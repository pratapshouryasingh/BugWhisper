function RepoInput({ repoUrl, setRepoUrl, onSubmit, streaming }) {
  const handleClick = () => {
    const url = repoUrl?.trim();

    if (!url) {
      alert("⚠️ Please enter a GitHub repository URL.");
      return;
    }

    if (!url.startsWith("https://github.com/")) {
      alert("⚠️ The URL must start with https://github.com/");
      return;
    }

    if (typeof onSubmit === "function") {
      onSubmit(url);
    } else {
      console.error("❌ onSubmit is not a function");
      alert("Internal error: onSubmit handler not provided.");
    }
  };

  return (
    <div className="space-y-2">
      <input
        type="url"
        className="w-full p-3 rounded-md bg-[#1e1e1e] border border-gray-700 text-white placeholder-gray-400"
        placeholder="Enter GitHub repo URL"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        disabled={streaming}
      />
      <button
        onClick={handleClick}
        className="bg-white text-black hover:bg-gray-200 px-6 py-2 w-full rounded-lg transition-colors duration-200 disabled:opacity-50"
        disabled={streaming}
      >
        {streaming ? "Streaming..." : "Analyze"}
      </button>
    </div>
  );
}

export default RepoInput;
