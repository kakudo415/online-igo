package main

import "github.com/gin-gonic/gin"

func main() {
	e := gin.New()
	e.Run(":8080")
}
