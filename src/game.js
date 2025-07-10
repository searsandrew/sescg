import { state, resetState, originalPlanetDeck } from './state.js';
import {
    renderPlayerDeck,
    initSwiper,
    renderActivePlanets,
    renderBattleResults,
    renderEndgameScreen,
    updateScoreboard,
    updatePlanetScoreboard,
    fireConfetti
} from './ui.js';

export function startGame() {
    resetState();
    renderPlayerDeck();
    initSwiper(handleCardSelection);
    renderActivePlanets();
    updateScoreboard();
    updatePlanetScoreboard();
}

export function handleCardSelection() {
    if (state.selectedCard) return; // Prevent double select

    const clickedSlide = state.swiper.clickedSlide;
    if (!clickedSlide) return;

    // Highlight selected card
    clickedSlide.classList.add('ring-4', 'ring-green-500', 'scale-110', 'z-10');
    // Dim other cards
    state.swiper.slides.forEach(slide => {
        if (slide !== clickedSlide) {
            slide.classList.add('opacity-30', 'pointer-events-none');
        }
    });

    // Lock Swiper
    state.swiper.allowSlideNext = false;
    state.swiper.allowSlidePrev = false;

    state.selectedCard = state.playerDeck[state.swiper.clickedIndex];

    // Randomly pick opponent card and remove it from deck
    const opponentIndex = Math.floor(Math.random() * state.opponentDeck.length);
    state.opponentCard = state.opponentDeck[opponentIndex];
    state.opponentDeck.splice(opponentIndex, 1); // 🆕 Remove played card

    resolveBattle();
}

function resolveBattle() {
    const playerPower = state.selectedCard.power;
    const opponentPower = state.opponentCard.power;

    if (playerPower > opponentPower) {
        claimPlanets('player');
    } else if (opponentPower > playerPower) {
        claimPlanets('opponent');
    } else {
        // Tie: Add next planet
        const nextPlanet = state.planetDeck[state.activePlanets.length];
        if (nextPlanet) {
            state.activePlanets.push(nextPlanet);
        }
    }

    // Render battle results
    renderBattleResults(playerPower, opponentPower, state.selectedCard.name, state.opponentCard.name);
    document.getElementById('next-turn').disabled = false;
}

function claimPlanets(winner) {
    if (winner === 'player') {
        state.playerPlanets.push(...state.activePlanets);
        state.playerScore += state.activePlanets.reduce((sum, p) => sum + p.value, 0);
    } else {
        state.opponentPlanets.push(...state.activePlanets);
        state.opponentScore += state.activePlanets.reduce((sum, p) => sum + p.value, 0);
    }

    state.activePlanets = []; // Clear planet stack
    renderActivePlanets();
    updateScoreboard();
    updatePlanetScoreboard();
}

export function nextTurn() {
    // Remove played player card
    state.playerDeck = state.playerDeck.filter(card => card.id !== state.selectedCard.id);

    if (state.playerDeck.length === 0 || state.opponentDeck.length === 0) {
        endGame();
        return;
    }

    state.selectedCard = null;
    state.opponentCard = null;
    document.getElementById('next-turn').disabled = true;

    // Add next planet if no tie stack
    if (state.activePlanets.length === 0) {
        const nextPlanet = state.planetDeck[originalPlanetDeck.length - state.playerDeck.length];
        if (nextPlanet) {
            state.activePlanets.push(nextPlanet);
        }
    }

    renderPlayerDeck();
    initSwiper(handleCardSelection);
    renderActivePlanets();
}

function endGame() {
    // Discard any unclaimed planets
    state.activePlanets = [];
    renderActivePlanets();

    const playerPoints = state.playerPlanets.reduce((sum, p) => sum + p.value, 0);
    const opponentPoints = state.opponentPlanets.reduce((sum, p) => sum + p.value, 0);

    let winner = 'draw';
    if (playerPoints > opponentPoints) {
        winner = 'player';
    } else if (opponentPoints > playerPoints) {
        winner = 'opponent';
    }

    if (winner === 'player') {
        fireConfetti(); // 🎉 Trigger confetti if player wins
    }

    renderEndgameScreen(winner, playerPoints, opponentPoints);
}

export function restartGame() {
    startGame();
}
