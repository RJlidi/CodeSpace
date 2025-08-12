import React, { useState } from "react";
import { toast } from "react-toastify";
import { Play, Terminal, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { OutputProps } from '../types';
import axios from "axios";
import { LANGUAGE_VERSIONS } from "../constants";
import { ExecuteCodeResponse } from '../types';

const Output = React.memo<OutputProps>(({ editorRef, language: lang }) => {
  const [output, setOutput] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  const API = axios.create({
    baseURL: "https://emkc.org/api/v2/piston",
  });

  const executeCode = async (sourceCode: string, language: string): Promise<ExecuteCodeResponse> => {
    const res = await API.post("/execute", {
      language: language,
      version: LANGUAGE_VERSIONS[language],
      files: [
        {
          content: sourceCode,
        },
      ],
    });
    return res.data;
  };

  const run = async (): Promise<void> => {
    const code = editorRef.current.getValue();
    if (!code) return;

    try {
      setLoading(true);
      setError(false);
      const { run: result } = await executeCode(code, lang);

      if (result.stderr) {
        setOutput("Error!!\n\n" + result.output);
        setError(true);
      } else {
        setOutput(result.output);
        setError(false);
      }
    } catch (err) {
      console.log(err);
      toast.error("Some Error Occured");
      setOutput("An error occured while running the code.");
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-l border-white/10 h-full px-6 bg-gradient-to-b from-slate-900/50 to-slate-900/80 backdrop-blur-sm flex flex-col">
      <div className="pt-7 mb-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white">Output</h2>
        </div>

        <button
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 group cursor-pointer shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={run}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Run Code
            </>
          )}
        </button>
      </div>

      <div className="flex-1 min-h-0 mb-6">
        <div className="h-full bg-slate-900/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-red-500/80 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500/80 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500/80 rounded-full"></div>
              </div>
              <span className="text-xs text-gray-400 ml-2 font-mono">console</span>
            </div>

            {output && (
              <div className="flex items-center gap-2 text-xs">
                {error ? (
                  <div className="flex items-center gap-1 text-red-400">
                    <AlertCircle className="w-3 h-3" />
                    Error
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-green-400">
                    <CheckCircle className="w-3 h-3" />
                    Success
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto min-h-0">
            <pre className="whitespace-pre-wrap break-words text-sm leading-relaxed">
              {loading ? (
                <div className="flex items-center gap-3 text-blue-400 animate-pulse">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                  <span>Executing your code...</span>
                </div>
              ) : output ? (
                <span className={error ? "text-red-300" : "text-green-300"}>
                  {output}
                </span>
              ) : (
                <div className="text-center py-12">
                  <Terminal className="w-12 h-12 text-gray-600 mx-auto mb-4 opacity-50" />
                  <span className="text-gray-500 text-sm">
                    Click "Run Code" to see the output here.
                  </span>
                </div>
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
});

Output.displayName = 'Output';

export default Output;