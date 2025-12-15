// Array of HTML questions
export const htmlQuestions = [
    {
        id: 1,
        text: 'What does HTML stand for?',
        options: [
            'Hyper Text Markup Language',
            'High Tech Modern Language',
            'Hyper Transfer Markup Language',
            'Home Tool Markup Language'
        ],
        answer: 0
    },
    {
        id: 2,
        text: 'Which HTML element is used for the largest heading?',
        options: ['<h6>', '<head>', '<h1>', '<header>'],
        answer: 2
    },
    {
        id: 3,
        text: 'What is the correct HTML element for inserting a line break?',
        options: ['<break>', '<lb>', '<br>', '<newline>'],
        answer: 2
    },
    {
        id: 4,
        text: 'Which HTML attribute specifies an alternate text for an image?',
        options: ['title', 'src', 'alt', 'href'],
        answer: 2
    },
    {
        id: 5,
        text: 'In HTML, which attribute is used to specify that an input field must be filled out?',
        options: ['placeholder', 'validate', 'required', 'necessary'],
        answer: 2
    },
    {
        id: 6,
        text: 'Which HTML element is used to define important text?',
        options: ['<strong>', '<b>', '<i>', '<important>'],
        answer: 0
    },
    {
        id: 7,
        text: 'Which HTML element is used to define a table row?',
        options: ['<td>', '<tr>', '<th>', '<table>'],
        answer: 1
    },
    {
        id: 8,
        text: 'What is the correct HTML for creating a hyperlink?',
        options: [
            '<a href="http://example.com">Example</a>',
            '<link>http://example.com</link>',
            '<a>http://example.com</a>',
            '<a url="http://example.com">Example</a>'
        ],
        answer: 0
    }
];

// Game state object
export const gameState = {
    currentQuestion: 0,
    totalQuestions: 0,
    score: 0,
    correct: 0,
    incorrect: 0,
    timeRemaining: 0,
    isActive: false,
    questions: []
};

// Array iteration methods
export const getRandomQuestions = (count) => {
    return [...htmlQuestions]
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.min(count, htmlQuestions.length));
};

// Reset game state
export const resetGame = () => {
    gameState.currentQuestion = 0;
    gameState.totalQuestions = 0;
    gameState.score = 0;
    gameState.correct = 0;
    gameState.incorrect = 0;
    gameState.timeRemaining = 0;
    gameState.isActive = false;
    gameState.questions = [];
};