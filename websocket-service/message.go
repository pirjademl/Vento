package websocketservice

type Message struct {
	RoomId   int    `json:"room_id"`
	Username string `json:"username"`
	Type     string `json:"type"`
	Body     string `json:"body"`
	SendAt   string `json:"send_at"`
}
