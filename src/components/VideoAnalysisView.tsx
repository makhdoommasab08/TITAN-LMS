import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Upload, FileVideo, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import Markdown from 'react-markdown';

interface VideoAnalysisViewProps {
  theme: 'dark' | 'light';
}

export const VideoAnalysisView: React.FC<VideoAnalysisViewProps> = ({ theme }) => {
  const isDark = theme === 'dark';
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalysis(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await fetch('/api/analyze-video', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze video');
      }

      setAnalysis(data.analysis);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className={`p-8 min-h-screen ${isDark ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-zinc-900'}`}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline mb-2 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-indigo-500" />
            AI Video Analysis
          </h1>
          <p className="text-zinc-500 font-medium">Upload educational videos or lectures, and Gemini 3.1 Pro will automatically extract key concepts, summaries, and notable events.</p>
        </div>

        <div className={`p-8 rounded-[2rem] border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-500/30 rounded-2xl p-10 bg-indigo-500/5 transition-colors hover:bg-indigo-500/10">
            {file ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-indigo-500/20 text-indigo-400 mx-auto flex items-center justify-center">
                  <FileVideo className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{file.name}</h3>
                  <p className="text-sm text-zinc-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
                <div className="flex items-center gap-3 justify-center">
                  <button
                    onClick={() => {
                      setFile(null);
                      setAnalysis(null);
                    }}
                    className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-zinc-200 hover:bg-zinc-300 text-zinc-900'}`}
                  >
                    Change Video
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="px-6 py-2 rounded-full text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing with Gemini...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Analyze Video
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center cursor-pointer w-full">
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 text-indigo-500 mb-4 flex items-center justify-center transition-transform hover:scale-110">
                  <Upload className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-lg mb-2">Upload a video to analyze</h3>
                <p className="text-sm text-zinc-500 mb-6">Supports MP4, MOV, AVI</p>
                <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" />
                <span className="px-6 py-2 rounded-full text-sm font-bold bg-zinc-900 text-white hover:bg-zinc-800 transition-all dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white">
                  Browse Files
                </span>
              </label>
            )}
          </div>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}

        {analysis && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`p-8 rounded-[2rem] border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
            <h2 className="text-xl font-bold font-headline mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Analysis Results
            </h2>
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <Markdown>{analysis}</Markdown>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
