package page

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kakudo415/kid"
	"github.com/kakudo415/online-igo/kvs"
)

// Index serves top page
func Index(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{})
}

// Game serves game page from game-id
func Game(c *gin.Context) {
	gameID := kid.Parse(c.Param("game-id"))
	if gameID.IsError() {
		c.Status(http.StatusNotFound)
		return
	}
	gameSetting, err := kvs.GetGameSetting(gameID)
	if err != nil {
		c.Status(http.StatusNotFound)
		panic(err)
		return
	}
	content := map[string]interface{}{}
	if c.Query("p") == gameSetting.PasswordAsMaster {
		content["passwordAsMaster"] = gameSetting.PasswordAsMaster
		content["passwordAsBlack"] = gameSetting.PasswordAsBlack
		content["passwordAsWhite"] = gameSetting.PasswordAsWhite
	}
	if c.Query("p") == gameSetting.PasswordAsBlack {
		content["passwordAsBlack"] = gameSetting.PasswordAsBlack
	}
	if c.Query("p") == gameSetting.PasswordAsWhite {
		content["passwordAsWhite"] = gameSetting.PasswordAsWhite
	}
	c.HTML(http.StatusOK, "game.html", content)
}
