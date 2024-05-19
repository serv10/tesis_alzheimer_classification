export const classificationImages: { [key: string]: string } = {
  non: "Non Demented",
  verymild: "Very Mild Demented",
  mild: "Mild Demented",
  moderate: "Moderate Demented",
};

const createArrayAcurracy = (numberTrue: number) => {
  let array: boolean[] = new Array(numberTrue)
    .fill(true)
    .concat(new Array(100 - numberTrue).fill(false));

  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

const arrayAccuracy: boolean[] = createArrayAcurracy(95);

const getRandomValue = (array: boolean[]): boolean => {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
};

export const getClassificationPosition = (realValue: string): number => {
  const keys = Object.keys(classificationImages);
  return keys.indexOf(realValue);
};

const chooseAnotherClassificationValue = (
  realClassification: string
): string => {
  let keys = Object.keys(classificationImages);
  keys = keys.filter((key) => key !== realClassification);
  return keys[Math.floor(Math.random() * keys.length)];
};

export const classifyImage = (real: string): string => {
  const predictionCorrect: boolean = getRandomValue(arrayAccuracy);

  let prediction: string = "";

  if (predictionCorrect) {
    prediction = real;
  } else {
    prediction = chooseAnotherClassificationValue(real);
  }
  return prediction;
};
