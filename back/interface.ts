export interface ResultType {
  result: number;
  message: String;
  errorMessage: string;
  errorSeverity: number;
  errorState: number;
  prediction?: string;
}

export interface AlzheimerPrediction {
  result: number;
}
