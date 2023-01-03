/* eslint-disable react/no-unescaped-entities */
import {Stack, Text, Link, useToast, Spinner} from '@chakra-ui/react';
import LoginView from '../components/LoginView';
import SignUpView from '../components/SignUpView';
import {useEffect, useState} from 'react';
import { useRouter } from "next/router";
import axios from 'axios';
import nookies from "nookies";

interface LoginPageProps{
    error: number;
}

export async function getServerSideProps(context: any) {
    const cookies = nookies.get(context);
    let redirectPath = 0; //0 for login page, 1 for signup flow into startprofile, 2 for signup flow into startcourses, 3 for login flow
    let isPageError = 0; //0 for no error, 1 for session timeout, 2 for session token error
    await axios.get("http://localhost:4000/access/me", { headers: {"Authentication" : `Bearer ${cookies.authToken}`, "Authorization": `Bearer ${cookies.signature}`} })  
        .then(res => {
                if (res.status === 201 || res.status === 202){
                    nookies.destroy(context, "authToken");
                    nookies.destroy(context, "signature");
                    if(res.status === 201) isPageError = 1;
                    else if(res.status === 202) isPageError = 2;
                } else if(res.status === 200){
                    if(!res.data.completedStartProfile) redirectPath = 1;
                    else if(res.data.newUser) redirectPath = 2;
                    else redirectPath = 3;
                }
            })
        .catch(function(error) {
            isPageError = 2;
        });
    if (redirectPath === 1){
        return {
            redirect: {
                permanent: false,
                destination: "/startprofile"
            }
        }
    } else if (redirectPath === 2) {
        return {
            redirect: {
                permanent: false,
                destination: "/startcourses"
            }
        }
    } else if (redirectPath === 3){
        return {
            redirect: {
                permanent: false,
                destination: "/explore"
            }
        }
    } else{
        return {
            props: {error: isPageError},
        }
    }
}

export default function Login(props: LoginPageProps) {
    const [viewState, setViewState] = useState(0);
    const [showSpinner, setShowSpinner] = useState(false);
    const router = useRouter();
    const {fromOtherPage} = router.query;
    const toast = useToast();
    const spinner = showSpinner ? <Spinner style={{position: "fixed", bottom: "10%", left: "48.5%", zIndex: "10"}} size="xl" thickness="4px" speed='0.65s' emptyColor='gray.200' color='#A73CFC'/>: null;
    useEffect(() => {
        if(props.error === 1){
            toast({
                title: 'Your Session has Expired',
                description: "Please log in again",
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        } else if(props.error === 2){
            toast({
                title: 'Error with Session',
                description: "Please log in again",
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        } else if(fromOtherPage !== undefined){
            toast({
                title: 'Please log in first',
                status: 'error',
                duration: 2000,
                isClosable: true,
            })
        }
    }, [])
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
            setShowSpinner(true);
            axios.post("http://localhost:4000/auth/login", {email: email, password: password})
                .then(res => {
                    setShowSpinner(false);
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
                            title: 'Unexpected Server Error',
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
                        const tokenList = res.data.token.split(".");
                        const header = tokenList[0];
                        const payload = tokenList[1];
                        const signature = tokenList[2];
                        nookies.set({ res }, "authToken", header + "." + payload, {maxAge: 2 * 60 * 60 * 1000, sameSite: true, secure: true});
                        nookies.set({ res }, "signature", signature, {maxAge: 2 * 60 * 60 * 1000, sameSite: true, secure: true});
                        router.push("/explore");
                    }
                })
                .catch(function(error) {
                    toast({
                        title: 'Unexpected Server Error',
                        description: "Please try again",
                        status: 'error',
                        duration: 2000,
                        isClosable: true,
                    })
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
            setShowSpinner(true);
            axios.post("http://localhost:4000/auth/signup", {email: email, password: password})
                .then(res => {
                    setShowSpinner(false);
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
                            title: 'Unexpected Server Error',
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
                        const tokenList = res.data.token.split(".");
                        const header = tokenList[0];
                        const payload = tokenList[1];
                        const signature = tokenList[2];
                        nookies.set({ res }, "authToken", header + "." + payload, {maxAge: 2 * 60 * 60 * 1000, sameSite: true, secure: true});
                        nookies.set({ res }, "signature", signature, {maxAge: 2 * 60 * 60 * 1000, sameSite: true, secure: true});
                        router.push("/startprofile");
                    }
                })
                .catch(function(error) {
                    toast({
                        title: 'Unexpected Server Error',
                        description: "Please try again",
                        status: 'error',
                        duration: 2000,
                        isClosable: true,
                    })
                });
        }
    }
    if(viewState === 0){
        return (
            <div>
                <div style={{marginTop: "12%", marginLeft: "auto", marginRight: "auto", width: '60%', textAlign: 'center'}}>
                    <Stack spacing={5}>
                        <LoginView submitClick={handleLogin}/>
                        <Text variant="underText">Don't have an account? <Link onClick={() => setViewState(1)}>Sign up</Link></Text>
                    </Stack>
                </div>
                {spinner}
            </div>
        );
    } else if(viewState === 1){
        return (
            <div>
                <div style={{marginTop: "11%", marginLeft: "auto", marginRight: "auto", width: '60%', textAlign: 'center'}}>
                    <Stack spacing={5}>
                    <SignUpView submitClick={handleSignUp}/>
                    <Text variant="underText">Already have an account? <Link onClick={() => setViewState(0)}>Log in</Link></Text>
                    </Stack>
                </div>
                {spinner}
            </div>
        );
    }
}