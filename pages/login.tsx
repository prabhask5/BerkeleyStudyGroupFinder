/* eslint-disable react/no-unescaped-entities */
import {Stack, Text, Link, useToast} from '@chakra-ui/react';
import LoginView from '../components/LoginView';
import SignUpView from '../components/SignUpView';
import {useState} from 'react';
import { useRouter } from "next/router";
import axios from 'axios';

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
            axios.post("http://localhost:4000/auth/login", {email: email, password: password})
                .then(res => {
                    if(res.status === 201){
                        if(res.data.message === "User Not Exist"){
                            toast({
                                title: 'User Not Found',
                                description: "A user with this email could not be found. Please try again",
                                status: 'error',
                                duration: 2000,
                                isClosable: true,
                            })
                        } else if(res.data.message === "Incorrect Password"){
                            toast({
                                title: 'Incorrect Password',
                                description: "This email password combination is incorrect. Please try again",
                                status: 'error',
                                duration: 2000,
                                isClosable: true,
                            })
                        }
                    } else if(res.status === 202){
                        toast({
                            title: 'Unexpected error',
                            description: "Please try again",
                            status: 'error',
                            duration: 2000,
                            isClosable: true,
                        })
                    } else if(res.status === 200){
                        toast({
                            title: 'Login Successful',
                            status: 'success',
                            duration: 2000,
                            isClosable: true,
                        })
                        localStorage.setItem("authToken", res.data.token);
                        router.push("/explore");
                    }
                });
        }

    }
    const handleSignUp = (email: string, password: string, isEmailError: boolean, isPasswordMatchError: boolean, isConfirmPasswordMatchError: boolean, isPasswordFormError: boolean, isConfirmPasswordFormError: boolean, anyError: boolean) => {
        if(isEmailError || isPasswordFormError || isConfirmPasswordFormError || anyError){
            toast({
                title: 'Error with Inputted Information',
                description: "Please enter your invalid information again",
                status: 'error',
                duration: 2000,
                isClosable: true,
              })
        }
        else if(isPasswordMatchError || isConfirmPasswordMatchError){
            toast({
                title: 'Error with Inputted Information',
                description: "Password and confirm password does not match",
                status: 'error',
                duration: 2000,
                isClosable: true,
              })
        }
        else {
            axios.post("http://localhost:4000/auth/signup", {email: email, password: password})
                .then(res => {
                    if(res.status === 201){
                        toast({
                            title: 'User with This Email Already Exists',
                            description: "Please use another email address",
                            status: 'error',
                            duration: 2000,
                            isClosable: true,
                        })
                    } else if(res.status === 202){
                        toast({
                            title: 'Unexpected error',
                            description: "Please try again",
                            status: 'error',
                            duration: 2000,
                            isClosable: true,
                        })
                    } else if(res.status === 200){
                        toast({
                            title: 'Sign Up Successful',
                            status: 'success',
                            duration: 2000,
                            isClosable: true,
                        })
                        localStorage.setItem("authToken", res.data.token);
                        router.push("/startprofile");
                    }
                });
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