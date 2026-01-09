package dtos

import (
	"encoding/json"
	"time"
)

type RoomRequest struct {
	OwnerId     int         `json:"owner_id"`
	Password    string      `json:"password"`
	Name        string      `json:"name"`
	Description string      `json:"description"`
	Category    string      `json:"category"`
	Limit       json.Number `json:"max_limit"`
}

type RoomResponse struct {
	Room_id     int    `json:"room_id"`
	Description string `json:"description"`
	Limit       int    `json:"limit"`
	Name        string `json:"name"`
	Owner_Name  string `json:"owner_name"`
}

type RoomJoinRequest struct {
	Room_id  int    `json:"room_id"`
	Password string `json:"password"`
}

type JWTRoomRequest struct {
	UserJwt
	RoomResponse
}

type Participant struct {
	Username  string    `json:"username"`
	Joined_At time.Time `json:"joined_at"`
}

type RoomDetails struct {
	Name         string `json:"name"`
	Username     string `json:"username"`
	Description  string `json:"description"`
	Category     string `json:"category"`
	Participants []Participant
}
