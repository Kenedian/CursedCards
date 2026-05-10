import {
  ref,
  computed,
  onMounted,
  onUnmounted
}
from "vue"

import socket
from "../../socket"

import {
  SOCKET_EVENTS
}
from "../../../../shared/constants/socketEvents"

import { CARD_TYPES }
from "../../../../shared/constants/cardTypes"

import getBlackCardPickCount
from "../../utils/cards/getBlackCardPickCount"

import useCardsStore
from "../../stores/cardsStore"

const {
  whiteCards,
  blackCards
} = useCardsStore()

export default function useCardsAdmin() {

  const currentType =
    ref(CARD_TYPES.WHITE)

  const cardText =
    ref("")

  const editingCard =
    ref(null)

  const trimmedText =
    computed(() => {

      return cardText.value
        .replace(/\s+/g, " ")
        .trim()
    })

  const blackBlankCount =
    computed(() => {

      return getBlackCardPickCount(
        trimmedText.value
      )
    })

  const canCreate =
    computed(() => {

      if (
        currentType.value ===
        CARD_TYPES.WHITE
      ) {

        return (
          trimmedText.value.length > 0
        )
      }

      return (
        blackBlankCount.value > 0
      )
    })

  function addBlank() {

    if (
      cardText.value.length > 0 &&
      !cardText.value.endsWith(" ")
    ) {

      cardText.value += " "
    }

    cardText.value += "[BLANK]"
  }

  function startEdit(card) {

    editingCard.value = card

    currentType.value = card.type

    cardText.value = card.text
  }

  function cancelEdit() {

    editingCard.value = null

    cardText.value = ""
  }

  function submitCard() {

    return new Promise(resolve => {

      if (!canCreate.value) {

        resolve()

        return
      }

      const complete = () => {

        socket.off(
          SOCKET_EVENTS.ADMIN_CARDS_UPDATED,
          complete
        )

        socket.off(
          SOCKET_EVENTS.ADMIN_ACTION_FAILED,
          complete
        )

        resolve()
      }

      socket.once(
        SOCKET_EVENTS.ADMIN_CARDS_UPDATED,
        complete
      )

      socket.once(
        SOCKET_EVENTS.ADMIN_ACTION_FAILED,
        complete
      )

      // UPDATE

      if (editingCard.value) {

        socket.emit(
          SOCKET_EVENTS.ADMIN_UPDATE_CARD,

          {
            type:
              currentType.value,

            id:
              editingCard.value.id,

            text:
              trimmedText.value
          }
        )

        return
      }

      // CREATE

      socket.emit(
        SOCKET_EVENTS.ADMIN_CREATE_CARD,

        {
          type:
            currentType.value,

          text:
            trimmedText.value
        }
      )
    })
  }

  function handleDeleteCard(
    cardData
  ) {

    socket.emit(
      SOCKET_EVENTS.ADMIN_DELETE_CARD,

      {
        type:
          cardData.type,

        id:
          cardData.id
      }
    )
  }

  function handleCardsUpdated(
    cards
  ) {

    whiteCards.value =
      cards.whiteCards

    blackCards.value =
      cards.blackCards

    cancelEdit()
  }

  onMounted(() => {

    socket.on(
      SOCKET_EVENTS.ADMIN_CARDS_UPDATED,

      handleCardsUpdated
    )
  })

  onUnmounted(() => {

    socket.off(
      SOCKET_EVENTS.ADMIN_CARDS_UPDATED,

      handleCardsUpdated
    )
  })

  return {

    whiteCards,
    blackCards,

    currentType,
    cardText,
    editingCard,

    trimmedText,
    blackBlankCount,
    canCreate,

    addBlank,
    startEdit,
    cancelEdit,
    submitCard,

    deleteCard:
      handleDeleteCard
  }
}