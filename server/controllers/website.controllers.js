import Website from "../models/website.model.js";
import User from "../models/user.model.js";
import { generateResponse } from "../config/OPENROUTER.js";
import extractJson from "../utils/extractJson.js";


const masterPrompt = `You are a world-class award-winning frontend engineer and UI/UX designer.
Your task is to generate a state-of-the-art, high-conversion landing page based on the user's description.

BRANDING & IDENTITY:
- Generate a UNIQUE and creative name/brand for the website based on the user's topic.
- Use this brand name as the logo in the header and in the copyright footer.

IMAGE REQUIREMENTS (MANDATORY & CRITICAL):
- DO NOT USE placeholder filenames like "dish1.jpg", "img.png", or descriptive strings as the src attribute.
- You MUST ONLY use valid Unsplash URLs.
- VALID PHOTO IDs (Use these EXACT IDs for relevance):
  * Food/Restaurant: 1546069901-ba9599a7e63c, 1504674900247-0877df9cc836, 1476718406336-c8a3e08358f0, 1555396273-d8b8cc815e21, 1504753793650-d4a138bc7bb2
  * Sweet/Candy/Dessert: 1536681666205-78f35555d61c, 1525048495126-72439899395d, 1481349518771-20055b2a7b24, 1514517604298-cf80e0fb7f1e
  * Technology/SaaS: 1518770660438-d7001aba4607, 1488590527305-4e12e861c476, 1678852524356-08188528aed9, 1519389950473-47ba0277781c
  * Business/Office: 1497334426901-fe6d7ce747da, 1542744094-246abc4ee3f7, 1522202176988-66273c2fd55f
  * Nature/Architecture: 1470772361482-bc2ef518c0c1, 1464822759023-fed62159b210, 1481277542470-35c02932230d
  * Transport/Buses: 1544620347455-8ef7246ec53d, 1570125909232-eb263c188f7e, 1568205445-565494191fe7
  * Automotive/Cars: 1533473359331-0135ef1b58bf, 1492144531105-251e44792055, 1503376780353-7e6692767b70
  * Aviation/Flights: 1436491865332-7a61a8979312, 1483375801503-3a8f66ec108f, 1556388158-158ea5ccacbd
  * Floral/Roses: 1496062031456-07b8f162a322, 1459411552884-841db9b3cc2a, 1561715276-a25b1ca600b7
  * Watch/Clock: 1523175111022-297c3230d452, 1508685096489-4b1b1b22935f, 1523275335684-18d1d0b7e197
  * Real Estate: 1560518883-ce09059eeffa, 1582408921715-184752e4960d, 1512917774598-15c11d9d6830
  * Health/Fitness: 1516876345887-6dd74f80787a, 1633339409275-84fb9541ab88, 1569466594095-b8cd77b835fd
  * Education: 1771765780945-c788a6ce4b33, 1759678444893-9c1762e022fd, 1758612898312-708f2ffdcd53
  * Pets: 1514888286974-6c03e2ca1dba, 1444212474815-6351d3bd473d, 1537151608828-ea2b11777ee8
  * Music: 1511379938547-c1f69419868d, 1459749411177-042180ec7739, 1514525253344-f2523004d1c0
- Format: https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&w=1200&q=80
- Failure to use these specific Unsplash URLs will result in broken images and is UNACCEPTABLE.

ANIMATION REQUIREMENTS (MANDATORY):
- All websites MUST feel alive and premium.
- Use Tailwind CSS transition and transform classes for ALL interactive elements (buttons, cards, links).
- Example animations to include:
  * Hero text entry: animate-fade-in or subtle slide-up.
  * Image hover: scale-105 with smooth transition-all duration-500.
  * Card hover: -translate-y-2 with box-shadow shifts.
  * Navbar: Glassmorphic blur-effect and sticky-top behavior.
- Ensure animations are subtle and don't overwhelm the user experience.

DESIGN PHILOSOPHY:
- Use VIBRANT, modern color palettes (mesh gradients, subtle glows, and glassmorphism).
- Use proper white space and premium typography (Inter/Geist).
- ALL sections must be beautifully detailed: Hero, Features (with icons), About, Portfolio/Gallery (with multiple images), Testimonials, FAQ, and Footer.

TECHNICAL REQUIREMENTS:
1. Return ONLY a single JSON object with "title" and "code" fields.
2. The "code" must be a COMPLETE, standalone HTML file with Tailwind CSS and Lucide icons (via CDN).
3. Use this Lucide CDN: <script src="https://unpkg.com/lucide@latest"></script> and initialize with <script>lucide.createIcons();</script> at the end of body.
4. The header MUST be a sticky, glassmorphic navbar with your generated brand logo and functional "Home, About, Services, Contact" links that smooth-scroll to their sections.
5. The footer MUST include a centered copyright notice: "© 2026 [Generated Brand Name]. All rights reserved."

USER PROMPT: "{USER_PROMPT}"

Return JSON:
{
  "title": "Your generated brand name",
  "code": "<!DOCTYPE html>..."
}
`;







export const generateWebsite = async (req, res) => {
    try {
        const { prompt } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (user.credits < 50) {
            return res.status(400).json({ success: false, message: "You have not enough credits to generate a website" });
        }

        const finalPrompt = masterPrompt.replace("{USER_PROMPT}", prompt);

        let raw = "";
        let parsed = null;

        // Retry logic for robust extraction
        for (let i = 0; i < 2 && !parsed; i++) {
            raw = await generateResponse(finalPrompt);
            parsed = await extractJson(raw);
        }


        if (!parsed || !parsed.code) {
            return res.status(500).json({ success: false, message: "AI failed to generate valid code. Please try again." });
        }

        const newWebsite = new Website({
            user: userId,
            title: parsed.title || "Untitled Website",
            latestCode: parsed.code,
            conversation: [{ role: "user", content: prompt }, { role: "ai", content: "Website generated successfully." }]
        });

        await newWebsite.save();

        // Deduct credits
        user.credits -= 50;
        await user.save();

        res.status(201).json({
            success: true,
            id: newWebsite._id,
            website: newWebsite,
            credits: user.credits
        });

    } catch (error) {
        console.error("Generate Website Error:", error.message);
        res.status(500).json({ success: false, message: `Failed to generate: ${error.message}` });
    }
};

export const getWebsites = async (req, res) => {
    try {
        const websites = await Website.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, websites });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const editPrompt = `You are a world-class award-winning frontend engineer and UI/UX designer.
Your task is to EDIT an existing landing page while maintaining its state-of-the-art quality.

CURRENT CODE:
"{CURRENT_CODE}"

USER REQUEST: "{USER_PROMPT}"

BRANDING & IDENTITY:
- Maintain or improve the website's brand name/logo based on the topic.
- Use this brand name as the logo in the header and in the copyright footer.

IMAGE REQUIREMENTS (MANDATORY & CRITICAL):
- DO NOT USE placeholder filenames like "dish1.jpg", "img.png", or descriptive strings as the src attribute.
- You MUST ONLY use valid Unsplash URLs.
- VALID PHOTO IDs (Use these EXACT IDs for relevance):
  * Food/Restaurant: 1546069901-ba9599a7e63c, 1504674900247-0877df9cc836, 1476718406336-c8a3e08358f0
  * Sweet/Candy/Dessert: 1536681666205-78f35555d61c, 1525048495126-72439899395d, 1481349518771-20055b2a7b24, 1514517604298-cf80e0fb7f1e
  * Technology/SaaS: 1518770660438-d7001aba4607, 1488590527305-4e12e861c476, 1678852524356-08188528aed9
  * Business/Office: 1497334426901-fe6d7ce747da, 1542744094-246abc4ee3f7, 1522202176988-66273c2fd55f
  * Nature/Architecture: 1470772361482-bc2ef518c0c1, 1464822759023-fed62159b210, 1481277542470-35c02932230d
  * Transport/Buses: 1544620347455-8ef7246ec53d, 1570125909232-eb263c188f7e, 1568205445-565494191fe7
  * Automotive/Cars: 1533473359331-0135ef1b58bf, 1492144531105-251e44792055, 1503376780353-7e6692767b70
  * Aviation/Flights: 1436491865332-7a61a8979312, 1483375801503-3a8f66ec108f, 1556388158-158ea5ccacbd
  * Floral/Roses: 1496062031456-07b8f162a322, 1459411552884-841db9b3cc2a, 1561715276-a25b1ca600b7
  * Watch/Clock: 1523175111022-297c3230d452, 1508685096489-4b1b1b22935f, 1523275335684-18d1d0b7e197
  * Real Estate: 1560518883-ce09059eeffa, 1582408921715-184752e4960d, 1512917774598-15c11d9d6830
  * Health/Fitness: 1516876345887-6dd74f80787a, 1633339409275-84fb9541ab88, 1569466594095-b8cd77b835fd
  * Education: 1771765780945-c788a6ce4b33, 1759678444893-9c1762e022fd, 1758612898312-708f2ffdcd53
  * Pets: 1514888286974-6c03e2ca1dba, 1444212474815-6351d3bd473d, 1537151608828-ea2b11777ee8
  * Music: 1511379938547-c1f69419868d, 1459749411177-042180ec7739, 1514525253344-f2523004d1c0
- Format: https://images.unsplash.com/photo-[ID]?auto=format&fit=crop&w=1200&q=80
- Failure to use these specific Unsplash URLs will result in broken images and is UNACCEPTABLE.

ANIMATION REQUIREMENTS (MANDATORY):
- All websites MUST feel alive and premium.
- Use Tailwind CSS transition and transform classes for ALL interactive elements.
- Example animations: scale-105 on hover, fade-in for section entry, sticky glassmorphic header.
- Maintain a high-end, responsive feel with custom Tailwind classes.

- If the CURRENT CODE has broken images or irrelevant images (like food photos on a bus site), you MUST replace them with valid IDs from the relevant category above.

DESIGN PHILOSOPHY:
- Maintain VIBRANT colors (mesh gradients, glows, glassmorphism).
- Keep typography premium (Inter/Geist).
- Ensure all sections are detailed: Hero, Features, Gallery, Testimonials, FAQ, and Footer.

TECHNICAL REQUIREMENTS:
1. Return ONLY a single JSON object with "title" and "code" fields.
2. The code must be a COMPLETE, standalone HTML file.
3. Use these Lucide icons (via CDN): <script src="https://unpkg.com/lucide@latest"></script> and initialize with <script>lucide.createIcons();</script> at the end of body.
4. The header MUST remain sticky/glassmorphic with a functional navbar (Home, About, Services, Contact).
5. The footer MUST include a centered copyright notice: "© 2026 [Brand Name]. All rights reserved."

Return JSON:
{
  "title": "Update the title if necessary",
  "code": "<!DOCTYPE html>..."
}
`;






export const editWebsite = async (req, res) => {
    try {
        const { id } = req.params;
        const { prompt } = req.body;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (user.credits < 10) {
            return res.status(400).json({ success: false, message: "You have not enough credits to edit a website (10 required)" });
        }

        const website = await Website.findOne({ _id: id, user: userId });
        if (!website) {
            return res.status(404).json({ success: false, message: "Website not found" });
        }

        // Use template literals carefully to avoid replacement issues
        const finalPrompt = editPrompt.replace("{CURRENT_CODE}", website.latestCode).replace("{USER_PROMPT}", prompt);

        let raw = "";
        let parsed = null;
        for (let i = 0; i < 2 && !parsed; i++) {
            raw = await generateResponse(finalPrompt);
            parsed = await extractJson(raw);
        }

        if (!parsed || !parsed.code) {
            return res.status(500).json({ success: false, message: "AI failed to edit the website. Please check your prompt and try again." });
        }

        website.latestCode = parsed.code;
        if (parsed.title) website.title = parsed.title;
        website.conversation.push({ role: "user", content: prompt });
        website.conversation.push({ role: "ai", content: "Website edited successfully." });

        await website.save();

        user.credits -= 10;
        await user.save();

        res.status(200).json({
            success: true,
            website,
            credits: user.credits
        });

    } catch (error) {
        console.error("Edit Website Error:", error.message);
        res.status(500).json({ success: false, message: `Failed to edit: ${error.message}` });
    }
};


export const getWebsiteById = async (req, res) => {
    try {
        const website = await Website.findOne({ _id: req.params.id, user: req.user.id });

        if (!website) {
            return res.status(404).json({ success: false, message: "Website not found" });
        }
        return res.status(200).json({ success: true, website });

    } catch (error) {
        res.status(500).json({ success: false, message: 'get website by id error' });
    }
};
export const deployWebsite = async (req, res) => {
    try {
        const { id } = req.params;
        const website = await Website.findOneAndUpdate(
            { _id: id, user: req.user.id },
            { deployed: true },
            { new: true }
        );

        if (!website) {
            return res.status(404).json({ success: false, message: "Website not found" });
        }

        res.status(200).json({ success: true, website });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to deploy website" });
    }
};
