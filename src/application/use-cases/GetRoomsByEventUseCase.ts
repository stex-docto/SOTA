import {RoomEntity, RoomRepository, EventId} from '@domain';

export interface GetRoomsByEventCommand {
    eventId: EventId;
}

export interface GetRoomsByEventResult {
    rooms: RoomEntity[];
}

export class GetRoomsByEventUseCase {
    constructor(
        private readonly roomRepository: RoomRepository
    ) {
    }

    async execute(command: GetRoomsByEventCommand): Promise<GetRoomsByEventResult> {
        const rooms = await this.roomRepository.findByEventId(command.eventId);
        return {rooms};
    }

    // Real-time subscription method for live updates
    subscribe(
        command: GetRoomsByEventCommand,
        callback: (result: GetRoomsByEventResult) => void
    ): () => void {
        // This will be implemented in the datastore layer for real-time updates
        // For now, just execute once
        this.execute(command).then(callback);
        
        // Return unsubscribe function (placeholder)
        return () => {};
    }
}