function FolderUpload({ inputRef, onUpload, loading }) {
  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={onUpload}
        style={{ display: "none" }}
        multiple
        // ⚠️ Supported in Chromium-based browsers
        webkitdirectory="true"
        directory="true"
      />

      <button
        onClick={() => {
          if (!inputRef?.current) {
            alert("Input reference not found");
            return;
          }
          inputRef.current.click();
        }}
        className="bg-gray-900 hover:bg-gray-700 px-6 py-2 w-full rounded-lg"
        disabled={loading}
      >
        {loading ? "Analyzing..." : "Select Folder to Analyze"}
      </button>
    </>
  );
}

export default FolderUpload;
