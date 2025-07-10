import { state } from './state.js';
import { restartGame } from './game.js';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';

// 🔊 Lightweight sound functions
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playBeep(frequency, duration = 150, type = 'sine') {
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    oscillator.connect(gain);
    gain.connect(audioCtx.destination);
    oscillator.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration / 1000);
    oscillator.stop(audioCtx.currentTime + duration / 1000);
}

function soundSelect() {
    playBeep(600, 100, 'square'); // clicky sound
}

function soundWin() {
    playBeep(880, 200, 'triangle');
    setTimeout(() => playBeep(1046, 200, 'triangle'), 200);
}

function soundLose() {
    playBeep(300, 400, 'sawtooth');
}

function soundTie() {
    playBeep(500, 100, 'square');
    setTimeout(() => playBeep(500, 100, 'square'), 150);
}

function soundEndWin() {
    playBeep(880, 200, 'triangle');
    setTimeout(() => playBeep(1046, 300, 'triangle'), 250);
    setTimeout(() => playBeep(1318, 400, 'triangle'), 600);
}

function soundEndLose() {
    playBeep(200, 600, 'sawtooth');
}

// 🛠 Card rendering
export function renderPlayerDeck() {
    const wrapper = document.querySelector('.swiper-wrapper');
    wrapper.innerHTML = '';
    state.playerDeck.forEach(card => {
        const slide = document.createElement('div');
        slide.className = `
            swiper-slide bg-gradient-to-br from-gray-800 to-gray-900
            border-2 border-gray-700 rounded-xl text-center
            transform transition-transform duration-300 hover:scale-105 hover:border-blue-500
            shadow-md hover:shadow-blue-500/50
        `;
        slide.innerHTML = `
            <div class="text-lg font-bold text-white">${card.name}</div>
            <div class="text-sm text-gray-300">Power: ${card.power}</div>
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
    state.swiper.on('click', () => {
        soundSelect(); // 🔊 Play select sound
        onCardSelected();
    });
}

export function renderActivePlanets() {
    const playZone = document.getElementById('play-zone');
    const totalPlanets = state.activePlanets.length;

    playZone.innerHTML = state.activePlanets.map((planet, index) => {
        const offsetX = index * 20; // Horizontal fan
        const rotate = (index - totalPlanets / 2) * 5; // Spread rotation
        const scale = 1 - index * 0.05; // Slight shrink for depth
        const zIndex = 100 - index;

        return `
        <div class="bg-gradient-to-br from-purple-700 to-purple-900 p-4 rounded-xl
                   shadow-lg transition-transform duration-300
                   hover:scale-105 hover:shadow-purple-500/50"
             style="transform: translateX(${offsetX}px) rotate(${rotate}deg) scale(${scale});
                    z-index: ${zIndex}">
            <div class="text-xl font-bold text-white">${planet.name}</div>
            <div class="text-md italic text-gray-200">${planet.type}</div>
            <div class="text-lg font-bold text-yellow-300">Value: ${planet.value}</div>
        </div>
        `;
    }).join('');
}

export function renderBattleResults(playerPower, opponentPower, playerShipName, opponentShipName) {
    const playZone = document.getElementById('play-zone');
    let resultText = '';

    if (playerPower > opponentPower) {
        resultText = '<span class="text-green-400 font-bold">You claim the planet(s)!</span>';
        soundWin(); // 🔊
    } else if (opponentPower > playerPower) {
        resultText = '<span class="text-red-400 font-bold">Opponent claims the planet(s)!</span>';
        soundLose(); // 🔊
    } else {
        resultText = '<span class="text-yellow-300 font-bold">It’s a tie! New planet added.</span>';
        soundTie(); // 🔊
    }

    playZone.innerHTML = `
        <div class="flex gap-4 justify-center items-center">
            <!-- Player Card -->
            <div class="bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 rounded-xl
                        shadow-lg animate-scale-in hover:scale-105 hover:shadow-blue-500/50">
                <div class="text-xl font-bold">${playerShipName}</div>
                <div class="text-md text-gray-400">Power: ${playerPower}</div>
            </div>
            <!-- Planets -->
            ${state.activePlanets.map((planet, index) => {
        const offsetX = index * 15;
        const rotate = (index - state.activePlanets.length / 2) * 5;
        const scale = 1 - index * 0.05;
        const zIndex = 100 - index;
        return `
                <div class="bg-gradient-to-br from-purple-700 to-purple-900 text-white p-6 rounded-xl
                            shadow-lg animate-scale-in hover:scale-105 hover:shadow-purple-500/50"
                     style="transform: translateX(${offsetX}px) rotate(${rotate}deg) scale(${scale});
                            z-index: ${zIndex}">
                    <div class="text-xl font-bold">${planet.name}</div>
                    <div class="text-md italic text-gray-200">${planet.type}</div>
                    <div class="text-lg font-bold text-yellow-300">Value: ${planet.value}</div>
                </div>
                `;
    }).join('')}
            <!-- Opponent Card -->
            <div class="bg-gradient-to-br from-red-700 to-red-900 text-white p-6 rounded-xl
                        shadow-lg animate-scale-in hover:scale-105 hover:shadow-red-500/50">
                <div class="text-xl font-bold">${opponentShipName}</div>
                <div class="text-md text-gray-200">Power: ${opponentPower}</div>
            </div>
        </div>
        <div class="mt-4 text-center text-xl font-bold">${resultText}</div>
    `;
}

export function renderEndgameScreen(winner, playerPoints, opponentPoints) {
    const playZone = document.getElementById('play-zone');
    let resultText = '';

    if (winner === 'player') {
        resultText = `<span class="text-green-400 font-bold text-2xl animate-pulse">🎉 You Win! (${playerPoints} - ${opponentPoints})</span>`;
        soundEndWin(); // 🔊
    } else if (winner === 'opponent') {
        resultText = `<span class="text-red-400 font-bold text-2xl animate-pulse">💀 Opponent Wins! (${opponentPoints} - ${playerPoints})</span>`;
        soundEndLose(); // 🔊
    } else {
        resultText = `<span class="text-yellow-300 font-bold text-2xl animate-pulse">🤝 It’s a Draw! (${playerPoints} - ${opponentPoints})</span>`;
    }

    playZone.innerHTML = `
        <div class="text-center mt-4 animate-fade-in-scale">
            ${resultText}
        </div>
        <button id="restart-game" class="mt-6 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900
                                        text-white font-bold py-2 px-4 rounded animate-bounce-up transition-all duration-300">
            🔄 Restart Game
        </button>
    `;

    document.getElementById('restart-game').addEventListener('click', restartGame);
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

export function fireConfetti() {
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiPieces = [];
    const colors = ['#22c55e', '#facc15', '#f43f5e', '#3b82f6'];

    for (let i = 0; i < 150; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            width: Math.random() * 8 + 2,
            height: Math.random() * 8 + 2,
            color: colors[Math.floor(Math.random() * colors.length)],
            velocity: Math.random() * 3 + 2,
            rotation: Math.random() * 360,
            opacity: 1
        });
    }

    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiPieces.forEach(piece => {
            ctx.save();
            ctx.translate(piece.x, piece.y);
            ctx.rotate(piece.rotation * Math.PI / 180);
            ctx.globalAlpha = piece.opacity;
            ctx.fillStyle = piece.color;
            ctx.fillRect(-piece.width / 2, -piece.height / 2, piece.width, piece.height);
            ctx.restore();

            // Update position
            piece.y += piece.velocity;
            piece.rotation += 5;
            piece.opacity -= 0.005;

            if (piece.opacity <= 0) {
                piece.y = -10;
                piece.x = Math.random() * canvas.width;
                piece.opacity = 1;
            }
        });
        requestAnimationFrame(drawConfetti);
    }

    drawConfetti();

    setTimeout(() => {
        document.body.removeChild(canvas);
    }, 3000);
}