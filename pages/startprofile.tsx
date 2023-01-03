import {Button, Heading, useToast, Spinner, Divider} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import ProfileEditView from "../components/ProfileEditView";
import axios from "axios";
import nookies from "nookies";

interface StartProfilePageProps {
    id: string;
    email: string;
    profileImage: string;
    firstName: string;
    lastName: string;
    major: string;
    gradYear: string;
    userBio: string;
    pronouns: string;
    fbURL: string;
    igURL: string;
    scURL: string;
}

export async function getServerSideProps(context: any) {
    const cookies = nookies.get(context);
    let redirectPath = 0; //0 for startprofile page, 1 for login page when token expires, 2 for error page, 3 for no token login page, 4 for start courses page
    let props = {}
    await axios.get("http://localhost:4000/access/me", { headers: {"Authentication" : `Bearer ${cookies.authToken}`, "Authorization": `Bearer ${cookies.signature}`} })
            .then(res => {
                if (res.status === 201 || res.status === 202){
                    nookies.destroy(context, "authToken");
                    nookies.destroy(context, "signature");
                    redirectPath = 1;
                } else if(res.status === 203){
                    redirectPath = 3;
                } else if(res.status === 200){
                    if(!res.data.completedStartProfile){
                        props = {
                            id: res.data._id ? res.data._id: "",
                            email: res.data.email ? res.data.email: "",
                            profileImage: res.data.profileImage ? res.data.profileImage: "",
                            firstName: res.data.firstName ? res.data.firstName: "",
                            lastName: res.data.lastName ? res.data.lastName: "",
                            major: res.data.major ? res.data.major: "",
                            gradYear: res.data.gradYear ? res.data.gradYear: "",
                            userBio: res.data.userBio ? res.data.userBio: "",
                            pronouns: res.data.pronouns ? res.data.pronouns: "",
                            fbURL: res.data.fbURL ? res.data.fbURL: "",
                            igURL: res.data.igURL ? res.data.igURL: "",
                            scURL: res.data.scURL ? res.data.scURL: "",
                        }
                    } else if(res.data.newUser) redirectPath = 4;
                    else redirectPath = 2;
                }
            })
            .catch(function(error) {
                console.log(error.config);
                redirectPath = 1;
            });
    if (redirectPath === 1){
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            }
        }
    } else if (redirectPath === 2){
        return {
            redirect: {
                permanent: false,
                destination: "/error"
            }
        }
    } else if(redirectPath === 3){
        return {
            redirect: {
                permanent: false,
                destination: "/login?fromOtherPage=true",
            }
        }
    } else if(redirectPath === 4){
        return {
            redirect: {
                permanent: false,
                destination: "/startcourses"
            }
        }
    } else{
        return {
            props: props
        }
    }
}

export default function StartProfile(props: StartProfilePageProps){
    const router = useRouter();
    const [profileImageFile, setProfileImageFile] = useState("");
    const [major, setMajor] = useState(props.major);
    const [year, setYear] = useState(props.gradYear);
    const [email, setEmail] = useState(props.email);
    const [firstName, setFirstName] = useState(props.firstName);
    const [lastName, setLastName] = useState(props.lastName);
    const [bio, setBio] = useState(props.userBio);
    const [pronouns, setPronouns] = useState(props.pronouns);
    const [fbURL, setFBURL] = useState(props.fbURL);
    const [scURL, setSCURL] = useState(props.scURL);
    const [igURL, setIGURL] = useState(props.igURL);
    const [isMajorError, setIsMajorError] = useState(false);
    const [isYearError, setIsYearError] = useState(false);
    const [isFirstNameError, setIsFirstNameError] = useState(false);
    const [isLastNameError, setIsLastNameError] = useState(false);
    const [isEmailError, setIsEmailError] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const emailRe = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
    const toast = useToast();
    const spinner = showSpinner ? <Spinner style={{position: "fixed", bottom: "2%", left: "48.5%", zIndex: "10"}} size="xl" thickness="4px" speed='0.65s' emptyColor='gray.200' color='#A73CFC'/>: null;
    const handleNext = (anyError: boolean) => {
        if(isMajorError || isYearError || isFirstNameError || isLastNameError || isEmailError || anyError){
            toast({
                title: 'Error with Inputted Information',
                description: "Please enter your invalid information again",
                status: 'error',
                duration: 2000,
                isClosable: true,
              })
        } else{
            const newData = {
                id: props.id,
                email: email,
                profileImageFile: profileImageFile,
                firstName: firstName,
                lastName: lastName,
                major: major,
                gradYear: year,
                userBio: bio,
                pronouns: pronouns,
                fbURL: fbURL,
                igURL: igURL,
                scURL: scURL,
            }
            setShowSpinner(true);
            axios.post("http://localhost:4000/user/updateInfo", newData)
                .then(res => {
                    setShowSpinner(false);
                    if(res.status === 202){
                        toast({
                            title: 'Unexpected Server Error',
                            description: "Please try again",
                            status: 'error',
                            duration: 2000,
                            isClosable: true,
                        })
                    } else if(res.status === 200){
                        toast({
                            title: 'Information Saved',
                            status: 'success',
                            duration: 2000,
                            isClosable: true,
                        })
                        router.push("/startcourses");
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
    return (
        <form onSubmit={e => {
            e.preventDefault();
            let anyError = false;
            if(isEmailError) setEmail("");
            if(isMajorError) setMajor("");
            if(isFirstNameError) setFirstName("");
            if(isLastNameError) setLastName("");
            if(isYearError) setYear("");
            if(!emailRe.test(email)){
                setIsEmailError(true);
                anyError = true;
            }
            if(major.length === 0){
                setIsMajorError(true);
                anyError = true;
            }
            if(firstName.length === 0){
                setIsFirstNameError(true);
                anyError = true;
            }
            if(lastName.length === 0){
                setIsLastNameError(true);
                anyError = true;
            }
            if(year.length === 0){
                setIsYearError(true);
                anyError = true;
            }
            handleNext(anyError);
        }}>
            <div style={{display: "flex", flexDirection: "row"}}>
                <div style={{margin: "auto", textAlign: "center", width: "30%"}}>
                    <Heading size="xl">Welcome! Start building your profile by first entering some basic information.</Heading>
                </div>
                <div style={{margin: "auto", width: "50%"}}>
                    <ProfileEditView profileImage={props.profileImage} firstName={firstName} lastName={lastName} email={email} major={major} gradYear={year} userBio={bio} pronouns={pronouns} fbURL={fbURL} igURL={igURL} scURL={scURL} setMajor={setMajor} setYear={setYear} setFirstName={setFirstName} setLastName={setLastName} setBio={setBio} setPronouns={setPronouns} setFBURL={setFBURL} setIGURL={setIGURL} setSCURL={setSCURL} isMajorError={isMajorError} isYearError={isYearError} isFirstNameError={isFirstNameError} isLastNameError={isLastNameError} setIsMajorError={setIsMajorError} setIsYearError={setIsYearError} setIsFirstNameError={setIsFirstNameError} setIsLastNameError={setIsLastNameError} isEmailError={isEmailError} setEmail={setEmail} setIsEmailError={setIsEmailError} profileImageFile={profileImageFile} setProfileImageFile={setProfileImageFile} />
                </div>
                <Button style={{marginRight: "2%", marginTop: "50%"}} type="submit" variant="start">Next</Button>
            </div>
            {spinner}
        </form>
    );
}