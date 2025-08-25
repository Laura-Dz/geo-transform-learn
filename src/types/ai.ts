// AI Assistant Types and Mock Data

export interface AIMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: string;
  context?: {
    function?: string;
    concept?: string;
    userLevel?: string;
    currentFunction?: string;
    currentConcept?: string;
    userProgress?: any;
    suggestions?: string[];
    examples?: string[];
    relatedConcepts?: string[];
  };
}

export interface AIResponse {
  response: string;
  suggestions?: string[];
  examples?: string[];
  relatedConcepts?: string[];
  confidence: number;
}

export interface AIContext {
  currentFunction?: string;
  currentConcept?: string;
  userLevel: string;
  recentTopics: string[];
  strugglingAreas?: string[];
}

// Mock AI Responses Database
export const MOCK_AI_RESPONSES: Record<string, AIResponse> = {
  // Function-related questions
  "what is a quadratic function": {
    response: "A quadratic function is a polynomial function of degree 2, typically written as f(x) = ax² + bx + c, where a ≠ 0. In 3D visualization, you can see how it forms a parabolic curve that opens upward (a > 0) or downward (a < 0).",
    suggestions: ["Try graphing f(x) = x²", "Explore f(x) = -x² + 4", "Compare different values of 'a'"],
    examples: ["f(x) = x²", "f(x) = 2x² - 4x + 1", "f(x) = -0.5x² + 3x"],
    relatedConcepts: ["Parabolas", "Vertex Form", "Axis of Symmetry"],
    confidence: 0.95
  },
  
  "how do transformations work": {
    response: "Transformations modify the position, orientation, or size of geometric objects. The main types are: Translation (moving), Rotation (turning), and Scaling (resizing). In our 3D visualizer, you can apply these transformations to see how functions change in real-time.",
    suggestions: ["Try translating a function", "Experiment with rotation", "Scale a 3D surface"],
    examples: ["Translate f(x) = x² by (2, 3, 0)", "Rotate sin(x) around y-axis", "Scale x² + y² by factor 2"],
    relatedConcepts: ["Matrix Transformations", "Coordinate Systems", "Linear Algebra"],
    confidence: 0.92
  },

  "explain sine function": {
    response: "The sine function, sin(x), creates a smooth wave that oscillates between -1 and 1. It's periodic with period 2π. In 3D, you can visualize sin(x), sin(y), or combinations like sin(x)cos(y) to create beautiful wave patterns and surfaces.",
    suggestions: ["Graph sin(x) in 3D", "Try sin(x) + cos(y)", "Explore sin(x*y)"],
    examples: ["sin(x)", "sin(x) * cos(y)", "sin(sqrt(x² + y²))"],
    relatedConcepts: ["Trigonometry", "Periodic Functions", "Wave Equations"],
    confidence: 0.98
  },

  "what are parametric equations": {
    response: "Parametric equations express coordinates as functions of a parameter (usually t). Instead of y = f(x), you have x = f(t), y = g(t), z = h(t). This allows you to create complex 3D curves and surfaces that can't be expressed as simple functions.",
    suggestions: ["Try a parametric circle", "Create a helix", "Explore Lissajous curves"],
    examples: ["x = cos(t), y = sin(t), z = t", "x = t, y = t², z = t³", "x = sin(2t), y = cos(3t), z = t"],
    relatedConcepts: ["Vector Functions", "Curves in Space", "Motion in 3D"],
    confidence: 0.94
  },

  "help with calculus": {
    response: "Calculus deals with rates of change (derivatives) and accumulation (integrals). In 3D visualization, you can see how derivatives represent slopes of tangent lines and how integrals represent areas under curves or volumes under surfaces.",
    suggestions: ["Visualize derivative as slope", "See integral as area", "Explore partial derivatives"],
    examples: ["d/dx(x²) = 2x", "∫x²dx = x³/3 + C", "∂/∂x(x²y) = 2xy"],
    relatedConcepts: ["Limits", "Derivatives", "Integrals", "Multivariable Calculus"],
    confidence: 0.91
  },

  // Default responses for common patterns
  "default_function": {
    response: "I can help you understand mathematical functions and their 3D visualizations. Try asking about specific functions, transformations, or mathematical concepts you'd like to explore.",
    suggestions: ["Ask about a specific function", "Learn about transformations", "Explore 3D graphing"],
    examples: ["What is f(x) = x²?", "How do I rotate a function?", "Show me a 3D surface"],
    relatedConcepts: ["Functions", "3D Graphing", "Mathematical Visualization"],
    confidence: 0.8
  },

  "default_help": {
    response: "I'm your AI math tutor! I can help with functions, 3D visualization, transformations, calculus, and more. What would you like to learn about today?",
    suggestions: ["Ask about functions", "Learn transformations", "Get help with homework"],
    examples: ["Explain quadratic functions", "How do 3D graphs work?", "Help me understand derivatives"],
    relatedConcepts: ["Mathematics", "3D Visualization", "Learning"],
    confidence: 0.85
  }
};

// Mock AI conversation starters
export const AI_CONVERSATION_STARTERS = [
  "What mathematical concept would you like to explore today?",
  "I can help you visualize any function in 3D. What would you like to see?",
  "Having trouble with a particular topic? I'm here to help!",
  "Let's make math visual! What function should we graph together?",
  "Ready to transform some equations? Ask me anything!"
];

// Mock AI learning tips
export const AI_LEARNING_TIPS = [
  "Try visualizing functions in 3D to better understand their behavior",
  "Use transformations to see how functions change with different parameters",
  "Practice with interactive examples to reinforce your learning",
  "Connect mathematical concepts to real-world applications",
  "Don't hesitate to ask questions - that's how you learn best!"
];

// Function to get AI response based on user input
export function getAIResponse(userInput: string, context?: AIContext): AIResponse {
  const input = userInput.toLowerCase();
  
  // Pattern matching for different types of questions
  if (input.includes('quadratic') || input.includes('x²') || input.includes('parabola')) {
    return MOCK_AI_RESPONSES["what is a quadratic function"];
  }
  
  if (input.includes('transformation') || input.includes('translate') || input.includes('rotate') || input.includes('scale')) {
    return MOCK_AI_RESPONSES["how do transformations work"];
  }
  
  if (input.includes('sine') || input.includes('sin(') || input.includes('cosine') || input.includes('cos(')) {
    return MOCK_AI_RESPONSES["explain sine function"];
  }
  
  if (input.includes('parametric') || input.includes('parameter')) {
    return MOCK_AI_RESPONSES["what are parametric equations"];
  }
  
  if (input.includes('calculus') || input.includes('derivative') || input.includes('integral')) {
    return MOCK_AI_RESPONSES["help with calculus"];
  }
  
  if (input.includes('function') || input.includes('f(x)') || input.includes('equation')) {
    return MOCK_AI_RESPONSES["default_function"];
  }
  
  // Default response
  return MOCK_AI_RESPONSES["default_help"];
}

// Mock AI study recommendations
export function getStudyRecommendations(userLevel: string, recentTopics: string[]): string[] {
  const recommendations: Record<string, string[]> = {
    BEGINNER: [
      "Start with basic linear functions: f(x) = mx + b",
      "Explore simple quadratic functions: f(x) = x²",
      "Learn about function transformations",
      "Practice with the 3D visualizer tools"
    ],
    INTERMEDIATE: [
      "Study trigonometric functions in 3D",
      "Explore polynomial functions of higher degrees",
      "Learn about parametric equations",
      "Practice with complex transformations"
    ],
    ADVANCED: [
      "Explore multivariable functions: f(x,y)",
      "Study vector fields and their visualizations",
      "Learn about differential equations",
      "Create custom 3D mathematical models"
    ],
    EXPERT: [
      "Research advanced mathematical surfaces",
      "Explore fractals and complex functions",
      "Study topology and advanced geometry",
      "Contribute to the community knowledge base"
    ]
  };
  
  return recommendations[userLevel] || recommendations.BEGINNER;
}
