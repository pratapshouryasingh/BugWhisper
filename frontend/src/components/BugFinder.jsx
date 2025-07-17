function BugFinder({
  searchQuery,
  setSearchQuery,
  repoUrl,
  setRepoUrl,
  onSearch,
  loading,
  folderInputRef,
  onFolderUpload,
}) {
  const handleClick = () => {
    if (!searchQuery.trim()) {
      alert("Please enter a bug keyword or description.");
      return;
    }
    if (typeof onSearch === "function") {
      onSearch();
    } else {
      console.warn("No onSearch function provided to BugFinder.");
    }
  };

  return (
    <>
      {/* Bug Query Input */}
      <input
        type="text"
        className="w-full p-3 rounded-md text-white bg-[#1f1f1f]"
        placeholder="e.g. login fails on 404"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        disabled={loading}
      />

      {/* Repo URL Input */}
      <input
        type="url"
        className="w-full p-3 rounded-md text-white mt-2 bg-[#010109]"
        placeholder="GitHub Repo URL (optional)"
        value={repoUrl}
        onChange={(e) => setRepoUrl(e.target.value)}
        disabled={loading}
      />

      {/* Search Bug Button */}
      <button
        onClick={handleClick}
        className="bg-gray-600 hover:bg-gray-500 px-6 py-2 w-full rounded-lg mt-2"
        disabled={loading}
      >
        {loading ? "Searching..." : "Search Bug"}
      </button>

      {/* Hidden folder input */}
      <input
        type="file"
        webkitdirectory="true"
        directory=""
        multiple
        ref={folderInputRef}
        onChange={onFolderUpload}
        style={{ display: "none" }}
        disabled={loading}
      />

      {/* Upload Folder Button */}
      {!repoUrl && (
        <button
          onClick={() => folderInputRef?.current?.click()}
          className="bg-indigo-600 hover:bg-indigo-500 px-6 py-2 w-full rounded-lg mt-2"
          disabled={loading}
        >
          Upload Folder Instead
        </button>
      )}
    </>
  );
}

export default BugFinder;
