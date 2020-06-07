package main

import (
	"os"

	"github.com/gin-gonic/gin"

	"github.com/kakudo415/kid"
	"github.com/kakudo415/online-igo/api"
	"github.com/kakudo415/online-igo/page"
	"github.com/kakudo415/online-igo/ws"
)

func main() {
	e := gin.New()

	e.GET("/", page.Index)
	e.POST("/", api.NewGame)

	e.GET("/game/:game-id", page.Game)
	e.GET("/game/:game-id/history", api.History)
	e.GET("/game/:game-id/ws", func(c *gin.Context) {
		ws.Handle(c.Writer, c.Request, kid.Parse((c.Param("game-id"))), c.Query("p"))
	})
	go ws.Broadcast()

	e.LoadHTMLGlob("./view/*.html")
	e.Static("static", "./view/static/")

	e.Run(":" + os.Getenv("IGO_PATH"))
}
