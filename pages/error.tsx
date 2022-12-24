import {Heading, Stack, Text} from '@chakra-ui/react';

export default function PageNotFound() {
    return (
        <div style={{textAlign: "center", marginTop: "17%"}}>
            <Heading variant="logo" size="lg" style={{marginBottom: "50px"}}>matchr</Heading>
            <Stack spacing={5}>
                <Heading size="2xl">404: Page Not Found.</Heading>
                <Text variant="underText">Sorry, the page you were looking for cannot be found. Please go back and try again.</Text>
            </Stack>
        </div>
    );
}