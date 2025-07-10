import { startGame, nextTurn } from './game.js';

startGame();
document.getElementById('next-turn').addEventListener('click', nextTurn);
