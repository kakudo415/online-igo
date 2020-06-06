package kvs

import (
	"github.com/gomodule/redigo/redis"
	"github.com/kakudo415/kid"
	"github.com/sethvargo/go-password/password"
)

var conn redis.Conn

// GameSetting provide setting and passwords
type GameSetting struct {
	GridNumber       int
	PasswordAsMaster string
	PasswordAsBlack  string
	PasswordAsWhite  string
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

	passMaster, err := password.Generate(10, 3, 0, false, false)
	if err != nil {
		return 0
	}
	passBlack, err := password.Generate(10, 4, 0, false, false)
	if err != nil {
		return 0
	}
	passWhite, err := password.Generate(10, 5, 0, false, false)
	if err != nil {
		return 0
	}

	_, err = conn.Do("SET", "igo."+gameID.ToHex(true)+".setting.password.master", passMaster)
	if err != nil {
		return 0
	}
	_, err = conn.Do("SET", "igo."+gameID.ToHex(true)+".setting.password.black", passBlack)
	if err != nil {
		return 0
	}
	_, err = conn.Do("SET", "igo."+gameID.ToHex(true)+".setting.password.white", passWhite)
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
	passMaster, err := redis.String(conn.Do("GET", "igo."+gameID.ToHex(true)+".setting.password.master"))
	if err != nil {
		return s, err
	}
	passBlack, err := redis.String(conn.Do("GET", "igo."+gameID.ToHex(true)+".setting.password.black"))
	if err != nil {
		return s, err
	}
	passWhite, err := redis.String(conn.Do("GET", "igo."+gameID.ToHex(true)+".setting.password.white"))
	if err != nil {
		return s, err
	}
	s.GridNumber = gridNumber
	s.PasswordAsMaster = passMaster
	s.PasswordAsBlack = passBlack
	s.PasswordAsWhite = passWhite
	return s, err
}
