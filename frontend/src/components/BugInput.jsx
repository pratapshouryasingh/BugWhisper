function BugInput({ bugText, setBugText, loading, onAnalyze }) {
  return (
    <>
      <textarea
        className="w-full h-32 p-3 rounded-md text-white bg-[#1f1f1f] border border-gray-700"
        value={bugText}
        onChange={(e) => setBugText(e.target.value)}
        placeholder="Paste bug or stack trace here..."
      />
      <button
        onClick={onAnalyze}
        disabled={loading}
        className="bg-white text-black hover:bg-gray-200 px-6 py-2 w-full rounded-lg mt-2"
      >
        {loading ? "Analyzing..." : "Analyze"}
      </button>
    </>
  );
}
export default BugInput;
