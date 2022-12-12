"use strict";
const IncludedLetters = new Set([]);
const NotLetters = new Set([]);
let GotWord = false;
let GuessCounter = 1;
const GuessConstraints = [
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
  {
    correct: "",
    not: new Set([]),
  },
];
const guessLetters = [];
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
  "w",
  "x",
  "y",
  "z",
]);
var WordResult;
(function (WordResult) {
  WordResult[(WordResult["Correct"] = 0)] = "Correct";
  WordResult[(WordResult["Present"] = 1)] = "Present";
  WordResult[(WordResult["Absent"] = 2)] = "Absent";
})(WordResult || (WordResult = {}));
const Keys = Array.from(alphabet).map((letter) => {
  return `[data-key="${letter}"]`;
});
const findKey = (key) => {
  return Keys.find((k) => k === `[data-key="${key}"]`) ?? "";
};
const pressKey = (key) => {
  key = key.toLowerCase();
  const keyElement = findKey(key);
  if (!keyElement) return;
  document.querySelector(keyElement).click();
};
const getLastWordUsed = () => {
  const tiles = [...document.querySelectorAll(".Tile-module_tile__3ayIZ")];
  let word = [];
  for (let i = 25; i >= 0; i -= 5) {
    if (tiles[i].dataset.state !== "empty") {
      word = tiles.slice(i, i + 5);
      break;
    }
  }
  const wordResult = [];
  word.forEach((tile) => {
    switch (tile.dataset.state) {
      case "correct":
        wordResult.push({ char: tile.textContent ?? "", state: WordResult.Correct });
        break;
      case "present":
        wordResult.push({ char: tile.textContent ?? "", state: WordResult.Present });
        break;
      case "absent":
        wordResult.push({ char: tile.textContent ?? "", state: WordResult.Absent });
        break;
      default:
        break;
    }
  });
  return wordResult;
};
const updateConstraints = () => {
  const lastWord = getLastWordUsed();
  lastWord.forEach(({ char, state }, index) => {
    switch (state) {
      case WordResult.Correct:
        GuessConstraints[index].correct = char;
        break;
      case WordResult.Present:
        GuessConstraints[index].not.add(char);
        IncludedLetters.add(char);
        break;
      case WordResult.Absent:
        NotLetters.add(char);
        break;
      default:
        break;
    }
  });
  GuessConstraints.forEach((constraint) => {
    if (constraint.correct !== "") {
      if (NotLetters.has(constraint.correct)) NotLetters.delete(constraint.correct);
    }
  });
  IncludedLetters.forEach((letter) => {
    if (NotLetters.has(letter)) NotLetters.delete(letter);
  });
  console.log(GuessConstraints.every((constraint) => constraint.correct !== ""));
  if (GuessConstraints.every((constraint) => constraint.correct !== "")) GotWord = true;
};
const pressEnter = () => {
  document.querySelector('[data-key="↵"]').click();
};
const getWords = async () => {
  return await fetch(
    "https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/ca9018b32e963292473841fb55fd5a62176769b5/valid-wordle-words.txt"
  );
};
let validWords = [];
getWords().then((res) =>
  res.text().then((words) => {
    const wordList = words.split("\n");
    validWords = wordList;
  })
);
const checkNewWord = () => {
  getWords().then((res) => {
    res.text().then((words) => {
      words[Math.floor(Math.random()) * words.length];
    });
  });
};
const removeWord = (word) => {
  const index = validWords.indexOf(word);
  if (index === -1) return;
  validWords.splice(index, 1);
};
const getNextGuess = (arr) => {
  const letters = new Map();
  for (const word of arr) {
    for (const letter of word) {
      letters.set(letter, (letters.get(letter) ?? 0) + 1);
    }
  }
  let mostCommonLetter = "";
  let mostCommonLetterCount = 0;
  for (const [letter, count] of letters) {
    if (count > mostCommonLetterCount) {
      mostCommonLetter = letter;
      mostCommonLetterCount = count;
    }
  }
  const mostCommonWords = arr.filter((word) => word.includes(mostCommonLetter));
  console.log("Most Common Words: ", mostCommonWords);
  return mostCommonWords[Math.floor(Math.random() * mostCommonWords.length)];
};
const filterGuesses = () => {
  words: for (let i = 0; i < validWords.length; i++) {
    const word = validWords[i];
    for (const letter of IncludedLetters) {
      if (!word.includes(letter)) {
        removeWord(word);
        i--;
        continue words;
      }
    }
    for (let j = 0; j < 5; j++) {
      if (
        NotLetters.has(word[j]) ||
        GuessConstraints[j].not.has(word[j]) ||
        (GuessConstraints[j].correct !== "" && GuessConstraints[j].correct !== word[j])
      ) {
        removeWord(word);
        i--;
        break;
      }
    }
  }
  console.log("Valid Words: ", validWords);
};
const guess = (presetWord) => {
  updateConstraints();
  filterGuesses();
  const word = presetWord ?? getNextGuess(validWords);
  word.split("").forEach((letter) => pressKey(letter));
  pressEnter();
  GuessCounter++;
};
(() => {
  const ans = prompt("Enter a word (defaults to serai)") ?? "serai";
  if (ans !== "" && ans.length === 5) guess(ans);
  else guess("serai");
  const bufferTime = 2000;
  const interval = setInterval(() => {
    if (GotWord) {
      GuessCounter = 0;
      clearInterval(interval);
      return;
    }
    console.log(GuessCounter, "guess counter");
    console.log(
      GuessConstraints.every((constraint) => constraint.correct !== ""),
      "got word"
    );
    if (
      GuessCounter >= 5 &&
      validWords.length <= 3 &&
      validWords.length > 1 &&
      !GuessConstraints.every((constraint) => constraint.correct !== "")
    ) {
      const ans = prompt("Down to few options, pick the best one!.", validWords.join(", ")) ?? "";
      if (ans !== "" && ans.length === 5) guess(ans);
      else guess(validWords[Math.floor(Math.random() * validWords.length)]);
    } else guess();
  }, bufferTime);
})();
