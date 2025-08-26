import React, { useState } from 'react';
import { personalInfo } from './data/personalInfo.jsx';
import MainContent from "./components/MainComponent.jsx";
import BlogContent from './components/BlogContent.jsx';
import Footer from './components/Footer.jsx';
import Warning from './components/warning.jsx'

export default function App() {
  const [view, setView] = useState('home');

  const callGeminiAPI = async (prompt, maxRetries = 3) => {
    setIsLoading(true);
    setGeneratedContent({ title: '', text: '' });
    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    const apiKey = ""; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

    for (let i = 0; i < maxRetries; i++) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setIsLoading(false);
                return text;
            } else {
                 throw new Error("Unexpected API response structure");
            }
        } catch (error) {
            console.error(`Attempt ${i + 1} failed:`, error);
            if (i === maxRetries - 1) {
                setIsLoading(false);
                return "Sorry, I couldn't generate a response right now.";
            }
            await new Promise(res => setTimeout(res, Math.pow(2, i) * 1000));
        }
    }
  };

  const handleRefineBio = async () => {
    const prompt = `Rewrite this bio for a first-year Computer Science student's portfolio to be more impactful and professional, but keep it concise (around 2-3 sentences). Original bio: "${personalInfo.bio}"`;
    const refinedText = await callGeminiAPI(prompt);
    setGeneratedContent({ title: '✨ Refined Bio Suggestion', text: refinedText });
  };

  const handleGenerateIdea = async () => {
    const prompt = `I am a first-year computer science student with skills in C++, Python, and React. Suggest a single, interesting project idea that I can build to showcase my skills. Provide a creative title and a one-sentence description.`;
    const ideaText = await callGeminiAPI(prompt);
    setGeneratedContent({ title: '✨ New Project Idea', text: ideaText });
  };

  return (
    <div className="bg-white font-sans text-gray-800">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <nav className="mb-12">
          <button onClick={() => setView('home')} className={`mr-4 font-medium ${view === 'home' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>Home</button>
          <button onClick={() => setView('blog')} className={`font-medium ${view === 'blog' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}>Blog</button>
        </nav>

        {view === 'home' ? (
          <MainContent />
        ) : (
          <BlogContent setView={setView} />
        )}
        <Warning />
        <Footer />
      </div>
    </div>
  );
}