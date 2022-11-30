const alphabet = new Set([
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
  'm',
  'n',
  'o',
  'p',
  'q',
  'r',
  's',
  't',
  'u',
  'v',
  'x',
  'y',
  'z',
]);

const Keys = Array.from(alphabet).map(letter => {
  return `[data-key="${letter}"]`;
});

const findKey = (key: string) => {
  return Keys.find(k => k === `[data-key="${key}"]`);
};

const pressKey = (key: string) => {
  const keyElement = findKey(key);
  if (!keyElement) return;
  (document.querySelector(keyElement) as HTMLElement).click();
};

pressKey('a');
