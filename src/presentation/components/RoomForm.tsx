import React, { useState } from 'react'
import { 
    VStack, 
    HStack, 
    Text, 
    Button, 
    Box, 
    Input, 
    Textarea, 
    Field 
} from '@chakra-ui/react'
import { IoWarningOutline } from 'react-icons/io5'

export interface RoomFormData {
    name: string
    description: string
}

export interface RoomFormProps {
    initialData?: Partial<RoomFormData>
    onSubmit: (data: RoomFormData) => void
    onCancel: () => void
    isSubmitting: boolean
    error: Error | string | null
    submitButtonText?: string
    title: string
}

function RoomForm({
    initialData = {},
    onSubmit,
    onCancel,
    isSubmitting,
    error,
    submitButtonText = 'Create Room',
    title
}: RoomFormProps) {
    const [formData, setFormData] = useState<RoomFormData>({
        name: initialData.name || '',
        description: initialData.description || ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <Box 
            p={6} 
            borderRadius="lg" 
            border="1px solid" 
            colorPalette="gray"
            bg={{ base: "white", _dark: "colorPalette.900" }}
            borderColor={{ base: "colorPalette.200", _dark: "colorPalette.700" }}
        >
            <VStack gap={6} align="stretch">
                <Text fontSize="xl" fontWeight="bold" colorPalette="gray">
                    {title}
                </Text>

                <Box as="form" onSubmit={handleSubmit}>
                    <VStack gap={4} align="stretch">
                        <Field.Root required>
                            <Field.Label htmlFor="name">Room Name</Field.Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="e.g., Main Auditorium, Breakout Room 1"
                                size="md"
                            />
                            <Field.RequiredIndicator />
                        </Field.Root>

                        <Field.Root>
                            <Field.Label htmlFor="description">Description</Field.Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Optional description of the room..."
                                rows={3}
                                size="md"
                            />
                        </Field.Root>

                        {error && (
                            <Box 
                                p={3} 
                                borderRadius="md" 
                                border="1px solid" 
                                colorPalette="red"
                                bg={{ base: "colorPalette.50", _dark: "colorPalette.900" }}
                                borderColor={{ base: "colorPalette.200", _dark: "colorPalette.700" }}
                            >
                                <HStack gap={2}>
                                    <IoWarningOutline />
                                    <Text fontSize="sm">
                                        {typeof error === 'string' ? error : error.message}
                                    </Text>
                                </HStack>
                            </Box>
                        )}

                        <HStack justify="flex-end" gap={3} pt={4}>
                            <Button
                                type="button"
                                onClick={onCancel}
                                variant="outline"
                                colorPalette="gray"
                                disabled={isSubmitting}
                            >
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
            </VStack>
        </Box>
    )
}

export default RoomForm
