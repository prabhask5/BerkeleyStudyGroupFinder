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
    const [isPasswordMatchError, setIsPasswordMatchError] = useState(false);
    const [isConfirmPasswordMatchError, setIsConfirmPasswordMatchError] = useState(false);
    const [isPasswordFormError, setIsPasswordFormError] = useState(false);
    const [isConfirmPasswordFormError, setIsConfirmPasswordFormError] = useState(false);
    const emailRe = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    return (
        <div>
            <Heading variant="logo" size="lg" style={{marginBottom: "50px"}}>BerkeleyFind</Heading>
            <form onSubmit={ e => {
                e.preventDefault();
                let anyError = false;
                if(isEmailError){
                    setEmail("");
                }
                if(!emailRe.test(email)){
                    setIsEmailError(true);
                    anyError = true;
                }
                if(isPasswordMatchError || isPasswordFormError){
                    setPassword("");
                    setShow(false);
                }
                if(password.length === 0){
                    setIsPasswordFormError(true);
                    anyError = true;
                }
                if(isConfirmPasswordMatchError || isConfirmPasswordFormError){
                    setConfirmPassword("");
                    setConfirmShow(false);
                }
                if(confirmPassword.length === 0){
                    setIsConfirmPasswordFormError(true);
                    anyError = true;
                }
                props.submitClick(email, password, isEmailError, isPasswordMatchError, isConfirmPasswordMatchError, isPasswordFormError, isConfirmPasswordFormError, anyError);
            }}>
                <Stack spacing={5}>
                    <Heading size="2xl">Create your account.</Heading>
                    <Text variant="underText">Enter your details to get started</Text>
                    <FormControl style={{width: "75%", marginLeft: 'auto', marginRight: 'auto'}} isInvalid={isEmailError}>
                        <Input value={email} onBlur={e => {if(!emailRe.test(e.target.value)) setIsEmailError(true); else setIsEmailError(false);}} onChange={event => setEmail(event.currentTarget.value)} placeholder="youremail@example.com"/>
                        {isEmailError ? <FormErrorMessage style={{margin: "0px", padding: "0px"}}></FormErrorMessage>: null}
                    </FormControl>
                    <FormControl style={{width: "75%", marginLeft: 'auto', marginRight: 'auto'}} isInvalid={isPasswordMatchError || isPasswordFormError}>
                        <InputGroup>
                            <Input
                            value={password}
                                onBlur={e => {
                                    if(e.target.value != confirmPassword && confirmPassword.length > 0){
                                        setIsPasswordMatchError(true);
                                        setIsConfirmPasswordMatchError(true);
                                    } else if(e.target.value === confirmPassword){
                                        setIsPasswordMatchError(false);
                                        setIsConfirmPasswordMatchError(false);
                                    }}}
                                onChange={event => {setPassword(event.currentTarget.value)
                                                    setIsPasswordFormError(false);
                                                    }}
                                type={show ? 'text' : 'password'}
                                placeholder='Password'
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
                                {show ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        {isPasswordMatchError || isPasswordFormError ? <FormErrorMessage style={{margin: "0px", padding: "0px"}}></FormErrorMessage>: null}
                    </FormControl>
                    <FormControl style={{width: "75%", marginLeft: 'auto', marginRight: 'auto'}} isInvalid={isConfirmPasswordMatchError || isConfirmPasswordFormError}>
                        <InputGroup>
                            <Input
                                value={confirmPassword}
                                onBlur={e => {
                                    if(e.target.value != password && password.length > 0){
                                        setIsPasswordMatchError(true);
                                        setIsConfirmPasswordMatchError(true);
                                    } else if(e.target.value === password){
                                        setIsPasswordMatchError(false);
                                        setIsConfirmPasswordMatchError(false);
                                    }}}
                                onChange={event => {setConfirmPassword(event.currentTarget.value);
                                                    setIsConfirmPasswordFormError(false);
                                                    }}
                                type={confirmShow ? 'text' : 'password'}
                                placeholder='Confirm Password'
                            />
                            <InputRightElement width='4.5rem'>
                                <Button h='1.75rem' size='sm' onClick={() => setConfirmShow(!confirmShow)}>
                                {confirmShow ? 'Hide' : 'Show'}
                                </Button>
                            </InputRightElement>
                        </InputGroup>
                        {isConfirmPasswordMatchError || isConfirmPasswordFormError ? <FormErrorMessage style={{margin: "0px", padding: "0px"}}></FormErrorMessage>: null}
                    </FormControl>
                    <Button type="submit" style={{width: "75%", marginLeft: 'auto', marginRight: 'auto'}} variant="login">
                    Sign Up
                    </Button>
                </Stack>
            </form>
        </div>
    );
}