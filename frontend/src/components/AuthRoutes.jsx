import { useAuthorizedFetch } from "../utils/useAuthorizedFetch";
import { useState, useRef } from "react";
import JSZip from "jszip";
import {
  SignedIn,
  UserButton,
  useUser,
  useClerk,
} from "@clerk/clerk-react";
import AnalyzeSelect from "./AnalyzeSelect";
import AIResponseBox from "./AIResponseBox";
import BugInput from "./BugInput";
import RepoInput from "./RepoInput";
import FolderUpload from "./FolderUpload";
import ZipUpload from "./ZipUpload";
import BugFinder from "./BugFinder";

export default function AuthRoutes({ response, setResponse }) {
  const { isSignedIn } = useUser();
  const clerk = useClerk();
  const fetchAuth = useAuthorizedFetch();

  const [mode, setMode] = useState("bug");
  const [bugText, setBugText] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [zipFile, setZipFile] = useState(null);
  const [followUp, setFollowUp] = useState("");

  const folderInputRef = useRef(null);
  const zipInputRef = useRef(null);

  const reset = () => {
    setResponse("");
    setZipFile(null);
    setFollowUp("");
  };

  const cancel = () => {
    reset();
    setLoading(false);
  };

  const redirectToClerkSignIn = () => clerk.redirectToSignIn();

  const saveHistory = async (query, result) => {
    try {
      await fetchAuth("/search", {
        method: "POST",
        body: { query, result },
      });
    } catch {}
  };

  const handleBugAnalyze = async () => {
    if (!isSignedIn) return redirectToClerkSignIn();
    if (!bugText.trim()) return;
    reset();
    setLoading(true);
    try {
      const res = await fetchAuth("/analyze", {
        method: "POST",
        body: { issueText: bugText },
      });
      const data = await res.json();
      const text = data.summary || "✅ Analyzed, but no summary.";
      setResponse(text);
      await saveHistory(bugText, text);
    } catch {
      setResponse("❌ Bug analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleFollowUp = async () => {
    if (!isSignedIn) return redirectToClerkSignIn();
    if (!followUp.trim()) return;
    setLoading(true);
    try {
      const prompt = `Previous response:\n${response}\n\nFollow-up question:\n${followUp}`;
      const res = await fetchAuth("/analyze", {
        method: "POST",
        body: { issueText: prompt },
      });
      const data = await res.json();
      const text = data.summary || "✅ Follow-up complete.";
      setResponse(text);
      await saveHistory(followUp, text);
      setFollowUp("");
    } catch {
      setResponse("❌ Follow-up failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRepoAnalyze = async () => {
    if (!isSignedIn) return redirectToClerkSignIn();
    reset();
    setLoading(true);
    try {
      const res = await fetchAuth("/analyze/repo", {
        method: "POST",
        body: { repoUrl },
      });
      const data = await res.json();
      const text = data.analysis || "✅ Repo analyzed, but no output.";
      setResponse(text);
      await saveHistory(repoUrl, text);
    } catch {
      setResponse("❌ Repo analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleFolderUpload = async (event) => {
    if (!isSignedIn) return redirectToClerkSignIn();
    const files = event.target.files;
    if (!files?.length) return;
    reset();
    setLoading(true);
    try {
      const zip = new JSZip();
      Array.from(files).forEach((f) => zip.file(f.webkitRelativePath, f));
      const blob = await zip.generateAsync({ type: "blob" });
      const form = new FormData();
      form.append("zip", blob, "folder.zip");

      const res = await fetchAuth("/analyze/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      const txt = data.analysis || "✅ Folder analyzed, but no output.";
      setResponse(txt);
      await saveHistory("Local folder upload", txt);
    } catch {
      setResponse("❌ Folder analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleZipUpload = (e) => {
    const f = e.target.files?.[0];
    if (!f?.name.endsWith(".zip")) return alert("Upload a .zip file");
    setZipFile(f);
  };

  const handleZipAnalyze = async () => {
    if (!isSignedIn) return redirectToClerkSignIn();
    if (!zipFile) return;
    reset();
    setLoading(true);
    try {
      const form = new FormData();
      form.append("zip", zipFile);
      const res = await fetchAuth("/analyze/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      const txt = data.analysis || "✅ ZIP analyzed, but no output.";
      setResponse(txt);
      await saveHistory(zipFile.name, txt);
    } catch {
      setResponse("❌ ZIP analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleBugFind = async () => {
    if (!isSignedIn) return redirectToClerkSignIn();
    reset();
    setLoading(true);
    try {
      let baseAnalysis = "";
      if (repoUrl.trim()) {
        const r = await fetchAuth("/analyze/repo", {
          method: "POST",
          body: { repoUrl },
        });
        baseAnalysis = (await r.json()).analysis;
      } else {
        folderInputRef.current?.click();
        return;
      }
      const prompt = `Find bugs related to: ${searchQuery}\n\n${baseAnalysis}`;
      const res = await fetchAuth("/analyze", {
        method: "POST",
        body: { issueText: prompt },
      });
      const txt = (await res.json()).summary;
      setResponse(txt);
      await saveHistory(`find:${searchQuery}`, txt);
    } catch {
      setResponse("❌ Bug search failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white flex flex-col justify-end">

      {/* Response & Follow-up Section */}
      {(loading || response) && (
        <div className="w-full flex justify-center px-4 mt-6">
          <div className="w-full max-w-6xl space-y-4">
            {loading && <p className="text-blue-400 text-sm">Analyzing...</p>}
            {response && <AIResponseBox response={response} />}
            {response && (
              <div className="mt-2 mb-22">
                <textarea
                  placeholder="Ask a follow-up question..."
                  value={followUp}
                  onChange={(e) => setFollowUp(e.target.value)}
                  className="w-full p-3 rounded-md bg-[#1E293B] border border-white/10 focus:outline-none text-white"
                  rows={3}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleFollowUp}
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                  >
                    {loading ? "Analyzing..." : "Submit Follow-up"}
                  </button>
                  <button
                    onClick={cancel}
                    className="px-4 py-2 bg-red-500/20 text-red-300 rounded border border-red-500/40 hover:bg-red-500/30 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Command Box - Hidden if response is active */}
      {!response && (
        <div className="w-full flex justify-center px-4 mb-24">
          <div className="w-full max-w-6xl bg-[#0F172A]/80 backdrop-blur-lg border border-white/10 rounded-lg p-6 shadow-md">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                {mode === "bug" ? "Summarize Bug" : "Run Analyzer"}
              </h2>
              <AnalyzeSelect mode={mode} setMode={setMode} />
            </div>

            {mode === "bug" && (
              <BugInput
                bugText={bugText}
                setBugText={setBugText}
                loading={loading}
                onAnalyze={handleBugAnalyze}
              />
            )}
            {mode === "repo" && (
              <RepoInput
                repoUrl={repoUrl}
                setRepoUrl={setRepoUrl}
                onSubmit={handleRepoAnalyze}
              />
            )}
            {mode === "folder" && (
              <FolderUpload
                inputRef={folderInputRef}
                onUpload={handleFolderUpload}
                loading={loading}
              />
            )}
            {mode === "zip" && (
              <ZipUpload
                zipFile={zipFile}
                inputRef={zipInputRef}
                onZipUpload={handleZipUpload}
                onAnalyze={handleZipAnalyze}
                loading={loading}
              />
            )}
            {mode === "find" && (
              <BugFinder
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                repoUrl={repoUrl}
                setRepoUrl={setRepoUrl}
                folderInputRef={folderInputRef}
                onFolderUpload={handleFolderUpload}
                onSearch={handleBugFind}
                loading={loading}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
