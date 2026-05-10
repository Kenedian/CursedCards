const db =
  require("../database")

const {
  CARD_TYPES
} = require(
  "../../shared/constants/cardTypes"
)

function getTableName(type) {

  return (
    type === CARD_TYPES.WHITE
      ? "WhiteCards"
      : "BlackCards"
  )
}

async function getWhiteCards() {

  const result =
    await db.execute(`

      SELECT *
      FROM WhiteCards

      ORDER BY id DESC
    `)

  return result.rows
}

async function getBlackCards() {

  const result =
    await db.execute(`

      SELECT *
      FROM BlackCards

      ORDER BY id DESC
    `)

  return result.rows
}

async function getAllCards() {

  return {

    whiteCards:
      await getWhiteCards(),

    blackCards:
      await getBlackCards()
  }
}

async function createCard(
  type,
  text
) {

  try {

    const table =
      getTableName(type)

    await db.execute({

      sql: `
        INSERT INTO ${table}
        (text)

        VALUES (?)
      `,

      args: [text]
    })

    return {
      success: true
    }
  }

  catch (error) {

    if (
      error.message.includes(
        "UNIQUE constraint failed"
      )
    ) {

      return {
        success: false,
        reason: "duplicate"
      }
    }

    return {
      success: false,
      reason: "unknown"
    }
  }
}

async function updateCard(
  type,
  id,
  text
) {

  try {

    const table =
      getTableName(type)

    await db.execute({

      sql: `
        UPDATE ${table}

        SET text = ?

        WHERE id = ?
      `,

      args: [
        text,
        id
      ]
    })

    return {
      success: true
    }
  }

  catch (error) {

    if (
      error.message.includes(
        "UNIQUE constraint failed"
      )
    ) {

      return {
        success: false,
        reason: "duplicate"
      }
    }

    return {
      success: false,
      reason: "unknown"
    }
  }
}

async function deleteCard(
  type,
  id
) {

  try {

    const table =
      getTableName(type)

    await db.execute({

      sql: `
        DELETE FROM ${table}

        WHERE id = ?
      `,

      args: [id]
    })

    return {
      success: true
    }
  }

  catch (error) {

    return {
      success: false,
      reason: "unknown"
    }
  }
}

module.exports = {

  getWhiteCards,
  getBlackCards,
  getAllCards,

  createCard,
  updateCard,
  deleteCard
}