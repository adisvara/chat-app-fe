type RoomButtonProps = {
  roomName: string;
  selectedRoom: string | null;
  onClick: (roomName: string) => void;
};

export const Room = ({ roomName, selectedRoom, onClick }: RoomButtonProps) => (
  <button
    onClick={() => onClick(roomName)}
    className={`rounded-md border-2 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors ${
      selectedRoom === roomName
        ? 'bg-red-400 border-red-500 shadow-lg'
        : 'bg-red-300 hover:bg-red-400 border-red-400'
    }`}
  >
    {roomName}
  </button>
);