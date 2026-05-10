import socket
from "../../socket"

import {
  SOCKET_EVENTS
}
from "../../../../shared/constants/socketEvents"

import {
  GAME_PHASES
}
from "../../../../shared/constants/gamePhases"

export default function useGameActions({

  currentLobby,

  gamePhase,

  isReady,

  selectedCards,

  selectedVoteId
}) {

  function toggleReady() {

    // submit selected cards

    if (
      gamePhase.value ===
      GAME_PHASES.PICKING &&
      !isReady.value
    ) {

      socket.emit(
        SOCKET_EVENTS.SUBMIT_CARDS,

        {
          code:
            currentLobby.value.code,

          // instanceIds

          cards:
            selectedCards.value
        }
      )
    }

    socket.emit(
      SOCKET_EVENTS.TOGGLE_READY,

      currentLobby.value.code
    )
  }

  function submitVote(id) {

    socket.emit(
      SOCKET_EVENTS.SUBMIT_VOTE,

      {
        code:
          currentLobby.value.code,

        submissionId: id
      }
    )
  }

  function nextRound() {

    socket.emit(
      SOCKET_EVENTS.NEXT_ROUND,

      currentLobby.value.code
    )
  }

  function backToLobby() {

    socket.emit(
      SOCKET_EVENTS.BACK_TO_LOBBY,

      currentLobby.value.code
    )
  }

  function leaveGame() {

    socket.emit(
      SOCKET_EVENTS.LEAVE_LOBBY,

      currentLobby.value.code
    )

    currentLobby.value = null
  }

  return {

    toggleReady,

    submitVote,

    nextRound,
    backToLobby,

    leaveGame
  }
}
