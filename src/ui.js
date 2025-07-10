import { state } from './state.js';
import { restartGame } from './game.js';
import Swiper from 'swiper';
import 'swiper/swiper-bundle.css';

// Preload sounds
const sounds = {
    select: new Audio('/sounds/select.mp3'),
    win: new Audio('/sounds/win.mp3'),
    lose: new Audio('/sounds/lose.mp3'),
    tie: new Audio('/sounds/tie.mp3'),
    endWin: new Audio('/sounds/end_win.mp3'),
    endLose: new Audio('/sounds/end_lose.mp3')
};

export function renderPlayerDeck() {
    const wrapper = document.querySelector('.swiper-wrapper');
    wrapper.innerHTML = '';
    state.playerDeck.forEach(card => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide bg-white text-black p-4 rounded-xl text-center transition-transform duration-300';
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
    state.swiper.on('click', () => {
        sounds.select.play(); // 🔊 Play select sound
        onCardSelected();
    });
}

export function renderActivePlanets() {
    const playZone = document.getElementById('play-zone');
    playZone.innerHTML = state.activePlanets.map((planet, index) => `
        <div class="bg-purple-600 text-white p-4 rounded-xl shadow-lg transition-transform duration-300 hover:scale-110"
             style="transform: translateX(${index * 20}px) scale(${1 - index * 0.05}); z-index: ${100 - index}">
            <div class="text-xl font-bold">${planet.name}</div>
            <div class="text-md italic">${planet.type}</div>
            <div class="text-lg font-bold">Value: ${planet.value}</div>
        </div>
    `).join('');
}

export function renderBattleResults(playerPower, opponentPower, playerShipName, opponentShipName) {
    const playZone = document.getElementById('play-zone');
    let resultText = '';

    if (playerPower > opponentPower) {
        resultText = '<span class="text-green-400 font-bold">You claim the planet(s)!</span>';
        sounds.win.play(); // 🔊 Play win sound
    } else if (opponentPower > playerPower) {
        resultText = '<span class="text-red-400 font-bold">Opponent claims the planet(s)!</span>';
        sounds.lose.play(); // 🔊 Play lose sound
    } else {
        resultText = '<span class="text-yellow-300 font-bold">It’s a tie! New planet added.</span>';
        sounds.tie.play(); // 🔊 Play tie sound
    }

    playZone.innerHTML = `
        <div class="flex gap-4 justify-center items-center">
            <!-- Player Card -->
            <div class="bg-white text-black p-6 rounded-xl shadow-lg animate-scale-in">
                <div class="text-xl font-bold">${playerShipName}</div>
                <div class="text-md text-gray-700">Power: ${playerPower}</div>
            </div>
            <!-- Planets -->
            ${state.activePlanets.map((planet, index) => `
                <div class="bg-purple-600 text-white p-6 rounded-xl shadow-lg animate-scale-in"
                     style="transform: translateX(${index * 15}px) scale(${1 - index * 0.05}); z-index: ${100 - index}">
                    <div class="text-xl font-bold">${planet.name}</div>
                    <div class="text-md italic">${planet.type}</div>
                    <div class="text-lg font-bold">Value: ${planet.value}</div>
                </div>
            `).join('')}
            <!-- Opponent Card -->
            <div class="bg-red-500 text-white p-6 rounded-xl shadow-lg animate-scale-in">
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
        sounds.endWin.play(); // 🔊 Victory fanfare
    } else if (winner === 'opponent') {
        resultText = `<span class="text-red-400 font-bold text-2xl animate-pulse">💀 Opponent Wins! (${opponentPoints} - ${playerPoints})</span>`;
        sounds.endLose.play(); // 🔊 Defeat sound
    } else {
        resultText = `<span class="text-yellow-300 font-bold text-2xl animate-pulse">🤝 It’s a Draw! (${playerPoints} - ${opponentPoints})</span>`;
    }

    playZone.innerHTML = `
        <div class="text-center mt-4 animate-fade-in-scale">
            ${resultText}
        </div>
        <button id="restart-game" class="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded animate-bounce-up">
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

            // Respawn at top if it falls
            if (piece.opacity <= 0) {
                piece.y = -10;
                piece.x = Math.random() * canvas.width;
                piece.opacity = 1;
            }
        });
        requestAnimationFrame(drawConfetti);
    }

    drawConfetti();

    // Stop confetti after 3 seconds
    setTimeout(() => {
        document.body.removeChild(canvas);
    }, 3000);
}
