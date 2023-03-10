import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(inputAnatomy.keys);

  const baseStyle = definePartsStyle({
    // define the part you're going to style
    addon: {
      borderRadius: 'full'
    },
    field: {
        color: '#1c1c1c',
        fontWeight: '510',
        borderRadius: 'full',
    },
  });


  export const inputTheme = defineMultiStyleConfig({ baseStyle });