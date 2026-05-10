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

  const table =
    getTableName(type)

  return db.prepare(`
    INSERT INTO ${table}
    (text)

    VALUES (?)
  `).run(text)
}

function updateCard(
  type,
  id,
  text
) {

  const table =
    getTableName(type)

  return db.prepare(`
    UPDATE ${table}

    SET text = ?

    WHERE id = ?
  `).run(
    text,
    id
  )
}

function deleteCard(
  type,
  id
) {

  const table =
    getTableName(type)

  return db.prepare(`
    DELETE FROM ${table}

    WHERE id = ?
  `).run(id)
}

module.exports = {

  getWhiteCards,
  getBlackCards,
  getAllCards,

  createCard,
  updateCard,
  deleteCard
}