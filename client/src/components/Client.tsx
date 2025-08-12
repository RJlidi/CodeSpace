import React from "react";
import { User } from "lucide-react";
import { ClientProps } from '../types';

const Client = React.memo<ClientProps>(({ socketId, username }) => {
  return (
    <div className="flex items-center w-10/12 mx-auto gap-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group">
      <div className="relative">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
            username
          )}&background=random&size=40`}
          alt={`${username} Avatar`}
          className="rounded-xl shadow-lg group-hover:shadow-xl transition-shadow duration-300"
        />
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-slate-900 animate-pulse"></div>
      </div>
      <div className="flex-1 min-w-0">
        <div
          className="text-gray-200 font-medium truncate text-ellipsis overflow-hidden whitespace-nowrap group-hover:text-white transition-colors duration-300"
          title={username}
        >
          {username}
        </div>
        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          Online
        </div>
      </div>
    </div>
  );
});

Client.displayName = 'Client';

export default Client;