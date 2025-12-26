package websocketservice

type Room struct {
	RoomId  int
	Clients map[*Client]bool
}
