import { EventEntity } from '@domain/entities/Event';
import { EventRepository } from '@domain/repositories/EventRepository';
import { UserRepository } from '@domain/repositories/UserRepository';
import { UserId } from '@domain/value-objects/UserId';

export interface CreateEventCommand {
  name: string;
  createdBy: UserId;
}

export interface CreateEventResult {
  event: EventEntity;
}

export class CreateEventUseCase {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(command: CreateEventCommand): Promise<CreateEventResult> {
    // Verify user exists
    const user = await this.userRepository.findById(command.createdBy);
    if (!user) {
      throw new Error('User not found');
    }

    // Create new event
    const event = EventEntity.create(command.name, command.createdBy);

    // Save event
    await this.eventRepository.save(event);

    // Update user with admin privilege for this event
    const updatedUser = user.addAdminEvent(event.id);
    await this.userRepository.save(updatedUser);

    return { event };
  }
}