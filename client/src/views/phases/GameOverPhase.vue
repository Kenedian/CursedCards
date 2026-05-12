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

function nameFitStyle(player) {
  const nameLength =
    [...(player?.username || "")].length

  const scale =
    Math.max(
      0.42,
      Math.min(
        1,
        14 / Math.max(nameLength, 1)
      )
    )

  return {
    "--name-scale": scale
  }
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

                  :style="
                    nameFitStyle(firstPlace)
                  "
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

                :style="
                  nameFitStyle(secondPlace)
                "
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

                :style="
                  nameFitStyle(thirdPlace)
                "
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
            class="leaderboard-list"
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

  padding:
    clamp(18px, 4vh, 56px)
    clamp(20px, 3vw, 40px)
    clamp(14px, 3vh, 32px);
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
  max-height: 100%;

  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: clamp(36px, 6vw, 120px);

  z-index: 2;
}

.podium-side {
  display: flex;
  flex-direction: column;

  gap: clamp(10px, 2vh, 18px);

  width: clamp(320px, 32vw, 420px);
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

  height: clamp(150px, 24vh, 205px);

  border-radius: clamp(18px, 2vw, 30px);

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
  width: 100%;
  min-width: 0;
  max-width: 100%;
  max-height: 100%;

  box-sizing: border-box;

  padding:
    0
    clamp(58px, 6vw, 88px)
    0
    clamp(14px, 2vw, 28px);

  z-index: 2;
}

.winner-label {
  font-size: clamp(13px, 1.2vw, 18px);
  font-weight: bold;

  letter-spacing: 5px;

  opacity: 0.7;
}

.crown {
  font-size: clamp(24px, 2.2vw, 34px);
  line-height: 1;
}

.winner-name {
  font-size:
    max(
      10px,
      calc(clamp(26px, 2.8vw, 38px) * var(--name-scale, 1))
    );
  font-weight: bold;
  line-height: 1.05;

  text-align: center;

  width: 100%;
  max-width: 100%;

  overflow: hidden;
  white-space: nowrap;
}

.host-name {
  color: #ffd84d;

  text-shadow:
    0 0 12px rgba(255,216,77,0.22);
}

.points-badge {
  position: absolute;

  right: clamp(10px, 1vw, 14px);
  bottom: clamp(10px, 1vw, 14px);

  width: clamp(34px, 3vw, 42px);
  height: clamp(34px, 3vw, 42px);

  border-radius: 999px;

  background: #2fe66b;
  color: black;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: clamp(14px, 1.2vw, 18px);
  font-weight: bold;

  box-shadow:
    0 0 16px rgba(47,230,107,0.35);

  z-index: 5;
}

.winner-badge {
  width: clamp(38px, 3.4vw, 46px);
  height: clamp(38px, 3.4vw, 46px);

  font-size: clamp(16px, 1.4vw, 20px);
}

.podium-card {
  height: clamp(94px, 15vh, 135px);

  border-radius: clamp(16px, 2vw, 28px);

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
  width: 100%;
  min-width: 0;
  max-width: 100%;
  max-height: 100%;

  box-sizing: border-box;

  padding:
    0
    clamp(52px, 5.4vw, 78px)
    0
    clamp(12px, 2vw, 24px);
}

.place-label {
  font-size: clamp(24px, 2.4vw, 34px);
  font-weight: bold;

  color: #2fe66b;

  text-shadow:
    0 0 16px rgba(47,230,107,0.3);
}

.podium-name {
  font-size:
    max(
      9px,
      calc(clamp(18px, 2vw, 26px) * var(--name-scale, 1))
    );
  font-weight: bold;
  line-height: 1.05;

  width: 100%;
  max-width: 100%;

  text-align: center;

  overflow: hidden;
  white-space: nowrap;
}

.leaderboard-side {
  flex: 1;

  max-width: 560px;
  max-height: 100%;
  min-height: 0;

  display: flex;
  flex-direction: column;

  gap: clamp(8px, 1.4vh, 16px);
}

.leaderboard-list {
  min-height: 0;

  display: flex;
  flex-direction: column;

  gap: clamp(8px, 1.2vh, 14px);

  overflow-y: auto;
  overflow-x: hidden;

  padding-right: 4px;
  padding-bottom: 2px;

  scroll-padding-bottom: 16px;
}

.leaderboard-title {
  font-size: clamp(17px, 1.8vw, 24px);
  font-weight: bold;

  letter-spacing: 4px;

  opacity: 0.7;

  margin-bottom: clamp(2px, 0.7vh, 8px);
}

.leaderboard-player {
  background:
    rgba(255,255,255,0.04);

  border-radius: clamp(12px, 1.6vw, 22px);

  padding:
    clamp(10px, 1.6vh, 18px)
    clamp(14px, 1.6vw, 22px);

  display: flex;
  justify-content: space-between;
  align-items: center;

  font-size: clamp(16px, 1.6vw, 22px);

  backdrop-filter: blur(4px);

  box-shadow:
    0 0 18px rgba(0,0,0,0.2);
}

.leaderboard-left {
  display: flex;
  align-items: center;

  gap: clamp(10px, 1.3vw, 18px);

  min-width: 0;
}

.leaderboard-left span:last-child {
  min-width: 0;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.leaderboard-place {
  color: #2fe66b;

  font-weight: bold;

  min-width: 42px;
}

.leaderboard-score {
  opacity: 0.72;

  flex-shrink: 0;
}

@media (max-width: 1050px) {
  .game-over-phase {
    align-items: flex-start;

    overflow-y: auto;

    padding: 18px 14px 24px;
  }

  .scoreboard-layout {
    align-items: stretch;

    gap: 24px;
  }

  .podium-side {
    width: clamp(260px, 34vw, 320px);
  }

  .leaderboard-side {
    max-width: none;
  }

  .winner-card {
    height: 142px;
  }

  .podium-card {
    height: 88px;
  }

  .leaderboard-player {
    padding: 10px 12px;

    font-size: 15px;
  }
}

@media (max-height: 760px) {
  .game-over-phase {
    align-items: stretch;
  }

  .scoreboard-layout {
    align-items: center;
  }
}

@media (max-width: 760px) {
  .game-over-phase {
    overflow-y: auto;

    align-items: flex-start;

    padding:
      14px
      8px
      calc(72px + env(safe-area-inset-bottom));
  }

  .scoreboard-layout {
    flex-direction: column;

    gap: 18px;

    min-height: 0;
  }

  .podium-side,
  .leaderboard-side {
    width: 100%;
    max-width: 420px;
  }

  .leaderboard-side {
    flex: 0 1 auto;
    max-height: min(40dvh, 320px);
  }

  .leaderboard-list {
    padding-bottom:
      calc(56px + env(safe-area-inset-bottom));

    scroll-padding-bottom:
      calc(56px + env(safe-area-inset-bottom));
  }

  .winner-card {
    height: 132px;
  }

  .podium-card {
    height: 82px;
  }

  .leaderboard-player {
    padding: 10px 12px;

    font-size: 15px;
  }
}

@media (max-width: 999px) and (max-height: 520px) and (orientation: landscape) {
  .game-over-phase {
    align-items: flex-start;

    overflow-y: auto;

    padding:
      8px
      8px
      calc(56px + env(safe-area-inset-bottom));
  }

  .scoreboard-layout {
    flex-direction: column;
    align-items: flex-start;

    gap: 14px;
  }

  .podium-side {
    width: 100%;
    max-width: none;

    gap: 8px;
  }

  .leaderboard-side {
    width: 100%;
    max-width: none;
    max-height: calc(100dvh - 82px);
  }

  .winner-card {
    height: 112px;
  }

  .podium-card {
    height: 66px;
  }

  .winner-label {
    font-size: 10px;

    letter-spacing: 3px;
  }

  .crown {
    font-size: 20px;
  }

  .winner-name {
    font-size:
      max(
        10px,
        calc(20px * var(--name-scale, 1))
      );
  }

  .place-label {
    font-size: 20px;
  }

  .podium-name {
    font-size:
      max(
        9px,
        calc(15px * var(--name-scale, 1))
      );
  }
}

@media (max-width: 420px) and (max-height: 720px) {
  .game-over-phase {
    padding:
      8px
      6px
      calc(64px + env(safe-area-inset-bottom));
  }

  .scoreboard-layout {
    gap: 12px;
  }

  .podium-side,
  .leaderboard-side {
    max-width: 100%;
  }

  .podium-side {
    gap: 8px;
  }

  .winner-card {
    height: 104px;
  }

  .podium-card {
    height: 62px;
  }

  .winner-label {
    font-size: 10px;

    letter-spacing: 3px;
  }

  .crown {
    font-size: 20px;
  }

  .winner-name {
    font-size:
      max(
        10px,
        calc(20px * var(--name-scale, 1))
      );
  }

  .place-label {
    font-size: 20px;
  }

  .podium-name {
    font-size:
      max(
        9px,
        calc(15px * var(--name-scale, 1))
      );
  }

  .leaderboard-title {
    font-size: 14px;

    margin-bottom: 4px;
  }

  .leaderboard-player {
    padding: 8px 10px;

    font-size: 13px;
  }
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
