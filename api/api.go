package api

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/k0kubun/pp"
	"github.com/kakudo415/kid"
)

type newGameFormJSON struct {
	GridNumber int    `json:"grid-number"`
	Nickname   string `json:"nickname"`
}

type newGameInfoJSON struct {
	GameID string `json:"game-id"`
}

// NewGame makes new game interface and serves new game id
func NewGame(c *gin.Context) {
	newGameForm := newGameFormJSON{}
	if err := c.BindJSON(&newGameForm); err != nil {
		pp.Println(err)
		c.Status(400)
		return
	}
	gameID := kid.New(0)
	newGameInfo := newGameInfoJSON{
		GameID: gameID.ToDec(),
	}
	c.JSON(http.StatusCreated, newGameInfo)
}

// Game provide interface to play
func Game(c *gin.Context) {

}
