import { menuAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(menuAnatomy.keys)

// define the base component styles
const baseStyle = definePartsStyle({
    
});

const variants = {
    menuProfile: {
        button: {
            bgGradient: 'none',
            _hover: {bgGradient: "none"},
            _active: {bgGradient: "none"},
        },
    },
    requests: {
        button: {
            bgGradient: 'linear(to-r, #A73CFC, #3C66FC)',
            _hover: {bgGradient: 'linear(to-r, #920efb, #0e42fb)'},
            _active: {bgGradient: 'linear(to-r, #7903d7, #0332d7)'},
        },
        item: {
            bg: '#A73CFC',
            _hover: {bg: "#920efb"},
            _active: {bg: "#7903d7"},
            color: "white",
            fontWeight: "700",
        },
        list: {
            bg: "#A73CFC",
        },
    }
}

// export the base styles in the component theme
export const menuTheme = defineMultiStyleConfig({ baseStyle, variants})