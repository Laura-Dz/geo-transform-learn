import { Request, Response } from 'express';
import { GoogleGenerativeAI, Part } from '@google/generative-ai';

// Define a type for the incoming message history for clarity
interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
}

// Define a type for the complex prompt object
interface ComplexPrompt {
  question: string;
  function: string;
  transformation: string;
  level: string;
  interests: string[];
  tone: string;
}

// Initialize the Google Generative AI client with the API key from the .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// Create separate models: one for classification (no system instruction) and one for chat (with system instruction)
const classificationModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
const chatModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash-latest',
  systemInstruction: 'You are an AI Math Tutor. Help the user with math concepts, problems, and explanations in a clear, step-by-step manner. Use Markdown for clear and precise formatting and LaTeX delimiters for math (e.g., $inline$ or $$display$$). Keep responses concise and educational. Your response must be clean and well-structured.'
});

/**
 * @route   POST /api/chat
 * @desc    Generate content using the Gemini API, restricted to math questions but allowing for greetings and follow-ups.
 * @access  Public
 */
export const generateContent = async (req: Request, res: Response) => {
  try {
    const { prompt, history = [] } = req.body as { prompt: string | ComplexPrompt; history?: ChatMessage[] };

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    let userPrompt: string;

    // Check if the prompt is a complex object or a simple string
    if (typeof prompt === 'object' && prompt !== null) {
      // If it's an object, construct a detailed prompt string for the AI
      const { question, function: func, transformation, level, interests, tone } = prompt as ComplexPrompt;
      userPrompt = `
        ${question}

        Function: \`${func}\`
        Transformation: \`${transformation}\`
        Difficulty Level: ${level}
        User Interests: ${interests.join(', ')}
        Desired Tone: ${tone}

        Please explain the function's properties and how the transformation affects it in a simple, user-friendly, and encouraging manner.
      `;
    } else {
      // If it's a string, use it directly
      userPrompt = prompt as string;
    }

    console.log("Constructed Prompt:", userPrompt);
    console.log("History:", history);

    // Expanded Intent Deduction...
    const classificationPrompt = `
      Analyze the user's latest message and classify its intent.
      The user is interacting with a math tutor AI.
      Possible intents are: GREETING, MATH_QUESTION, UNRELATED.
      - GREETING: User is saying hello, goodbye, thank you, etc.
      - MATH_QUESTION: The user is asking a direct math question, or a follow-up question related to a previous math explanation.
      - UNRELATED: The user is asking about something other than math (e.g., "What is the weather?").
      User's message: "${userPrompt}"
      Respond with only one word: GREETING, MATH_QUESTION, or UNRELATED.
    `;

    const classificationResult = await classificationModel.generateContent(classificationPrompt);
    const intent = classificationResult.response.text().trim();

    // Decision Making based on Intent...
    switch (intent) {
      case 'GREETING':
        const greetings = ["Hello! How can I help you with math today?", "Hi there! I'm ready to tackle some math problems. What's on your mind?", "Hey! Ask me any math question."];
        const greetingResponse = greetings[Math.floor(Math.random() * greetings.length)];
        return res.status(200).json({ response: greetingResponse });

      case 'MATH_QUESTION':
        const firstUserMessageIndex = history.findIndex(msg => msg.type === 'user');
        const validHistory = firstUserMessageIndex !== -1 ? history.slice(firstUserMessageIndex) : [];

        const formattedHistory: Part[] = validHistory.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }));

        const chat = chatModel.startChat({
          history: formattedHistory,
        });

        const result = await chat.sendMessage(userPrompt);
        const text = result.response.text();
        console.log(text);
        return res.status(200).json({ response: text });

      case 'UNRELATED':
      default:
        return res.status(403).json({
          response: "I'm sorry, but my purpose is to assist with math-related questions.",
        });
    }
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
};