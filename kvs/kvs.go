package kvs

import (
	"errors"
	"strconv"
	"strings"

	"github.com/gomodule/redigo/redis"
	"github.com/kakudo415/kid"
	"github.com/sethvargo/go-password/password"
)

var conn redis.Conn

// GameSetting provide setting and passwords
type GameSetting struct {
	GridNumber int
	Password   string
}

// Kifu is history of game
type Kifu struct {
	Te     string `json:"te"`
	Column int    `json:"column"`
	Row    int    `json:"row"`
}

func init() {
	var err error
	conn, err = redis.Dial("tcp", "localhost:6379")
	if err != nil {
		panic(err)
	}
}

// NewGame create new game id and return it
func NewGame(gridNumber int) kid.ID {
	gameID := kid.New(1)
	if gridNumber <= 0 || 19 < gridNumber {
		return 0
	}
	_, err := conn.Do("SET", "igo."+gameID.ToHex(true)+".setting.grid", gridNumber)
	if err != nil {
		return 0
	}

	password, err := password.Generate(10, 3, 0, true, false)
	if err != nil {
		return 0
	}
	password = strings.ToUpper(password)

	_, err = conn.Do("SET", "igo."+gameID.ToHex(true)+".setting.password", password)
	if err != nil {
		return 0
	}

	return gameID
}

// GetGameSetting provide game settings such as grid number
func GetGameSetting(gameID kid.ID) (GameSetting, error) {
	var s GameSetting
	gridNumber, err := redis.Int(conn.Do("GET", "igo."+gameID.ToHex(true)+".setting.grid"))
	if err != nil {
		return s, err
	}
	password, err := redis.String(conn.Do("GET", "igo."+gameID.ToHex(true)+".setting.password"))
	if err != nil {
		return s, err
	}
	s.GridNumber = gridNumber
	s.Password = password
	return s, err
}

// PushHistory saves new kifu to list
func PushHistory(gameID kid.ID, kifu Kifu) error {
	if kifu.Te != "b" && kifu.Te != "w" && kifu.Te != "rm" {
		return errors.New("不正な手です")
	}
	k := kifu.Te + ":" + strconv.Itoa(kifu.Column) + ":" + strconv.Itoa(kifu.Row)
	_, err := conn.Do("RPUSH", "igo."+gameID.ToHex(true)+".kifu", k)
	if err != nil {
		return err
	}
	return nil
}

// GetHistory returns history of game
func GetHistory(gameID kid.ID) ([]Kifu, error) {
	rawHistory, err := redis.Strings(conn.Do("LRANGE", "igo."+gameID.ToHex(true)+".kifu", 0, -1))
	if err != nil {
		return nil, err
	}
	var gameHistory []Kifu
	for _, history := range rawHistory {
		token := strings.Split(history, ":")
		var kifu Kifu
		kifu.Te = token[0]
		kifu.Column, err = strconv.Atoi(token[1])
		if err != nil {
			return nil, err
		}
		kifu.Row, err = strconv.Atoi(token[2])
		if err != nil {
			return nil, err
		}
		gameHistory = append(gameHistory, kifu)
	}
	return gameHistory, nil
}
