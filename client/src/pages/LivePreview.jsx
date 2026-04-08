import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { getImageFixerScript } from '../utils/imageFixer';

const serverUrl = "https://ai-website-bulider1.onrender.com";

function LivePreview() {
    const { id } = useParams();
    const [website, setWebsite] = useState(null);
    const [error, setError] = useState("");

    const getPreviewCode = (site) => {
        if (!site?.latestCode) return "";

        const scripts = `
            <script>
                ${getImageFixerScript(site?.title || "")}
            </script>
        `;

        let finalCode = site.latestCode;
        if (/<\/body>/i.test(finalCode)) {
            finalCode = finalCode.replace(/<\/body>/i, `${scripts}</body>`);
        } else if (/<\/html>/i.test(finalCode)) {
            finalCode = finalCode.replace(/<\/html>/i, `${scripts}</html>`);
        } else {
            finalCode = `<!DOCTYPE html><html><head><script src="https://cdn.tailwindcss.com"></script><script src="https://unpkg.com/lucide@latest"></script></head><body>${finalCode}${scripts}</body></html>`;
        }
        return finalCode;
    };

    useEffect(() => {
        const fetchWebsite = async () => {
            try {
                const res = await axios.get(`${serverUrl}/api/website/get-by-id/${id}`, {
                    withCredentials: true
                });
                if (res.data.success) {
                    setWebsite(res.data.website);
                }
            } catch (err) {
                setError("Failed to load live preview");
            }
        };
        fetchWebsite();
    }, [id]);

    if (error) return <div className="h-screen flex items-center justify-center bg-black text-red-400">{error}</div>;
    if (!website) return <div className="h-screen flex items-center justify-center bg-black text-zinc-500 font-bold uppercase tracking-widest"><Loader2 className="animate-spin mr-2" /> Loading Live Preview...</div>;

    return (
        <iframe
            srcDoc={getPreviewCode(website)}
            title="Live Preview"
            className="w-screen h-screen border-none m-0 p-0"
        />
    );
}

export default LivePreview;
