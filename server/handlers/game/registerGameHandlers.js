const registerStartGame =
  require("./startGame")

const registerToggleReady =
  require("./toggleReady")

const registerRevealFinished =
  require("./revealFinished")

const registerSubmitCards =
  require("./submitCards")

const registerSubmitVote =
  require("./submitVote")

const registerNextRound =
  require("./nextRound")

const registerBackToLobby =
  require("./backToLobby")

const registerEndGame =
  require("./endGame")

const registerForceVoting =
  require("./forceVoting")

module.exports =
function registerGameHandlers(
  io,
  socket
) {

  registerStartGame(
    io,
    socket
  )

  registerToggleReady(
    io,
    socket
  )

  registerRevealFinished(
    io,
    socket
  )

  registerSubmitCards(
    io,
    socket
  )

  registerSubmitVote(
    io,
    socket
  )

  registerNextRound(
    io,
    socket
  )

  registerBackToLobby(
    io,
    socket
  )

  registerEndGame(
    io,
    socket
  )

  registerForceVoting(
    io,
    socket
  )
}
