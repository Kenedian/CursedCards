const crypto =
  require("crypto")

const {
  GAME_PHASES
} = require("../../shared/constants/gamePhases")

const {

  getWhiteCards,
  getBlackCards

} = require("./cardService")

const MAX_PLAYERS = 8

const HAND_SIZE = 6

function shuffle(array) {

  return [...array]
    .sort(() => Math.random() - 0.5)
}

function createCardInstance(card) {

  return {

    instanceId:
      crypto.randomUUID(),

    cardId:
      card.id,

    text:
      card.text
  }
}

function drawCards(deck, count) {

  return deck
    .splice(0, count)
    .map(createCardInstance)
}

function allPlayersReady(room) {

  return room.players.every(
    player => player.ready
  )
}

function startGame(room) {

    const shuffledWhiteCards =
        shuffle(
            getWhiteCards()
        )

    const shuffledBlackCards =
        shuffle(
            getBlackCards()
        )

  room.game = {

    phase:
      GAME_PHASES.PICKING,

    round: 1,

    maxRounds: 10,

    submissions: [],

    blackDeck:
      shuffledBlackCards,

    whiteDeck:
      shuffledWhiteCards,

    blackCard:
      shuffledBlackCards.shift()
  }

  room.players.forEach(player => {

    player.score = 0

    player.ready = false

    player.selectedCards = []

    player.selectedCardInstanceIds = []

    player.selectedVoteId = null

    player.hand = drawCards(

      room.game.whiteDeck,

      HAND_SIZE
    )
  })
}

function nextRound(room) {

  room.game.round++

  room.game.phase =
    GAME_PHASES.PICKING

  room.game.submissions = []

  room.game.blackCard =
    room.game.blackDeck.shift()

  room.players.forEach(player => {

    // remove used cards

    player.hand =
      player.hand.filter(

        card =>

          !player
            .selectedCardInstanceIds
            .includes(
              card.instanceId
            )
      )

    // refill hand

    const missingCards =
      HAND_SIZE -
      player.hand.length

    if (missingCards > 0) {

      player.hand.push(

        ...drawCards(
          room.game.whiteDeck,
          missingCards
        )
      )
    }

    // reset state

    player.ready = false

    player.selectedCards = []

    player.selectedCardInstanceIds =
      []

    player.selectedVoteId = null
  })
}

module.exports = {

  startGame,

  nextRound,

  allPlayersReady,

  MAX_PLAYERS
}