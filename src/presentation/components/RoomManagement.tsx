import { useEffect, useState } from "react";
import { EventId, RoomEntity } from "@domain";
import { useDependencies } from "../hooks/useDependencies";
import RoomList from "./RoomList";
import RoomForm, { RoomFormData } from "./RoomForm";
import ConfirmationModal from "./ConfirmationModal";

export interface RoomManagementProps {
  eventId: EventId;
  isEventCreator: boolean;
}

type ViewMode = "list" | "create" | "edit";

function RoomManagement({ eventId, isEventCreator }: RoomManagementProps) {
  const {
    getRoomsByEventUseCase,
    createRoomUseCase,
    updateRoomUseCase,
    deleteRoomUseCase,
  } = useDependencies();

  const [rooms, setRooms] = useState<RoomEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingRoom, setEditingRoom] = useState<RoomEntity | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState<RoomEntity | null>(null);

  useEffect(() => {
    loadRooms();
  }, [eventId]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadRooms = async () => {
    try {
      setLoading(true);
      const result = await getRoomsByEventUseCase.execute({ eventId });
      setRooms(result.rooms);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (formData: RoomFormData) => {
    try {
      setIsSubmitting(true);
      setError("");

      await createRoomUseCase.execute({
        eventId,
        name: formData.name,
        description: formData.description,
      });

      await loadRooms();
      setViewMode("list");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create room");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateRoom = async (formData: RoomFormData) => {
    if (!editingRoom) return;

    try {
      setIsSubmitting(true);
      setError("");

      await updateRoomUseCase.execute({
        roomId: editingRoom.id,
        name: formData.name,
        description: formData.description,
      });

      await loadRooms();
      setViewMode("list");
      setEditingRoom(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update room");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (!roomToDelete) return;

    try {
      setIsSubmitting(true);
      setError("");

      await deleteRoomUseCase.execute({ roomId: roomToDelete.id });

      await loadRooms();
      setShowDeleteConfirmation(false);
      setRoomToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete room");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (room: RoomEntity) => {
    setEditingRoom(room);
    setViewMode("edit");
  };

  const handleDeleteClick = (room: RoomEntity) => {
    setRoomToDelete(room);
    setShowDeleteConfirmation(true);
  };

  const handleCancel = () => {
    setViewMode("list");
    setEditingRoom(null);
    setError("");
  };

  if (loading) {
    return <div className="loading">Loading rooms...</div>;
  }

  return (
    <div className="room-management">
      <div className="action-group">
        <h3>Event Rooms</h3>
        {isEventCreator && viewMode === "list" && (
          <button
            onClick={() => setViewMode("create")}
            className="admin-button primary"
          >
            Add Room
          </button>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      {viewMode === "list" && (
        <RoomList
          rooms={rooms}
          isEventCreator={isEventCreator}
          onEdit={isEventCreator ? handleEditClick : undefined}
          onDelete={isEventCreator ? handleDeleteClick : undefined}
        />
      )}

      {viewMode === "create" && (
        <RoomForm
          title="Create New Room"
          onSubmit={handleCreateRoom}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          error={error}
          submitButtonText="Create Room"
        />
      )}

      {viewMode === "edit" && editingRoom && (
        <RoomForm
          title="Edit Room"
          initialData={{
            name: editingRoom.name,
            description: editingRoom.description,
          }}
          onSubmit={handleUpdateRoom}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
          error={error}
          submitButtonText="Update Room"
        />
      )}

      {showDeleteConfirmation && roomToDelete && (
        <ConfirmationModal
          isOpen={showDeleteConfirmation}
          title="Delete Room"
          message={`Are you sure you want to delete "${roomToDelete.name}"? This action cannot be undone.`}
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
          onConfirm={handleDeleteRoom}
          onClose={() => {
            setShowDeleteConfirmation(false);
            setRoomToDelete(null);
          }}
          isLoading={isSubmitting}
          isDestructive={true}
        />
      )}
    </div>
  );
}

export default RoomManagement;
