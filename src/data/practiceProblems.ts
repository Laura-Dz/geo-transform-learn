
import { Problem } from '@/types/practice';

export const practiceProblems: Problem[] = [
  {
    baseFunction: 'x^2 + y^2',
    instruction: 'Apply a vertical translation of +2 units',
    expectedAnswer: 'x^2 + y^2 + 2',
    transformationType: 'translation',
    transformationValue: { x: 0, y: 0, z: 2 }
  },
  {
    baseFunction: 'sin(x) * cos(y)',
    instruction: 'Reflect over the x-axis',
    expectedAnswer: '-sin(x) * cos(y)',
    transformationType: 'reflection',
    transformationValue: { x: false, y: true, z: false }
  },
  {
    baseFunction: 'x^2',
    instruction: 'Scale vertically by factor of 2',
    expectedAnswer: '2x^2',
    transformationType: 'scaling',
    transformationValue: { x: 1, y: 2, z: 1 }
  }
];
