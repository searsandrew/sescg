import { startGame, nextTurn, handleCardSelection } from './game.js';
import { initSwiper } from './ui.js';

startGame();
document.getElementById('next-turn').addEventListener('click', nextTurn);
