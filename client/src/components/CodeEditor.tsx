import React, { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import { useLocation } from "react-router-dom";
import { CodeEditorProps, CursorPosition, CursorData, EditorPageState } from '../types';
import { useDebounce } from '../hooks/useDebounce';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

// User cursor colors
const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
  '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
  '#10AC84', '#EE5A24', '#0984E3', '#A29BFE', '#FD79A8'
];

const CodeEditor: React.FC<CodeEditorProps> = ({ socketRef, roomId, username }) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [code, setCode] = useState<string>(CODE_SNIPPETS["javascript"]);
  const [lang, setLang] = useState<string>("javascript");
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [cursors, setCursors] = useState<Map<string, CursorData>>(new Map());
  const decorations = useRef<Map<string, string[]>>(new Map());
  const colors = useRef<Map<string, string>>(new Map());
  const user = useRef<string | null>(null);
  const isRemote = useRef<boolean>(false);
  const styles = useRef<Set<string>>(new Set());
  const { debounce: debounceFn, cleanup: cleanupDebounce } = useDebounce();
  const { debounce: debounceCursor, cleanup: cleanupCursor } = useDebounce();

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);



  const updateDecorations = (): void => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    decorations.current.forEach((ids) => {
      editor.deltaDecorations(ids, []);
    });
    decorations.current.clear();

    cursors.forEach((data, id) => {
      const { position, username } = data;

      // Get or assign color
      if (!colors.current.has(id)) {
        colors.current.set(id, COLORS[colors.current.size % COLORS.length]!);
      }
      const color = colors.current.get(id)!;

      // Create decoration
      const decoration = {
        range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column),
        options: {
          className: `remote-cursor-${username.replace(/\s+/g, '-')}`,
          beforeContentClassName: 'remote-cursor-before',
          afterContentClassName: 'remote-cursor-after',
          stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
        }
      };

      const ids = editor.deltaDecorations([], [decoration]);
      decorations.current.set(id, ids);
      injectStyles(username, color);
    });
  };

  const injectStyles = (name: string, color: string): void => {
    const id = `cursor-style-${name.replace(/\s+/g, '-')}`;

    if (styles.current.has(id)) return;

    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      .remote-cursor-${name.replace(/\s+/g, '-')}::before {
        content: '';
        position: absolute;
        width: 2px;
        height: 20px;
        background-color: ${color};
        animation: cursor-blink 1s infinite;
        z-index: 1000;
        pointer-events: none;
      }
      
      .remote-cursor-${name.replace(/\s+/g, '-')}::after {
        content: '${name}';
        position: absolute;
        top: -25px;
        left: -2px;
        background-color: ${color};
        color: white;
        font-size: 11px;
        padding: 2px 6px;
        border-radius: 4px;
        white-space: nowrap;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-weight: 500;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        z-index: 1001;
        pointer-events: none;
        opacity: 0.9;
      }
      
      @keyframes cursor-blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0.3; }
      }
    `;
    document.head.appendChild(style);
    styles.current.add(id);
  };

  const location = useLocation();
  useEffect(() => {
    if (!socketRef.current) return;

    user.current = username || (location.state as EditorPageState | null)?.username || 'Anonymous';

    const onCodeChange = ({ code }: { code: string }) => {
      const editor = editorRef.current;
      if (!editor || editor.getValue() === code) return;

      const sel = editor.getSelection();
      isRemote.current = true;
      editor.setValue(code);
      if (sel) editor.setSelection(sel);
    };


    const onCursorChange = ({ socketId, position, username }: { socketId: string, position: CursorPosition, username: string }) => {
      if (socketId === socketRef.current?.id) return;

      setCursors(prev => {
        const next = new Map(prev);
        next.set(socketId, { position, username });
        return next;
      });
    };

    const onDisconnect = ({ socketId, username }: { socketId: string, username: string }) => {
      setCursors(prev => {
        const next = new Map(prev);
        next.delete(socketId);
        return next;
      });

      const ids = decorations.current.get(socketId);
      if (ids && editorRef.current) {
        editorRef.current.deltaDecorations(ids, []);
      }
      decorations.current.delete(socketId);

      if (username) {
        const id = `cursor-style-${username.replace(/\s+/g, '-')}`;
        const el = document.getElementById(id);
        if (el) {
          el.remove();
          styles.current.delete(id);
        }
      }
      colors.current.delete(socketId);
    };

    socketRef.current.on("code-change", onCodeChange);
    socketRef.current.on("language-change", (lang: string) => setLang(lang));
    socketRef.current.on("sync", ({ code, language }: { code?: string, language?: string }) => {
      if (code) {
        isRemote.current = true;
        editorRef.current?.setValue(code);
        setCode(code);
      }
      if (language) setLang(language);
    });
    socketRef.current.on("cursor-change", onCursorChange);
    socketRef.current.on("disconnected", onDisconnect);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("code-change", onCodeChange);
        socketRef.current.off("language-change", (lang: string) => setLang(lang));
        socketRef.current.off("sync");
        socketRef.current.off("cursor-change", onCursorChange);
        socketRef.current.off("disconnected", onDisconnect);
      }

      cleanupDebounce();
      cleanupCursor();
      styles.current.forEach(id => document.getElementById(id)?.remove());
      styles.current.clear();

      if (editorRef.current) {
        decorations.current.forEach((ids) => {
          editorRef.current!.deltaDecorations(ids, []);
        });
      }
      decorations.current.clear();
      colors.current.clear();
      setCursors(new Map());
    };
  }, [socketRef, username, location.state]);

  useEffect(() => {
    updateDecorations();
  }, [cursors]);

  const onMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    editor.focus();

    const emitCursor = debounceCursor((pos: monaco.Position, name: string) => {
      socketRef.current?.emit("cursor-change", {
        roomId,
        position: { lineNumber: pos.lineNumber, column: pos.column },
        username: name
      });
    }, 100);

    editor.onDidChangeCursorPosition((e) => {
      if (isRemote.current) return;
      const name = user.current;
      if (name) emitCursor(e.position, name);
    });

    editor.onDidChangeCursorSelection((e) => {
      if (isRemote.current) return;
      const name = user.current;
      if (name) emitCursor(e.selection.getStartPosition(), name);
    });
  };




  return (
    <div className="flex md:flex-row flex-col h-full bg-darkBg">
      <div className="text-light md:w-1/2 w-full flex flex-col h-full">
        <div className="flex-shrink-0">
          <LanguageSelector
            language={lang}
            onLanguageChange={(lang: string) => {
              setLang(lang);
              const current = editorRef.current?.getValue() || '';
              const isEmpty = current.trim() === '';
              const isDefault = Object.values(CODE_SNIPPETS).includes(current);

              if (isEmpty || isDefault) {
                setCode(CODE_SNIPPETS[lang]);
              }

              socketRef.current?.emit("language-change", { roomId, language: lang });
            }}
          />
        </div>
        <div className="flex-1 min-h-0">
          <Editor
            key={lang}
            height="100%"
            theme="vs-dark"
            language={lang}
            value={code}
            onChange={(val: string | undefined) => {
              if (isRemote.current) {
                isRemote.current = false;
                return;
              }
              if (val !== undefined) {
                setCode(val);
                debounceFn((code: string) => {
                  socketRef.current?.emit("code-change", { roomId, code });
                }, 300)(val);
              }
            }}
            onMount={onMount}
            options={{
              fontSize: 14,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollBeyondLastLine: false,
              readOnly: false,
              automaticLayout: true,
            }}
          />
        </div>
      </div>
      <div className="md:w-1/2 w-full text-light flex flex-col h-full">
        <Output editorRef={editorRef} language={lang} />
      </div>
    </div>
  );
};

export default CodeEditor;