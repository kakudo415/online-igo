package page

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// Index serves top page
func Index(c *gin.Context) {
	c.HTML(http.StatusOK, "index.html", gin.H{})
}

// Game serves game page from game-id
func Game(c *gin.Context) {
	c.HTML(http.StatusOK, "game.html", gin.H{})
}
