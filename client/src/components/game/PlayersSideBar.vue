<script setup>
defineProps({
  players: Array
})
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
              :class="{ ready: player.ready }"
            ></div>

            <div
              class="player-name"

              :class="{
                host: player.isHost
              }"
            >
              {{ player.username }}
            </div>

          </div>

          <div class="player-score">
            {{ player.score }}
          </div>

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

  padding-top: 10px;
}

.players-list {
  display: flex;
  flex-direction: column;

  gap: 18px;
}

.player-row {
  display: flex;
  justify-content: space-between;
  align-items: center;

  min-height: 24px;

  font-size: 16px;

  transition:
    transform 0.18s ease,
    opacity 0.18s ease;
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

.player-score {
  opacity: 0.7;

  font-size: 15px;

  flex-shrink: 0;
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