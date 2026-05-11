<script setup>
defineProps({
  players: Array,

  isHost: {
    type: Boolean,
    default: false
  },

  currentPlayerId: {
    type: [
      String,
      Number
    ],
    default: null
  }
})

defineEmits([
  "kick-player"
])
</script>

<template>
  <div class="players-side">

    <div class="players-list">

      <transition-group
        name="players"
        tag="div"
      >

        <div
          class="player-row"

          v-for="player in players"
          :key="player.id"
        >

          <div class="player-left">

            <div
              class="ready-dot"
              :class="{
                ready: player.ready,
                offline: player.connected === false
              }"
            ></div>

            <div
              class="player-name"

              :class="{
                host: player.isHost,
                offline: player.connected === false
              }"
            >
              {{ player.username }}
            </div>

          </div>

          <div class="player-score">
            {{ player.score }}
          </div>

          <button
            v-if="
              isHost &&
              player.id !== currentPlayerId &&
              !player.isHost
            "
            class="kick-button"
            type="button"
            :aria-label="`Kick ${player.username}`"
            title="Kick player"
            @click="
              $emit(
                'kick-player',
                player.id
              )
            "
          >
            <i class="fa-solid fa-user-minus"></i>
          </button>

        </div>

      </transition-group>

    </div>

  </div>
</template>

<style scoped>
.players-side {
  width: clamp(220px, 12.5vw, 320px);

  flex-shrink: 0;

  display: flex;
  flex-direction: column;

  justify-content: center;

  padding: clamp(14px, 0.95vw, 24px);

  border:
    1px solid rgba(255,255,255,0.08);

  border-radius: 12px;

  background:
    linear-gradient(
      180deg,
      rgba(13,17,15,0.78),
      rgba(7,9,8,0.78)
    );

  box-shadow:
    0 18px 34px rgba(0,0,0,0.24),
    inset 0 1px 0 rgba(255,255,255,0.06);
}

.players-list {
  display: flex;
  flex-direction: column;

  gap: clamp(12px, 0.9vw, 24px);
}

.player-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;

  column-gap: 8px;

  min-height: clamp(36px, 2.3vw, 58px);

  padding: 0 clamp(8px, 0.7vw, 16px);

  border-radius: 8px;

  background:
    rgba(255,255,255,0.025);

  font-size: clamp(15px, 0.9vw, 22px);
  font-weight: 800;

  transition:
    transform 0.18s ease,
    opacity 0.18s ease,
    background 0.18s ease;
}

.player-row:has(.kick-button) {
  padding-right: 4px;
}

.player-row:hover {
  background:
    rgba(255,255,255,0.05);
}

.player-left {
  display: flex;
  align-items: center;

  gap: clamp(8px, 0.55vw, 14px);

  min-width: 0;
}

  .player-name {
    color: rgba(255,255,255,0.92);

    transition:
      color 0.18s ease,
      text-shadow 0.18s ease;
  }

  .player-name.host {
    color: #ffd84d;

    text-shadow:
      0 0 12px rgba(255,216,77,0.18);
  }

  .player-name.offline {
    color:
      rgba(255,255,255,0.46);

    text-decoration:
      line-through;
  }

.player-score {
  color:
    var(--game-yellow);

  font-size: clamp(14px, 0.85vw, 20px);
  font-weight: 900;

  flex-shrink: 0;
}

.kick-button {
  width: clamp(28px, 1.7vw, 42px);
  height: clamp(28px, 1.7vw, 42px);

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 0;

  border: none;
  border-radius: 8px;

  background:
    rgba(255,77,97,0.14);

  color:
    #ff8391;

  font-size: clamp(12px, 0.75vw, 17px);

  opacity: 0.72;

  transition:
    transform 0.16s ease,
    opacity 0.16s ease,
    background 0.16s ease,
    color 0.16s ease;
}

.kick-button:hover,
.kick-button:focus {
  transform:
    translateY(-1px);

  opacity: 1;

  background:
    rgba(255,77,97,0.26);

  color:
    white;
}

.ready-dot {
  width: clamp(9px, 0.55vw, 14px);
  height: clamp(9px, 0.55vw, 14px);

  border-radius: 999px;

  background: #555;

  flex-shrink: 0;

  transition:
    background 0.18s ease,
    box-shadow 0.18s ease;
}

.ready-dot.ready {
  background: #2fe66b;

  box-shadow:
    0 0 10px #2fe66b;
}

.ready-dot.offline {
  background:
    var(--game-red);

  box-shadow:
    0 0 10px rgba(255,77,97,0.6);
}

/* PLAYER LIST ANIM */

.players-enter-active,
.players-leave-active,
.players-move {
  transition:
    all 0.22s ease;
}

.players-enter-from,
.players-leave-to {
  opacity: 0;

  transform:
    translateY(8px);
}

@media (max-width: 1100px) {
  .players-side {
    width: 190px;

    padding: 10px;
  }

  .players-list {
    gap: 8px;
  }

  .player-row {
    min-height: 32px;

    padding: 0 6px;

    column-gap: 6px;

    font-size: 13px;
  }

  .player-score {
    font-size: 13px;
  }

  .ready-dot {
    width: 8px;
    height: 8px;
  }

  .kick-button {
    width: 25px;
    height: 25px;

    font-size: 11px;
  }
}

@media (max-width: 900px) {
  .players-side {
    width: 166px;
  }
}

@media (max-width: 760px) {
  .players-side {
    width: 100%;
    max-height: 142px;

    padding: 8px;

    overflow-y: auto;
  }

  .players-list {
    overflow: visible;

    flex-direction: column;

    gap: 8px;

    padding-bottom: 0;
  }

  .players-list > :deep(div) {
    display: grid;

    grid-template-columns:
      repeat(2, minmax(0, 1fr));

    gap: 8px;
  }

  .player-row {
    width: 100%;
    min-height: 32px;

    font-size: 12px;
  }

  .player-left {
    min-width: 0;
  }

  .player-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

@media (max-width: 420px) and (max-height: 720px) {
  .players-side {
    max-height: 88px;

    padding: 6px;
  }

  .players-list > :deep(div) {
    gap: 6px;
  }

  .player-row {
    min-height: 26px;

    padding: 0 5px;

    column-gap: 4px;

    font-size: 10px;
  }

  .player-score {
    font-size: 10px;
  }

  .ready-dot {
    width: 6px;
    height: 6px;
  }

  .kick-button {
    width: 21px;
    height: 21px;

    font-size: 9px;
  }
}
</style>
