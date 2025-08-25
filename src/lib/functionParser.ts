import * as math from 'mathjs';

export interface FunctionInfo {
  variables: string[];
  expression: string;
  type: 'single' | 'bivariate' | 'trivariate' | 'parametric';
  evaluator: (vars: Record<string, number>) => number;
}

export class FunctionParser {
  private static readonly SUPPORTED_VARIABLES = ['x', 'y', 'z', 't', 'u', 'v'];
  
  static parse(expression: string): FunctionInfo {
    try {
      // Clean and normalize the expression
      const cleanExpression = this.normalizeExpression(expression);
      
      // Compile the expression using mathjs
      const compiled = math.compile(cleanExpression);
      
      // Detect variables in the expression
      const variables = this.detectVariables(cleanExpression);
      
      // Determine function type
      const type = this.determineFunctionType(variables);
      
      // Create evaluator function
      const evaluator = (vars: Record<string, number>): number => {
        try {
          const result = compiled.evaluate(vars);
          return typeof result === 'number' && isFinite(result) ? result : 0;
        } catch {
          return 0;
        }
      };
      
      return {
        variables,
        expression: cleanExpression,
        type,
        evaluator
      };
    } catch (error) {
      // Fallback for invalid expressions
      return {
        variables: ['x', 'y'],
        expression: '0',
        type: 'bivariate',
        evaluator: () => 0
      };
    }
  }
  
  private static normalizeExpression(expr: string): string {
    return expr
      .replace(/\s+/g, '') // Remove spaces
      .replace(/\^/g, '^') // Ensure proper power notation
      .replace(/(\d)([xyz])/g, '$1*$2') // Add multiplication: 2x -> 2*x
      .replace(/([xyz])(\d)/g, '$1*$2') // Add multiplication: x2 -> x*2
      .replace(/([xyz])([xyz])/g, '$1*$2') // Add multiplication: xy -> x*y
      .replace(/\)([xyz])/g, ')*$1') // Add multiplication: )x -> )*x
      .replace(/([xyz])\(/g, '$1*(') // Add multiplication: x( -> x*(
      .replace(/sin/g, 'sin')
      .replace(/cos/g, 'cos')
      .replace(/tan/g, 'tan')
      .replace(/log/g, 'log')
      .replace(/ln/g, 'log')
      .replace(/exp/g, 'exp')
      .replace(/sqrt/g, 'sqrt')
      .replace(/abs/g, 'abs');
  }
  
  private static detectVariables(expression: string): string[] {
    const variables: string[] = [];
    
    for (const variable of this.SUPPORTED_VARIABLES) {
      const regex = new RegExp(`\\b${variable}\\b`, 'g');
      if (regex.test(expression)) {
        variables.push(variable);
      }
    }
    
    // Default to x, y if no variables found
    return variables.length > 0 ? variables : ['x', 'y'];
  }
  
  private static determineFunctionType(variables: string[]): FunctionInfo['type'] {
    const varCount = variables.length;
    
    if (varCount === 1) return 'single';
    if (varCount === 2) return 'bivariate';
    if (varCount === 3) return 'trivariate';
    return 'parametric';
  }
  
  static getVisualizationMode(functionInfo: FunctionInfo): 'line' | 'surface' | 'volume' | 'parametric' {
    switch (functionInfo.type) {
      case 'single':
        return 'line';
      case 'bivariate':
        return 'surface';
      case 'trivariate':
        return 'volume';
      default:
        return 'parametric';
    }
  }
  
  static getSampleFunctions(): Record<string, string> {
    return {
      'Linear (1D)': 'x',
      'Quadratic (1D)': 'x^2',
      'Sine Wave (1D)': 'sin(x)',
      'Paraboloid (2D)': 'x^2 + y^2',
      'Saddle (2D)': 'x^2 - y^2',
      'Sine Wave (2D)': 'sin(x) * cos(y)',
      'Ripple (2D)': 'sin(sqrt(x^2 + y^2))',
      'Gaussian (2D)': 'exp(-(x^2 + y^2))',
      'Sphere (3D)': 'sqrt(1 - x^2 - y^2)',
      'Torus (3D)': '(sqrt(x^2 + y^2) - 2)^2 + z^2',
      'Wave Function (3D)': 'sin(x) * cos(y) * sin(z)'
    };
  }
}
