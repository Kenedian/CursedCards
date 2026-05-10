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

        createCard(
          cardData.type,
          cardData.text
        )

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

        updateCard(
          cardData.type,
          cardData.id,
          cardData.text
        )

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