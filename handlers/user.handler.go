package handlers

import (
	"chat/config"
	"chat/dtos"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Handler struct {
	DB *config.PGConn
}

func enableCors(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)

	})

}

func (h *Handler) Register(w http.ResponseWriter, r *http.Request) {
	enableCors(w)
	log.Println("handling user register request")
	var req dtos.RegisterUser

	// TODO: at some point transform this one function to make it one accepting reading body and writing object

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}
	if _, err := h.DB.CreateUser(&req); err != nil {
		http.Error(w, err.Error(), http.StatusExpectationFailed)
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "user Registered successfully"})

}

type CustomClaim struct {
	dtos.UserJwt
	jwt.RegisteredClaims
}

func (h *Handler) Login(w http.ResponseWriter, r *http.Request) {
	// check if user exist
	println("checking login request")
	fmt.Println(r.ContentLength)
	var credentials dtos.LoginRequest
	json.NewDecoder(r.Body).Decode(&credentials)
	log.Print(credentials.Password, credentials.Email)
	if credentials.Email == "" || credentials.Password == "" {
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		return
	}
	row := h.DB.DB.QueryRow(
		"SELECT user_id, username, first_name,last_name,email,password_hash FROM users WHERE email=$1  AND password_hash=$2 limit 1",
		credentials.Email,
		credentials.Password,
	)
	var user dtos.UserJwt
	if err := row.Scan(&user.UserId, &user.Username, &user.FirstName, &user.LastName, &user.Email, &user.Password); err != nil {
		println(err.Error())
		http.Error(w, err.Error(), http.StatusNotFound)
		return
	}

	var loginres dtos.LoginResponse
	log.Println(time.Now().Add(24 * time.Hour))

	log.Println(time.Now().Hour() + 2)
	config := &jwt.RegisteredClaims{
		ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * time.Hour)),
		IssuedAt:  jwt.NewNumericDate(time.Now()),
		Audience:  []string{"user"},
	}
	fmt.Println(user.UserId)

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, &CustomClaim{
		UserJwt:          user,
		RegisteredClaims: *config,
	})
	secretKey := []byte(os.Getenv("JWT_SECRET"))
	if secretKey == nil {
		log.Fatal("secret key not loaded")
		return

	}

	file, err := os.OpenFile("jwt.log.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Println("unable to open log file:", err)
		return
	}
	defer file.Close()
	signkedkey, err := token.SignedString(secretKey)
	if err != nil {
		log.Fatal(err.Error())
		http.Error(w, err.Error(), http.StatusFailedDependency)
		return
	}
	loginres.AccessToken = signkedkey
	loginres.Username = user.Username

	file.Write([]byte(user.Username + " \t" + signkedkey + "\n"))
	w.WriteHeader(http.StatusCreated)

	json.NewEncoder(w).Encode(loginres)
}

func (h *Handler) CheckUserSession(w http.ResponseWriter, r *http.Request) {
	header := strings.Split(r.Header.Get("Authorization"), " ")
	if len(header) == 0 || len(header) == 1 {
		http.Error(w, "AUTHENTICATION FAILED", http.StatusForbidden)
		return
	}
	secret := os.Getenv("JWT_SECRET")
	token := header[1]
	if token == "" {
		http.Error(w, "AUTHENTICATION FAILED", http.StatusForbidden)
		log.Println("token is empty")
		return
	}
	claims := jwt.MapClaims{}
	_, err := jwt.ParseWithClaims(token, claims, func(t *jwt.Token) (any, error) {
		return []byte(secret), nil
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusForbidden)
		return
	}
	w.WriteHeader(http.StatusCreated)
	return

}
