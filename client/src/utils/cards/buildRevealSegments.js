const BLANK_PATTERN =
  /\[BLANK\]|_{3,}/g

function normalizeText(value) {
  return String(
    value ?? ""
  )
}

export default function buildRevealSegments(
  blackCardText,
  selectedCards = []
) {
  const source =
    normalizeText(blackCardText)

  const segments = []
  const answerRanges = []

  let cardIndex = 0
  let sourceIndex = 0
  let spokenIndex = 0

  function pushText(text) {
    if (!text) {
      return
    }

    segments.push({
      type: "text",
      text
    })

    spokenIndex +=
      text.length
  }

  function pushAnswer(text) {
    const answerIndex =
      cardIndex++

    const start =
      spokenIndex

    const end =
      start + text.length

    segments.push({
      type: "answer",
      text,
      answerIndex,
      start,
      end
    })

    answerRanges.push({
      answerIndex,
      start,
      end
    })

    spokenIndex =
      end
  }

  source.replace(
    BLANK_PATTERN,
    (match, offset) => {
      pushText(
        source.slice(
          sourceIndex,
          offset
        )
      )

      pushAnswer(
        normalizeText(
          selectedCards[cardIndex]?.text ||
          "???"
        )
      )

      sourceIndex =
        offset + match.length

      return match
    }
  )

  pushText(
    source.slice(sourceIndex)
  )

  return {
    segments,
    answerRanges,
    fullText:
      segments
        .map(segment => segment.text)
        .join("")
  }
}

