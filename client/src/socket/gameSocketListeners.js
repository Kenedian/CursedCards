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
  let hasTriedInitialReconnect = false
  let reconnectInFlight = false

  function saveReconnectInfoFromRoom(room) {
    const sessionId =
      getClientSessionId()

    const player =
      room.players.find(
        player =>
          player.id === socket.id ||
          player.sessionId === sessionId
      )

    if (!player?.username) {
      return
    }

    saveReconnectInfo({
      code:
        room.code,

      username:
        player.username
    })
  }

  function reconnectToSavedLobby() {
    const reconnectInfo =
      getReconnectInfo()

    if (
      !reconnectInfo?.code ||
      !reconnectInfo?.username
    ) {
      return
    }

    reconnectInFlight =
      true

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

      saveReconnectInfoFromRoom(room)

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

      saveReconnectInfoFromRoom(room)

      console.log(
        "joined lobby",
        room
      )
    }
  )

  socket.on(
    SOCKET_EVENTS.RECONNECT_LOBBY_SUCCESS,

    room => {
      reconnectInFlight =
        false

      setLobby(room)

      setCurrentPlayerId(
        socket.id
      )

      saveReconnectInfoFromRoom(room)

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

      saveReconnectInfoFromRoom(room)

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

      saveReconnectInfoFromRoom(room)

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
    SOCKET_EVENTS.LOBBY_ERROR,

    () => {
      if (!reconnectInFlight) {
        return
      }

      reconnectInFlight =
        false
    }
  )

  socket.on(
    "connect",

    () => {
      if (
        currentLobby.value ||
        !hasTriedInitialReconnect
      ) {
        hasTriedInitialReconnect =
          true

        reconnectToSavedLobby()
      }
    }
  )

  if (socket.connected) {
    hasTriedInitialReconnect =
      true

    reconnectToSavedLobby()
  }
}
