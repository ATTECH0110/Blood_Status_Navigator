import React, { useState, useEffect } from "react";

export default function Chatbot() {
  const [open, setOpen] = useState(false);

  const speak = () => {
    const text =
      "नमस्ते। आपका Blood status tracker website me स्वागत है ,सबसे पहले नीचे दिए गए Refresh Hospital बटन पर क्लिक करें। उसके बाद मैप पर jo अस्पताल के मार्कर  diya hai uss पर क्लिक करें और ब्लड रिक्वेस्ट बटन दबाएं।";

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "hi-IN"; // ✅ Hindi voice
    speech.rate = 0.85;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(true);
      speak();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg z-[9999]"
      >
        💬
      </button>

      {/* Chatbox */}
      {open && (
        <div className="fixed bottom-20 right-5 w-72 bg-white text-black rounded-2xl shadow-2xl p-4 z-[9999] border">
          
          <h3 className="font-bold text-lg mb-2 text-blue-600">
            🤖 सहायता
          </h3>

          <div className="text-sm space-y-2">
            {/* <p>👉 📍 लोकेशन बटन पर क्लिक करें</p> */}
            <p>👉 Refresh Hospital बटन पर क्लिक करें </p>
            <p>👉 अस्पताल चुनें</p>
            <p>👉 Request Blood दबाएं</p>
          </div>

          <button
            onClick={speak}
            className="mt-3 w-full bg-green-600 text-white py-2 rounded-lg"
          >
            🔊 फिर से सुनें
          </button>

          <button
            onClick={() => setOpen(false)}
            className="mt-2 w-full bg-red-500 text-white py-2 rounded-lg"
          >
            बंद करें
          </button>
        </div>
      )}
    </>
  );
}