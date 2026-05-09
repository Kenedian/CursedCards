import {
  ref,
  computed
} from "vue"

import useGameStore
from "../../stores/gameStore"

import { CARD_TYPES }
from "../../../../shared/constants/cardTypes"

import getBlackCardPickCount
from "../../utils/cards/getBlackCardPickCount"

const {
  whiteCards,
  blackCards,

  createCard,
  updateCard,
  deleteCard
} = useGameStore()

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

  function normalize(text) {

    return text
      .replace(/\s+/g, " ")
      .trim()
      .toLowerCase()
  }

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

    if (!canCreate.value) {
      return
    }

    const normalizedInput =
      normalize(
        trimmedText.value
      )

    const target =
      currentType.value ===
      CARD_TYPES.WHITE
        ? whiteCards.value
        : blackCards.value

    const duplicate =
      target.some(
        card =>
          card.id !==
            editingCard.value?.id &&
          normalize(card.text) ===
            normalizedInput
      )

    if (duplicate) {

      alert(
        `Duplicate ${
          currentType.value
        } card`
      )

      return
    }

    if (editingCard.value) {

      updateCard(
        currentType.value,
        editingCard.value.id,
        trimmedText.value
      )
    }

    else {

      createCard(
        currentType.value,
        trimmedText.value
      )
    }

    cancelEdit()
  }

  function handleDeleteCard(
    cardData
  ) {

    deleteCard(
      cardData.type,
      cardData.id
    )
  }

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