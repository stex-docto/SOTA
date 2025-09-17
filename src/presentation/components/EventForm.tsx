import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import {
    Box,
    Button,
    Container,
    Field,
    Heading,
    HStack,
    Input,
    Text,
    Textarea,
    VStack
} from '@chakra-ui/react'

export interface EventFormData {
    title: string
    description: string
    startDate: string
    endDate: string
    location: string
}

export interface EventFormProps {
    initialData?: Partial<EventFormData>
    onSubmit: (data: EventFormData) => void
    onCancel: () => void
    isSubmitting: boolean
    error: Error | string | null
    submitButtonText?: string
    title: string
    subtitle: string
}

function EventForm({
    initialData = {},
    onSubmit,
    onCancel,
    isSubmitting,
    error,
    submitButtonText = 'Submit',
    title,
    subtitle
}: EventFormProps) {
    const [descriptionPreview, setDescriptionPreview] = useState(false)

    const [formData, setFormData] = useState<EventFormData>({
        title: initialData.title || '',
        description: initialData.description || '',
        startDate: initialData.startDate || '',
        endDate: initialData.endDate || '',
        location: initialData.location || ''
    })

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <Container>
            {title && (
                <VStack gap={2} mb={8} textAlign="center">
                    <Heading size="2xl" colorPalette="gray">
                        {title}
                    </Heading>
                    {subtitle && (
                        <Text fontSize="lg" colorPalette="gray">
                            {subtitle}
                        </Text>
                    )}
                </VStack>
            )}

            <Box as="form" onSubmit={handleSubmit}>
                <VStack gap={8} align="stretch">
                    <Box>
                        <Heading size="lg" mb={6} colorPalette="gray">
                            Basic Information
                        </Heading>

                        <VStack gap={6} align="stretch">
                            <Field.Root required>
                                <Field.Label>Event Title *</Field.Label>
                                <Input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    placeholder="Enter event title"
                                />
                            </Field.Root>

                            <Field.Root>
                                <HStack justify="space-between" align="center" mb={2}>
                                    <Field.Label>Description (Markdown supported)</Field.Label>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setDescriptionPreview(!descriptionPreview)}
                                    >
                                        {descriptionPreview ? 'Edit' : 'Preview'}
                                    </Button>
                                </HStack>
                                {descriptionPreview ? (
                                    <Box
                                        colorPalette="gray"
                                        p={4}
                                        borderWidth="1px"
                                        borderColor="colorPalette.200"
                                        borderRadius="md"
                                        bg={{ base: 'colorPalette.50', _dark: 'colorPalette.800' }}
                                        minH="100px"
                                    >
                                        {formData.description ? (
                                            <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                                                {formData.description}
                                            </ReactMarkdown>
                                        ) : (
                                            <Text colorPalette="gray" fontStyle="italic">
                                                No description provided
                                            </Text>
                                        )}
                                    </Box>
                                ) : (
                                    <Textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Describe your event... (Markdown formatting supported)"
                                        rows={4}
                                        autoresize
                                    />
                                )}
                            </Field.Root>

                            <Field.Root required>
                                <Field.Label>Start Date & Time *</Field.Label>
                                <Input
                                    name="startDate"
                                    type="datetime-local"
                                    value={formData.startDate}
                                    onChange={handleInputChange}
                                />
                            </Field.Root>

                            <Field.Root required>
                                <Field.Label>End Date & Time *</Field.Label>
                                <Input
                                    name="endDate"
                                    type="datetime-local"
                                    value={formData.endDate}
                                    onChange={handleInputChange}
                                />
                            </Field.Root>

                            <Field.Root>
                                <Field.Label>Location</Field.Label>
                                <Input
                                    name="location"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Conference Room A, Virtual Meeting, etc."
                                />
                            </Field.Root>
                        </VStack>
                    </Box>

                    {error && (
                        <Box
                            colorPalette="red"
                            p={4}
                            bg={{ base: 'colorPalette.50', _dark: 'colorPalette.900' }}
                            borderColor="colorPalette.200"
                            borderWidth="1px"
                            borderRadius="md"
                        >
                            <Text colorPalette="red" fontWeight="medium">
                                {typeof error === 'string' ? error : error.message}
                            </Text>
                        </Box>
                    )}

                    <HStack justify="flex-end" gap={4}>
                        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            colorPalette="blue"
                            disabled={isSubmitting}
                            loading={isSubmitting}
                        >
                            {isSubmitting
                                ? `${submitButtonText.replace(/e$/, 'ing')}...`
                                : submitButtonText}
                        </Button>
                    </HStack>
                </VStack>
            </Box>
        </Container>
    )
}

export default EventForm
