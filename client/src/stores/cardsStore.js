import { ref } from "vue"

const whiteCards = ref([])
const blackCards = ref([])

export default function useCardsStore() {

  return {
    whiteCards,
    blackCards
  }
}