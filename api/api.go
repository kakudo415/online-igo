package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/k0kubun/pp"
	"github.com/kakudo415/online-igo/kvs"
)

type newGameFormJSON struct {
	GridNumber int    `json:"grid-number"`
	Nickname   string `json:"nickname"`
}

type newGameInfoJSON struct {
	GameID           string `json:"game-id"`
	PasswordAsMaster string `json:"password-as-master"`
	PasswordAsBlack  string `json:"password-as-black"`
	PasswordAsWhite  string `json:"password-as-white"`
}

// NewGame makes new game interface and serves new game id
func NewGame(c *gin.Context) {
	newGameForm := newGameFormJSON{}
	if err := c.BindJSON(&newGameForm); err != nil {
		pp.Println(err)
		c.Status(http.StatusNotFound)
		return
	}

	gameID := kvs.NewGame(newGameForm.GridNumber)
	if gameID.IsError() {
		c.Status(http.StatusNotFound)
		return
	}
	gameSetting, err := kvs.GetGameSetting(gameID)
	if err != nil {
		c.Status(http.StatusNotFound)
		return
	}
	newGameInfo := newGameInfoJSON{
		GameID:           gameID.ToHex(true),
		PasswordAsMaster: gameSetting.PasswordAsMaster,
		PasswordAsBlack:  gameSetting.PasswordAsBlack,
		PasswordAsWhite:  gameSetting.PasswordAsWhite,
	}

	c.JSON(http.StatusCreated, newGameInfo)
}

// Game provide interface to play
func Game(c *gin.Context) {

}
