import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const location = useLocation();

  const speechRef = useRef(null); // 🔥 track speech

  // 🔥 FORCE STOP (real fix)
  const stopVoice = () => {
    try {
      if (speechRef.current) {
        window.speechSynthesis.cancel();
        speechRef.current = null;
      }

      window.speechSynthesis.cancel();
    } catch (e) {}
  };

  // 🔥 PAGE CHANGE → INSTANT STOP
  useEffect(() => {
    stopVoice();
    setOpen(false);
  }, [location.pathname]);

  // 🔇 MUTE → INSTANT STOP
  useEffect(() => {
    if (isMuted) {
      stopVoice();
    }
  }, [isMuted]);

  // 🔊 SPEAK
  const speak = (text) => {
    if (isMuted) return;

    stopVoice(); // 🔥 पहले बंद

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "hi-IN";
    speech.rate = 0.9;

    speechRef.current = speech; // 🔥 track

    window.speechSynthesis.speak(speech);
  };

  // 🤖 AUTO VOICE
  useEffect(() => {
    if (open) {
      speak(
        "नमस्ते! इस वेबसाइट में आप नजदीकी ब्लड बैंक खोज सकते हैं। पहले लोकेशन बटन पर क्लिक करें, फिर अस्पताल चुनें और रिक्वेस्ट भेजें।"
      );
    }
  }, [open]);

  return (
    <>
      {/* Chatbot Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-red-600 text-white px-4 py-3 rounded-full z-[9999]"
      >
        💬
      </button>

      {/* Mute Button */}
      <button
        onClick={() => setIsMuted((prev) => !prev)}
        className="fixed bottom-20 right-5 bg-slate-800 text-white px-4 py-3 rounded-full z-[9999]"
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      {/* Chat UI */}
      {open && (
        <div className="fixed bottom-20 right-5 w-[300px] bg-slate-900 text-white p-4 rounded-xl z-[9999]">
          <h2 className="font-bold mb-2">Assistant</h2>
          <p className="text-sm text-gray-300">
            👉 Map पर hospital marker पर click करें <br />
            👉 Request Blood button दबाएं
          </p>

          <button
            onClick={() =>
              speak(
                "मैप पर ब्लू मार्कर पर क्लिक करें और ब्लड रिक्वेस्ट भेजें"
              )
            }
            className="bg-green-600 w-full py-2 rounded"
          >
            🔊 Guide Me
          </button>
        </div>
      )}
    </>
  );
}