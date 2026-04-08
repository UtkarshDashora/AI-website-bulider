const extractJson = async (text) => {
    try {
        if (!text) return null;
        
        // Remove markdown-style ```json blocks
        const cleaned = text
            .replace(/```json/gi, "")
            .replace(/```/g, "")
            .trim();

        // Find first valid JSON object
        const firstBrace = cleaned.indexOf("{");
        const lastBrace = cleaned.lastIndexOf("}");

        if (firstBrace === -1 || lastBrace === -1) {
            // Try direct parse if no braces
            try {
                return JSON.parse(cleaned);
            } catch (e) {
                return null;
            }
        }

        const jsonString = cleaned.slice(firstBrace, lastBrace + 1);
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("JSON Extraction Error:", error.message);
        return null;
    }
};

export default extractJson;