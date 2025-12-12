import { useState } from "react";

export default function AiTools({ content, setContent, setTitle }) {
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function callAI(endpoint, payload) {
    setLoading(true);

    const res = await fetch(`/api/ai/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    const output =
      data.corrected || data.keywords || data.outline || data.title || "No output";

    setResult(output);
    setLoading(false);
  }

  return (
    <div className="border rounded-lg p-4 bg-white shadow space-y-4">
      <h2 className="text-lg font-semibold">✨ AI Writing Tools</h2>

      {/* TOPIC INPUT */}
      <input
        type="text"
        className="w-full border p-2 rounded"
        placeholder="Enter your topic (example: Meditation Benefits)"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
      />

      {/* BUTTONS */}
      <button
        onClick={() => callAI("seo-keywords", { topic })}
        className="w-full p-2 bg-green-100 hover:bg-green-200 rounded"
      >
        🔍 Generate SEO Keywords
      </button>

      <button
        onClick={() => callAI("outline", { topic })}
        className="w-full p-2 bg-purple-100 hover:bg-purple-200 rounded"
      >
        📄 Generate Blog Outline
      </button>

      <button
        onClick={() => callAI("correct", { text: content || topic })}
        className="w-full p-2 bg-yellow-100 hover:bg-yellow-200 rounded"
      >
        ✨ Fix Grammar & Fluency
      </button>

      <button
        onClick={() => {
          callAI("title", { topic });
        }}
        className="w-full p-2 bg-blue-100 hover:bg-blue-200 rounded"
      >
        📝 Generate Blog Titles
      </button>

      {/* AI RESULT PREVIEW */}
      {loading && <p className="italic text-gray-500">AI is thinking...</p>}

      {result && (
        <div className="p-3 bg-gray-50 border rounded">
          <h3 className="font-semibold mb-2">AI Result:</h3>

          {/* Render HTML */}
          <div
            className="prose"
            dangerouslySetInnerHTML={{ __html: result }}
          />

          {/* Insert into Editor */}
          <button
            onClick={() =>
              setContent((prev) => (prev || "") + "<br/><br/>" + result)
            }
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
          >
            ➕ Insert Into Editor
          </button>
        </div>
      )}
    </div>
  );
}
