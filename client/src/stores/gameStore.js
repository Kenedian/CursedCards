import {
  ref,
  computed
}
from "vue"

const currentLobby =
  ref(null)

const currentPlayerId =
  ref(null)

const currentPlayer =
  computed(() => {

    if (!currentLobby.value) {
      return null
    }

    return (
      currentLobby.value.players || []
    ).find(
      player =>
        player.id ===
        currentPlayerId.value
    )
})

function setLobby(room) {

  currentLobby.value =
    room
}

function clearLobby() {

  currentLobby.value =
    null
}

function setCurrentPlayerId(id) {

  currentPlayerId.value =
    id
}

export default function useGameStore() {

  return {

    // state

    currentLobby,
    currentPlayer,
    currentPlayerId,

    // mutations

    setLobby,
    clearLobby,
    setCurrentPlayerId
  }
}