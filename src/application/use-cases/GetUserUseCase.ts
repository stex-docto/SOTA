import { UserEntity, UserId, UserRepository } from '@/domain'

export interface GetUserRequest {
    userId: UserId
}

export type GetUserResponse = UserEntity | null

export class GetUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute({ userId }: GetUserRequest): Promise<GetUserResponse> {
        return await this.userRepository.getUser(userId)
    }
}
