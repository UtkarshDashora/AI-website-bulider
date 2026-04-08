import axios from "axios";

export const generateResponse = async (prompt) => {
    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "google/gemini-2.0-flash-001",
                messages: [
                    {
                        role: "user",
                        content: prompt,
                    },
                ],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "HTTP-Referer": "http://localhost:5000",
                    "X-Title": "Genweb.ai",
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Raw AI Response:", response.data.choices[0].message.content.slice(0, 100) + "...");
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error("OpenRouter API Error Details:", error.response?.data || error.message);
        throw new Error(`OpenRouter error: ${error.response?.data?.error?.message || error.message}`);
    }
};
