import type { AppProps } from 'next/app';
import { ChakraProvider} from '@chakra-ui/react';
import customTheme from "../theme/index";
import "media/global.css";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={customTheme}>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}