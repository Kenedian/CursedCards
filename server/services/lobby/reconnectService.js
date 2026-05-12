const rooms =
  require("../../state/rooms")

const {
  emitLobby,
  emitGame
} = require("../../emitters/gameEmitter")

const {
  removePlayerFromRoom
} = require("./playerLifecycleService")

const RECONNECT_GRACE_MS =
  30 * 60 * 1000

const pendingRemovals =
  new Map()

function getPlayerKey(player) {
  return player.sessionId || player.id
}

function getRemovalKey(room, player) {
  return `${room.code}:${getPlayerKey(player)}`
}

function cancelPendingRemoval(room, player) {
  const removalKey =
    getRemovalKey(room, player)

  const timer =
    pendingRemovals.get(removalKey)

  if (!timer) {
    return
  }

  clearTimeout(timer)

  pendingRemovals.delete(removalKey)
}

function schedulePlayerRemoval(io, room, player) {
  cancelPendingRemoval(room, player)

  const removalKey =
    getRemovalKey(room, player)

  const playerKey =
    getPlayerKey(player)

  const timer =
    setTimeout(() => {

      const currentRoom =
        rooms.get(room.code)

      if (!currentRoom) {
        pendingRemovals.delete(removalKey)

        return
      }

      const currentPlayer =
        currentRoom.players.find(candidate =>
          getPlayerKey(candidate) ===
          playerKey
        )

      if (
        !currentPlayer ||
        currentPlayer.connected
      ) {
        pendingRemovals.delete(removalKey)

        return
      }

      removePlayerFromRoom(
        currentRoom,
        currentPlayer.id
      )

      pendingRemovals.delete(removalKey)

      if (
        currentRoom.players.length === 0
      ) {
        rooms.delete(currentRoom.code)

        return
      }

      emitLobby(io, currentRoom)

      if (currentRoom.game) {
        emitGame(io, currentRoom)
      }
    }, RECONNECT_GRACE_MS)

  pendingRemovals.set(
    removalKey,
    timer
  )
}

module.exports = {
  cancelPendingRemoval,
  schedulePlayerRemoval
}
