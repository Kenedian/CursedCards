<script setup>
import {
  computed,
  ref,
  onMounted,
  onUnmounted
} from "vue"

import {
  playSound
}
from "../../composables/useGameAudio"

const props = defineProps({
  players: {
    type: Array,
    default: () => []
  }
})

function isHost(player) {
  return player?.isHost
}

const sortedPlayers = computed(() =>
  [...props.players].sort((a, b) => b.score - a.score)
)

const firstPlace = computed(() => sortedPlayers.value[0])
const secondPlace = computed(() => sortedPlayers.value[1])
const thirdPlace = computed(() => sortedPlayers.value[2])

const remainingPlayers = computed(() =>
  sortedPlayers.value.slice(3)
)

const revealThird = ref(false)
const revealThirdText = ref(false)

const revealSecond = ref(false)
const revealSecondText = ref(false)

const revealFirst = ref(false)
const revealWinnerText = ref(false)

const revealRemaining = ref(false)

const shakeWinner = ref(false)

let cancelled = false

function wait(ms) {
  return new Promise(resolve =>
    setTimeout(resolve, ms)
  )
}

function isCancelled() {
  return cancelled
}

async function startReveal() {

  if (thirdPlace.value) {

    await wait(500)

    if (isCancelled()) {
      return
    }

    revealThird.value = true

    await wait(220)

    if (isCancelled()) {
      return
    }

    revealThirdText.value = true
  }

  if (secondPlace.value) {

    await wait(650)

    if (isCancelled()) {
      return
    }

    revealSecond.value = true

    await wait(220)

    if (isCancelled()) {
      return
    }

    revealSecondText.value = true
  }

  if (firstPlace.value) {

    await wait(850)

    if (isCancelled()) {
      return
    }

    revealFirst.value = true

    playSound("gameOverWinner")

    await wait(260)

    if (isCancelled()) {
      return
    }

    shakeWinner.value = true

    await wait(350)

    if (isCancelled()) {
      return
    }

    shakeWinner.value = false

    await wait(100)

    if (isCancelled()) {
      return
    }

    revealWinnerText.value = true
  }

  // vždy revealni pravou stranu
  await wait(700)

  if (isCancelled()) {
    return
  }

  revealRemaining.value = true
}

onMounted(() => {
  cancelled = false

  startReveal()
})

onUnmounted(() => {
  cancelled = true
})
</script>

<template>
  <div class="game-over-phase">

    <div class="scoreboard-layout">

      <!-- LEFT -->

      <div class="podium-side">

        <!-- #1 -->

        <div
          v-if="firstPlace"

          class="winner-wrapper"

          :class="{
            revealed: revealFirst
          }"
        >

          <div
            class="winner-card"

            :class="{
              shake: shakeWinner,
              'hidden-style': !revealWinnerText
            }"
          >

            <div
              v-if="revealWinnerText"
              class="winner-glow"
            ></div>

            <div
              v-if="revealWinnerText"
              class="points-badge winner-badge"
            >
              {{ firstPlace.score }}
            </div>

            <transition name="winner-text">

              <div
                v-if="revealWinnerText"
                class="winner-content"
              >

                <div class="winner-label">
                  WINNER
                </div>

                <div class="crown">
                  👑
                </div>

                <div
                  class="winner-name"

                  :class="{
                    'host-name': isHost(firstPlace)
                  }"
                >
                  {{ firstPlace.username }}
                </div>

              </div>

            </transition>

          </div>

        </div>

        <!-- #2 -->

        <div
          v-if="secondPlace"

          class="podium-card"

          :class="{
            revealed: revealSecond
          }"
        >

          <div
            v-if="revealSecondText"
            class="points-badge"
          >
            {{ secondPlace.score }}
          </div>

          <transition name="podium-text">

            <div
              v-if="revealSecondText"
              class="podium-content"
            >

              <div class="place-label">
                #2
              </div>

              <div
                class="podium-name"

                :class="{
                  'host-name': isHost(secondPlace)
                }"
              >
                {{ secondPlace.username }}
              </div>

            </div>

          </transition>

        </div>

        <!-- #3 -->

        <div
          v-if="thirdPlace"

          class="podium-card"

          :class="{
            revealed: revealThird
          }"
        >

          <div
            v-if="revealThirdText"
            class="points-badge"
          >
            {{ thirdPlace.score }}
          </div>

          <transition name="podium-text">

            <div
              v-if="revealThirdText"
              class="podium-content"
            >

              <div class="place-label">
                #3
              </div>

              <div
                class="podium-name"

                :class="{
                  'host-name': isHost(thirdPlace)
                }"
              >
                {{ thirdPlace.username }}
              </div>

            </div>

          </transition>

        </div>

      </div>

      <!-- RIGHT -->

      <transition name="leaderboard-fade">

        <div
          v-if="revealRemaining"
          class="leaderboard-side"
        >

          <div class="leaderboard-title">
            FINAL STANDINGS
          </div>

          <div
            v-if="remainingPlayers.length > 0"
          >

            <div
              v-for="(player, index) in remainingPlayers"

              :key="player.id"

              class="leaderboard-player"
            >

              <div class="leaderboard-left">

                <span class="leaderboard-place">
                  #{{ index + 4 }}
                </span>

                <span
                  :class="{
                    'host-name': isHost(player)
                  }"
                >
                  {{ player.username }}
                </span>

              </div>

              <div class="leaderboard-score">
                {{ player.score }} pts
              </div>

            </div>

          </div>

        </div>

      </transition>

    </div>

  </div>
</template>

<style scoped>
.game-over-phase {
  flex: 1;

  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;

  position: relative;

  padding: 90px 40px 40px;
}

.game-over-phase::before {
  content: "";

  position: absolute;
  inset: 0;

  background:
    radial-gradient(
      circle at center,
      rgba(47,230,107,0.06),
      transparent 60%
    );

  pointer-events: none;
}

.scoreboard-layout {
  width: 100%;
  max-width: 1400px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 120px;

  z-index: 2;
}

.podium-side {
  display: flex;
  flex-direction: column;

  gap: 18px;

  width: 420px;
}

.winner-wrapper {
  opacity: 0.15;

  transform: scale(0.9);

  transition:
    all 0.7s
    cubic-bezier(.2,1,.2,1);
}

.winner-wrapper.revealed {
  opacity: 1;

  transform: scale(1);
}

.winner-card {
  position: relative;

  height: 205px;

  border-radius: 30px;

  overflow: hidden;

  background:
    linear-gradient(
      180deg,
      #080808 0%,
      #020202 100%
    );

  border: 4px solid #2fe66b;

  display: flex;
  justify-content: center;
  align-items: center;

  box-shadow:
    0 0 26px rgba(47,230,107,0.18),
    0 0 55px rgba(47,230,107,0.06);
}

.winner-card.hidden-style {
  border-color: transparent;

  box-shadow: none;
}

.winner-card.shake {
  animation:
    winnerShake 0.35s ease;
}

.winner-glow {
  position: absolute;
  inset: 0;

  background:
    radial-gradient(
      circle at center,
      rgba(47,230,107,0.05),
      transparent 70%
    );
}

.winner-content {
  display: flex;
  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 4px;

  z-index: 2;
}

.winner-label {
  font-size: 18px;
  font-weight: bold;

  letter-spacing: 5px;

  opacity: 0.7;
}

.crown {
  font-size: 34px;
}

.winner-name {
  font-size: 38px;
  font-weight: bold;

  text-align: center;
}

.host-name {
  color: #ffd84d;

  text-shadow:
    0 0 12px rgba(255,216,77,0.22);
}

.points-badge {
  position: absolute;

  right: 14px;
  bottom: 14px;

  width: 42px;
  height: 42px;

  border-radius: 999px;

  background: #2fe66b;
  color: black;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 18px;
  font-weight: bold;

  box-shadow:
    0 0 16px rgba(47,230,107,0.35);

  z-index: 5;
}

.winner-badge {
  width: 46px;
  height: 46px;

  font-size: 20px;
}

.podium-card {
  height: 135px;

  border-radius: 28px;

  background:
    linear-gradient(
      180deg,
      #101010 0%,
      #070707 100%
    );

  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;

  overflow: hidden;

  opacity: 0.15;

  transform: scale(0.92);

  transition:
    all 0.6s
    cubic-bezier(.2,1,.2,1);

  box-shadow:
    0 0 35px rgba(0,0,0,0.4);
}

.podium-card.revealed {
  opacity: 1;

  transform: scale(1);
}

.podium-content {
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  gap: 2px;
}

.place-label {
  font-size: 34px;
  font-weight: bold;

  color: #2fe66b;

  text-shadow:
    0 0 16px rgba(47,230,107,0.3);
}

.podium-name {
  font-size: 26px;
  font-weight: bold;
}

.leaderboard-side {
  flex: 1;

  max-width: 560px;

  display: flex;
  flex-direction: column;

  gap: 16px;
}

.leaderboard-title {
  font-size: 24px;
  font-weight: bold;

  letter-spacing: 4px;

  opacity: 0.7;

  margin-bottom: 8px;
}

.leaderboard-player {
  background:
    rgba(255,255,255,0.04);

  border-radius: 22px;

  padding: 18px 22px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  font-size: 22px;

  backdrop-filter: blur(4px);

  box-shadow:
    0 0 18px rgba(0,0,0,0.2);
}

.leaderboard-left {
  display: flex;
  align-items: center;

  gap: 18px;
}

.leaderboard-place {
  color: #2fe66b;

  font-weight: bold;

  min-width: 42px;
}

.leaderboard-score {
  opacity: 0.72;
}

.winner-text-enter-active,
.podium-text-enter-active {
  transition: all 0.4s ease;
}

.winner-text-enter-from,
.podium-text-enter-from {
  opacity: 0;

  transform: translateY(10px);
}

.leaderboard-fade-enter-active {
  transition: all 0.7s ease;
}

.leaderboard-fade-enter-from {
  opacity: 0;

  transform: translateX(30px);
}

@keyframes winnerShake {

  0% {
    transform: translateX(0);
  }

  20% {
    transform: translateX(-6px);
  }

  40% {
    transform: translateX(6px);
  }

  60% {
    transform: translateX(-4px);
  }

  80% {
    transform: translateX(4px);
  }

  100% {
    transform: translateX(0);
  }
}
</style>
