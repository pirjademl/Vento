package websocketservice

import (
	"fmt"
	"log"
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
		client.Pool.Disconnect <- client
		client.Conn.Close()
	}()
	fmt.Println(client)
	for {
		var msg Message
		err := client.Conn.ReadJSON(&msg)

		//check if the err is closing error and is closed
		//client.Conn.ReadJSON
		if e, ok := (err).(*websocket.CloseError); ok {
			fmt.Println("it is a close error", e.Code, e.Text)
			return
		}

		if err != nil {
			log.Println("not close error ", err.Error())
			return
		}
		message := Message{
			UserId:   client.Id,
			Username: client.Username,
			Type:     msg.Type,
			Body:     msg.Body,
			File:     msg.File,
			FileName: msg.FileName,
			RoomId:   client.RoomId,
			SendAt:   time.Now().Format(time.TimeOnly),
		}
		client.Pool.BroadCast <- message
	}

}
