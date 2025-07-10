import { state, resetState, originalPlanetDeck } from './state.js';
import {
    renderPlayerDeck,
    initSwiper,
    renderActivePlanets,
    renderBattleResults,
    updateScoreboard,
    updatePlanetScoreboard
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

    state.selectedCard = state.playerDeck[state.swiper.clickedIndex];
    state.opponentCard = state.opponentDeck[Math.floor(Math.random() * state.opponentDeck.length)];

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
    renderBattleResults(playerPower, opponentPower);
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
    state.playerDeck = state.playerDeck.filter(card => card.id !== state.selectedCard.id);

    if (state.playerDeck.length === 0) {
        console.log('Game over!');
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
