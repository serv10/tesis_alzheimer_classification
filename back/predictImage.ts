// Classification mapping - order matches model prediction AND database
// Model: mild=0, moderate=1, non=2, verymild=3
// DB:    mild=1, moderate=2, non=3, verymild=4
export const classificationImages: { [key: string]: string } = {
  mild: "Mild Demented",
  moderate: "Moderate Demented",
  non: "Non Demented",
  verymild: "Very Mild Demented",
};

const classificationKeys = Object.keys(classificationImages);

// Get classification key by model prediction index (0-3)
export const getClassificationKeyByIndex = (index: number): string => {
  return classificationKeys[index];
};

// Get index (0-3) from classification key
// Used for real value: index + 1 = DB ID
export const getClassificationKeyPosition = (value: string): number => {
  return classificationKeys.indexOf(value);
};
