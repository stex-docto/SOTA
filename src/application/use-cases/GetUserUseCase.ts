import { UserEntity, UserId, UserRepository } from '@/domain'

export interface GetUserRequest {
    userId: UserId
}

export interface GetUserResponse {
    user: UserEntity | null
}

export class GetUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute({ userId }: GetUserRequest): Promise<GetUserResponse> {
        const user = await this.userRepository.getUser(userId)
        return { user }
    }
}
