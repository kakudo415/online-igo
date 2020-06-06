package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/k0kubun/pp"
	"github.com/kakudo415/kid"
	"github.com/kakudo415/online-igo/kvs"
)

type newGameFormJSON struct {
	GridNumber int `json:"grid-number"`
}

type newGameInfoJSON struct {
	GameID   string `json:"game-id"`
	Password string `json:"password"`
}

type gameHistoryJSON struct {
	Kifu []kifuJSON `json:"kifu"`
}

type kifuJSON struct {
	Column int `json:"column"`
	Row    int `json:"row"`
	Te     int `json:"te"`
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
		GameID:   gameID.ToHex(true),
		Password: gameSetting.Password,
	}

	c.JSON(http.StatusCreated, newGameInfo)
}

// History serves current history of game
func History(c *gin.Context) {
	history, err := kvs.GetHistory(kid.Parse((c.Param("game-id"))))
	if err != nil {
		c.Status(http.StatusNotFound)
		return
	}
	c.JSON(http.StatusOK, history)
}
