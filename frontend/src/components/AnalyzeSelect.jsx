function AnalyzeSelect({ mode, setMode }) {
  return (
    <select
      className="w-full p-3 rounded bg-[#010109] border border-gray-700 text-white"
      value={mode}
      onChange={(e) => setMode(e.target.value)}
    >
      <option value="bug">🧠 Summarize Bug</option>
      <option value="repo">🔗 Analyze GitHub Repo</option>
      <option value="folder">📂 Upload Folder</option>
      <option value="zip">🗜️ Upload .zip File</option>
      <option value="find">🔍 Find Bug in Repo or Folder</option>
    </select>
  );
}
export default AnalyzeSelect;
