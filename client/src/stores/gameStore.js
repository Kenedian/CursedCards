import { ref }
from "vue"

import getBlackCardPickCount
from "../utils/cards/getBlackCardPickCount"

import {
  mockWhiteCards,
  mockBlackCards
} from "../mocks/cards"

import {
  mockPlayers
} from "../mocks/players"

import {
  mockSubmissions
} from "../mocks/submissions"

import { CARD_TYPES }
from "../../../shared/constants/cardTypes"

const whiteCards =
  ref([...mockWhiteCards])

const blackCards =
  ref([...mockBlackCards])

const players =
  ref([...mockPlayers])

const submissions =
  ref([...mockSubmissions])

function shuffle(array) {

  return [...array].sort(
    () => Math.random() - 0.5
  )
}

function getCardCollection(type) {

  return (
    type === CARD_TYPES.WHITE
      ? whiteCards.value
      : blackCards.value
  )
}

function createCard(
  type,
  text
) {

  getCardCollection(type)
    .push({
      id: Date.now(),
      text
    })
}

function updateCard(
  type,
  id,
  text
) {

  const card =
    getCardCollection(type)
      .find(
        card => card.id === id
      )

  if (card) {
    card.text = text
  }
}

function deleteCard(
  type,
  id
) {

  const target =
    getCardCollection(type)

  const index =
    target.findIndex(
      card => card.id === id
    )

  if (index !== -1) {

    target.splice(index, 1)
  }
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

    // admin
    createCard,
    updateCard,
    deleteCard,

    // helpers
    getRandomWhiteCards,
    getRandomBlackCard,
    getBlackCardPickCount
  }
}