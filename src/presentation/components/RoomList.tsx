import {RoomEntity} from '@domain';

export interface RoomListProps {
    rooms: RoomEntity[];
    isEventCreator: boolean;
    onEdit?: (room: RoomEntity) => void;
    onDelete?: (room: RoomEntity) => void;
}

function RoomList({rooms, isEventCreator, onEdit, onDelete}: RoomListProps) {
    if (rooms.length === 0) {
        return (
            <div className="empty-state">
                <p>No rooms have been created for this event yet.</p>
                {isEventCreator && (
                    <p>Add rooms where talks will be held.</p>
                )}
            </div>
        );
    }

    return (
        <div className="room-list">
            {rooms.map(room => (
                <div key={room.id.value} className="room-card">
                    <div className="room-info">
                        <h4 className="room-name">{room.name}</h4>
                        {room.description && (
                            <p className="room-description">{room.description}</p>
                        )}
                    </div>
                    
                    {isEventCreator && (onEdit || onDelete) && (
                        <div className="room-actions">
                            {onEdit && (
                                <button
                                    onClick={() => onEdit(room)}
                                    className="admin-button secondary"
                                    aria-label={`Edit room ${room.name}`}
                                >
                                    Edit
                                </button>
                            )}
                            {onDelete && (
                                <button
                                    onClick={() => onDelete(room)}
                                    className="admin-button danger"
                                    aria-label={`Delete room ${room.name}`}
                                >
                                    Delete
                                </button>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default RoomList;