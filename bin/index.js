#!/usr/bin/env node
import { startGame } from '../src/gamelogic.js';

// Using async function with try-catch
async function main() {
    try {
        await startGame();
    } catch (error) {
        //  handling error based on error type
        if (error.message === 'User force closed the prompt') {
            console.log(' Game closed by user');
        } else {
            console.error('Game Error:', error.message);
        }
        process.exit(error.message === 'User force closed the prompt' ? 0 : 1);
    }
}

main();