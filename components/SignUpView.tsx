import {Heading, Text, Input, Stack, Button, FormControl, FormErrorMessage, InputGroup, InputRightElement} from '@chakra-ui/react';
import { useState } from "react";

interface SignUpProps{
    submitClick: Function,
}


export default function SignUp(props: SignUpProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [show, setShow] = useState(false);
    const [confirmShow, setConfirmShow] = useState(false);
    const [isEmailError, setIsEmailError] = useState(false);
    const [isPasswordError, setIsPasswordError] = useState(false);
    const [isConfirmPasswordError, setIsConfirmPasswordError] = useState(false);
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
                if(isConfirmPasswordError){
                    setConfirmPassword("");
                    setConfirmShow(false);
                }
                if(confirmPassword.length === 0){
                    setIsConfirmPasswordError(true);
                    anyError = true;
                }
                props.submitClick(email, password, isEmailError, isPasswordError, isConfirmPasswordError, anyError);
            }}>
                <Stack spacing={5}>
                    <Heading size="2xl">Create your account.</Heading>
                    <Text variant="underText">Enter your details to get started</Text>
                    <FormControl style={{width: "75%", marginLeft: 'auto', marginRight: 'auto'}} isInvalid={isEmailError}>
                        <Input value={email} onBlur={e => {if(e.target.value.length === 0 || !emailRe.test(e.target.value)) setIsEmailError(true); else setIsEmailError(false);}} onChange={event => setEmail(event.currentTarget.value)} placeholder="youremail@example.com"/>
                        {isEmailError ? <FormErrorMessage style={{margin: "0px", padding: "0px"}}></FormErrorMessage>: null}
                    </FormControl>
                    <FormControl style={{width: "75%", marginLeft: 'auto', marginRight: 'auto'}} isInvalid={isPasswordError}>
                        <InputGroup>
                            <Input
                            value={password}
                                onBlur={e => {
                                    if(e.target.value != confirmPassword){
                                        setIsPasswordError(true);
                                        setIsConfirmPasswordError(true);
                                } else if(e.target.value.length === 0){
                                    setIsPasswordError(true);
                                } else if(e.target.value === confirmPassword){
                                    setIsPasswordError(false);
                                    setIsConfirmPasswordError(false);
                                }}}
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
                    <FormControl style={{width: "75%", marginLeft: 'auto', marginRight: 'auto'}} isInvalid={isConfirmPasswordError}>
                        <InputGroup>
                            <Input
                                value={confirmPassword}
                                onBlur={e => {
                                    if(e.target.value != password){
                                        setIsPasswordError(true);
                                        setIsConfirmPasswordError(true);
                                } else if(e.target.value.length === 0){
                                    setIsConfirmPasswordError(true);
                                } else if(e.target.value === password){
                                    setIsPasswordError(false);
                                    setIsConfirmPasswordError(false);
                                }}}
                                onChange={event => setConfirmPassword(event.currentTarget.value)}
                                type={confirmShow ? 'text' : 'password'}
                                placeholder='Confirm Password'
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={() => setConfirmShow(!confirmShow)}>
                                {confirmShow ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        {isConfirmPasswordError ? <FormErrorMessage style={{margin: "0px", padding: "0px"}}></FormErrorMessage>: null}
                    </FormControl>
                    <Button type="submit" style={{width: "75%", marginLeft: 'auto', marginRight: 'auto'}} variant="login">
                    Sign Up
                    </Button>
                </Stack>
            </form>
        </div>
    );
}