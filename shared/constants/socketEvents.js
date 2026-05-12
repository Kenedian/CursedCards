export const SOCKET_EVENTS = {

  // lobby

  CREATE_LOBBY:
    "create-lobby",

  CREATE_LOBBY_SUCCESS:
    "create-lobby-success",

  JOIN_LOBBY:
    "join-lobby",

  JOIN_LOBBY_SUCCESS:
    "join-lobby-success",

  RECONNECT_LOBBY:
    "reconnect-lobby",

  RECONNECT_LOBBY_SUCCESS:
    "reconnect-lobby-success",

  LEAVE_LOBBY:
    "leave-lobby",

  LOBBY_UPDATED:
    "lobby-updated",

  UPDATE_LOBBY_SETTINGS:
    "update-lobby-settings",

  LOBBY_ERROR:
    "lobby-error",

  KICK_PLAYER:
    "kick-player",

  PLAYER_KICKED:
    "player-kicked",

  // game

  START_GAME:
    "start-game",

  GAME_UPDATED:
    "game-updated",

  TOGGLE_READY:
    "toggle-ready",

  SUBMIT_CARDS:
    "submit-cards",

  SUBMIT_VOTE:
    "submit-vote",

  NEXT_ROUND:
    "next-round",

  BACK_TO_LOBBY:
    "back-to-lobby",

  REVEAL_FINISHED:
   "reveal-finished",

  // admin auth

  ADMIN_LOGIN:
    "admin-login",

  ADMIN_LOGIN_SUCCESS:
    "admin-login-success",

  ADMIN_LOGIN_FAILED:
    "admin-login-failed",

  // admin cards

  ADMIN_GET_CARDS:
    "admin-get-cards",

  ADMIN_CARDS_UPDATED:
    "admin-cards-updated",

  ADMIN_CREATE_CARD:
    "admin-create-card",

  ADMIN_UPDATE_CARD:
    "admin-update-card",

  ADMIN_DELETE_CARD:
    "admin-delete-card",

  ADMIN_ACTION_FAILED:
    "admin-action-failed"
}
