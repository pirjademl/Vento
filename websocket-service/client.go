package websocketservice

import (
	"fmt"
	"time"

	"github.com/gorilla/websocket"
)

type Client struct {
	RoomId   int
	Id       int
	Conn     *websocket.Conn
	Pool     *Pool
	Username string
}

func (client *Client) Read() {
	defer func() {
		fmt.Println("attempting to disconnect client")
		client.Pool.Disconnect <- client
		client.Conn.Close()
	}()
	fmt.Println(client)
	for {
		var msg Message
		err := client.Conn.ReadJSON(&msg)
		fmt.Println(msg)

		if err != nil {
			fmt.Println("error reading json message", err.Error())
		}
		if err != nil {
			return
		}
		message := Message{
			UserId:   client.Id,
			Username: client.Username,
			Type:     msg.Type,
			Body:     msg.Body,
			RoomId:   client.RoomId,
			SendAt:   time.Now().Format(time.TimeOnly),
		}
		client.Pool.BroadCast <- message
	}

}
