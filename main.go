package main

import (
	"github.com/gin-gonic/gin"

	"github.com/kakudo415/online-igo/api"
	"github.com/kakudo415/online-igo/page"
)

func main() {
	e := gin.New()

	e.GET("/", page.Index)
	e.POST("/", api.NewGame)

	e.GET("/game/:game-id", page.Game)
	e.POST("/game/:game-id", api.Game)

	e.LoadHTMLGlob("./view/*.html")
	e.Static("static", "./view/static/")

	e.Run(":8080")
}
