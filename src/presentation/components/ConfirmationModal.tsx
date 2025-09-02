import { HiExclamationTriangle, HiXMark } from 'react-icons/hi2'
import { Box, Button, Dialog, HStack, IconButton, Text, VStack } from '@chakra-ui/react'

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
            <Dialog.Positioner>
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
                    </VStack>
                    <Dialog.Footer>
                        <Dialog.ActionTrigger asChild>
                            <Button variant="outline" disabled={isLoading}>
                                {cancelButtonText}
                            </Button>
                        </Dialog.ActionTrigger>
                        <Button
                            colorPalette={isDestructive ? 'red' : 'blue'}
                            onClick={onConfirm}
                            disabled={isLoading}
                            loading={isLoading}
                        >
                            {isLoading ? 'Loading...' : confirmButtonText}
                        </Button>
                    </Dialog.Footer>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}

export default ConfirmationModal
