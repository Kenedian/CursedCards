export default function getBlackCardPickCount(
  text
) {

  return (
    text.match(
      /\[BLANK\]/g
    ) || []
  ).length
}