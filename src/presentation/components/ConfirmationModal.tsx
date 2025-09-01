import { HiExclamationTriangle, HiXMark } from 'react-icons/hi2'
import { Dialog, Button, VStack, HStack, Box, Text, IconButton } from '@chakra-ui/react'

export interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    message: string
    confirmButtonText?: string
    cancelButtonText?: string
    isDestructive?: boolean
    isLoading?: boolean
}

function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmButtonText = 'Confirm',
    cancelButtonText = 'Cancel',
    isDestructive = false,
    isLoading = false
}: ConfirmationModalProps) {
    if (!isOpen) return null

    return (
        <Dialog.Root open={isOpen} onOpenChange={({ open }) => !open && onClose()}>
            <Dialog.Content maxW="md">
                <Dialog.Header>
                    <Dialog.Title>
                        <HStack gap={3}>
                            <Box colorPalette={isDestructive ? 'red' : 'blue'}>
                                <HiExclamationTriangle size={24} />
                            </Box>
                            <Text>{title}</Text>
                        </HStack>
                    </Dialog.Title>
                    <Dialog.CloseTrigger asChild>
                        <IconButton variant="outline" size="sm" disabled={isLoading}>
                            <HiXMark />
                        </IconButton>
                    </Dialog.CloseTrigger>
                </Dialog.Header>

                <VStack gap={6} p={6} align="stretch">
                    <Text fontSize="md" colorPalette="gray" textAlign="center">
                        {message}
                    </Text>

                    <HStack justify="flex-end" gap={3}>
                        <Button variant="outline" onClick={onClose} disabled={isLoading}>
                            {cancelButtonText}
                        </Button>
                        <Button
                            colorPalette={isDestructive ? 'red' : 'blue'}
                            onClick={onConfirm}
                            disabled={isLoading}
                            loading={isLoading}
                        >
                            {isLoading ? 'Loading...' : confirmButtonText}
                        </Button>
                    </HStack>
                </VStack>
            </Dialog.Content>
        </Dialog.Root>
    )
}

export default ConfirmationModal
