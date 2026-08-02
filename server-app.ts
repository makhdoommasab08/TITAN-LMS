import express from 'express';
import { GoogleGenAI } from '@google/genai';

export const app = express();

app.use(express.json());

// Helper to retrieve and initialize Gemini client with server environment variables
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
}

// API endpoint for AI Tutor
app.post('/api/ai-tutor', async (req, res) => {
  try {
    const { courseTitle, lessonTitle, question } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        answer: `[AI Tutor] In "${courseTitle}" (${lessonTitle}): ${question} is a core academic topic. (Note: Ensure GEMINI_API_KEY is configured in your deployment environment variables for real-time live responses).`
      });
    }

    const prompt = `You are a helpful academic AI tutor at Taj Institute of Technology & Applied Networks for the course "${courseTitle}", current lesson: "${lessonTitle}". Provide a concise, clear 2-3 sentence answer to the student's question: "${question}".`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });

    const text = response.text || 'I could not generate a response. Please review the lesson material.';
    res.json({ answer: text });
  } catch (error: any) {
    console.error('Gemini API Error in AI Tutor:', error);
    res.json({
      answer: `In "${req.body.courseTitle || 'Course'}": Analyzing core formulas and practicing module exercises is essential. (API Note: ${error?.message || 'Check Gemini Key'})`
    });
  }
});

// API endpoint for Integrated Gemini Chatbot (TITAN AI)
app.post('/api/gemini-chat', async (req, res) => {
  try {
    const { message, history, userName, userRole } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      let fallbackReply = `Hello ${userName || 'Student'}! I am TITAN AI, the assistant for Taj Institute of Technology & Applied Networks. `;
      const lower = (message || '').toLowerCase();
      if (lower.includes('course') || lower.includes('study') || lower.includes('class')) {
        fallbackReply += 'You can view all enrolled courses, track module progress, download official TITAN certificates, and get automated study guidance right in your student portal.';
      } else if (lower.includes('certif') || lower.includes('degree')) {
        fallbackReply += 'Official certificates of completion are issued by Taj Institute of Technology & Applied Networks upon completing course requirements. Check the Certificates tab in your portal!';
      } else {
        fallbackReply += `Regarding "${message}": Note that GEMINI_API_KEY is not set in Vercel. Please add GEMINI_API_KEY to your Vercel Project Environment Variables for live Gemini responses!`;
      }
      return res.json({ reply: fallbackReply });
    }

    const systemInstruction = `You are TITAN AI, the official academic AI assistant for Taj Institute of Technology & Applied Networks (ESTD. 2025).
The user is ${userName || 'a student'} in the ${userRole || 'student'} portal.
Be encouraging, academic, polite, and articulate. Keep answers well-structured and helpful.
Provide brief markdown formatting (bolding key terms, short bullet points) when helpful.`;

    const formattedHistory = Array.isArray(history)
      ? history.slice(-6).map((h: any) => `${h.sender === 'user' ? 'User' : 'TITAN AI'}: ${h.text}`).join('\n')
      : '';

    const fullPrompt = `${systemInstruction}\n\nRecent Conversation:\n${formattedHistory}\n\nUser: ${message}\nTITAN AI:`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: fullPrompt
    });

    const replyText = response.text || 'I am currently processing academic data. Please feel free to ask another question!';
    res.json({ reply: replyText });
  } catch (error: any) {
    console.error('Gemini Chat API Error:', error);
    res.json({
      reply: `I encountered an issue generating a response (${error?.message || 'API Error'}). Please verify that GEMINI_API_KEY is added to Vercel environment variables.`
    });
  }
});

// API endpoint for Quiz Generator
app.post('/api/generate-quiz', async (req, res) => {
  const { topic, courseTitle } = req.body;
  
  const defaultFallback = {
    title: `${topic} Quiz`,
    description: `A short assessment on ${topic} for ${courseTitle}.`,
    questions: [
      {
        id: `q-1`,
        text: `What is a primary concept in ${topic}?`,
        options: ['Concept A', 'Concept B', 'Concept C', 'Concept D'],
        correctAnswerIndex: 0
      },
      {
        id: `q-2`,
        text: `Which of the following best describes the application of ${topic}?`,
        options: ['Application X', 'Application Y', 'Application Z', 'None of the above'],
        correctAnswerIndex: 1
      }
    ]
  };

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json(defaultFallback);
    }

    const prompt = `
Generate a 3-question multiple choice quiz about "${topic}" for a course titled "${courseTitle}".
Format the response strictly as a JSON object matching this schema:
{
  "title": "A catchy title for the quiz",
  "description": "A short 1 sentence description of what the quiz covers",
  "questions": [
    {
      "id": "q-1",
      "text": "The question text",
      "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
      "correctAnswerIndex": 0
    }
  ]
}
Do not include markdown backticks. Return raw JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const rawText = response.text || '';
    const cleanedJsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    const parsedData = JSON.parse(cleanedJsonText);
    if (parsedData && Array.isArray(parsedData.questions)) {
      parsedData.questions.forEach((q: any, idx: number) => {
        q.id = `q-${idx + 1}`;
      });
      return res.json(parsedData);
    } else {
      return res.json(defaultFallback);
    }
  } catch (error) {
    console.error('Quiz Generation API Error:', error);
    return res.json(defaultFallback);
  }
});

// API endpoint for AI Study Planner
app.post('/api/study-planner', async (req, res) => {
  const { courses, deadlines, availableHours = 3, preferredSlots = ['Morning', 'Evening'], studyStrategy = 'Balanced', customNote = '', studentName = 'Alex' } = req.body;

  const defaultFallback = {
    headline: `Optimized ${studyStrategy} Daily Study Plan for ${studentName}`,
    summaryStrategy: `Based on your ${courses?.length || 3} registered courses and upcoming deadlines, this schedule prioritizes high-weight subjects and upcoming assessments while maintaining focus efficiency.`,
    dailyTargetHours: availableHours,
    priorityFocusCourse: courses?.[0]?.title || 'Data Science & Machine Learning 101',
    scheduleBlocks: [
      {
        id: 'block-1',
        timeSlot: '09:00 AM - 10:15 AM',
        courseTitle: courses?.[0]?.title || 'Data Science & Machine Learning 101',
        activityTitle: 'Deep Work: Core Concepts & Formula Review',
        durationMinutes: 75,
        focusLevel: 'High',
        studyTip: 'Target key formulas & review recent lecture slides before starting problem sets.',
        completed: false
      },
      {
        id: 'block-2',
        timeSlot: '10:30 AM - 11:30 AM',
        courseTitle: courses?.[1]?.title || 'UI/UX Design Systems & Prototyping',
        activityTitle: 'Assignment Practice & Hands-on Lab',
        durationMinutes: 60,
        focusLevel: 'Medium',
        studyTip: 'Work through interactive exercises and verify output step by step.',
        completed: false
      },
      {
        id: 'block-3',
        timeSlot: '02:00 PM - 02:45 PM',
        courseTitle: 'General Academic Review',
        activityTitle: 'Deadline Review & Flashcard Recall',
        durationMinutes: 45,
        focusLevel: 'Light',
        studyTip: 'Test yourself without looking at notes to strengthen long-term memory.',
        completed: false
      }
    ],
    weeklyGoalSummary: 'Complete 12 study modules, submit upcoming lab reports 24 hours prior to deadline, and maintain a consistent daily review routine.',
    aiRecommendations: [
      'Allocate 15 minutes of quiet active recall before bed to solidify today’s concepts.',
      'Take a structured 10-minute break between heavy problem-solving blocks to prevent cognitive fatigue.',
      'Focus extra time on lower-grade course modules early in the week when energy levels are highest.'
    ]
  };

  try {
    const ai = getGeminiClient();
    if (!ai) {
      return res.json(defaultFallback);
    }

    const prompt = `You are an expert AI Academic Advisor at Taj Institute of Technology & Applied Networks (TITAN).
Generate a structured JSON daily study schedule for student ${studentName}.

STUDENT CONTEXT:
- Enrolled Courses & Grade Performance: ${JSON.stringify(courses || [])}
- Upcoming Deadlines & Due Dates: ${JSON.stringify(deadlines || [])}
- Available Daily Study Hours: ${availableHours} hours
- Preferred Time Slots: ${preferredSlots.join(', ')}
- Study Strategy Preference: ${studyStrategy}
- Special Student Note: "${customNote}"

Instructions:
Respond with ONLY a valid JSON object matching this structure:
{
  "headline": "A short inspiring title for today's plan",
  "summaryStrategy": "2 sentence strategic rationale explaining why this schedule was prioritized this way based on course grades and deadlines",
  "dailyTargetHours": ${availableHours},
  "priorityFocusCourse": "Title of the course that needs highest attention today",
  "scheduleBlocks": [
    {
      "id": "b-1",
      "timeSlot": "09:00 AM - 10:15 AM",
      "courseTitle": "Course Name",
      "activityTitle": "Specific task title",
      "durationMinutes": 60,
      "focusLevel": "High" | "Medium" | "Light",
      "studyTip": "Actionable study technique tip",
      "completed": false
    }
  ],
  "weeklyGoalSummary": "A concise 1-2 sentence goal summary for the week",
  "aiRecommendations": [
    "3 specific, personalized study recommendations based on their grades and deadlines"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const rawText = response.text || '';
    const cleanedJsonText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedData = JSON.parse(cleanedJsonText);
    if (parsedData && Array.isArray(parsedData.scheduleBlocks)) {
      return res.json(parsedData);
    } else {
      return res.json(defaultFallback);
    }
  } catch (error) {
    console.error('Gemini Study Planner API Error (using default fallback):', error);
    return res.json(defaultFallback);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
