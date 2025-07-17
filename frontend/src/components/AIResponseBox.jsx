function AIResponseBox({ response }) {
  if (!response) return null;

  // Split by triple backticks to detect code blocks
  const blocks = response.split(/```(?:\w+)?/g);

  return (
    <div className="bg-[#37373a] p-6 rounded-lg max-h-[67vh] overflow-y-auto text-base leading-relaxed border border-gray-700 shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-pink-400 flex items-center gap-2">
        <span>🧠</span> BugWhisper Response:
      </h2>

      <div className="space-y-4 font-mono">
        {blocks.map((block, index) =>
          index % 2 === 1 ? (
            // Odd index → code block
            <pre
              key={index}
              className="bg-[#010109] text-green-400 p-4 rounded-md overflow-x-auto text-sm"
            >
              {block.trim()}
            </pre>
          ) : (
            // Even index → normal text
            <p key={index} className="text-white whitespace-pre-wrap">
              {block.trim()}
            </p>
          )
        )}
      </div>
    </div>
  );
}
export default AIResponseBox;
