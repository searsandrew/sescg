import { startGame, nextTurn } from './game.js';
import './style.css';

startGame();
document.getElementById('next-turn').addEventListener('click', nextTurn);
