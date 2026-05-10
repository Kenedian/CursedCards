import socket
from "."

import {
  SOCKET_EVENTS
}
from "../../../shared/constants/socketEvents"

import useGameStore
from "../stores/gameStore"

const {

  setLobby,
  clearLobby,
  setCurrentPlayerId

} = useGameStore()

export default function registerGameSocketListeners() {

  socket.on(
    SOCKET_EVENTS.CREATE_LOBBY_SUCCESS,

    room => {

      setLobby(room)

      setCurrentPlayerId(
        socket.id
      )

      console.log(
        "created lobby",
        room
      )
    }
  )

  socket.on(
    SOCKET_EVENTS.JOIN_LOBBY_SUCCESS,

    room => {

      setLobby(room)

      setCurrentPlayerId(
        socket.id
      )

      console.log(
        "joined lobby",
        room
      )
    }
  )

  socket.on(
    SOCKET_EVENTS.LOBBY_UPDATED,

    room => {

      setLobby(room)

      console.log(
        "lobby updated",
        room
      )
    }
  )

  socket.on(
    SOCKET_EVENTS.GAME_UPDATED,

    room => {

      setLobby(room)

      console.log(
        "game updated",
        room
      )
    }
  )

  socket.on(
    SOCKET_EVENTS.PLAYER_KICKED,

    () => {

      clearLobby()

      window.location.reload()
    }
  )
}