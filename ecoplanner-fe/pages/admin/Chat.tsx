import React, { useState, useEffect } from 'react';
import { Search, MoreVertical, Bot, Loader2, User, Eye } from 'lucide-react';
import { api } from '../../services/api';

// Parse markdown bold (**text**) to HTML
const parseMarkdown = (text: string) => {
   return text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
};

interface Message {
   id: string;
   content: string;
   sender: 'USER' | 'AI' | 'ADMIN';
   createdAt: string;
}

interface Conversation {
   id: string;
   status: string;
   user: { id: string; name: string; email: string };
   messages: Message[];
   createdAt: string;
   updatedAt: string;
}

const AdminChat: React.FC = () => {
   const [conversations, setConversations] = useState<Conversation[]>([]);
   const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
   const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
      loadConversations();
   }, []);

   const loadConversations = async () => {
      try {
         setIsLoading(true);
         const data = await api.getConversations();
         setConversations(data);
         if (data.length > 0) {
            setSelectedConv(data[0]);
         }
      } catch (error) {
         console.error('Failed to load conversations:', error);
      } finally {
         setIsLoading(false);
      }
   };

   const formatTime = (date: string) => {
      const d = new Date(date);
      return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
   };

   const formatTimeAgo = (date: string) => {
      const diff = Date.now() - new Date(date).getTime();
      const minutes = Math.floor(diff / 60000);
      if (minutes < 60) return `${minutes}p`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h`;
      return `${Math.floor(hours / 24)}d`;
   };

   if (isLoading) {
      return (
         <div className="flex h-full w-full items-center justify-center bg-[#162013]">
            <Loader2 className="w-8 h-8 animate-spin text-green-500" />
            <span className="ml-2 text-gray-400">Đang tải tin nhắn...</span>
         </div>
      );
   }

   return (
      <div className="flex h-full w-full bg-[#162013] text-white">
         {/* Left Sidebar - Thread List */}
         <div className="w-80 lg:w-96 flex flex-col border-r border-[#2e4328] bg-[#1a2e24]/80 backdrop-blur-xl">
            <div className="p-6 pb-2">
               <h2 className="text-2xl font-bold mb-6 font-display">Messages</h2>
               <div className="relative w-full mb-4">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" placeholder="Search threads..." className="w-full bg-[#2e4328] border-none rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-400 focus:ring-1 focus:ring-green-500 text-sm" />
               </div>
               <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
                  {['All', 'Active', 'Resolved'].map((tab, i) => (
                     <button key={tab} className={`px-4 py-1.5 text-xs font-medium rounded-full whitespace-nowrap ${i === 0 ? 'bg-[#53d22d] text-black font-bold' : 'bg-[#2e4328] text-gray-300'}`}>{tab}</button>
                  ))}
               </div>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
               {conversations.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                     <p>Chưa có cuộc hội thoại nào</p>
                  </div>
               ) : conversations.map((conv) => (
                  <div
                     key={conv.id}
                     onClick={() => setSelectedConv(conv)}
                     className={`flex items-start gap-3 p-4 rounded-2xl cursor-pointer ${selectedConv?.id === conv.id ? 'bg-[#2e4328]/60 border border-green-500/20' : 'hover:bg-[#2e4328]/40'}`}
                  >
                     <div className="relative shrink-0">
                        <div className="w-12 h-12 rounded-full bg-[#2e4328] flex items-center justify-center">
                           <User className="w-6 h-6 text-gray-400" />
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#162013] ${conv.status === 'ACTIVE' ? 'bg-orange-500' : 'bg-gray-500'}`}></div>
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                           <h3 className="font-semibold text-sm truncate">{conv.user.name || conv.user.email}</h3>
                           <span className="text-xs text-green-400 font-medium">{formatTimeAgo(conv.updatedAt)}</span>
                        </div>
                        <p className="text-gray-300 text-xs line-clamp-2">
                           {conv.messages[conv.messages.length - 1]?.content || 'Cuộc hội thoại mới'}
                        </p>
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Main Chat Area */}
         <div className="flex-1 flex flex-col bg-[#0f160d]/50 relative">
            {selectedConv ? (
               <>
                  <header className="h-20 px-6 flex items-center justify-between border-b border-[#2e4328] bg-[#162013]/95 backdrop-blur z-10">
                     <div className="flex items-center gap-4">
                        <h2 className="text-lg font-bold">{selectedConv.user.name || selectedConv.user.email}</h2>
                        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${selectedConv.status === 'ACTIVE' ? 'bg-green-900/30 border-green-800/50' : 'bg-gray-900/30 border-gray-800/50'}`}>
                           <div className={`w-2 h-2 rounded-full ${selectedConv.status === 'ACTIVE' ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></div>
                           <span className={`text-xs font-medium ${selectedConv.status === 'ACTIVE' ? 'text-green-500' : 'text-gray-500'}`}>
                              {selectedConv.status === 'ACTIVE' ? 'Active' : 'Resolved'}
                           </span>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#2e4328] text-gray-400"><MoreVertical className="w-5 h-5" /></button>
                     </div>
                  </header>

                  <div className="flex-1 overflow-y-auto p-6 space-y-6">
                     <div className="flex justify-center"><span className="px-3 py-1 rounded-full bg-[#2e4328] text-[10px] font-medium text-gray-400 uppercase tracking-widest">
                        {new Date(selectedConv.createdAt).toLocaleDateString('vi-VN')}
                     </span></div>

                     {selectedConv.messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 max-w-[80%] ${msg.sender === 'USER' ? 'justify-start' : 'justify-end ml-auto'}`}>
                           {msg.sender === 'USER' && (
                              <div className="w-8 h-8 rounded-full bg-[#2e4328] flex items-center justify-center shrink-0">
                                 <User className="w-4 h-4 text-gray-400" />
                              </div>
                           )}
                           <div className="flex flex-col items-start gap-1">
                              <div className={`p-4 rounded-2xl text-sm ${msg.sender === 'USER'
                                 ? 'bg-[#2a2a2a] text-white rounded-tl-sm'
                                 : msg.sender === 'AI'
                                    ? 'bg-[#2e4328] border border-white/5 text-gray-200 rounded-tr-sm'
                                    : 'bg-[#53d22d] text-black font-medium rounded-tr-sm shadow-lg shadow-green-500/10'
                                 }`}
                                 dangerouslySetInnerHTML={msg.sender !== 'USER' ? { __html: parseMarkdown(msg.content) } : undefined}
                              >
                                 {msg.sender === 'USER' ? msg.content : null}
                              </div>
                              <span className="text-[10px] text-gray-500 ml-1">
                                 {msg.sender === 'AI' ? 'AI Assistant' : msg.sender === 'ADMIN' ? 'Admin' : 'User'} • {formatTime(msg.createdAt)}
                              </span>
                           </div>
                           {msg.sender !== 'USER' && (
                              <div className="w-8 h-8 rounded-full bg-[#2e4328] flex items-center justify-center border border-white/10 shrink-0">
                                 {msg.sender === 'AI' ? <Bot className="w-4 h-4 text-green-500" /> : <User className="w-4 h-4 text-green-500" />}
                              </div>
                           )}
                        </div>
                     ))}
                  </div>

                  {/* View-only notice */}
                  <div className="p-4 bg-[#162013] border-t border-[#2e4328]">
                     <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                        <Eye className="w-4 h-4" />
                        <span>Chế độ xem - Admin không can thiệp chat AI</span>
                     </div>
                  </div>
               </>
            ) : (
               <div className="flex-1 flex items-center justify-center text-gray-500">
                  <p>Chọn một cuộc hội thoại để xem</p>
               </div>
            )}
         </div>
      </div>
   );
};

export default AdminChat;