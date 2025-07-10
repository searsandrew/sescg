import { state } from './state.js';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';

export function renderPlayerDeck() {
    const wrapper = document.querySelector('.swiper-wrapper');
    wrapper.innerHTML = '';
    state.playerDeck.forEach(card => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide bg-white text-black p-4 rounded-xl text-center';
        slide.innerHTML = `
            <div class="text-lg font-bold">${card.name}</div>
            <div class="text-sm text-gray-700">Power: ${card.power}</div>
        `;
        wrapper.appendChild(slide);
    });
}

export function initSwiper(onCardSelected) {
    if (state.swiper) state.swiper.destroy(true, true);
    state.swiper = new Swiper('.mySwiper', {
        slidesPerView: 1.5,
        centeredSlides: true,
        grabCursor: true,
        spaceBetween: 16,
    });
    state.swiper.on('click', onCardSelected);
}

export function renderActivePlanets() {
    const playZone = document.getElementById('play-zone');
    playZone.innerHTML = state.activePlanets.map(planet => `
        <div class="bg-purple-600 text-white p-4 rounded-xl shadow-lg">
            <div class="text-xl font-bold">${planet.name}</div>
            <div class="text-md italic">${planet.type}</div>
            <div class="text-lg font-bold">Value: ${planet.value}</div>
        </div>
    `).join('');
}

export function renderBattleResults(playerPower, opponentPower) {
    const playZone = document.getElementById('play-zone');
    let resultText = '';

    if (playerPower > opponentPower) {
        resultText = '<span class="text-green-400 font-bold">You claim the planet(s)!</span>';
    } else if (opponentPower > playerPower) {
        resultText = '<span class="text-red-400 font-bold">Opponent claims the planet(s)!</span>';
    } else {
        resultText = '<span class="text-yellow-300 font-bold">It’s a tie! New planet added.</span>';
    }

    playZone.innerHTML = `
        <div class="flex gap-4 justify-center items-center">
            <!-- Player Card -->
            <div class="bg-white text-black p-6 rounded-xl shadow-lg">
                <div class="text-xl font-bold">Your Ship</div>
                <div class="text-md text-gray-700">Power: ${playerPower}</div>
            </div>
            <!-- Planets -->
            ${state.activePlanets.map(planet => `
                <div class="bg-purple-600 text-white p-6 rounded-xl shadow-lg">
                    <div class="text-xl font-bold">${planet.name}</div>
                    <div class="text-md italic">${planet.type}</div>
                    <div class="text-lg font-bold">Value: ${planet.value}</div>
                </div>
            `).join('')}
            <!-- Opponent Card -->
            <div class="bg-red-500 text-white p-6 rounded-xl shadow-lg">
                <div class="text-xl font-bold">Opponent’s Ship</div>
                <div class="text-md text-gray-200">Power: ${opponentPower}</div>
            </div>
        </div>
        <div class="mt-4 text-center text-xl font-bold">${resultText}</div>
    `;
}

export function updateScoreboard() {
    document.getElementById('player-score').innerText = state.playerScore;
    document.getElementById('opponent-score').innerText = state.opponentScore;
}

export function updatePlanetScoreboard() {
    const playerList = document.getElementById('player-planets');
    const opponentList = document.getElementById('opponent-planets');

    playerList.innerHTML = state.playerPlanets
        .map(p => `<li>${p.name} (${p.value})</li>`)
        .join('');
    opponentList.innerHTML = state.opponentPlanets
        .map(p => `<li>${p.name} (${p.value})</li>`)
        .join('');
}
