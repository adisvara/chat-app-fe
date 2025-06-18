// Messages.tsx
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

// Type definitions
interface Message {
    id: number;
    text: string;
    sender: string;
    timestamp: string;
    isOwn: boolean;
    type: 'system' | 'chat';
}

interface LocationState {
    roomName: string;
}

interface WebSocketMessage {
    type: 'join' | 'chat';
    payload: {
        roomId?: string;
        message?: string;
    };
}

interface ServerMessage {
    type: 'system' | 'chat';
    message: string;
    sender: string;
    timestamp: string;
    isOwn: boolean;
}

export const Messages: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const wsRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    
    // Get room name from navigation state with type safety
    const locationState = location.state as LocationState | null;
    const roomName: string = locationState?.roomName || 'Unknown Room';
    
    // Auto scroll to bottom when new messages arrive
    const scrollToBottom = (): void => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    
    useEffect(() => {
        scrollToBottom();
    }, [messages]);
    
    // WebSocket connection effect
    useEffect(() => {
        if (!locationState?.roomName) {
            console.log('No room name provided');
            return;
        }
        
        // Create WebSocket connection
        console.log('Attempting to connect to WebSocket server...');
        const ws = new WebSocket('ws://localhost:8080');
        wsRef.current = ws;
        
        ws.onopen = (): void => {
            console.log('Successfully connected to WebSocket server');
            setIsConnected(true);
            
            // Join the room
            const joinMessage: WebSocketMessage = {
                type: 'join',
                payload: {
                    roomId: roomName
                }
            };
            console.log('Sending join message:', joinMessage);
            ws.send(JSON.stringify(joinMessage));
        };
        
        ws.onmessage = (event: MessageEvent<string>): void => {
            console.log('Raw message received:', event.data);
            try {
                // Parse the structured message from server
                const serverMessage: ServerMessage = JSON.parse(event.data);
                console.log('Parsed server message:', serverMessage);
                
                // Add message to chat
                setMessages(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    text: serverMessage.message,
                    sender: serverMessage.sender,
                    timestamp: new Date(serverMessage.timestamp).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    }),
                    isOwn: serverMessage.isOwn,
                    type: serverMessage.type
                }]);
            } catch (error) {
                console.error('Error parsing message:', error);
                console.error('Raw message was:', event.data);
                // Fallback for plain text messages (backward compatibility)
                setMessages(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    text: event.data,
                    sender: event.data.includes('You have joined') ? 'System' : 'User',
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isOwn: event.data.includes('You have joined'),
                    type: event.data.includes('joined') || event.data.includes('left') ? 'system' : 'chat'
                }]);
            }
        };
        
        // Handle WebSocket errors
        ws.onerror = (error: Event): void => {
            console.error('WebSocket error occurred:', error);
            setIsConnected(false);
            // Show error in messages
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: 'Connection error occurred. Please try refreshing the page.',
                sender: 'System',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOwn: false,
                type: 'system'
            }]);
        };
        
        ws.onclose = (event: CloseEvent): void => {
            console.log('WebSocket connection closed:', event.code, event.reason);
            setIsConnected(false);
            // Show disconnection in messages
            setMessages(prev => [...prev, {
                id: Date.now(),
                text: 'Disconnected from chat server.',
                sender: 'System',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isOwn: false,
                type: 'system'
            }]);
        };
        
        // Cleanup on component unmount
        return (): void => {
            console.log('Component unmounting, closing WebSocket connection');
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [roomName, locationState?.roomName]);
    
    // Send message function with improved error handling
    const sendMessage = (): void => {
        if (!inputMessage.trim()) {
            console.log('Empty message, not sending');
            return;
        }
        
        if (!wsRef.current) {
            console.error('No WebSocket connection available');
            return;
        }
        
        if (wsRef.current.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not in OPEN state:', wsRef.current.readyState);
            return;
        }
        
        // Send message to WebSocket server
        const chatMessage: WebSocketMessage = {
            type: 'chat',
            payload: {
                message: inputMessage
            }
        };
        console.log('Sending chat message:', chatMessage);
        wsRef.current.send(JSON.stringify(chatMessage));
        
        // Clear input
        setInputMessage('');
    };
    
    // Handle Enter key press
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };
    
    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setInputMessage(e.target.value);
    };
    
    // Handle navigation back to rooms
    const handleBackToRooms = (): void => {
        navigate('/');
    };
    
    // If no room name in state, redirect back to room selection
    if (!locationState?.roomName) {
        return (
            <div className="p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>No room selected. Please select a room first.</p>
                </div>
                <button 
                    onClick={handleBackToRooms}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Back to Room Selection
                </button>
            </div>
        );
    }
    
    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                        {roomName}
                    </h1>
                    <div className="flex items-center mt-2">
                        <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-sm ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                            {isConnected ? 'Connected' : 'Disconnected'}
                        </span>
                    </div>
                </div>
                <button 
                    onClick={handleBackToRooms}
                    className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                    ← Back to Rooms
                </button>
            </div>
            
            {/* Chat Messages Area */}
            <div className="bg-white border rounded-lg shadow-sm mb-4">
                <div className="border-b p-4 bg-gray-50">
                    <h2 className="font-semibold text-gray-700">Chat Messages</h2>
                </div>
                <div className="p-4 h-96 overflow-y-auto">
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-500 mt-20">
                            <p>No messages yet. Start the conversation!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((message: Message) => (
                                <div key={message.id} className={`flex flex-col space-y-1 ${message.type === 'system' ? 'items-center' : message.isOwn ? 'items-end' : 'items-start'}`}>
                                    {message.type === 'system' ? (
                                        <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm">
                                            {message.text}
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex items-center space-x-2">
                                                {!message.isOwn && <span className="font-semibold text-blue-600">{message.sender}</span>}
                                                <span className="text-xs text-gray-500">{message.timestamp}</span>
                                                {message.isOwn && <span className="font-semibold text-purple-600">You</span>}
                                            </div>
                                            <div className={`p-3 rounded-lg max-w-md ${message.isOwn ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}>
                                                <p>{message.text}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>
            </div>
            
            {/* Message Input */}
            <div className="bg-white border rounded-lg shadow-sm">
                <div className="p-4">
                    <div className="flex space-x-2">
                        <input 
                            type="text" 
                            value={inputMessage}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder={`Type a message to ${roomName}...`}
                            disabled={!isConnected}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        <button 
                            onClick={sendMessage}
                            disabled={!isConnected || !inputMessage.trim()}
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            Send
                        </button>
                    </div>
                    {!isConnected && (
                        <p className="text-red-500 text-sm mt-2">
                            Disconnected from server. Please refresh the page to reconnect.
                        </p>
                    )}
                </div>
            </div>
            
            {/* Room Info */}
            <div className="mt-4 text-center text-gray-600">
                <p>You are currently in <strong>{roomName}</strong></p>
            </div>
        </div>
    );
};

export default Messages;