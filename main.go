package main

import (
	"chat/config"
	"chat/handlers"
	"chat/middleware"
	websocketservice "chat/websocket-service"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

type contextKey string

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		origin := r.Header.Get("Origin")
		if origin != "" {
			w.Header().Set("Access-Control-Allow-Origin", origin)

		}
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusNoContent)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Println(r.URL, " ", r.Method)
		next.ServeHTTP(w, r)
	})

}

func main() {
	publicrouter := mux.NewRouter()
	config.LoadEnv()
	db, err := config.ConnectDB()
	if err != nil {
		log.Println("Unable to connect to databse due to  ", err.Error())
		os.Exit(0)
		return
	}
	handler := handlers.Handler{DB: db}
	pool := websocketservice.NewPool(*db)
	go pool.Start()

	wsHanlder := websocketservice.NewWebsocketHandler(db)
	webscoketRouter := publicrouter.PathPrefix("/ws/rooms/{roomid}").Subrouter()
	webscoketRouter.Use(middleware.AuthMiddleware)
	webscoketRouter.HandleFunc("", func(w http.ResponseWriter, r *http.Request) {
		wsHanlder.ServeWebsocket(pool, w, r)
	})

	publicrouter.HandleFunc("/api/v1/auth/signup", handler.Register).Methods("POST")
	publicrouter.HandleFunc("/api/v1/auth/login", handler.Login).Methods("POST")
	publicrouter.HandleFunc("/api/v1/auth/user", handler.CheckUserSession).Methods("POST")

	//	roomRouter := publicrouter.PathPrefix("/api/v1/rooms/").Subrouter()
	//
	//	roomRouter.Use(loggingMiddleware)
	//	roomRouter.Use(middleware.AuthMiddleware)

	//	roomRouter.HandleFunc("", handler.CREATERoom).Methods("POST")

	//	roomRouter.HandleFunc("", handler.GETROOMs).Methods("GET")
	//	roomRouter.HandleFunc("{roomId}", handler.GetRoom).Methods("GET")
	//
	// 1. Remove the trailing slash from the Prefix
	roomRouter := publicrouter.PathPrefix("/api/v1/rooms").Subrouter()
	userRouter := publicrouter.PathPrefix("/api/v1/user").Subrouter()

	//accepts mutliple middleware functions

	roomRouter.Use(loggingMiddleware, middleware.AuthMiddleware)
	userRouter.Use(loggingMiddleware, middleware.AuthMiddleware)

	userRouter.HandleFunc("", handler.GETUser).Methods("GET")

	//user details room endpoint

	// 2. Use "/" for the base 'rooms' list

	roomRouter.HandleFunc("", handler.GETROOMs).Methods("GET")
	roomRouter.HandleFunc("", handler.CREATERoom).Methods("POST")

	// 3. Use "/{roomId}" for the specific room
	roomRouter.HandleFunc("/{roomId}", handler.GetRoom).Methods("GET")

	roomRouter.HandleFunc("/join", handler.JOINRoom).Methods("POST")

	middleware := corsMiddleware(publicrouter)

	if err := http.ListenAndServe(":8000", middleware); err != nil {
		println(err.Error())
	}

}
