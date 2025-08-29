import { useState, useEffect } from 'react'
import { UserEntity } from '@/domain'
import { useDependencies } from '../../hooks/useDependencies'
import { VStack, HStack, Text, Button, Input, Field } from '@chakra-ui/react'
import { toaster } from '@presentation/ui/toaster-config'

interface UserProfileProps {
    currentUser: UserEntity
}

export function UserProfile({ currentUser }: UserProfileProps) {
    const { updateUserProfileUseCase } = useDependencies()
    const [isEditingProfile, setIsEditingProfile] = useState(false)
    const [displayName, setDisplayName] = useState('')
    const [isSavingProfile, setIsSavingProfile] = useState(false)

    useEffect(() => {
        if (currentUser) {
            setDisplayName(currentUser.displayName || '')
        }
    }, [currentUser])

    const handleSaveProfile = async () => {
        if (!displayName.trim()) return

        setIsSavingProfile(true)
        try {
            await updateUserProfileUseCase.execute({
                displayName: displayName.trim()
            })
            setIsEditingProfile(false)
            toaster.create({
                title: 'Profile Updated',
                description: 'Your display name has been saved.',
                type: 'success',
                duration: 3000
            })
        } catch (error) {
            console.error('Failed to save profile:', error)
            toaster.create({
                title: 'Save Failed',
                description: error instanceof Error ? error.message : 'Failed to save profile. Please try again.',
                type: 'error',
                duration: 5000
            })
        } finally {
            setIsSavingProfile(false)
        }
    }

    const handleEditProfile = () => {
        setIsEditingProfile(true)
    }

    const handleCancelEditProfile = () => {
        if (currentUser) {
            setDisplayName(currentUser.displayName || '')
            setIsEditingProfile(false)
        }
    }

    return (
        <VStack gap={4} align="stretch">
            <Text fontSize="lg" fontWeight="semibold" colorPalette="gray">
                Profile
            </Text>

            <Field.Root>
                <Field.Label fontSize="sm" fontWeight="medium" colorPalette="gray">
                    Display Name
                </Field.Label>
                {isEditingProfile ? (
                    <VStack gap={3} align="stretch">
                        <Input
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                            placeholder="Enter your display name"
                            disabled={isSavingProfile}
                            maxLength={50}
                        />
                        <HStack gap={2} justify="flex-end">
                            <Button
                                colorPalette="blue"
                                size="sm"
                                onClick={handleSaveProfile}
                                disabled={isSavingProfile || !displayName.trim()}
                                loading={isSavingProfile}
                            >
                                {isSavingProfile ? 'Saving...' : 'Save'}
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleCancelEditProfile}
                                disabled={isSavingProfile}
                            >
                                Cancel
                            </Button>
                        </HStack>
                    </VStack>
                ) : (
                    <HStack
                        justify="space-between"
                        align="center"
                        py={3}
                        px={4}
                        bg="bg"
                        borderRadius="md"
                        border="1px solid"
                        borderColor="border.subtle"
                    >
                        <Text fontSize="md" colorPalette="gray" fontWeight="medium">
                            {currentUser.displayName || 'No display name set'}
                        </Text>
                        <Button
                            variant="outline"
                            size="sm"
                            colorPalette="blue"
                            onClick={handleEditProfile}
                        >
                            Edit
                        </Button>
                    </HStack>
                )}
            </Field.Root>

            {!currentUser.displayName && (
                <Text fontSize="sm" colorPalette="gray" fontStyle="italic">
                    Set your display name to be shown to other users in events.
                </Text>
            )}
        </VStack>
    )
}
