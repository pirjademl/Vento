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
	pool := websocketservice.NewPool()
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

	//	protectedRouter := publicrouter.PathPrefix("/api/v1/rooms/").Subrouter()
	//
	//	protectedRouter.Use(loggingMiddleware)
	//	protectedRouter.Use(middleware.AuthMiddleware)

	//	protectedRouter.HandleFunc("", handler.CREATERoom).Methods("POST")

	//	protectedRouter.HandleFunc("", handler.GETROOMs).Methods("GET")
	//	protectedRouter.HandleFunc("{roomId}", handler.GetRoom).Methods("GET")
	//
	// 1. Remove the trailing slash from the Prefix
	protectedRouter := publicrouter.PathPrefix("/api/v1/rooms").Subrouter()

	protectedRouter.Use(loggingMiddleware)
	protectedRouter.Use(middleware.AuthMiddleware)

	// 2. Use "/" for the base 'rooms' list
	protectedRouter.HandleFunc("", handler.GETROOMs).Methods("GET")
	protectedRouter.HandleFunc("", handler.CREATERoom).Methods("POST")

	// 3. Use "/{roomId}" for the specific room
	protectedRouter.HandleFunc("/{roomId}", handler.GetRoom).Methods("GET")

	protectedRouter.HandleFunc("/join", handler.JOINRoom).Methods("POST")

	middleware := corsMiddleware(publicrouter)

	if err := http.ListenAndServe(":8000", middleware); err != nil {
		println(err.Error())
	}

}
