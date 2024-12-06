'use client';

import { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

interface ChatMessage {
    role: 'user' | 'bot';
    content: string;
}

// Custom prompt to ensure solar-focused responses
const SYSTEM_PROMPT = `You are a specialized chatbot focused exclusively on Indian solar energy initiatives and government schemes. Your knowledge encompasses:
- National Solar Mission and related policies
- State-wise solar programs
- Residential and commercial solar initiatives
- Solar subsidies and financial incentives
- Solar installation processes and requirements
- Technical aspects of solar implementation in India

Important rules:
1. Only discuss topics related to solar energy in India
2. If asked about non-solar topics, politely redirect to solar energy discussions
3. Provide accurate, up-to-date information about Indian solar schemes
4. Use simple, clear language to explain technical concepts
5. Include relevant government scheme names and details when applicable

If any question is outside the scope of Indian solar initiatives, respond with:
"Let me help you learn about India's solar energy initiatives instead. Would you like to know about [relevant solar topic]?"
`;

export default function SolarChatPage() {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState<ChatMessage[]>([{
        role: 'bot',
        content: 'Hello! I can help you learn about solar energy initiatives and government schemes in India. What would you like to know?'
    }]);
    const [isLoading, setIsLoading] = useState(false);

    const sendMessageToGemini = async (userMessage: string) => {
        try {
            const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });

            // Combine system prompt with user message for context
            const fullPrompt = `${SYSTEM_PROMPT}\n\nUser message: ${userMessage}\n\nResponse:`;
            const result = await model.generateContent(fullPrompt);
            const response = await result.response;
            return response.text();
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            throw new Error('Failed to get response about Indian solar initiatives');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        const currentMessage = message.trim();
        setChat(prev => [...prev, { role: 'user', content: currentMessage }]);
        setIsLoading(true);
        setMessage('');

        try {
            const response = await sendMessageToGemini(currentMessage);
            setChat(prev => [...prev, { role: 'bot', content: response }]);
        } catch (error) {
            console.error('Error:', error);
            setChat(prev => [...prev, {
                role: 'bot',
                content: 'I apologize for the error. Please ask another question about Indian solar energy initiatives.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const renderMessages = () => {
        return chat.map((msg, index) => (
            <div
                key={index}
                className={`mb-4 p-3 rounded-lg ${msg.role === 'user'
                    ? 'bg-blue-100 ml-auto max-w-[80%]'
                    : 'bg-gray-100 mr-auto max-w-[80%]'
                    }`}
            >
                <p className="break-words whitespace-pre-wrap">{msg.content}</p>
            </div>
        ));
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
                    <h1 className="text-2xl font-bold text-center mb-4 text-green-600">
                        Indian Solar Energy Initiatives Assistant
                    </h1>
                    <div className="min-h-[400px] max-h-[600px] overflow-y-auto">
                        {renderMessages()}
                        {isLoading && (
                            <div className="flex items-center justify-center text-gray-500 gap-2">
                                <div className="animate-bounce">●</div>
                                <div className="animate-bounce delay-100">●</div>
                                <div className="animate-bounce delay-200">●</div>
                            </div>
                        )}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                        placeholder="Ask about Indian solar energy initiatives..."
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
}