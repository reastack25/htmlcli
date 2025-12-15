import { select, confirm } from '@inquirer/prompts';
import chalk from 'chalk';
import { gameState, htmlQuestions, getRandomQuestions, resetGame } from './state.js';

let timer = null;

// Asynchronous timer function
const startTimer = (seconds) => {
    return new Promise((resolve) => {
        gameState.timeRemaining = seconds;
        
        timer = setInterval(() => {
            gameState.timeRemaining--;
            
            if (gameState.timeRemaining <= 0) {
                clearInterval(timer);
                resolve(false);
            }
        }, 1000);
    });
};

// Stop timer function
const stopTimer = () => {
    if (timer) {
        clearInterval(timer);
        timer = null;
    }
};

// Display question function - WHITE
const displayQuestion = (question, index, total) => {
    console.log(chalk.white(`\n Question ${index + 1} of ${total}`));
    console.log(chalk.white(`\n${question.text}\n`));
};

// Get user answer function
const getUserAnswer = async (question) => {
    const choices = question.options.map((option, index) => ({
        name: `${String.fromCharCode(65 + index)}) ${option}`,
        value: index
    }));

    return await select({
        message: 'Select your answer:',
        choices
    });
};

// Process single question
const processQuestion = async (question, index, total) => {
    displayQuestion(question, index, total);
    
    const startTime = Date.now();
    const timeLimit = 15;
    
    const timerPromise = startTimer(timeLimit);
    
    const answerPromise = getUserAnswer(question)
        .then((answer) => ({
            answered: true,
            answer,
            timeTaken: Math.floor((Date.now() - startTime) / 1000)
        }))
        .catch(() => ({
            answered: false,
            timeTaken: timeLimit
        }));
    
    const result = await Promise.race([timerPromise, answerPromise]);
    stopTimer();
    
    // GREEN for correct, RED for incorrect
    if (result.answered) {
        const isCorrect = result.answer === question.answer;
        
        if (isCorrect) {
            console.log(chalk.green('\n Correct!'));
            gameState.correct++;
            gameState.score += 10;
        } else {
            console.log(chalk.red('\n Incorrect!'));
            console.log(chalk.white(`The correct answer was: ${question.options[question.answer]}`));
            gameState.incorrect++;
        }
      
        console.log(chalk.white(` Time taken: ${result.timeTaken} seconds`));
    } else {
        console.log(chalk.red("\nTime's up!"));
        console.log(chalk.white(`The correct answer was: ${question.options[question.answer]}`));
        gameState.incorrect++;
    }
    
    return result;
};

// Main game function
export const startGame = async () => {
    try {
        // Game header in white
        console.log(chalk.white('='.repeat(40)));
        console.log(chalk.white(' HTML TRIVIA GAME '));
        console.log(chalk.white('='.repeat(40)));
        
        resetGame();
        
        // Select number of questions
        const questionCount = await select({
            message: 'This trivia contain 8 Questions',
            choices: [                       
                { name: `${htmlQuestions.length} questions (All)`, value: htmlQuestions.length }
            ]
        });
        
        // Get random questions
        gameState.questions = getRandomQuestions(questionCount);
        gameState.totalQuestions = gameState.questions.length;
        gameState.isActive = true;
        
        console.log(chalk.white(`\n Game starting with ${gameState.questions.length} questions...\n`));
        
        // Loop through questions
        for (let i = 0; i < gameState.questions.length; i++) {
            gameState.currentQuestion = i + 1;
            await processQuestion(gameState.questions[i], i, gameState.questions.length);
            
            // Ask to continue if not last question
            if (i < gameState.questions.length - 1) {
                const continueGame = await confirm({
                    message: 'Continue to next question?',
                    default: true
                });
                
                if (!continueGame) {
                    console.log(chalk.white('\nGame ended.'));
                    break;
                }
            }
        }
        
        // End game and show results
        endGame();
        
        // Ask to play again
        const playAgain = await confirm({
            message: '\nWould you like to play again?',
            default: false
        });
        
        if (playAgain) {
            console.clear();
            await startGame();
        } else {
            console.log(chalk.white('\nThanks for playing! \n'));
        }
        
    } catch (error) {
        if (error.message !== 'User force closed the prompt') {
            console.log(chalk.red('\nGame ended unexpectedly.'));
        }
        stopTimer();
    }
};

// End game function
const endGame = () => {
    gameState.isActive = false;
    
    const accuracy = gameState.totalQuestions ? 
        Math.round((gameState.correct / gameState.totalQuestions) * 100) : 0;
    
    console.log(chalk.white('\n' + '='.repeat(40)));
    console.log(chalk.white('GAME RESULTS'));
    console.log(chalk.white('='.repeat(40)));
    
    console.log(chalk.white(`\nTotal Questions: ${gameState.totalQuestions}`));
    console.log(chalk.green(` Correct Answers: ${gameState.correct}`));
    console.log(chalk.red(` Incorrect Answers: ${gameState.incorrect}`));
    console.log(chalk.white(`\n Final Score: ${gameState.score}`));
    console.log(chalk.white(`Accuracy: ${accuracy}%`));
    
    // Performance rating
    if (accuracy === 100) {        
    } else {
        console.log(chalk.red('\n Keep practicing!'));
    }
};