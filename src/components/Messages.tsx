import { useState } from "react";

import { useLocation, useNavigate } from 'react-router-dom';

export const Messages = () => {
    //still have to learn this hook
    const location = useLocation();
    const navigate = useNavigate();
    
    // Get room name from navigation state
    const roomName = location.state?.roomName || 'Unknown Room';
    
    // If no room name in state, redirect back to room selection
    if (!location.state?.roomName) {
        return (
            <div className="p-4">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    <p>No room selected. Please select a room first.</p>
                </div>
                <button 
                    onClick={() => navigate('/')}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Back to Room Selection
                </button>
            </div>
        );
    }
    
    const[inputText,setInputText] =useState<string>('')
    const[msgs,setMsgs] = useState<string[]>([])

    const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>)=> {
        setInputText(e.target.value)
    }
    const handleSend = () => {
        if(inputText.trim()){
            setMsgs([...msgs,inputText])
            setInputText('')
        }
    }

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    Welcome to {roomName}!
                </h1>
                <button 
                    onClick={() => navigate('/')}
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
                    
                    <div className="space-y-4">
                        {/* Sample messages */}
                        <div className="flex flex-col space-y-1">
                            <div className="flex items-center space-x-2">
                                <span className="font-semibold text-blue-600">User1</span>
                                <span className="text-xs text-gray-500">10:30 AM</span>
                            </div>
                            <div className="bg-gray-100 p-3 rounded-lg max-w-md">
                                <p>Hello everyone! Welcome to {roomName}</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col space-y-1 items-end">
                            <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">10:35 AM</span>
                                <span className="font-semibold text-purple-600">You</span>
                            </div>
                            <div className="bg-blue-500 text-white p-3 rounded-lg max-w-md">
                                <p>Just joined {roomName}! Looking forward to chatting.</p>
                            </div>
                            {
                                msgs.map((msg,index) =>(
                                    <div className="flex flex-col space-y-1 items-end">
                                <div className="bg-blue-500 text-white p-3 rounded-lg max-w-md">
                                    <p key={index}>{msg}</p>
                                </div>
                            </div>
                                ))
                            }
                            
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Message Input */}
            <div className="bg-white border rounded-lg shadow-sm">
                <div className="p-4">
                    <div className="flex space-x-2">
                        <input 
                            type="text"
                            onChange={handleInputChange} 
                            placeholder={`Type a message to ${roomName}...`}
                            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button onClick={handleSend} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            Send
                        </button>
                    </div>
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