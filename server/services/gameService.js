const crypto = require("crypto")

const { GAME_PHASES } = require("../../shared/constants/gamePhases")

const { getWhiteCards, getBlackCards } = require("./cardService")

const MAX_PLAYERS = 8
const HAND_SIZE = 6
const MAX_ROUNDS = 10

function shuffle(array) {
  const shuffled = [...array]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const card = shuffled[i]

    shuffled[i] = shuffled[j]
    shuffled[j] = card
  }

  return shuffled
}

function createCardInstance(card) {
  return {
    instanceId: crypto.randomUUID(),
    cardId: card.id,
    text: card.text
  }
}

function drawCards(room, count) {
  const deck = room.game.whiteDeck

  // refill deck dokud není dostatek karet
  while (deck.length < count) {
    const refillDeck = shuffle(room.game.allWhiteCards)
    deck.push(...refillDeck)
  }

  return deck.splice(0, count).map(createCardInstance)
}

function allPlayersReady(room) {
  return room.players.every(player => player.ready)
}

async function startGame(room) {
  const shuffledWhiteCards = shuffle(await getWhiteCards())
  const shuffledBlackCards = shuffle(await getBlackCards())
  const blackCard = shuffledBlackCards.shift()

  room.game = {
    phase: GAME_PHASES.PICKING,
    round: 1,
    maxRounds: MAX_ROUNDS,
    submissions: [],
    blackDeck: shuffledBlackCards,
    whiteDeck: [...shuffledWhiteCards],
    allWhiteCards: [...shuffledWhiteCards],
    blackCard
  }

  room.players.forEach(player => {
    player.score = 0
    player.ready = false
    player.selectedCards = []
    player.selectedCardInstanceIds = []
    player.selectedVoteId = null
    player.hand = drawCards(room, HAND_SIZE)
  })
}

function nextRound(room) {
  room.game.round++
  room.game.phase = GAME_PHASES.PICKING
  room.game.submissions = []
  room.game.blackCard = room.game.blackDeck.shift()

  room.players.forEach(player => {
    // odebrat použité karty
    player.hand = player.hand.filter(
      card => !player.selectedCardInstanceIds.includes(card.instanceId)
    )

    // dolíznout chybějící karty
    const missingCards = HAND_SIZE - player.hand.length
    if (missingCards > 0) {
      player.hand.push(...drawCards(room, missingCards))
    }

    player.ready = false
    player.selectedCards = []
    player.selectedCardInstanceIds = []
    player.selectedVoteId = null
  })
}

module.exports = {
  startGame,
  nextRound,
  allPlayersReady,
  MAX_PLAYERS,
  HAND_SIZE,
  MAX_ROUNDS
}
