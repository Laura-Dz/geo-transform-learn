import { Request, Response } from 'express';
import { GoogleGenerativeAI, Part } from '@google/generative-ai';

// --- TYPE DEFINITIONS ---
// For chat history
interface ChatMessage {
  type: 'user' | 'ai';
  content: string;
}

// For the complex prompt object from the frontend
interface ComplexPrompt {
  question: string;
  function: string;
  transformation: string;
  level: string;
  interests: string[];
  tone:string;
}

// --- INITIALIZE GEMINI AI CLIENT ---
// Ensure GEMINI_API_KEY is in your .env file
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// Model for simple classification tasks
const classificationModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

// Model for the main chat functionality with specific instructions
const chatModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash-latest',
  systemInstruction: `You are an expert AI Math Tutor. Your goal is to provide clear, encouraging, step-by-step explanations.
  - Use Markdown for clear formatting (headings, lists, bold).
  - Use LaTeX delimiters for all mathematical notation (e.g., $inline_math$ or $$display_math$$).
  - **CRITICAL**: You MUST structure your entire response into exactly two sections separated by the unique delimiter '|||'.
    1. The first section is the 'explanation'. It must detail the function's properties and the impact of the given transformation.
    2. The second section is the 'guidance'. It must provide encouraging next steps, suggest related concepts, or pose a new question to the user.
  - Example Format:
    This is the detailed explanation of the function and its transformation...|||Here are some great next steps to continue your learning journey...`
});

/**
 * Parses the AI's raw text response into a structured JSON object.
 * @param {string} text The raw text from the Gemini API.
 * @returns {{ explanation: string, guidance: string }} A structured object.
 */
const parseAIResponse = (text: string) => {
  const parts = text.split('|||');

  // If the AI followed the format perfectly
  if (parts.length === 2) {
    return {
      explanation: parts[0].trim(),
      guidance: parts[1].trim(),
    };
  }

  // Fallback in case the AI response format is unexpected
  console.warn('AI response did not contain the expected "|||" delimiter.');
  return {
    explanation: text,
    guidance: "Let's explore another aspect of this function! What would you like to know next?",
  };
};

/**
 * @route   POST /api/chat
 * @desc    Generate structured math explanations using the Gemini API.
 * @access  Public
 */
export const contentAi = async (req: Request, res: Response) => {
  try {
    const { prompt, history = [] } = req.body as { prompt: string | ComplexPrompt; history?: ChatMessage[] };

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    let userPrompt: string;

    // Handle both simple string prompts and complex object prompts
    if (typeof prompt === 'object' && prompt !== null) {
      const { question, function: func, transformation, level, interests, tone } = prompt as ComplexPrompt;
      userPrompt = `
        ${question}

        Function Details:
        - Function: $${func}$
        - Transformation: ${transformation}
        - User Level: ${level}
        - User Interests: ${interests.join(', ')}
        - Desired Tone: ${tone}
      `;
    } else {
      userPrompt = prompt as string;
    }

    // --- Intent Classification Step ---
    const classificationPrompt = `
      Analyze the user's message and classify its intent as GREETING, MATH_QUESTION, or UNRELATED.
      User's message: "${userPrompt}"
      Respond with only one word.`;

    const classificationResult = await classificationModel.generateContent(classificationPrompt);
    const intent = classificationResult.response.text().trim();

    // --- Respond Based on Intent ---
    switch (intent) {
      case 'GREETING':
        const greetings = ["Hello! How can I help you with math today?", "Hi there! I'm ready for your math questions."];
        return res.status(200).json({ response: greetings[Math.floor(Math.random() * greetings.length)] });

      case 'MATH_QUESTION':
        const formattedHistory: Part[] = history.map(msg => ({
          role: msg.type === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }],
        }));

        const chat = chatModel.startChat({ history: formattedHistory });
        const result = await chat.sendMessage(userPrompt);
        const rawText = result.response.text();

        // Parse the raw text into the structured JSON for the frontend
        const structuredResponse = parseAIResponse(rawText);

        return res.status(200).json(structuredResponse);

      case 'UNRELATED':
      default:
        return res.status(403).json({
          response: "I'm sorry, I'm a specialized math tutor and can only assist with math-related questions.",
        });
    }
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
};