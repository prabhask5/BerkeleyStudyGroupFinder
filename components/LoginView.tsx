import {Heading, Text, Input, Stack, Button, InputGroup, InputRightElement, FormControl, FormErrorMessage} from '@chakra-ui/react';
import { useState } from 'react';

interface LoginProps{
    submitClick: Function;
}

export default function Login(props: LoginProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [show, setShow] = useState(false);
    const [isEmailError, setIsEmailError] = useState(false);
    const [isPasswordError, setIsPasswordError] = useState(false);
    const emailRe = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    return (
        <div>
            <Heading variant="logo" size="lg" style={{marginBottom: "50px"}}>matchr</Heading>
            <form onSubmit={ e => {
                e.preventDefault();
                let anyError = false;
                if(isEmailError){
                    setEmail("");
                }
                if(email.length === 0){
                    setIsEmailError(true);
                    anyError = true;
                }
                if(isPasswordError){
                    setPassword("");
                    setShow(false);
                }
                if(password.length === 0){
                    setIsPasswordError(true);
                    anyError = true;
                }
                props.submitClick(email, password, isEmailError, isPasswordError, anyError);
            }}>
                <Stack spacing={5}>
                    <Heading size="2xl">Log in.</Heading>
                    <Text variant="underText">Enter your details to get signed in</Text>
                    <FormControl style={{width: "75%", marginLeft: 'auto', marginRight: 'auto'}} isInvalid={isEmailError}>
                        <Input value={email} onBlur={e => {if(e.target.value.length === 0 || !emailRe.test(e.target.value)) setIsEmailError(true); else setIsEmailError(false);}} onChange={event => setEmail(event.currentTarget.value)} placeholder="Email"/>
                        {isEmailError ? <FormErrorMessage style={{margin: "0px", padding: "0px"}}></FormErrorMessage>: null}
                    </FormControl>
                    <FormControl isInvalid={isPasswordError}>
                        <InputGroup style={{width: "75%", marginLeft: 'auto', marginRight: 'auto'}}>
                            <Input
                                onBlur={e => {if(e.target.value.length === 0) setIsPasswordError(true); else setIsPasswordError(false);}}
                                value={password}
                                onChange={event => setPassword(event.currentTarget.value)}
                                type={show ? 'text' : 'password'}
                                placeholder='Password'
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
                                {show ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        {isPasswordError ? <FormErrorMessage style={{margin: "0px", padding: "0px"}}></FormErrorMessage>: null}
                    </FormControl>
                    <Button style={{width: "75%", marginLeft: 'auto', marginRight: 'auto'}} type="submit" variant="login">
                    Log In
                    </Button>
                </Stack>
            </form>
        </div>
    );
}