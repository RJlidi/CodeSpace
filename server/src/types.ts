export interface Client {
  socketId: string;
  username: string;
}

export interface RoomData {
  code?: string;
  language?: string;
}

export interface UserSocketMap {
  [socketId: string]: string;
}

export interface RoomDataMap {
  [roomId: string]: RoomData;
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
  position: any;
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

export interface ServerToClientEvents {
  "sync": (data: RoomData) => void;
  "joined": (data: JoinedEventData) => void;
  "disconnected": (data: DisconnectedEventData) => void;
  "code-change": (data: { code: string }) => void;
  "cursor-change": (data: { socketId: string; position: any; username: string }) => void;
  "language-change": (data: { language: string }) => void;
}

export interface ClientToServerEvents {
  "join": (data: JoinRoomData) => void;
  "code-change": (data: CodeChangeData) => void;
  "cursor-change": (data: CursorChangeData) => void;
  "language-change": (data: LanguageChangeData) => void;
}

export interface InterServerEvents { }

export interface SocketData {
  username?: string;
  roomId?: string;
}