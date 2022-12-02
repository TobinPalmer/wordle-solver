"use strict";
const includedLetters = new Map();
const correctLetters = new Map();
const grayLetters = new Set([]);
let GotWord = false;
const GuessConstraints = [
    {
        correct: "a",
        not: new Set([]),
    },
    {
        correct: "",
        not: new Set([]),
    },
    {
        correct: "",
        not: new Set([]),
    },
    {
        correct: "",
        not: new Set([]),
    },
    {
        correct: "",
        not: new Set([]),
    },
];
const guessLetters = ["e"];
const alphabet = new Set([
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "x",
    "y",
    "z",
]);
const Keys = Array.from(alphabet).map((letter) => {
    return `[data-key="${letter}"]`;
});
const findKey = (key) => {
    return Keys.find((k) => k === `[data-key="${key}"]`);
};
const pressKey = (key) => {
    key = key.toLowerCase();
    const keyElement = findKey(key);
    if (!keyElement)
        return;
    document.querySelector(keyElement).click();
    console.log("pressed key", keyElement);
};
const pressEnter = () => {
    document.querySelector('[data-key="↵"]').click();
};
const getWords = async () => {
    return await fetch("https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/ca9018b32e963292473841fb55fd5a62176769b5/valid-wordle-words.txt");
};
const validWords = [];
getWords().then((res) => res.text().then((words) => words.split("\n").forEach((word) => validWords.push(word))));
const checkNewWord = () => {
    getWords().then((res) => {
        res.text().then((words) => {
            const wordList = words.split("\n");
            words[Math.floor(Math.random()) * words.length];
        });
    });
};
const removeWord = (index) => validWords.splice(index, 1);
const filterGuesses = () => {
    validWords.forEach((word, index) => {
        for (const constraint of GuessConstraints) {
            console.log("filtering word");
            if (constraint.correct && word[index] !== constraint.correct) {
                removeWord(index);
                console.log("removed word because not t: ", word);
                break;
            }
            if (constraint.not && constraint.not.has(word[index])) {
                removeWord(index);
                console.log("removed word because grey letters: ", word);
                break;
            }
        }
    });
};
(() => {
    const startingWord = "SALET";
    console.log("init");
    startingWord.split("").forEach((letter) => {
        console.log(letter);
        pressKey(letter);
    });
    pressEnter();
    setTimeout(() => {
        if (!GotWord) {
            filterGuesses();
            console.log(validWords);
        }
    }, 500);
})();
