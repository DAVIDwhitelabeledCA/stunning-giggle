import { useState, useEffect, useRef } from "react";
import { FrontendUser } from "@shared/schema";
import { MessageCircle, Send, Users, Hash, Plus, Search, ArrowLeft } from "lucide-react";

interface ChatProps {
  user: FrontendUser;
}

export default function Chat({ user }: ChatProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<number | null>(1);
  const [newMessage, setNewMessage] = useState("");
  const [showRoomList, setShowRoomList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sample chat rooms with realistic data
  const chatRooms = [
    {
      id: 1,
      name: "General Discussion",
      description: "Company-wide conversations and announcements",
      memberCount: 45,
      lastActivity: "2 min ago",
      color: "bg-blue-500",
      isOnline: true
    },
    {
      id: 2,
      name: "Engineering Team",
      description: "Technical discussions and development updates",
      memberCount: 15,
      lastActivity: "5 min ago",
      color: "bg-green-500",
      isOnline: true
    },
    {
      id: 3,
      name: "Marketing & Sales",
      description: "Campaign planning and sales coordination",
      memberCount: 12,
      lastActivity: "1 hour ago",
      color: "bg-purple-500",
      isOnline: false
    },
    {
      id: 4,
      name: "Project Alpha",
      description: "Development discussion for Project Alpha",
      memberCount: 8,
      lastActivity: "3 hours ago",
      color: "bg-orange-500",
      isOnline: false
    }
  ];

  // Sample messages for the selected room
  const getMessagesForRoom = (roomId: number) => {
    const messagesByRoom = {
      1: [
        {
          id: 1,
          senderId: "user-1",
          senderName: "Sarah Johnson",
          senderAvatar: "SJ",
          message: "Good morning everyone! Hope everyone had a great weekend.",
          timestamp: new Date(Date.now() - 5 * 60 * 1000),
          isCurrentUser: false
        },
        {
          id: 2,
          senderId: user.id,
          senderName: `${user.firstName} ${user.lastName}`,
          senderAvatar: `${user.firstName[0]}${user.lastName[0]}`,
          message: "Morning Sarah! Yes, it was great. Ready for the week ahead.",
          timestamp: new Date(Date.now() - 3 * 60 * 1000),
          isCurrentUser: true
        },
        {
          id: 3,
          senderId: "user-2",
          senderName: "Mike Chen",
          senderAvatar: "MC",
          message: "Don't forget we have the quarterly review meeting at 2 PM today.",
          timestamp: new Date(Date.now() - 2 * 60 * 1000),
          isCurrentUser: false
        }
      ],
      2: [
        {
          id: 4,
          senderId: "user-3",
          senderName: "Jessica Davis",
          senderAvatar: "JD",
          message: "The deployment went smoothly this morning. All systems are green.",
          timestamp: new Date(Date.now() - 10 * 60 * 1000),
          isCurrentUser: false
        },
        {
          id: 5,
          senderId: "user-4",
          senderName: "Alex Rodriguez",
          senderAvatar: "AR",
          message: "Great work on the optimization! Performance improvements are noticeable.",
          timestamp: new Date(Date.now() - 8 * 60 * 1000),
          isCurrentUser: false
        }
      ],
      3: [
        {
          id: 6,
          senderId: "user-5",
          senderName: "Lisa Thompson",
          senderAvatar: "LT",
          message: "The Q1 campaign results are in - we exceeded our targets by 25%!",
          timestamp: new Date(Date.now() - 60 * 60 * 1000),
          isCurrentUser: false
        }
      ],
      4: [
        {
          id: 7,
          senderId: "user-6",
          senderName: "David Kim",
          senderAvatar: "DK",
          message: "I've updated the project timeline. We're still on track for the March release.",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          isCurrentUser: false
        }
      ]
    };
    return messagesByRoom[roomId as keyof typeof messagesByRoom] || [];
  };

  const [messages, setMessages] = useState(getMessagesForRoom(selectedRoomId || 1));

  useEffect(() => {
    if (selectedRoomId) {
      setMessages(getMessagesForRoom(selectedRoomId));
    }
  }, [selectedRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedRoomId) return;

    const newMsg = {
      id: messages.length + 1,
      senderId: user.id,
      senderName: `${user.firstName} ${user.lastName}`,
      senderAvatar: `${user.firstName[0]}${user.lastName[0]}`,
      message: newMessage.trim(),
      timestamp: new Date(),
      isCurrentUser: true
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const selectedRoom = chatRooms.find(room => room.id === selectedRoomId);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      {/* Mobile Room List Overlay */}
      <div className={`fixed inset-0 z-50 bg-white dark:bg-gray-800 transform transition-transform lg:hidden ${showRoomList ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Chat Rooms List */}
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h1 className="text-lg font-bold">Team Chat</h1>
                  <p className="text-green-100 text-sm">{chatRooms.length} conversations</p>
                </div>
              </div>
              <button 
                onClick={() => setShowRoomList(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-white hover:bg-opacity-20"
              >
                <ArrowLeft size={20} />
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Room List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {chatRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => {
                  setSelectedRoomId(room.id);
                  setShowRoomList(false);
                }}
                className={`w-full p-4 rounded-2xl text-left transition-all ${
                  selectedRoomId === room.id
                    ? 'bg-primary text-white mobile-shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 card-depth'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${selectedRoomId === room.id ? 'bg-white bg-opacity-20' : room.color} rounded-xl flex items-center justify-center mobile-shadow`}>
                    <Hash size={20} className={selectedRoomId === room.id ? 'text-white' : 'text-white'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm truncate">{room.name}</h3>
                      <div className="flex items-center space-x-1">
                        {room.isOnline && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                        <span className="text-xs opacity-75">{room.lastActivity}</span>
                      </div>
                    </div>
                    <p className="text-xs opacity-75 truncate">{room.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Users size={12} className="opacity-75" />
                      <span className="text-xs opacity-75">{room.memberCount} members</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-80 bg-white dark:bg-gray-800 card-depth">
        {/* Same content as mobile but always visible */}
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary to-primary-dark text-white p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <MessageCircle size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold">Team Chat</h1>
                <p className="text-green-100 text-sm">{chatRooms.length} conversations</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Room List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {chatRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className={`w-full p-4 rounded-2xl text-left transition-all ${
                  selectedRoomId === room.id
                    ? 'bg-primary text-white mobile-shadow-lg'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 card-depth'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${selectedRoomId === room.id ? 'bg-white bg-opacity-20' : room.color} rounded-xl flex items-center justify-center mobile-shadow`}>
                    <Hash size={20} className={selectedRoomId === room.id ? 'text-white' : 'text-white'} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm truncate">{room.name}</h3>
                      <div className="flex items-center space-x-1">
                        {room.isOnline && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                        <span className="text-xs opacity-75">{room.lastActivity}</span>
                      </div>
                    </div>
                    <p className="text-xs opacity-75 truncate">{room.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Users size={12} className="opacity-75" />
                      <span className="text-xs opacity-75">{room.memberCount} members</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <>
            {/* Chat Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 card-depth">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => setShowRoomList(true)}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Hash size={20} className="text-gray-600 dark:text-gray-400" />
                  </button>
                  <div className={`w-10 h-10 ${selectedRoom.color} rounded-xl flex items-center justify-center mobile-shadow`}>
                    <Hash size={20} className="text-white" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-800 dark:text-white">{selectedRoom.name}</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedRoom.memberCount} members</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${selectedRoom.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedRoom.isOnline ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start space-x-3 ${message.isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm mobile-shadow ${
                    message.isCurrentUser ? 'bg-primary' : 'bg-gray-500'
                  }`}>
                    {message.senderAvatar}
                  </div>
                  <div className={`flex-1 max-w-xs lg:max-w-md ${message.isCurrentUser ? 'text-right' : ''}`}>
                    <div className={`inline-block p-3 rounded-2xl ${
                      message.isCurrentUser 
                        ? 'bg-primary text-white rounded-br-md' 
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-md card-depth'
                    }`}>
                      {!message.isCurrentUser && (
                        <p className="text-xs font-medium mb-1 opacity-75">{message.senderName}</p>
                      )}
                      <p className="text-sm leading-relaxed">{message.message}</p>
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${message.isCurrentUser ? 'text-right' : ''}`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full p-3 pr-12 bg-gray-100 dark:bg-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-primary text-white rounded-xl hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors button-depth"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MessageCircle size={32} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Select a Conversation</h3>
              <p className="text-gray-600 dark:text-gray-400">Choose a chat room to start messaging your team.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
