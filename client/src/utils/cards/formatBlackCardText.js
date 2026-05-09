export default function formatBlackCardText(
  blackCardText,
  selectedCards = []
) {

  let index = 0

  return blackCardText.replace(
    /\[BLANK\]/g,
    () => {

      const card =
        selectedCards[index++] || "???"

      return card
    }
  )
}