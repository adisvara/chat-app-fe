import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom";

export const Join = () => {
    const topButtonRef = useRef<HTMLButtonElement>(null);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    
    const navigate = useNavigate();

    const joinRoom = (event: React.MouseEvent<HTMLButtonElement>) => {
        const clickedButton = event.currentTarget;
        const roomName = clickedButton.textContent || '';
        
        setSelectedRoom(roomName);
        clickedButton.blur();
        topButtonRef.current?.focus();
    }

    return (
        <div className="p-4">
            <button 
                type="submit" 
                ref={topButtonRef}
                onClick={()=> navigate('/room')}
                className={`h-12 text-xl w-full text-center content-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    selectedRoom ? 'bg-blue-400 shadow-lg' : 'bg-blue-300 hover:bg-blue-400'
                }`}
            >
                {selectedRoom ? `Join ${selectedRoom}` : 'Join Room'}
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