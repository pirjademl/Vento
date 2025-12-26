package config

import (
	"chat/dtos"
	"context"
	"database/sql"
	"errors"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
)

type PGConn struct {
	DB *sql.DB
}

func ConnectDB() (*PGConn, error) {
	DBUser := os.Getenv("DATABASE_USER")
	DBName := os.Getenv("DATABASE_NAME")
	DBPASSWORD := os.Getenv("DATABASE_PASSWORD")

	if DBUser == "" || len(DBUser) == 0 || DBName == "" || DBPASSWORD == "" {
		log.Fatal("unable to get db info to connect to db")
		return nil, errors.New("env variable error")

	}
	connstr := fmt.Sprintf(
		"user=%s dbname=%s password=%s sslmode=disable",
		DBUser,
		DBName,
		DBPASSWORD,
	)
	println(connstr)

	db, _ := sql.Open("postgres", connstr)

	err := db.Ping()

	if err != nil {
		log.Fatal(" error connecting to the database", err.Error())
		return nil, err
	}
	return &PGConn{
		DB: db,
	}, nil
}

func (conn *PGConn) CreateUser(user *dtos.RegisterUser) (bool, error) {
	if user.FirstName == "" || user.LastName == "" || user.Email == "" || user.Password == "" {
		return false, errors.New("Missing Required fields to register")
	}
	bgContext := context.Background()

	runes := []rune(user.FirstName)[:len(user.FirstName)/2]
	lastt := []rune(user.LastName)[:len(user.LastName)/2]
	username := string(append(runes, lastt...))

	_, err := conn.DB.ExecContext(
		bgContext,
		"INSERT INTO users (username, first_name, last_name, email, password_hash) VALUES ($1, $2, $3, $4, $5)",
		username,
		user.FirstName,
		user.LastName,
		user.Email,
		user.Password,
	)
	if err != nil {
		log.Println(err.Error())
		return false, errors.New("")
	}
	return true, nil
}

func (conn *PGConn) CreateRoom(room *dtos.RoomRequest) (bool, error) {
	fmt.Println(room.Name, room.Password)

	//if room.Name == "" || room.Password == "" {
	//		return false, errors.New("Missing Required fields to register")
	//	}
	fmt.Println("room owner is", room.OwnerId)

	fmt.Println(room.Name, room.Description, room.Category, room.Password, room.Limit)

	_, err := conn.DB.Exec(
		"INSERT INTO rooms(name,description,category,password_hash,owner_id,max_limit) VALUES($1,$2,$3,$4,$5,$6)",
		room.Name,
		room.Description,
		room.Category,
		room.Password,
		room.OwnerId,
		room.Limit,
	)
	if err != nil {
		log.Println(err.Error())
		return false, errors.New("INSERT FAILED")

	}

	return true, nil

}
func (conn *PGConn) GETRooms() ([]dtos.RoomResponse, error) {
	rows, err := conn.DB.Query(
		"select  r.room_id,r.name,r.description,r.max_limit,CONCAT(u.first_name,' ',u.last_name) FROM  rooms r JOIN users u ON r.owner_id=u.user_id",
	)

	if err != nil {
		return nil, errors.New(err.Error())
	}

	var rooms []dtos.RoomResponse
	for rows.Next() {
		var room dtos.RoomResponse
		rows.Scan(&room.Room_id, &room.Name, &room.Description, &room.Limit, &room.Owner_Name)
		rooms = append(rooms, room)
	}
	return rooms, nil
}

func (conn *PGConn) RoomJoin(request dtos.RoomJoinRequest, userId int) (dtos.RoomResponse, error) {
	//responsibility
	//check room id and password is correct
	//then insert a record in the table with new joinee information  room_members
	//room id user id join time
	row := conn.DB.QueryRow(
		"SELECT room_id,name,description,max_limit from rooms where room_id=$1 AND password_hash=$2",
		request.Room_id,
		request.Password,
	)
	var roomresponse dtos.RoomResponse
	row.Scan(
		&roomresponse.Room_id,
		&roomresponse.Name,
		&roomresponse.Description,
		&roomresponse.Limit)

	if row.Err() != nil {
		return roomresponse, row.Err()

	}

	bgContext := context.Background()
	_, err := conn.DB.ExecContext(
		bgContext,
		"insert into room_members(room_id,user_id) VALUES($1,$2)",
		request.Room_id,
		userId,
	)
	if err != nil {
		log.Print(err.Error())
		return roomresponse, nil

	}

	return roomresponse, nil
}
