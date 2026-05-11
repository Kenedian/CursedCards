import socket
from "."

import {
  SOCKET_EVENTS
}
from "../../../shared/constants/socketEvents"

import useGameStore
from "../stores/gameStore"

import {
  getClientSessionId,
  getReconnectInfo,
  saveReconnectInfo,
  clearReconnectInfo
}
from "../utils/reconnectSession"

const {

  currentLobby,
  setLobby,
  clearLobby,
  setCurrentPlayerId

} = useGameStore()

export default function registerGameSocketListeners() {

  function reconnectToSavedLobby() {
    const reconnectInfo =
      getReconnectInfo()

    if (
      !reconnectInfo?.code ||
      !reconnectInfo?.username
    ) {
      return
    }

    socket.emit(
      SOCKET_EVENTS.RECONNECT_LOBBY,

      {
        ...reconnectInfo,
        sessionId:
          getClientSessionId()
      }
    )
  }

  socket.on(
    SOCKET_EVENTS.CREATE_LOBBY_SUCCESS,

    room => {

      setLobby(room)

      setCurrentPlayerId(
        socket.id
      )

      saveReconnectInfo({
        code:
          room.code,

        username:
          room.players.find(
            player =>
              player.id ===
              socket.id
          )?.username
      })

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

      saveReconnectInfo({
        code:
          room.code,

        username:
          room.players.find(
            player =>
              player.id ===
              socket.id
          )?.username
      })

      console.log(
        "joined lobby",
        room
      )
    }
  )

  socket.on(
    SOCKET_EVENTS.RECONNECT_LOBBY_SUCCESS,

    room => {

      setLobby(room)

      setCurrentPlayerId(
        socket.id
      )

      saveReconnectInfo({
        code:
          room.code,

        username:
          room.players.find(
            player =>
              player.id ===
              socket.id
          )?.username
      })

      console.log(
        "reconnected lobby",
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

      clearReconnectInfo()

      window.location.reload()
    }
  )

  socket.on(
    "connect",

    () => {
      if (currentLobby.value) {
        reconnectToSavedLobby()
      }
    }
  )
}
