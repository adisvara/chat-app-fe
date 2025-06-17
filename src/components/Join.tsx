import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom";

export const Join = () => {
    const topButtonRef = useRef<HTMLButtonElement>(null);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const navigate = useNavigate();
    
    // Handle room selection
    const joinRoom = (event: React.MouseEvent<HTMLButtonElement>) => {
        const clickedButton = event.currentTarget;
        const roomName = clickedButton.textContent || '';
        
        setSelectedRoom(roomName);
        clickedButton.blur();
        topButtonRef.current?.focus();
    }
    
    // Handle top button click - navigate to Messages using React Router
    const handleJoinClick = () => {
        if (selectedRoom) {
            // Navigate to messages route with room name as state
            navigate('/messages', { 
                state: { roomName: selectedRoom } 
            });
        }
    }

    return (
        <div className="p-4">
            <button 
                type="submit" 
                ref={topButtonRef} 
                onClick={handleJoinClick}
                disabled={!selectedRoom}
                className={`h-12 text-xl w-full text-center content-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    selectedRoom 
                        ? 'bg-blue-400 shadow-lg hover:bg-blue-500 cursor-pointer' 
                        : 'bg-blue-300 hover:bg-blue-400 opacity-75 cursor-not-allowed'
                }`}
            >
                {selectedRoom ? `Join ${selectedRoom}` : 'Select a Room First'}
            </button> 
            
            <div className="grid gap-2 grid-cols-2 mt-10 grid-rows-2 w-60 h-60 place-content-center mx-auto">
                <button 
                    onClick={joinRoom} 
                    className={`border-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                        selectedRoom === 'Room 101' 
                            ? 'bg-red-400 border-red-500 shadow-lg' 
                            : 'bg-red-300 hover:bg-red-400 border-red-400'
                    }`}
                >
                    Room 101
                </button>
                <button 
                    onClick={joinRoom} 
                    className={`border-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                        selectedRoom === 'Room 102' 
                            ? 'bg-red-400 border-red-500 shadow-lg' 
                            : 'bg-red-300 hover:bg-red-400 border-red-400'
                    }`}
                >
                    Room 102
                </button>
                <button 
                    onClick={joinRoom} 
                    className={`border-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                        selectedRoom === 'Room 103' 
                            ? 'bg-red-400 border-red-500 shadow-lg' 
                            : 'bg-red-300 hover:bg-red-400 border-red-400'
                    }`}
                >
                    Room 103
                </button>
                <button 
                    onClick={joinRoom} 
                    className={`border-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
                        selectedRoom === 'Room 104' 
                            ? 'bg-red-400 border-red-500 shadow-lg' 
                            : 'bg-red-300 hover:bg-red-400 border-red-400'
                    }`}
                >
                    Room 104
                </button>
            </div>
        </div>
    )
}
