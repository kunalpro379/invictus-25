import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  X, 
  Send, 
  Upload, 
  User, 
  Loader2, 
  MessageSquare, 
  FileText,
  Trash2,
  Download,
  Maximize2, 
  Minimize2, 
  History, 
  PanelLeftClose, 
  PanelLeftOpen
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import FileUpload from './FileUpload';
import axios from 'axios';

const AiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => localStorage.getItem('aiSessionId') || uuidv4());
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadContext, setUploadContext] = useState('');
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConversations, setShowConversations] = useState(false);
  const [pastConversations, setPastConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(sessionId);

  // Initialize session
  useEffect(() => {
    localStorage.setItem('aiSessionId', sessionId);
    loadChatHistory();
  }, [sessionId]);

  // Auto scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load past conversations
  useEffect(() => {
    const loadPastConversations = () => {
      const conversations = Object.keys(localStorage)
        .filter(key => key.startsWith('chat_'))
        .map(key => ({
          id: key.replace('chat_', ''),
          messages: JSON.parse(localStorage.getItem(key) || '[]'),
          lastMessage: new Date(JSON.parse(localStorage.getItem(key) || '[]')[0]?.timestamp || Date.now())
        }))
        .sort((a, b) => b.lastMessage - a.lastMessage);
      setPastConversations(conversations);
    };
    loadPastConversations();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      // Load messages from localStorage
      const savedMessages = localStorage.getItem(`chat_${sessionId}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }

      // Load papers from server
      const response = await axios.get(`http://localhost:5000/api/list_papers`, {
        params: { session_id: sessionId }
      });
      
      if (response.data.papers) {
        setFiles(response.data.papers.map(paper => ({
          id: paper.paper_id,
          name: paper.filename,
          uploadTime: paper.upload_time
        })));
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
      addMessage({
        type: 'error',
        content: 'Error loading chat history'
      });
    }
  };

  const handleFileUpload = async (event) => {
    const uploadedFiles = Array.from(event.target.files);
    setIsLoading(true);

    try {
      // Create FormData for upload
      const formData = new FormData();
      uploadedFiles.forEach(file => {
        formData.append('files', file);
      });
      formData.append('title', uploadTitle);
      formData.append('context', uploadContext);
      formData.append('sessionId', sessionId);

      // Upload files to server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Upload failed');

      const result = await response.json();

      // Add files to state
      const newFiles = uploadedFiles.map(file => ({
        id: uuidv4(),
        name: file.name,
        size: file.size,
        uploadTime: new Date().toISOString(),
        title: uploadTitle,
        context: uploadContext
      }));

      setFiles(prev => {
        const updated = [...prev, ...newFiles];
        localStorage.setItem(`files_${sessionId}`, JSON.stringify(updated));
        return updated;
      });

      // Add success message to chat
      addMessage({
        type: 'system',
        content: `Successfully uploaded ${uploadedFiles.length} file(s)`,
        files: newFiles
      });

      // Clear upload form
      setUploadTitle('');
      setUploadContext('');
      event.target.value = null;

    } catch (error) {
      console.error('Upload error:', error);
      addMessage({
        type: 'error',
        content: `Upload failed: ${error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: uuidv4(),
      type: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => {
      const updated = [...prev, userMessage];
      localStorage.setItem(`chat_${sessionId}`, JSON.stringify(updated));
      return updated;
    });
    setInput('');
    setIsLoading(true);

    try {
      // Send message to AI endpoint
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: input,
        session_id: sessionId
      });

      // Add AI response to chat
      const aiMessage = {
        id: uuidv4(),
        type: 'assistant',
        content: response.data.response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => {
        const updated = [...prev, aiMessage];
        localStorage.setItem(`chat_${sessionId}`, JSON.stringify(updated));
        return updated;
      });

    } catch (error) {
      console.error('Chat error:', error);
      addMessage({
        type: 'error',
        content: `Error: ${error.response?.data?.error || error.message}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addMessage = (message) => {
    setMessages(prev => {
      const updated = [...prev, { ...message, id: uuidv4(), timestamp: new Date().toISOString() }];
      localStorage.setItem(`chat_${sessionId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const clearSession = async () => {
    try {
      await axios.post('http://localhost:5000/api/clear_session', {
        session_id: sessionId
      });
      
      localStorage.removeItem(`chat_${sessionId}`);
      localStorage.removeItem(`files_${sessionId}`);
      setMessages([]);
      setFiles([]);
      setInput('');
      const newSessionId = uuidv4();
      localStorage.setItem('aiSessionId', newSessionId);
    } catch (error) {
      console.error('Error clearing session:', error);
      addMessage({
        type: 'error',
        content: 'Error clearing session'
      });
    }
  };

  const downloadChatHistory = () => {
    const history = messages.map(m => {
      return `[${new Date(m.timestamp).toLocaleString()}] ${m.type}: ${m.content}`;
    }).join('\n');
    
    const blob = new Blob([history], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${sessionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isOpen ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed ${
            isExpanded 
              ? 'inset-0' // Full screen mode
              : 'bottom-4 right-4 w-[95vw] md:w-[600px] lg:w-[800px] h-[80vh]' // Normal mode
          } bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-200/50 flex flex-col overflow-hidden`}
        >
          {/* Header */}
          <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Bot className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold tracking-tight">AI Research Assistant</h3>
                <p className="text-sm text-blue-100 font-medium">Always here to help</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                className="hover:bg-white/20 text-white h-10 w-10"
              >
                {isExpanded ? 
                  <Minimize2 className="h-5 w-5" /> : 
                  <Maximize2 className="h-5 w-5" />
                }
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 text-white h-10 w-10"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Always Visible Past Conversations Sidebar */}
            <div className={`${
              isExpanded ? 'w-80' : 'hidden lg:flex w-72'
            } border-r border-gray-100 flex-shrink-0 flex flex-col bg-gray-50/50`}>
              <div className="p-4 border-b bg-white/50 backdrop-blur-sm">
                <h4 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
                  <History className="h-5 w-5" />
                  Conversations
                </h4>
              </div>
              <ScrollArea className="flex-1 p-4">
                {pastConversations.length > 0 ? (
                  <div className="space-y-3">
                    {pastConversations.map((conv) => (
                      <Button
                        key={conv.id}
                        variant={currentConversationId === conv.id ? "secondary" : "ghost"}
                        className={`w-full justify-start text-left p-4 rounded-xl transition-all ${
                          currentConversationId === conv.id 
                            ? 'bg-blue-50 text-blue-700 hover:bg-blue-100' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => {
                          setCurrentConversationId(conv.id);
                          setMessages(conv.messages);
                        }}
                      >
                        <div className="truncate">
                          <div className="font-medium text-base mb-1">
                            {new Date(conv.lastMessage).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-500 truncate leading-relaxed">
                            {conv.messages[0]?.content || 'New Conversation'}
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-base font-medium text-gray-600 mb-1">No conversations yet</h3>
                    <p className="text-sm text-gray-500">Start chatting to create a new conversation</p>
                  </div>
                )}
              </ScrollArea>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
              <Tabs defaultValue="chat" className="h-full flex flex-col">
                <TabsList className="px-4 py-2 border-b bg-white flex-shrink-0">
                  <TabsTrigger value="chat" className="flex gap-2 items-center data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                    <MessageSquare className="h-4 w-4" />
                    Chat
                  </TabsTrigger>
                  <TabsTrigger value="files" className="flex gap-2 items-center data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                    <FileText className="h-4 w-4" />
                    Files ({files.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden">
                  {/* Messages Area */}
                  <div className="flex-1 overflow-y-auto">
                    <div className="h-full p-4 space-y-6">
                      {messages.map((message) => (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={message.id}
                          className={`flex gap-4 mb-6 ${
                            message.type === 'user' ? 'justify-end' : ''
                          }`}
                        >
                          {message.type !== 'user' && (
                            <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-lg">AI</AvatarFallback>
                              <AvatarImage src="/ai-avatar.png" />
                            </Avatar>
                          )}
                          <div
                            className={`rounded-2xl p-5 max-w-[80%] shadow-md ${
                              message.type === 'user'
                                ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white text-[15px] leading-relaxed'
                                : message.type === 'error'
                                ? 'bg-red-50 text-red-600 border border-red-100'
                                : message.type === 'system'
                                ? 'bg-gray-100 text-gray-600'
                                : 'bg-white border border-gray-100 text-[15px] leading-relaxed'
                            }`}
                          >
                            {message.content}
                            {message.files && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {message.files.map(file => (
                                  <Badge key={file.id} variant="secondary" className="bg-white/20 text-white px-3 py-1 text-sm">
                                    {file.name}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                          {message.type === 'user' && (
                            <Avatar className="h-10 w-10 border-2 border-white shadow-md">
                              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-purple-600 text-white text-lg">ME</AvatarFallback>
                              <AvatarImage src="/user-avatar.png" />
                            </Avatar>
                          )}
                        </motion.div>
                      ))}
                    </div>
                    <div ref={chatEndRef} />
                  </div>

                  {/* Chat Input - Fixed at bottom */}
                  <div className="p-4 border-t bg-white mt-auto">
                    <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
                      <div className="relative flex items-center">
                        <Input
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder="Type your message..."
                          disabled={isLoading}
                          className="pr-28 py-6 rounded-xl border-gray-200 focus:border-blue-300 focus:ring focus:ring-blue-200 transition-all text-base shadow-sm"
                        />
                        <Button 
                          type="submit" 
                          disabled={isLoading || !input.trim()}
                          className="absolute right-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg px-5 py-5"
                        >
                          {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <Send className="h-5 w-5" />
                          )}
                        </Button>
                      </div>
                    </form>
                  </div>
                </TabsContent>

                <TabsContent value="files" className="flex-1 p-4 lg:p-6 overflow-hidden flex flex-col">
                  <div className="max-w-3xl mx-auto w-full">
                    <FileUpload 
                      sessionId={sessionId}  // Pass the sessionId prop
                      onUploadComplete={(result) => {
                        if (result.success) {
                          const newFile = {
                            id: uuidv4(),
                            name: result.filename,
                            uploadTime: new Date().toISOString(),
                            url: result.url
                          };
                          
                          setFiles(prev => {
                            const updated = [...prev, newFile];
                            localStorage.setItem(`files_${sessionId}`, JSON.stringify(updated));
                            return updated;
                          });

                          // Reload papers list after upload
                          loadChatHistory();  // Add this line to refresh papers list

                          addMessage({
                            type: 'system',
                            content: `Successfully uploaded and processed ${result.filename}`,
                            files: [newFile]
                          });
                        }
                      }}
                    />
                    
                    {/* File List */}
                    <ScrollArea className="flex-1 mt-6">
                      <div className="space-y-2">
                        {files.map((file) => (
                          <div
                            key={file.id}
                            className="p-3 rounded-lg border bg-gray-50 flex justify-between items-center"
                          >
                            <div>
                              <p className="font-medium">{file.name}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(file.uploadTime).toLocaleString()}
                              </p>
                              {file.url && (
                                <a 
                                  href={file.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-xs text-blue-500 hover:text-blue-600"
                                >
                                  View PDF
                                </a>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setFiles(files.filter(f => f.id !== file.id));
                                localStorage.setItem(
                                  `files_${sessionId}`,
                                  JSON.stringify(files.filter(f => f.id !== file.id))
                                );
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t flex justify-between items-center bg-white/50 backdrop-blur-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSession}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 text-sm font-medium"
            >
              Clear Session
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadChatHistory}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 text-sm font-medium"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Chat
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.95 }}
          transition={{ 
            type: "spring",
            stiffness: 260,
            damping: 20 
          }}
        >
          <Button
            onClick={() => setIsOpen(true)}
            className="group relative rounded-full h-24 w-24 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 p-0 flex flex-col items-center justify-center gap-1"
          >
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <Bot className="h-10 w-10 animate-bounce" style={{ animationDuration: '2s' }} />
            <span className="text-sm font-bold">Ask AI</span>
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default AiAssistant;