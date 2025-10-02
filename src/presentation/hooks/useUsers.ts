import { UserEntity, UserId } from '@domain'
import { useState } from 'react'
import { useDependencies } from '@presentation/hooks/useDependencies.ts'
import moment, { Moment } from 'moment'
import { useMoment } from '@presentation/hooks/useMoment.ts'

export type Users = {
    getUser: (uid: UserId) => Promise<UserEntity | null>
}

export function useUsers(): Users {
    const { getUserUseCase } = useDependencies()
    const { now } = useMoment()
    const [users, setUsers] = useState<Map<UserId, { user: UserEntity; ttl: Moment }>>(new Map())

    const getUser = async (uid: UserId) => {
        const userEntry = users.get(uid)

        // Return cached user if still valid (TTL is in the future)
        if (userEntry?.user && userEntry.ttl.isAfter(now)) {
            return userEntry.user
        }

        const newUsers = new Map(users)
        const result = await getUserUseCase.execute({ userId: uid })
        if (result) {
            newUsers.set(result.id, { user: result, ttl: moment().add(10, 'minutes') })
            setUsers(newUsers)
            return result
        }
        return null
    }

    return {
        getUser
    }
}
