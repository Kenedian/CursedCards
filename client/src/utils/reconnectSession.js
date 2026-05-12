const SESSION_ID_KEY =
  "cursedCards.sessionId"

const RECONNECT_INFO_KEY =
  "cursedCards.reconnectInfo"

function createSessionId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random()}`
}

export function getClientSessionId() {
  let sessionId =
    localStorage.getItem(SESSION_ID_KEY)

  if (!sessionId) {
    sessionId = createSessionId()

    localStorage.setItem(
      SESSION_ID_KEY,
      sessionId
    )
  }

  return sessionId
}

export function saveReconnectInfo({
  code,
  username
}) {
  localStorage.setItem(
    RECONNECT_INFO_KEY,
    JSON.stringify({
      code,
      username,
      savedAt:
        Date.now()
    })
  )
}

export function getReconnectInfo() {
  try {
    const info =
      JSON.parse(
      localStorage.getItem(RECONNECT_INFO_KEY)
    )

    if (
      !info?.code ||
      !info?.username
    ) {
      clearReconnectInfo()

      return null
    }

    return info
  }

  catch {
    clearReconnectInfo()

    return null
  }
}

export function clearReconnectInfo() {
  localStorage.removeItem(
    RECONNECT_INFO_KEY
  )
}
