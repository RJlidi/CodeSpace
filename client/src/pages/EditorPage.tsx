import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import StatusBar from "../components/StatusBar";
import LoadingScreen from "../components/LoadingScreen";
import EditorContainer from "../components/EditorContainer";
import {
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import { initSocket } from "../socket";
import { Users } from "lucide-react";
import { Client, EditorPageState } from '../types';
import { Socket } from 'socket.io-client';

const EditorPage: React.FC = () => {
  const socketRef = useRef<Socket | null>(null);
  const location = useLocation();
  const { roomId } = useParams<{ roomId: string }>();
  const [clients, setClients] = useState<Client[]>([]);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [connected, setConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [retries, setRetries] = useState<number>(0);
  const state = location.state as EditorPageState | null;

  useEffect(() => {
    if (state?.username) {
      toast.success(`Room joined as ${state.username}`);
    }
  }, [state?.username]);

  useEffect(() => {
    const init = async () => {
      const onError = (err: any) => {
        console.error("Socket Error ", err);
        setError(err.message || "Connection failed");
        setConnected(false);
        setLoading(false);
        toast.error("Connection failed. Retrying...");
      };

      try {
        setError(null);
        socketRef.current = await initSocket();
        setConnected(true);
        setLoading(false);
        setRetries(0);
        toast.success("Connected successfully!");

        socketRef.current.on("connect_error", onError);
        socketRef.current.on("connect_failed", onError);

        socketRef.current.on("disconnect", () => {
          setConnected(false);
        });

        socketRef.current.on("reconnect", (num: number) => {
          setConnected(true);
          setError(null);
          setRetries(0);
          toast.success(`Reconnected after ${num} attempts!`);
        });

        socketRef.current.on("reconnect_attempt", (num: number) => {
          setRetries(num);
          toast.info(`Reconnecting... (${num}/10)`);
        });

        socketRef.current.on("reconnect_failed", () => {
          toast.error("Failed to reconnect. Please refresh the page.");
          setError("Reconnection failed");
        });

        socketRef.current.emit("join", {
          roomId,
          username: state?.username,
        });

        socketRef.current.on("joined", ({ clients, username, socketId }: { clients: Client[], username: string, socketId: string }) => {
          if (username !== state?.username) {
            toast.success(`${username} has joined.`);
          }
          setClients(clients);
        });

        socketRef.current.on("disconnected", ({ socketId, username }: { socketId: string, username: string }) => {
          toast.success(`${username} left the room.`);
          setClients((prev: Client[]) => {
            return prev.filter((client) => client.socketId !== socketId);
          });
        });
      } catch (err) {
        onError(err);
      }
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.off("joined");
        socketRef.current.off("disconnected");
        socketRef.current.off("connect_error");
        socketRef.current.off("connect_failed");
        socketRef.current.off("disconnect");
        socketRef.current.off("reconnect");
        socketRef.current.off("reconnect_attempt");
        socketRef.current.off("reconnect_failed");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [state]);

  if (!state) {
    return <Navigate to="/" />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-screen overflow-hidden relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" onClick={() => setShowSidebar(false)}>
      <StatusBar
        showSidebar={showSidebar}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        roomId={roomId}
        clientCount={clients.length}
        isConnected={connected}
        reconnectAttempts={retries}
      />

      {/* Sidebar */}
      <div
        className={`md:w-1/5 bg-slate-900/95 backdrop-blur-sm md:relative fixed top-0 left-0 h-screen w-64 transform transition-all duration-300 z-40 border-r border-white/10 flex flex-col ${showSidebar ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sidebar Header */}
        <div className="h-12 flex items-center justify-between px-4 border-b border-white/10 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 flex-shrink-0 mt-12">
          <div className="flex items-center gap-2 text-white">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">Collaborators</span>
          </div>
          <div className="text-xs text-gray-400 bg-white/10 px-2 py-1 rounded">
            {clients.length} online
          </div>
        </div>

        {/* Scrollable Sidebar Content */}
        <div className="flex-1 overflow-y-auto">
          <Sidebar clients={clients} roomId={roomId || ''} />
        </div>
      </div>

      {showSidebar && (
        <div className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30" onClick={() => setShowSidebar(false)} />
      )}

      <EditorContainer
        socketRef={socketRef}
        roomId={roomId || ''}
        username={state?.username}
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-32 h-32 bg-purple-500/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-cyan-500/5 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default EditorPage;