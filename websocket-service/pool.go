package websocketservice

import (
	"fmt"
	"time"
)

type Pool struct {
	Rooms      map[int]*Room
	Register   chan *Client
	Disconnect chan *Client
	BroadCast  chan Message
}

func NewPool() *Pool {
	return &Pool{
		Rooms:      make(map[int]*Room),
		Register:   make(chan *Client),
		Disconnect: make(chan *Client),
		BroadCast:  make(chan Message),
	}

}

func (pool *Pool) Start() {
	for {
		select {
		case client := <-pool.Register:
			if _, ok := pool.Rooms[client.RoomId]; !ok {
				//room not exist
				//create one//
				pool.Rooms[client.RoomId] = &Room{
					RoomId:  client.RoomId,
					Clients: make(map[*Client]bool),
				}
			}
			pool.Rooms[client.RoomId].Clients[client] = true
			fmt.Println(
				"new connection estabilished room size",
				len(pool.Rooms[client.RoomId].Clients),
			)
			for client, _ = range pool.Rooms[client.RoomId].Clients {
				client.Conn.WriteJSON(
					Message{
						RoomId:   client.RoomId,
						Type:     "new",
						Username: client.Username,
						Body:     client.Username + "joined",
						SendAt:   time.Now().Format(time.TimeOnly),
					},
				)
			}
			break

		case client := <-pool.Disconnect:
			delete(pool.Rooms[client.RoomId].Clients, client)
			fmt.Println("new connection estabilished room size", len(pool.Rooms))
			for client, _ = range pool.Rooms[client.RoomId].Clients {
				client.Conn.WriteJSON(
					Message{
						RoomId:   client.RoomId,
						Username: client.Username,
						Type:     "Disconnect",
						Body:     client.Username + "Disconnected",
						SendAt:   time.Now().Format(time.TimeOnly),
					},
				)

			}

			break

		case message := <-pool.BroadCast:
			for client, _ := range pool.Rooms[message.RoomId].Clients {
				if err := client.Conn.WriteJSON(message); err != nil {
					fmt.Println(err)
					return
				}
			}
			break

		}
	}
}
