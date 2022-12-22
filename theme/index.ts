import { extendTheme } from "@chakra-ui/react";
import "@fontsource/baloo-thambi-2";
import { inputTheme } from "../theme/input";
import { menuTheme } from "./menu";

const customTheme = extendTheme({
    components: {
      Heading: {
        // 1. We can update the base styles
        baseStyle: {
            color: '#414141',
        },
        // 2. We can add a new button size or extend existing
        sizes: {},
        // 3. We can add a new visual variant
        variants: {
          logo: {
            fontFamily: `"Baloo Thambi 2", cursive`,
          },
          // 4. We can override existing variants
          // 5. We can add responsive variants
        },
        // 6. We can overwrite defaultProps
        defaultProps: {
        },
      },
      Text: {
        baseStyle: {
          fontWeight: "510",
        },
        variants: {
            underText: {
                color: '#8A8A8A',
                fontWeight: '510',
                fontSize: "13px",
            },
            navbar: {
              paddingRight: "25px",
              fontWeight: "590",
              color: "#414141",
              fontSize: "18px",
              _hover: { color: '#A73CFC' },
              _active: { color: "#920efb" },
            },
            currPageNavBar: {
              paddingRight: "25px",
              fontWeight: "590",
              color: "#A73CFC",
              fontSize: "18px",
            },
            courseMain: {
              color: "#414141",
              fontWeight: "590",
              fontSize: "18px",
              paddingTop: "20px",
            },
            courseUnder: {
              color: "#A73CFC",
              fontSize: "14px",
              fontWeight: "590",
            }
        },
      },
      Link: {
        baseStyle: {
            color: "#A73CFC",
        },
        variants: {
          photo: {
            color: "#3485FF",
            fontWeight: "700",
            fontSize: "15px",
          },
          filter: {
            color: "#3485FF",
            fontWeight: "590",
            fontSize: "152x",
          }
        },
      },
      Input: inputTheme,
      Button: {
        variants: {
          login: {
            color:'white',
            width: "75%",
            bgGradient: 'linear(to-r, #A73CFC, #3C66FC)',
            _hover: {bgGradient: 'linear(to-r, #920efb, #0e42fb)'},
            _active: {bgGradient: 'linear(to-r, #7903d7, #0332d7)'},
          },
          start: {
            color:'white',
            bgGradient: 'linear(to-r, #A73CFC, #3C66FC)',
            _hover: {bgGradient: 'linear(to-r, #920efb, #0e42fb)'},
            _active: {bgGradient: 'linear(to-r, #7903d7, #0332d7)'},
          },
          navbar: {
            color:'white',
            bgGradient: 'linear(to-tr, #3C66FC, #A73CFC)',
            _hover: {bgGradient: 'linear(to-tr, #0e42fb, #920efb)'}, 
            _active: {bgGradient: 'linear(to-tr, #0332d7, #7903d7)'}, 
          },
        },
      },
      Textarea: {
        baseStyle: {
          color: '#8A8A8A',
          fontWeight: '510',
        },
      },
      IconButton: {
        variants: {
          like: {
            _hover: "undefined",
            padding: "0",
          },
        },
      },
      Icon: {
        variants: {
          like: {
            _hover: {color: "red"},
          },
        },
      },
      Menu: menuTheme,
    },
  });

  export default customTheme;

