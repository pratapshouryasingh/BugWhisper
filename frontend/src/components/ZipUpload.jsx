import React from "react";

function ZipUpload({ zipFile, onZipUpload, inputRef, onAnalyze, loading }) {
  return (
    <div className="space-y-2">
      {/* Hidden file input */}
      <input
        type="file"
        accept=".zip"
        ref={inputRef}
        onChange={onZipUpload}
        style={{ display: "none" }}
      />

      {/* Upload ZIP button */}
      {!loading && (
        <button
          onClick={() => inputRef?.current?.click()}
          className="bg-gray-600 hover:bg-gray-500 px-6 py-2 w-full rounded-lg"
        >
          Upload ZIP
        </button>
      )}

      {/* File name & Analyze button */}
      {zipFile && !loading && (
        <>
          <div className="text-sm text-gray-400 mt-1">Selected: {zipFile.name}</div>
          <button
            onClick={onAnalyze}
            className="bg-gray-600 hover:bg-gray-500 px-6 py-2 w-full rounded-lg"
          >
            Analyze ZIP
          </button>
        </>
      )}

      {/* Analyzing indicator */}
      {loading && (
        <button
          disabled
          className="bg-gray-700 px-6 py-2 w-full rounded-lg text-gray-300 cursor-wait"
        >
          Analyzing...
        </button>
      )}
    </div>
  );
}

export default ZipUpload;
