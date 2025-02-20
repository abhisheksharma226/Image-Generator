import React, { useState } from "react";
import { Loader } from "lucide-react"; // For loading animation (make sure you have Lucide installed)

const token = process.env.REACT_APP_HF_TOKEN; // Access from env
const model = process.env.HF_model;

const TextToImage = () => {
  const [text, setText] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!text) return alert("Enter a description!");
    setLoading(true);

    try {
      const response = await fetch(
        `${model}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputs: text }),
        }
      );

      if (!response.ok) throw new Error("Failed to generate image");

      const imageBlob = await response.blob();
      const url = URL.createObjectURL(imageBlob);
      setImageUrl(url);
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-blue-400 p-6">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Text-to-Image Generator</h1>
        <input
          type="text"
          placeholder="Enter text description..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={generateImage}
          className="w-full bg-blue-600 text-white font-semibold px-4 py-3 mt-4 rounded-lg hover:bg-blue-700 transition flex justify-center items-center"
          disabled={loading}
        >
          {loading ? <Loader className="animate-spin w-5 h-5" /> : "Generate Image"}
        </button>
        {imageUrl && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700">Generated Image:</h2>
            <img
              src={imageUrl}
              alt="Generated"
              className="mt-4 rounded-lg shadow-md w-full h-64 object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TextToImage;
