package main

import (
	"net/http"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo/v4"
)

var upgrader = websocket.Upgrader{}
var clients []*websocket.Conn

type WebSocketMessage struct {
	Name    string
	Message string
}

func chat(c echo.Context) error {
	upgrader.CheckOrigin = func(r *http.Request) bool { return true }
	ws, err := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if err != nil {
		return err
	}
	defer ws.Close()
	clients = append(clients, ws)
	webSocketMessage := new(WebSocketMessage)

	for {
		err := ws.ReadJSON(webSocketMessage)
		if err != nil {
			c.Logger().Error(err)
		} else {
			if webSocketMessage.Name != "" && webSocketMessage.Message != "" {
				go sendMessage(*webSocketMessage, c)
			}
		}
	}
}

func sendMessage(message WebSocketMessage, c echo.Context) {
	for _, client := range clients {
		err := client.WriteJSON(message)
		if err != nil {
			c.Logger().Error(err)
		}
	}
}

func main() {
	e := echo.New()
	e.GET("/ws", chat)
	e.Logger.Fatal(e.Start(":8000"))
}
