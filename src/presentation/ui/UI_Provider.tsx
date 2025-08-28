'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode.tsx'
import { Toaster } from './toaster.tsx'

export function UI_Provider(props: ColorModeProviderProps) {
    return (
        <ChakraProvider value={defaultSystem}>
            <ColorModeProvider {...props} />
            <Toaster />
        </ChakraProvider>
    )
}
