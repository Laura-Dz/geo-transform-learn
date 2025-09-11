import { Request, Response } from 'express';
import { GoogleGenerativeAI, Part } from '@google/generative-ai';

// Define a type for the incoming message history for clarity
interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
}

// Initialize the Google Generative AI client with the API key from the .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// Create separate models: one for classification (no system instruction) and one for chat (with system instruction)
const classificationModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

const chatModel = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash-lite',
  systemInstruction: 'You are an AI Math Tutor. Help the user with math concepts, problems, and explanations in a clear, step-by-step manner. Use  Markdown for clear and precise formatting and LaTeX delimiters for math (e.g., $inline$ or $$display$$). Keep responses concise and educational. your response must be clean'
});

/**
 * @route   POST /api/chat
 * @desc    Generate content using the Gemini API, restricted to math questions but allowing for greetings and follow-ups.
 * @access  Public
 */
export const generateContent = async (req: Request, res: Response) => {
  try {
    const { prompt, history = [] } = req.body as { prompt: string; history?: ChatMessage[] };

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Expanded Intent Deduction...
    const classificationPrompt = `
      Analyze the user's latest message and classify its intent.
      The user is interacting with a math tutor AI.
      Possible intents are: GREETING, MATH_QUESTION, UNRELATED.
      - GREETING: User is saying hello, goodbye, thank you, etc.
      - MATH_QUESTION: The user is asking a direct math question, or a follow-up question related to a previous math explanation.
      - UNRELATED: The user is asking about something other than math (e.g., "What is the weather?").

      User's message: "${prompt}"

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
        // ========================= FIX IS HERE =========================
        // The Google API requires the history to start with a 'user' message.
        // We find the index of the first user message and slice the array from there
        // to remove any initial AI welcome messages.
        const firstUserMessageIndex = history.findIndex(msg => msg.type === 'user');
        
        // If no user messages are found (e.g., history is just AI prompts), 
        // we'll use an empty history. Otherwise, we slice from the first user message.
        const validHistory = firstUserMessageIndex !== -1 ? history.slice(firstUserMessageIndex) : [];
        // ===============================================================

        // Now, we use the cleaned 'validHistory'
        const formattedHistory: Part[] = validHistory.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }));

        const chat = chatModel.startChat({
          history: formattedHistory,
        });

        const result = await chat.sendMessage(prompt);
        const text = result.response.text();
        console.log(text)
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