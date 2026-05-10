const {
  SOCKET_EVENTS
} = require(
  "../../shared/constants/socketEvents"
)

const {

  getAllCards,

  createCard,
  updateCard,
  deleteCard

} = require(
  "../services/cardService"
)

const admins =
  new Set()

module.exports =
  function registerAdminHandlers(
    io,
    socket
  ) {

    function isAdmin() {

      return admins.has(
        socket.id
      )
    }

    function emitCards() {

      io.emit(
        SOCKET_EVENTS.ADMIN_CARDS_UPDATED,

        getAllCards()
      )
    }

    function emitError(message) {

      socket.emit(
        SOCKET_EVENTS.ADMIN_ACTION_FAILED,

        message
      )
    }

    // LOGIN

    socket.on(
      SOCKET_EVENTS.ADMIN_LOGIN,

      password => {

        if (
          password ===
          process.env.ADMIN_PASSWORD
        ) {

          admins.add(socket.id)

          socket.emit(
            SOCKET_EVENTS.ADMIN_LOGIN_SUCCESS
          )

          console.log(
            "admin authenticated:",
            socket.id
          )

          return
        }

        socket.emit(
          SOCKET_EVENTS.ADMIN_LOGIN_FAILED
        )

        console.log(
          "admin auth failed:",
          socket.id
        )
      }
    )

    // GET CARDS

    socket.on(
      SOCKET_EVENTS.ADMIN_GET_CARDS,

      () => {

        if (!isAdmin()) {
          return
        }

        socket.emit(
          SOCKET_EVENTS.ADMIN_CARDS_UPDATED,

          getAllCards()
        )
      }
    )

    // CREATE CARD

    socket.on(
      SOCKET_EVENTS.ADMIN_CREATE_CARD,

      cardData => {

        if (!isAdmin()) {
          return
        }

        const result =
          createCard(
            cardData.type,
            cardData.text
          )

        if (!result.success) {

          emitError(

            result.reason ===
            "duplicate"

              ? "Duplicate card"

              : "Failed to create card"
          )

          return
        }

        emitCards()
      }
    )

    // UPDATE CARD

    socket.on(
      SOCKET_EVENTS.ADMIN_UPDATE_CARD,

      cardData => {

        if (!isAdmin()) {
          return
        }

        const result =
          updateCard(
            cardData.type,
            cardData.id,
            cardData.text
          )

        if (!result.success) {

          emitError(

            result.reason ===
            "duplicate"

              ? "Duplicate card"

              : "Failed to update card"
          )

          return
        }

        emitCards()
      }
    )

    // DELETE CARD

    socket.on(
      SOCKET_EVENTS.ADMIN_DELETE_CARD,

      cardData => {

        if (!isAdmin()) {
          return
        }

        deleteCard(
          cardData.type,
          cardData.id
        )

        emitCards()
      }
    )

    // DISCONNECT

    socket.on(
      "disconnect",

      () => {

        admins.delete(
          socket.id
        )
      }
    )
  }