package ws

import (
	"fmt"
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/kakudo415/kid"
	"github.com/kakudo415/online-igo/kvs"
)

var clients = make(map[kid.ID]map[*websocket.Conn]bool)
var broadcast = make(chan ResJSON)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// ReqJSON is request
type ReqJSON struct {
	Type   string `json:"type"`
	Action struct {
		Te     string `json:"te"`
		Column int    `json:"column"`
		Row    int    `json:"row"`
	} `json:"Action"`
}

// ResJSON is response of action request
type ResJSON struct {
	GameID kid.ID `json:"-"`
	Type   string `json:"type"`
	Action struct {
		Te     string `json:"te"`
		Column int    `json:"column"`
		Row    int    `json:"row"`
	} `json:"action,omitempty"`
}

// Handle handle WebSocket request
func Handle(w http.ResponseWriter, r *http.Request, gameID kid.ID, password string) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, "Cannot upgrade to web socket")
		return
	}
	gameSetting, err := kvs.GetGameSetting(gameID)
	if err != nil {
		fmt.Fprintf(w, "Invalid game ID")
		return
	}

	if clients[gameID] == nil {
		clients[gameID] = make(map[*websocket.Conn]bool)
	}
	clients[gameID][conn] = true

	hasAuth := false

	if password == gameSetting.Password {
		hasAuth = true
	}

	defer conn.Close()

	for {
		var req ReqJSON
		e := conn.ReadJSON(&req)
		if e != nil {
			delete(clients[gameID], conn)
			break
		}
		var res ResJSON
		res.GameID = gameID
		res.Type = req.Type
		if req.Type == "action" {
			if !hasAuth {
				break
			}
			res.Action.Te = req.Action.Te
			res.Action.Column = req.Action.Column
			res.Action.Row = req.Action.Row
			e := kvs.PushHistory(gameID, kvs.Kifu{
				Te:     req.Action.Te,
				Column: req.Action.Column,
				Row:    req.Action.Row,
			})
			if e != nil {
				break
			}
			broadcast <- res
		}
	}
}

// Broadcast serve message
func Broadcast() {
	for {
		res := <-broadcast
		numUsers := 0
		for client := range clients[res.GameID] {
			e := client.WriteJSON(res)
			if e != nil {
				client.Close()
				delete(clients[res.GameID], client)
			} else {
				numUsers++
			}
		}
		if len(clients[res.GameID]) == 0 {
			delete(clients, res.GameID)
		}
		println(numUsers)
	}
}
