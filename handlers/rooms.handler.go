package handlers

import (
	"chat/dtos"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
)

// let's for now not create a middleware just develop the chat functionality
func (h *Handler) GetRoom(w http.ResponseWriter, r *http.Request) {
	//enableCors(w)
	vars := mux.Vars(r)
	roomId, err := strconv.Atoi(vars["roomId"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusExpectationFailed)
		return
	}
	var roomdetails dtos.RoomDetails
	err = h.DB.DB.QueryRow(
		`SELECT username,Description,Category,name FROM rooms JOIN users on rooms.owner_id=users.user_id WHERE room_id=$1`,
		roomId,
	).Scan(&roomdetails.Username, &roomdetails.Description, &roomdetails.Category, &roomdetails.Name)
	if err != nil {
		println(err.Error())
		http.Error(w, "Room Not FOund", http.StatusNotFound)
		return
	}
	result, err := h.DB.DB.Query(
		`SELECT username,joined_at FROM users JOIN room_members on users.user_id=room_members.user_id WHERE room_id=$1`,
		roomId,
	)
	if err != nil {
		log.Println(err.Error())
		http.Error(w, "Room Not FOund", http.StatusNotFound)
		return
	}
	for result.Next() {
		var participant dtos.Participant
		err := result.Scan(&participant.Username, &participant.Joined_At)
		if err != nil {
			log.Println("error scanning participant ", err.Error())
		}
		roomdetails.Participants = append(roomdetails.Participants, participant)
	}

	defer result.Close()
	if err != nil {
		println(err.Error())
		http.Error(w, "Room Not FOund", http.StatusNotFound)
		return
	}
	response, err := json.Marshal(roomdetails)
	if err != nil {
		http.Error(w, "Error while json Marshal", http.StatusBadGateway)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(response)

}

func (h *Handler) CREATERoom(w http.ResponseWriter, r *http.Request) {
	fmt.Println("executing room creation function ", r.ContentLength)
	enableCors(w)
	var req dtos.RoomRequest

	cntxt := r.Context()

	UserJwt, ok := cntxt.Value(dtos.UserContext).(*dtos.UserJwt)
	fmt.Printf("%t\n", cntxt.Value(dtos.UserContext))
	if !ok {
		log.Println("unable to verify user")
		return
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid Request", http.StatusBadRequest)
		log.Println(err.Error())
		return
	}
	req.OwnerId = UserJwt.UserId
	if _, err := h.DB.CreateRoom(&req); err != nil {
		http.Error(w, err.Error(), http.StatusExpectationFailed)
		log.Println(err.Error())
		return
	}
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]string{"message": "Room created successfully"})
}
func (h *Handler) GETROOMs(w http.ResponseWriter, r *http.Request) {
	println("coming reuqest here")
	enableCors(w)

	room_data, err := h.DB.GETRooms()
	if err != nil {
		http.Error(w, err.Error(), http.StatusExpectationFailed)
		return
	}

	rooms_json, err := json.Marshal(room_data)
	if err != nil {
		http.Error(w, err.Error(), http.StatusExpectationFailed)
		return

	}
	w.WriteHeader(http.StatusCreated)
	w.Write(rooms_json)
}

type RoomClaim struct {
	dtos.UserJwt
	jwt.RegisteredClaims
	dtos.RoomResponse
}

func (h *Handler) JOINRoom(w http.ResponseWriter, r *http.Request) {
	enableCors(w)
	cntxt := r.Context()
	UserJwt, ok := cntxt.Value(dtos.UserContext).(*dtos.UserJwt)
	if !ok {
		log.Println("unable to verify user")
		return
	}

	var roomrequest dtos.RoomJoinRequest
	json.NewDecoder(r.Body).Decode(&roomrequest)

	_, err := h.DB.RoomJoin(roomrequest, UserJwt.UserId)
	if err != nil {
		http.Error(w, err.Error(), http.StatusExpectationFailed)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{"status": "Room Joined  Successfully "})

}
