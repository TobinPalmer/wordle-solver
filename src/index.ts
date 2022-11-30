const presentLetters = new Set<string>();
const correctLetters = new Map<string, number>();

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

const checkIfPresent = () =>
  (document.querySelectorAll(".Tile-module_tile__3ayIZ") as NodeListOf<HTMLElement>).forEach(
    (tile) => {
      if (tile.dataset.state === "present") {
        presentLetters.add(tile.textContent ?? "");
        console.log(presentLetters);
      }
    }
  );

const checkIfCorrect = () => {
  (document.querySelectorAll(".Tile-module_tile__3ayIZ") as NodeListOf<HTMLElement>).forEach(
    (tile) => {
      if (tile.dataset.state === "correct") {
        correctLetters.set(tile.textContent ?? "", 0);
        console.log(correctLetters);
      }
    }
  );
};

const pressEnter = () => {
  (document.querySelector('[data-key="↵"]') as HTMLElement).click();
  checkIfPresent();
  checkIfCorrect();
};

const getWords = async () => {
  return await fetch(
    "https://gist.githubusercontent.com/dracos/dd0668f281e685bad51479e5acaadb93/raw/ca9018b32e963292473841fb55fd5a62176769b5/valid-wordle-words.txt"
  );
};

(() => {
  console.log("init");
  const startingWord = "SALET";
  startingWord.split("").forEach((letter) => {
    console.log(letter);
    pressKey(letter);
  });
  pressEnter();
})();

const checkNewWord = () => {
  getWords().then((res) => {
    res.text().then((words) => {
      const wordList = words.split("\n");

      wordList.forEach((word) => {
        if (presentLetters.size === 0 || correctLetters.size === 0) return;
      });
      words[Math.floor(Math.random()) * words.length];
    });
  });
};
