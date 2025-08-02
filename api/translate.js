const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports = async (request, response) => {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    const { text } = request.body;
    if (!text) {
        return response.status(400).json({ error: 'Text to translate is required' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `Translate the following Vietnamese text to Simplified Chinese: "${text}"`;

        const result = await model.generateContent(prompt);
        const geminiResponse = await result.response;
        const translatedText = geminiResponse.text();

        response.status(200).json({ translation: translatedText.trim() });
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Failed to translate text' });
    }
};
