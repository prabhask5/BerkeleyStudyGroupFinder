/* eslint-disable react/no-unescaped-entities */
import {Stack, Text, Link, useToast} from '@chakra-ui/react';
import LoginView from '../components/LoginView';
import SignUpView from '../components/SignUpView';
import {useState} from 'react';
import { useRouter } from "next/router";

export default function Login() {
    const [viewState, setViewState] = useState(0);
    const router = useRouter();
    const toast = useToast();
    const handleLogin = (email: string, password: string, isEmailError: boolean, isPasswordError: boolean, anyError: boolean) => {
        if(isEmailError || isPasswordError || anyError){
            toast({
                title: 'Error with Inputted Information',
                description: "Please enter your invalid information again",
                status: 'error',
                duration: 2000,
                isClosable: true,
              })
        }
        else {
            console.log("Email: " + email + "  Password: " + password);
            router.push("/explore");
        }

    }
    const handleSignUp = (email: string, password: string, isEmailError: boolean, isPasswordError: boolean, isConfirmPasswordError: boolean, anyError: boolean) => {
        if(isEmailError || isPasswordError || isConfirmPasswordError || anyError){
            toast({
                title: 'Error with Inputted Information',
                description: "Please enter your invalid information again",
                status: 'error',
                duration: 2000,
                isClosable: true,
              })
        }
        else {
            console.log("Signup! Email: " + email + "  Password: " + password);
            router.push("/startprofile");
        }
    }
    if(viewState === 0){
        return (
            <div style={{marginTop: "12%", marginLeft: "auto", marginRight: "auto", width: '60%', textAlign: 'center'}}>
                <Stack spacing={5}>
                    <LoginView submitClick={handleLogin}/>
                    <Text variant="underText">Don't have an account? <Link onClick={() => setViewState(1)}>Sign up</Link></Text>
                </Stack>
            </div>
        );
    } else if(viewState === 1){
        return (
            <div style={{marginTop: "11%", marginLeft: "auto", marginRight: "auto", width: '60%', textAlign: 'center'}}>
                <Stack spacing={5}>
                <SignUpView submitClick={handleSignUp}/>
                <Text variant="underText">Already have an account? <Link onClick={() => setViewState(0)}>Log in</Link></Text>
                </Stack>
            </div>
        );
    }
}