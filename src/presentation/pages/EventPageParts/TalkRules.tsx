import { useState } from 'react'
import { Box, Button, Card, Heading, HStack, Textarea, VStack } from '@chakra-ui/react'
import ReactMarkdown from 'react-markdown'
import remarkBreaks from 'remark-breaks'
import { EventEntity } from '@domain'
import { toaster } from '@presentation/ui'
import { HiMicrophone } from 'react-icons/hi2'
import { useDependencies } from '@presentation/hooks/useDependencies.ts'

interface TalkRulesProps {
    event: EventEntity
    isAdmin: boolean
}

const DEFAULT_TALK_RULES = `### The Four Principles

1. **Whoever comes are the right people** — The people who show up are exactly who need to be there.
1. **Whatever happens is the only thing that could have happened** — Don't worry about what might have been; focus on what is.
1. **When it starts is the right time to start** — Things begin when they're ready, not before.
1. **When it's over, it's over** — When the energy for a topic is gone, move on.

---

### The Law of Two Feet

**Use your feet!** 

If you're not learning or contributing, go somewhere else. No hard feelings.

This creates engaged, passionate discussions where everyone participates by choice.

---
_More on this, visit [Open Space Technology](https://openspaceworld.org/wp2/what-is/) principles for self-organizing conversations_`

export function TalkRules({ event, isAdmin }: TalkRulesProps) {
    const { updateEventUseCase } = useDependencies()
    const [isEditing, setIsEditing] = useState(false)
    const [isUpdating, setIsUpdating] = useState(false)
    const [editedRules, setEditedRules] = useState(event.talkRules)

    const handleEdit = () => {
        setIsEditing(true)
        setEditedRules(event.talkRules)
    }

    const handleCancel = () => {
        setIsEditing(false)
        setEditedRules(event.talkRules)
    }

    const handleSave = async () => {
        setIsUpdating(true)
        try {
            await updateEventUseCase.execute({
                eventId: event.id,
                talkRules: editedRules
            })

            setIsEditing(false)
            toaster.success({
                title: 'Talk rules updated',
                description: 'The talk rules have been successfully updated',
                duration: 2000
            })
        } catch (error) {
            toaster.error({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to update talk rules',
                duration: 2000
            })
        } finally {
            setIsUpdating(false)
        }
    }

    const rules = isEditing ? editedRules : event.talkRules
    const displayRules = rules.length ? rules : DEFAULT_TALK_RULES

    return (
        <VStack gap={4} align="stretch">
            <HStack justify="space-between" align="center">
                <Heading size="md" colorPalette="blue" asChild>
                    <HStack gap={2}>
                        <HiMicrophone /> Talk Rules
                    </HStack>
                </Heading>
                {isAdmin && !isEditing && (
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                        Edit
                    </Button>
                )}
            </HStack>

            <Card.Root
                colorPalette={isEditing ? 'green' : 'white'}
                bg={{ base: 'colorPalette.50', _dark: 'colorPalette.950' }}
                borderColor={{ base: 'colorPalette.200', _dark: 'colorPalette.800' }}
            >
                <Card.Body gap={2}>
                    {isEditing && (
                        <Box
                            colorPalette="yellow"
                            bg={{ base: 'colorPalette.50', _dark: 'colorPalette.900' }}
                        >
                            <Textarea
                                value={editedRules}
                                onChange={e => setEditedRules(e.target.value)}
                                placeholder="Enter talk rules... (Markdown formatting supported, if none, default to Open Talk rules)"
                                rows={8}
                                autoresize
                            />
                        </Box>
                    )}

                    <ReactMarkdown remarkPlugins={[remarkBreaks]}>{displayRules}</ReactMarkdown>
                </Card.Body>
                {isEditing && (
                    <Card.Footer justifyContent="end">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancel}
                            disabled={isUpdating}
                        >
                            Cancel
                        </Button>
                        <Button
                            colorPalette="blue"
                            size="sm"
                            onClick={handleSave}
                            disabled={isUpdating}
                            loading={isUpdating}
                        >
                            Save Changes
                        </Button>
                    </Card.Footer>
                )}
            </Card.Root>
        </VStack>
    )
}
