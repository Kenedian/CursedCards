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

function getWhiteCards() {

  return db.prepare(`
    SELECT *
    FROM WhiteCards

    ORDER BY id DESC
  `).all()
}

function getBlackCards() {

  return db.prepare(`
    SELECT *
    FROM BlackCards

    ORDER BY id DESC
  `).all()
}

function getAllCards() {

  return {
    whiteCards:
      getWhiteCards(),

    blackCards:
      getBlackCards()
  }
}

function createCard(
  type,
  text
) {

  try {

    const table =
      getTableName(type)

    db.prepare(`
      INSERT INTO ${table}
      (text)

      VALUES (?)
    `).run(text)

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

function updateCard(
  type,
  id,
  text
) {

  try {

    const table =
      getTableName(type)

    db.prepare(`
      UPDATE ${table}

      SET text = ?

      WHERE id = ?
    `).run(
      text,
      id
    )

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

function deleteCard(
  type,
  id
) {

  try {

    const table =
      getTableName(type)

    db.prepare(`
      DELETE FROM ${table}

      WHERE id = ?
    `).run(id)

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