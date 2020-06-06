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
		return
	}
	content := map[string]interface{}{}
	content["gameID"] = gameID.ToHex(true)
	content["gridNumber"] = gameSetting.GridNumber
	content["lastGridNumber"] = gameSetting.GridNumber - 1
	if c.Query("p") == gameSetting.Password {
		content["password"] = gameSetting.Password
	}
	var rowArray = [...]string{"一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九"}
	var colArray = [...]int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19}
	content["rowArray"] = rowArray[:gameSetting.GridNumber]
	content["colArray"] = colArray[:gameSetting.GridNumber]
	c.HTML(http.StatusOK, "game.html", content)
}
