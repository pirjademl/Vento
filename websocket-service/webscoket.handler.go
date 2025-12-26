package websocketservice

import (
	"chat/config"
	"chat/dtos"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
)

type Websockethandler struct {
	DB *config.PGConn
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func NewWebsocketHandler(db *config.PGConn) *Websockethandler {
	return &Websockethandler{
		DB: db,
	}

}

func (ws *Websockethandler) ServeWebsocket(
	pool *Pool,
	w http.ResponseWriter,
	r *http.Request,
) {

	vars := mux.Vars(r)
	cntxt := r.Context()

	UserJwt, ok := cntxt.Value(dtos.UserContext).(*dtos.UserJwt)
	if !ok {
		http.Error(w, "NOt Authorized to join the room", http.StatusUnauthorized)
		return
	}
	roomId, err := strconv.Atoi(vars["roomid"])
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadGateway)
		return
	}
	// now check if the user exists in the room members table
	var exists bool
	err = ws.DB.DB.QueryRow(
		"SELECT exists(select 1 from room_members where room_id=$1 AND user_id=$2)",
		roomId,
		UserJwt.UserId,
	).Scan(&exists)
	if err != nil || !exists {
		http.Error(w, "NOt Authorized to join the room", http.StatusUnauthorized)
		return
	}
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUpgradeRequired)
		return
	}
	client := &Client{
		Username: UserJwt.Username,
		RoomId:   roomId,
		Id:       UserJwt.UserId,
		Pool:     pool,
		Conn:     conn,
	}
	pool.Register <- client
	client.Read()

}
