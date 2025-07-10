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
    if (state.selectedCard) return; // Prevent multiple selections
    const clicked = state.swiper.clickedSlide;
    if (!clicked) return;

    clicked.classList.add('ring-4', 'ring-green-500', 'scale-110', 'z-10');
    state.swiper.slides.forEach(slide => {
        if (slide !== clicked) {
            slide.classList.add('opacity-30', 'pointer-events-none');
        }
    });
    state.swiper.allowSlideNext = false;
    state.swiper.allowSlidePrev = false;

    state.selectedCard = state.playerDeck[state.swiper.clickedIndex];
    const opponentIdx = Math.floor(Math.random() * state.opponentDeck.length);
    state.opponentCard = state.opponentDeck.splice(opponentIdx, 1)[0];

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
        // Tie → stack another planet if available
        const nextPlanet = state.planetDeck[state.activePlanets.length];
        if (nextPlanet) {
            state.activePlanets.push(nextPlanet);
        }
    }

    renderBattleResults(
        playerPower,
        opponentPower,
        state.selectedCard.name,
        state.opponentCard.name
    );

    document.getElementById('next-turn').disabled = false;
}

function claimPlanets(winner) {
    const totalPoints = state.activePlanets.reduce((sum, planet) => sum + planet.value, 0);
    if (winner === 'player') {
        state.playerPlanets.push(...state.activePlanets);
        state.playerScore += totalPoints;
    } else if (winner === 'opponent') {
        state.opponentPlanets.push(...state.activePlanets);
        state.opponentScore += totalPoints;
    }

    state.activePlanets = []; // Clear the stack
    renderActivePlanets();
    updateScoreboard();
    updatePlanetScoreboard();
}

export function nextTurn() {
    // Remove played card
    state.playerDeck = state.playerDeck.filter(card => card.id !== state.selectedCard.id);

    // Reset selection
    state.selectedCard = null;
    state.opponentCard = null;
    document.getElementById('next-turn').disabled = true;

    // Check if game should end
    if (state.playerDeck.length === 0 || state.opponentDeck.length === 0) {
        // Discard unresolved planets (if tie stack exists)
        state.activePlanets = [];
        return endGame();
    }

    // Add next planet if no active tie stack
    if (state.activePlanets.length === 0) {
        const nextPlanetIndex = originalPlanetDeck.length - state.playerDeck.length;
        const nextPlanet = state.planetDeck[nextPlanetIndex];
        if (nextPlanet) {
            state.activePlanets.push(nextPlanet);
        }
    }

    // Re-render everything
    renderPlayerDeck();
    initSwiper(handleCardSelection);
    renderActivePlanets();
}

function endGame() {
    // Tally points
    const playerPoints = state.playerPlanets.reduce((sum, planet) => sum + planet.value, 0);
    const opponentPoints = state.opponentPlanets.reduce((sum, planet) => sum + planet.value, 0);

    let winner = 'draw';
    if (playerPoints > opponentPoints) {
        winner = 'player';
        fireConfetti();
    } else if (opponentPoints > playerPoints) {
        winner = 'opponent';
    }

    renderEndgameScreen(winner, playerPoints, opponentPoints);
}

export function restartGame() {
    startGame();
}
