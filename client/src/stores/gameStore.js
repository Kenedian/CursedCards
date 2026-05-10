import { ref }
from "vue"

import socket
from "../socket"

import {
  SOCKET_EVENTS
}
from "../../../shared/constants/socketEvents"

import getBlackCardPickCount
from "../utils/cards/getBlackCardPickCount"

const whiteCards =
  ref([])

const blackCards =
  ref([])

const currentLobby =
  ref(null)

const currentPlayer =
  ref(null)

socket.on(
  SOCKET_EVENTS.ADMIN_CARDS_UPDATED,

  cards => {

    whiteCards.value =
      cards.whiteCards

    blackCards.value =
      cards.blackCards
  }
)

socket.on(
  SOCKET_EVENTS.CREATE_LOBBY_SUCCESS,

  lobby => {

    currentLobby.value =
      lobby

    currentPlayer.value =
      lobby.players.find(
        player =>
          player.id ===
          socket.id
      )
  }
)

socket.on(
  SOCKET_EVENTS.JOIN_LOBBY_SUCCESS,

  lobby => {

    currentLobby.value =
      lobby

    currentPlayer.value =
      lobby.players.find(
        player =>
          player.id ===
          socket.id
      )
  }
)

socket.on(
  SOCKET_EVENTS.LOBBY_UPDATED,

  lobby => {

    currentLobby.value =
      lobby
  }
)

socket.on(
  SOCKET_EVENTS.PLAYER_KICKED,

  () => {

    currentLobby.value =
      null

    currentPlayer.value =
      null
  }
)

function shuffle(array) {

  return [...array].sort(
    () => Math.random() - 0.5
  )
}

function getRandomWhiteCards(
  count
) {

  return shuffle(
    whiteCards.value
  ).slice(0, count)
}

function getRandomBlackCard() {

  const card =
    shuffle(
      blackCards.value
    )[0]

  return {
    ...card,

    pickCount:
      getBlackCardPickCount(
        card.text
      )
  }
}

export default function useGameStore() {

  return {

    // cards

    whiteCards,
    blackCards,

    // lobby

    currentLobby,
    currentPlayer,

    // helpers

    getRandomWhiteCards,
    getRandomBlackCard,
    getBlackCardPickCount
  }
}