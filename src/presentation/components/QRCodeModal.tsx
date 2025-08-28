import { VStack, HStack, Text, Input, IconButton, Box, CloseButton } from '@chakra-ui/react'
import { Dialog } from '@chakra-ui/react'
import { QrCode } from '@chakra-ui/react'
import { IoQrCodeOutline } from 'react-icons/io5'
import { MdContentCopy } from 'react-icons/md'
import { toaster } from '@presentation/ui'

interface QRCodeModalProps {
    url: string
    title?: string
    buttonClassName?: string
}

function QRCodeModal({ url, title, buttonClassName = 'share-button' }: QRCodeModalProps) {
    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(url)
            toaster.create({
                title: 'URL copied!',
                description: 'The event URL has been copied to your clipboard',
                type: 'success',
                duration: 2000
            })
        } catch (err) {
            console.error('Failed to copy URL:', err)
            toaster.create({
                title: 'Copy failed',
                description: 'Unable to copy URL to clipboard',
                type: 'error',
                duration: 3000
            })
        }
    }

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <IconButton
                    className={buttonClassName}
                    variant="outline"
                    size="sm"
                    aria-label="Share QR Code"
                >
                    <IoQrCodeOutline />
                </IconButton>
            </Dialog.Trigger>

            <Dialog.Backdrop />
            <Dialog.Positioner>
                <Dialog.Content>
                    <Dialog.Header>
                        <Dialog.Title>{title ? `Share ${title}` : 'Share Event'}</Dialog.Title>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton />
                        </Dialog.CloseTrigger>
                    </Dialog.Header>

                    <Dialog.Body>
                        <VStack>
                            <Box
                                p={6}
                                bg="white"
                                borderRadius="md"
                                border="1px solid"
                                borderColor="gray.200"
                            >
                                <QrCode.Root value={url} size="2xl">
                                    <QrCode.Frame>
                                        <QrCode.Pattern />
                                    </QrCode.Frame>
                                </QrCode.Root>
                            </Box>

                            <Text fontSize="sm" color="gray.600" textAlign="center">
                                Scan this QR code with your phone to quickly access the event page
                            </Text>

                            <HStack w="full">
                                <Input value={url} readOnly bg="gray.50" fontSize="sm" />
                                <IconButton
                                    aria-label="Copy URL"
                                    onClick={handleCopyUrl}
                                    colorScheme="blue"
                                >
                                    <MdContentCopy />
                                </IconButton>
                            </HStack>
                        </VStack>
                    </Dialog.Body>
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    )
}

export default QRCodeModal
