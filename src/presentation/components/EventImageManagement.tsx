import { useState } from 'react'
import { VStack, Heading, Text, Button, FileUpload, Card } from '@chakra-ui/react'
import { EventEntity, SvgContent } from '@domain'
import { useDependencies } from '../hooks/useDependencies'
import { HiUpload } from 'react-icons/hi'
import { toaster } from '@presentation/ui'

interface EventImageManagementProps {
    event: EventEntity
    isAdmin: boolean
}

export default function EventImageManagement({ event, isAdmin }: EventImageManagementProps) {
    const { updateEventUseCase } = useDependencies()
    const [isUploading, setIsUploading] = useState(false)
    const [svgValidation, setSvgValidation] = useState<SvgContent | null>(null)

    const handleFileChange = async (details: FileUpload.FileAcceptDetails) => {
        const file = details.files[0]
        setSvgValidation(null)

        if (!file) {
            return
        }

        // Check file type
        if (file.type !== 'image/svg+xml' && !file.name.toLowerCase().endsWith('.svg')) {
            toaster.error({
                title: 'Invalid SVG content',
                description: 'File type is not SVG',
                duration: 2000
            })
        }

        // Check file size (limit to 1MB)
        if (file.size > 1024 * 1024) {
            toaster.error({
                title: 'Invalid SVG content',
                description: 'SVG file must be smaller than 1MB',
                duration: 2000
            })
        }

        try {
            const fileContent = await file.text()
            const svgContent = SvgContent.from(fileContent)
            setSvgValidation(svgContent)
        } catch (error) {
            setSvgValidation(null)
            toaster.error({
                title: 'Invalid SVG content',
                description: error instanceof Error ? error.message : '',
                duration: 2000
            })
        }
    }

    const handleCancel = async () => {
        setSvgValidation(null)
    }

    const handleUploadSvg = async () => {
        if (!svgValidation) return
        setIsUploading(true)

        try {
            await updateEventUseCase.execute({
                eventId: event.id,
                svgContent: svgValidation.value
            })

            // Reset file input and validation
            setSvgValidation(null)
        } catch (error) {
            toaster.error({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to upload SVG',
                duration: 2000
            })
        } finally {
            toaster.success({
                title: '',
                description: 'The event URL has been copied to your clipboard',
                duration: 2000
            })
            setIsUploading(false)
        }
    }

    const handleRemoveSvg = async () => {
        setIsUploading(true)
        try {
            await updateEventUseCase.execute({
                eventId: event.id,
                svgContent: null
            })
        } catch (error) {
            toaster.error({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to upload SVG',
                duration: 2000
            })
        } finally {
            setIsUploading(false)
        }
    }

    const displayContent: string | undefined =
        svgValidation?.toString() || event.svgContent?.toString() || undefined

    return (
        <VStack gap={4} align="stretch">
            <Heading size="md" colorPalette="blue">
                Event Image
            </Heading>
            <Card.Root
                maxW="sm"
                overflow="hidden"
                bg={{ base: 'gray.50', _dark: 'gray.800' }}
                padding={2}
            >
                {displayContent ? (
                    <img
                        src={`data:image/svg+xml;base64,${btoa(displayContent)}`}
                        alt={event.title}
                        style={{
                            width: '100%',
                            height: 'auto',
                            display: 'block',
                            maxHeight: 'sm',
                            objectFit: 'contain'
                        }}
                        onError={e => {
                            ;(e.target as HTMLImageElement).style.display = 'none'
                        }}
                    />
                ) : (
                    <Text colorPalette="gray" fontStyle="italic">
                        No image uploaded yet
                    </Text>
                )}
                {isAdmin && (
                    <Card.Footer padding={0} paddingTop={1}>
                        {!svgValidation && (
                            <FileUpload.Root
                                accept={['.svg,image/svg+xml']}
                                maxFiles={1}
                                onFileAccept={handleFileChange}
                            >
                                <FileUpload.HiddenInput />
                                <FileUpload.Trigger asChild>
                                    <Button variant="outline" size="sm">
                                        <HiUpload /> Upload an SVG image.
                                    </Button>
                                </FileUpload.Trigger>
                                <FileUpload.ClearTrigger />
                            </FileUpload.Root>
                        )}

                        {svgValidation && (
                            <Button
                                colorPalette="blue"
                                onClick={handleUploadSvg}
                                disabled={isUploading}
                                loading={isUploading}
                            >
                                {event.svgContent ? 'Replace Image' : 'Upload Image'}
                            </Button>
                        )}

                        {svgValidation && (
                            <Button
                                variant="outline"
                                colorPalette="red"
                                onClick={handleCancel}
                                disabled={isUploading}
                                loading={isUploading}
                            >
                                Cancel
                            </Button>
                        )}

                        {event.svgContent && !svgValidation && (
                            <Button
                                variant="outline"
                                colorPalette="red"
                                onClick={handleRemoveSvg}
                                disabled={isUploading}
                                loading={isUploading}
                            >
                                Remove Image
                            </Button>
                        )}
                    </Card.Footer>
                )}
            </Card.Root>
        </VStack>
    )
}
