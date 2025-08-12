export interface Client {
  socketId: string;
  username: string;
}

export interface ErrorState {
  username: boolean;
  roomId: boolean;
}

export interface RoomData {
  code?: string;
  language?: string;
}

export interface ErrorState {
  username: boolean;
  roomId: boolean;
}

export interface CursorPosition {
  lineNumber: number;
  column: number;
}

export interface CursorData {
  position: CursorPosition;
  username: string;
}

export interface RemoteCursor extends CursorData {
  socketId: string;
}

export interface ExecuteCodeResult {
  output: string;
  stderr?: string;
}

export interface ExecuteCodeResponse {
  run: ExecuteCodeResult;
}

export interface JoinRoomData {
  roomId: string;
  username: string;
}

export interface CodeChangeData {
  roomId: string;
  code: string;
}

export interface CursorChangeData {
  roomId: string;
  position: CursorPosition;
  username: string;
}

export interface LanguageChangeData {
  roomId: string;
  language: string;
}

export interface JoinedEventData {
  clients: Client[];
  username: string;
  socketId: string;
}

export interface DisconnectedEventData {
  socketId: string;
  username: string;
}

export interface ClientProps {
  socketId: string;
  username: string;
}

export interface SidebarProps {
  clients: Client[];
  roomId: string;
}

export interface CodeEditorProps {
  socketRef: React.MutableRefObject<any>;
  roomId: string;
  username?: string;
}

export interface StatusBarProps {
  showSidebar: boolean;
  onToggleSidebar: () => void;
  roomId?: string;
  clientCount: number;
  isConnected: boolean;
  reconnectAttempts: number;
}


export interface OutputProps {
  editorRef: React.MutableRefObject<any>;
  language: string;
}

export interface LanguageSelectorProps {
  language: string;
  onLanguageChange: (language: string) => void;
}

export interface EditorPageState {
  username: string;
}

export interface LanguageVersions {
  [key: string]: string;
}

export interface CodeSnippets {
  [key: string]: string;
}