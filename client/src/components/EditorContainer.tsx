import React from "react";
import CodeEditor from "./CodeEditor";
import { Socket } from 'socket.io-client';

interface EditorContainerProps {
  socketRef: React.RefObject<Socket | null>;
  roomId: string;
  username?: string;
}

const EditorContainer: React.FC<EditorContainerProps> = ({
  socketRef,
  roomId,
  username
}) => {
  return (
    <div className="md:w-4/5 w-full h-screen relative">
      <div className="h-[calc(100vh-3rem)] bg-slate-900/50 backdrop-blur-sm border border-white/5 m-2 mt-14 rounded-xl overflow-hidden shadow-2xl">
        <div className="h-full relative flex flex-col">
          <div className="h-10 bg-gradient-to-r from-slate-800/80 to-slate-700/80 backdrop-blur-sm border-b border-white/10 flex items-center px-4 flex-shrink-0">
            <div className="flex items-center gap-2 text-gray-300">
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-red-500/80 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500/80 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500/80 rounded-full"></div>
              </div>
              <span className="text-xs ml-4 font-mono">main.js</span>
            </div>
          </div>

          <div className="flex-1 min-h-0">
            <CodeEditor
              socketRef={socketRef}
              roomId={roomId}
              username={username}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorContainer;