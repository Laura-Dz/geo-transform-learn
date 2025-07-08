
export interface TransformationValue {
  x: number | boolean;
  y: number | boolean;
  z: number | boolean;
}

export interface Problem {
  baseFunction: string;
  instruction: string;
  expectedAnswer: string;
  transformationType: string;
  transformationValue: TransformationValue;
}

export interface UserTransformations {
  translation: { x: number; y: number; z: number };
  scaling: { x: number; y: number; z: number };
  reflection: { x: boolean; y: boolean; z: boolean };
}
