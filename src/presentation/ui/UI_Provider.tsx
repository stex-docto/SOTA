'use client'

import { ChakraProvider, defaultConfig, createSystem, defineConfig } from '@chakra-ui/react'
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode.tsx'
import { Toaster } from './toaster.tsx'

const customConfig = defineConfig({
    globalCss: {
        'html, body': {
            fontFamily: `-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif`,
            lineHeight: '1.6',
            color: 'fg',
            bg: 'bg'
        }
    }
})

const customSystem = createSystem(defaultConfig, customConfig)

export function UI_Provider(props: ColorModeProviderProps) {
    return (
        <ChakraProvider value={customSystem}>
            <ColorModeProvider {...props} />
            <Toaster />
        </ChakraProvider>
    )
}
