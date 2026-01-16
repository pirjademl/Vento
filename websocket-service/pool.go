package websocketservice

import (
	"chat/config"
	"fmt"
	"log"
	"time"
)

var (
	typing  = "typing"
	message = "message"

	//messages types can be added here

)

type Pool struct {
	DB         *config.PGConn
	Rooms      map[int]*Room
	Register   chan *Client
	Disconnect chan *Client
	BroadCast  chan Message
}

func NewPool(db config.PGConn) *Pool {
	return &Pool{
		DB:         &db,
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

			fmt.Println("before deleting the client", len(pool.Rooms[client.RoomId].Clients))
			delete(pool.Rooms[client.RoomId].Clients, client)
			fmt.Println("after deleting the client", len(pool.Rooms[client.RoomId].Clients))

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
			println("new message arrived trying to broadcast")
			if message.Type == typing {
				for client, _ := range pool.Rooms[message.RoomId].Clients {
					if err := client.Conn.WriteJSON(message); err != nil {
						fmt.Println(err)
						return
					}
				}
				continue

			}

			result, err := pool.DB.DB.Exec(
				"INSERT INTO messages(room_id,user_id,body) values($1,$2,$3)",
				message.RoomId,
				message.UserId,
				message.Body,
			)
			if err != nil {
				log.Println("failed to insert a message ", err.Error())

			}
			log.Println(result.RowsAffected())

			log.Println(result.LastInsertId())

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
