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
  width: 240px;

  flex-shrink: 0;

  display: flex;
  flex-direction: column;

  justify-content: center;

  padding: 16px;

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

  gap: 18px;
}

.player-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  align-items: center;

  column-gap: 8px;

  min-height: 38px;

  padding: 0 8px;

  border-radius: 8px;

  background:
    rgba(255,255,255,0.025);

  font-size: 16px;
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

  gap: 8px;

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

  font-size: 15px;
  font-weight: 900;

  flex-shrink: 0;
}

.kick-button {
  width: 30px;
  height: 30px;

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

  font-size: 13px;

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
  width: 10px;
  height: 10px;

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
</style>
