package middleware

import (
	"chat/dtos"
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		header := strings.Split(r.Header.Get("Authorization"), " ")

		secret := os.Getenv("JWT_SECRET")
		var token string
		if len(header) == 0 && !r.URL.Query().Has("token") {
			http.Error(w, "AUTHENTICATION FAILED", http.StatusForbidden)
			return
		}

		if len(header) == 1 && r.URL.Query().Has("token") {
			token = r.URL.Query().Get("token")
		} else if len(header) > 1 {
			token = header[1]
		}

		if token == "" {
			log.Println("token is string and  empty")
			http.Error(w, "AUTHENTICATION FAILED", http.StatusForbidden)
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

		username, usernameok := claims["username"].(string)
		firstName, firstOk := claims["firstName"].(string)
		lastName, lastok := claims["lastName"].(string)
		email, emailok := claims["email"].(string)
		floatId, idok := claims["user_id"].(float64)

		if !usernameok || !lastok || !emailok || !idok || !firstOk {
			http.Error(w, "AUTHENTICATION FAILED", http.StatusForbidden)
			log.Println("token is empty")
			return
		}

		userContext := &dtos.UserJwt{
			RegisterUser: dtos.RegisterUser{
				Username:  username,
				FirstName: firstName,
				LastName:  lastName,
				Email:     email,
			}, UserId: int(floatId),
		}
		cntxt := context.WithValue(r.Context(), dtos.UserContext, userContext)
		next.ServeHTTP(w, r.WithContext(cntxt))
		return
	})
}

func WebsocketAuthMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
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
		fmt.Println(claims)

		username, usernameok := claims["username"].(string)
		firstName, firstOk := claims["firstName"].(string)
		lastName, lastok := claims["lastName"].(string)
		email, emailok := claims["email"].(string)
		floatId, idok := claims["UserId"].(float64)

		fmt.Printf("%T\n", claims["UserId"])
		fmt.Println(usernameok, lastok, emailok, idok, firstOk)
		if !usernameok || !lastok || !emailok || !idok || !firstOk {
			http.Error(w, "AUTHENTICATION FAILED", http.StatusForbidden)
			log.Println("token is empty")
			return
		}

		userContext := &dtos.UserJwt{
			RegisterUser: dtos.RegisterUser{
				Username:  username,
				FirstName: firstName,
				LastName:  lastName,
				Email:     email,
			}, UserId: int(floatId),
		}
		cntxt := context.WithValue(r.Context(), dtos.UserContext, userContext)
		next.ServeHTTP(w, r.WithContext(cntxt))
		return

	})
}
