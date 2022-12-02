const includedLetters = new Map<string, number>();
const correctLetters = new Map<string, number>();
const grayLetters = new Set<string>([]);
let GotWord = false;

/*
 */
const GuessConstraints: {
  correct: string;
  not: Set<string>;
}[] = [
  {
    correct: "a",
    not: new Set<string>([]),
  },
  {
    correct: "",
    not: new Set<string>([]),
  },
  {
    correct: "",
    not: new Set<string>([]),
  },
  {
    correct: "",
    not: new Set<string>([]),
  },
  {
    correct: "",
    not: new Set<string>([]),
  },
];

const guessLetters = ["e"];
/*
we have a word after the first word which we've preprogramed in. ok.
bascially lets say that the word has 1 yellow and 1 green.
what we do it; loop through all the words, than check if the word has a char that is yellow and most importantly check
if the char is in the correct posttion of the green char.
 */

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

const findKey = (key: string) => {
  return Keys.find((k) => k === `[data-key="${key}"]`);
};

const pressKey = (key: string) => {
  key = key.toLowerCase();
  const keyElement = findKey(key);
  if (!keyElement) return;
  (document.querySelector(keyElement) as HTMLElement).click();
  console.log("pressed key", keyElement);
};

// const checkIfPresent = () =>
//   (document.querySelectorAll(".Tile-module_tile__3ayIZ") as NodeListOf<HTMLElement>).forEach(
//     (tile) => {
//       if (tile.dataset.state === "present") {
//         presentLetters.add(tile.textContent ?? "");
//         console.log(presentLetters);
//       }
//     }
//   );

// const checkIfCorrect = () => {
//   (document.querySelectorAll(".Tile-module_tile__3ayIZ") as NodeListOf<HTMLElement>).forEach(
//     (tile) => {
//       if (tile.dataset.state === "correct") {
//         correctLetters.set(tile.textContent ?? "", 0);
//         console.log(correctLetters);
//       }
//     }
//   );
// };

const pressEnter = () => {
  (document.querySelector('[data-key="↵"]') as HTMLElement).click();
  // checkIfPresent();
  // checkIfCorrect();
};

const getWords = async () => {
  return await fetch(
    "https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/ca9018b32e963292473841fb55fd5a62176769b5/valid-wordle-words.txt"
  );
};

const validWords: string[] = [];

getWords().then((res) =>
  res.text().then((words) => words.split("\n").forEach((word) => validWords.push(word)))
);

const checkNewWord = () => {
  getWords().then((res) => {
    res.text().then((words) => {
      const wordList = words.split("\n");

      words[Math.floor(Math.random()) * words.length];
    });
  });
};

const removeWord = (index: number) => validWords.splice(index, 1);

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
