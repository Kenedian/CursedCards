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

import {
  mockPlayers
}
from "../mocks/players"

import {
  mockSubmissions
}
from "../mocks/submissions"

const whiteCards =
  ref([])

const blackCards =
  ref([])

const players =
  ref([...mockPlayers])

const submissions =
  ref([...mockSubmissions])

socket.on(
  SOCKET_EVENTS.ADMIN_CARDS_UPDATED,

  cards => {

    whiteCards.value =
      cards.whiteCards

    blackCards.value =
      cards.blackCards
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

    // gameplay

    players,
    submissions,

    // helpers

    getRandomWhiteCards,
    getRandomBlackCard,
    getBlackCardPickCount
  }
}