import ProfileReadView from "../components/ProfileReadView"
import ProfileEditView from "../components/ProfileEditView";
import NavBar from "../components/NavBar";
import { useRouter } from 'next/router';
import { useState, useEffect } from "react";
import AddCourseForm from "../components/AddCourseForm";
import { Button, ButtonGroup, CloseButton, Divider, Heading, Spinner, Stack, Text, Tooltip, useToast} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import CourseListItemUpper from "../components/CourseListItemUpper";
import CourseListItemLower from "../components/CourseListItemLower";
import nookies from "nookies";
import axios from "axios";
import ObjectID from "bson-objectid";

interface CourseListProps {
    _id: ObjectID;
    courseAbrName: string;
    courseLongName: string;
    classNumber: string;
    disNumber: string;
    labNumber: string;
}

interface MyProfilePageProps {
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
    courseList: CourseListProps[],
}

export async function getServerSideProps(context: any) {
    const cookies = nookies.get(context);
    let redirectPath = 0; //0 for startprofile page, 1 for login page, 2 for error page
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
                    if(!res.data.newUser){
                        props = {
                            id: res.data._id,
                            email: res.data.email,
                            profileImage: res.data.profileImage,
                            firstName: res.data.firstName,
                            lastName: res.data.lastName,
                            major: res.data.major,
                            gradYear: res.data.gradYear,
                            userBio: res.data.userBio,
                            pronouns: res.data.pronouns,
                            fbURL: res.data.fbURL,
                            igURL: res.data.igURL,
                            scURL: res.data.scURL,
                            courseList: res.data.courseList,
                        }
                    }
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
    } else{
        return {
            props: props
        }
    }
}

export default function MyProfile(props: MyProfilePageProps) {
    const router = useRouter();
    const toast = useToast();
    const [editState, setEditState] = useState(0); //0 for read, 1 for edit
    const [userCourseData, setUserCourseData] = useState(props.courseList);
    const [profileImage, setProfileImage] = useState(props.profileImage);
    const [profileImageFile, setProfileImageFile] = useState("");
    const [major, setMajor] = useState(props.major);
    const [year, setYear] = useState(props.gradYear);
    const [firstName, setFirstName] = useState(props.firstName);
    const [lastName, setLastName] = useState(props.lastName);
    const [bio, setBio] = useState(props.userBio);
    const [pronouns, setPronouns] = useState(props.pronouns);
    const [fbURL, setFBURL] = useState(props.fbURL);
    const [scURL, setSCURL] = useState(props.igURL);
    const [igURL, setIGURL] = useState(props.scURL);
    const [email, setEmail] = useState(props.email);
    const [anyChanges, setAnyChanges] = useState(false);
    const [isMajorError, setIsMajorError] = useState(false);
    const [isYearError, setIsYearError] = useState(false);
    const [isFirstNameError, setIsFirstNameError] = useState(false);
    const [isLastNameError, setIsLastNameError] = useState(false);
    const [isEmailError, setIsEmailError] = useState(false);
    const [allClosed, setAllClosed] = useState(false);
    const [showSpinner, setShowSpinner] = useState(false);
    const spinner = showSpinner ? <Spinner style={{position: "fixed", bottom: "2%", left: "48.5%", zIndex: "10"}} size="xl" thickness="4px" speed='0.65s' emptyColor='gray.200' color='#A73CFC'/>: null;
    const emailRe = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

    useEffect(() => {
        setAnyChanges(true);
    }, [userCourseData, profileImageFile, major, year, firstName, lastName, bio, pronouns, fbURL, igURL, scURL, email]);
    
    const handleAddCourse = (courseShortHand: string, courseTitle: string, courseID: string, courseDisID: string, courseLabID: string, isCourseShortHandError: boolean, isCourseTitleError: boolean, isCourseIDError: boolean, isCourseDisIDError: boolean, isCourseLabIDError: boolean, anyError: boolean) => {
        if(isCourseShortHandError || isCourseTitleError || isCourseIDError || isCourseDisIDError || isCourseLabIDError || anyError){
            toast({
                title: 'Error with Inputted Information',
                description: "Please enter your invalid information again",
                status: 'error',
                duration: 2000,
                isClosable: true,
              })
        } else {
            const newElement = {
                _id: ObjectID(),
                courseAbrName: courseShortHand,
                courseLongName: courseTitle,
                classNumber: courseID,
                disNumber: courseDisID,
                labNumber: courseLabID,
            };
            setUserCourseData([newElement, ...userCourseData]);
            toast({
                title: 'Course Successfully Added',
                status: 'success',
                duration: 2000,
                isClosable: true,
            })
        }
    }

    const handleDeleteCourse = (courseDataID: string) => {
        setUserCourseData(userCourseData.filter(a => a._id.toString() !== courseDataID));
        toast({
            title: 'Course Successfully Removed',
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
    }

    const handleCancel = () => {
        const cookies = nookies.get({});
        let newData: MyProfilePageProps;
        axios.get("http://localhost:4000/access/me", { headers: {"Authentication" : `Bearer ${cookies.authToken}`, "Authorization": `Bearer ${cookies.signature}`} })
            .then(res => {
                if (res.status === 201 || res.status === 202){
                    nookies.destroy({}, "authToken");
                    nookies.destroy({}, "signature");
                    router.push("/login");
                } else if(res.status === 200){
                    newData = {
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
                        courseList: res.data.courseList,
                    }
                    setUserCourseData(newData.courseList);
                    setProfileImage(newData.profileImage);
                    setMajor(newData.major);
                    setYear(newData.gradYear);
                    setFirstName(newData.firstName);
                    setLastName(newData.lastName);
                    setBio(newData.userBio);
                    setPronouns(newData.pronouns);
                    setFBURL(newData.fbURL);
                    setSCURL(newData.scURL);
                    setIGURL(newData.igURL);
                    setEmail(newData.email);
                }
            })
            .catch(function(error) {
                console.log(error.config);
                router.push("/login");
            });

        setEditState(0);
    }

    const handleChangeProfile = (anyError: boolean) => {
        if(!anyChanges){
            toast({
                title: "No Profile Changes Made",
                description: "Click cancel if you want to make no changes",
                status: "error",
                duration: 2000,
                isClosable: true,
            })
        } else if(isMajorError || isYearError || isFirstNameError || isLastNameError || isEmailError || anyError){
            toast({
                title: 'Error with Inputted Information',
                description: "Please enter your invalid information again",
                status: 'error',
                duration: 2000,
                isClosable: true,
              })
        } else {
            const newProfileData = {
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
            const newCourseData = {
                id: props.id,
                courseList: userCourseData,
            }
            setShowSpinner(true);
            axios.post("http://localhost:4000/user/updateInfo", newProfileData)
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
                        setProfileImage(res.data.profileImage);
                        axios.post("http://localhost:4000/user/updateStartCourseInfo", newCourseData)
                            .then(res => {
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
                                        title: "Profile Successfully Changed",
                                        status: "success",
                                        duration: 2000,
                                        isClosable: true,
                                    })
                                    setEditState(0);
                                }
                            })
                            .catch(function(error) {
                                throw error;
                            });
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
    
    const fbIcon = fbURL === "" ? null: <Tooltip label="Facebook profile" aria-label="tooltip for socials" openDelay={350}><a target="_blank" rel="noreferrer" href={fbURL}>
                                            <svg className="icon" fill="#414141" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="30px" height="30px">
                                                <path d="M15,3C8.373,3,3,8.373,3,15c0,6.016,4.432,10.984,10.206,11.852V18.18h-2.969v-3.154h2.969v-2.099c0-3.475,1.693-5,4.581-5 c1.383,0,2.115,0.103,2.461,0.149v2.753h-1.97c-1.226,0-1.654,1.163-1.654,2.473v1.724h3.593L19.73,18.18h-3.106v8.697 C22.481,26.083,27,21.075,27,15C27,8.373,21.627,3,15,3z"/>
                                            </svg>
                                        </a></Tooltip>;
    const igIcon = igURL === "" ? null: <Tooltip label="Instagram profile" aria-label="tooltip for socials" openDelay={350}><a target="_blank" rel="noreferrer" href={igURL}>
                                            <svg className="icon" fill="#414141" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 48 48" width="30px" height="30px">
                                                <path d="M 16.5 5 C 10.16639 5 5 10.16639 5 16.5 L 5 31.5 C 5 37.832757 10.166209 43 16.5 43 L 31.5 43 C 37.832938 43 43 37.832938 43 31.5 L 43 16.5 C 43 10.166209 37.832757 5 31.5 5 L 16.5 5 z M 16.5 8 L 31.5 8 C 36.211243 8 40 11.787791 40 16.5 L 40 31.5 C 40 36.211062 36.211062 40 31.5 40 L 16.5 40 C 11.787791 40 8 36.211243 8 31.5 L 8 16.5 C 8 11.78761 11.78761 8 16.5 8 z M 34 12 C 32.895 12 32 12.895 32 14 C 32 15.105 32.895 16 34 16 C 35.105 16 36 15.105 36 14 C 36 12.895 35.105 12 34 12 z M 24 14 C 18.495178 14 14 18.495178 14 24 C 14 29.504822 18.495178 34 24 34 C 29.504822 34 34 29.504822 34 24 C 34 18.495178 29.504822 14 24 14 z M 24 17 C 27.883178 17 31 20.116822 31 24 C 31 27.883178 27.883178 31 24 31 C 20.116822 31 17 27.883178 17 24 C 17 20.116822 20.116822 17 24 17 z"/>
                                            </svg>
                                        </a></Tooltip>;
    const scIcon = scURL === "" ? null: <Tooltip label="Snapchat profile" aria-label="tooltip for socials" openDelay={350}><a target="_blank" rel="noreferrer" href={scURL}>
                                            <svg className="icon" fill="#414141" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="30px" height="30px">
                                                <path d="M15.22,5c0.894,0,3.921,0.241,5.347,3.336c0.476,1.033,0.358,2.842,0.263,4.296l-0.004,0.064 c-0.013,0.203-0.026,0.399-0.037,0.587c0.023,0.023,0.205,0.192,0.617,0.208h0.001c0.313-0.012,0.673-0.108,1.067-0.287 c0.116-0.053,0.244-0.064,0.332-0.064c0.134,0,0.269,0.025,0.381,0.071l0.007,0.003c0.319,0.109,0.528,0.326,0.533,0.553 c0.004,0.213-0.164,0.534-0.988,0.849c-0.085,0.033-0.194,0.066-0.311,0.102c-0.471,0.145-1.182,0.364-1.4,0.861 c-0.119,0.272-0.081,0.603,0.114,0.985c0.002,0.004,0.004,0.007,0.005,0.011c0.059,0.134,1.483,3.278,4.662,3.785 c0.117,0.019,0.201,0.12,0.194,0.235c-0.003,0.043-0.014,0.086-0.032,0.129c-0.131,0.297-0.722,0.718-2.79,1.027 c-0.169,0.025-0.235,0.238-0.335,0.685c-0.037,0.163-0.074,0.323-0.125,0.491c-0.044,0.145-0.138,0.214-0.296,0.214H22.4 c-0.109,0-0.266-0.019-0.463-0.056c-0.35-0.066-0.742-0.127-1.242-0.127c-0.291,0-0.593,0.025-0.896,0.073 c-0.621,0.1-1.147,0.461-1.704,0.842C17.281,24.427,16.445,25,15.141,25c-0.057,0-0.113-0.002-0.168-0.005 C14.938,24.998,14.901,25,14.864,25c-1.303,0-2.14-0.573-2.949-1.126c-0.558-0.382-1.085-0.744-1.707-0.843 c-0.303-0.048-0.604-0.073-0.896-0.073c-0.525,0-0.94,0.078-1.242,0.135c-0.184,0.035-0.343,0.065-0.463,0.065 c-0.126,0-0.262-0.026-0.322-0.223c-0.051-0.17-0.089-0.335-0.125-0.494c-0.093-0.41-0.158-0.662-0.335-0.688 c-2.067-0.309-2.659-0.731-2.79-1.03c-0.018-0.043-0.029-0.085-0.032-0.128c-0.006-0.115,0.078-0.216,0.194-0.235 c3.177-0.507,4.602-3.653,4.662-3.786c0.002-0.004,0.004-0.007,0.005-0.011c0.194-0.382,0.233-0.714,0.114-0.985 c-0.218-0.498-0.929-0.716-1.4-0.861c-0.115-0.035-0.225-0.069-0.311-0.102c-0.94-0.36-1.017-0.729-0.981-0.917 c0.063-0.321,0.505-0.545,0.863-0.545c0.098,0,0.184,0.017,0.257,0.05c0.423,0.192,0.804,0.289,1.132,0.289 c0.454,0,0.653-0.185,0.676-0.209c-0.012-0.208-0.026-0.425-0.04-0.65C9.08,11.179,8.963,9.372,9.437,8.339 c1.424-3.094,4.446-3.334,5.337-3.334C14.799,5.004,15.167,5,15.167,5H15.22 M15.22,3h-0.053c-0.013,0-0.235,0.004-0.392,0.007 V3.005c-1.193,0-5.233,0.324-7.154,4.497c-0.484,1.052-0.562,2.356-0.526,3.652c-1.151,0.023-2.498,0.778-2.77,2.157 c-0.099,0.509-0.229,2.23,2.227,3.172c0.013,0.005,0.027,0.01,0.041,0.015c-0.491,0.701-1.394,1.677-2.71,1.887 c-1.131,0.177-1.94,1.175-1.876,2.321c0.018,0.286,0.082,0.552,0.191,0.805c0.513,1.17,1.756,1.702,3.177,2.012 c0.307,0.994,1.181,1.633,2.233,1.633c0.305,0,0.581-0.052,0.825-0.098c0.271-0.051,0.541-0.102,0.88-0.102 c0.186,0,0.381,0.016,0.582,0.048c0.174,0.028,0.568,0.297,0.884,0.514c0.916,0.627,2.161,1.48,4.085,1.48 c0.042,0,0.084-0.001,0.125-0.002C15.039,26.999,15.09,27,15.141,27c1.915,0,3.161-0.849,4.071-1.469 c0.351-0.24,0.728-0.498,0.905-0.526c0.196-0.031,0.392-0.047,0.578-0.047c0.319,0,0.569,0.035,0.869,0.092 c0.33,0.062,0.595,0.091,0.835,0.091c1.062,0,1.926-0.635,2.231-1.618c1.419-0.308,2.661-0.837,3.17-1.992 c0.117-0.271,0.181-0.537,0.198-0.808c0.065-1.156-0.739-2.154-1.869-2.338c-1.321-0.211-2.226-1.187-2.716-1.887 c0.015-0.005,0.029-0.011,0.042-0.016c2.004-0.767,2.283-2.053,2.271-2.751c-0.022-1.069-0.743-2.002-1.842-2.396 c-0.278-0.112-0.624-0.183-0.975-0.195c0.033-1.272-0.047-2.601-0.526-3.643C20.461,3.325,16.415,3,15.22,3L15.22,3z"/>
                                            </svg>
                                        </a></Tooltip>;
    const emailIcon = email === "" ? null: <Tooltip label="Email" aria-label="tooltip for socials" openDelay={350}><a target="_blank" rel="noreferrer" href={"mailto:" + email}>
                                                <svg className="icon" fill="#414141" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="30px" height="30px">
                                                    <path d="M53.42 53.32H10.58a8.51 8.51 0 0 1-8.5-8.5V19.18a8.51 8.51 0 0 1 8.5-8.5h42.84a8.51 8.51 0 0 1 8.5 8.5v25.64a8.51 8.51 0 0 1-8.5 8.5ZM10.58 13.68a5.5 5.5 0 0 0-5.5 5.5v25.64a5.5 5.5 0 0 0 5.5 5.5h42.84a5.5 5.5 0 0 0 5.5-5.5V19.18a5.5 5.5 0 0 0-5.5-5.5Z"/>
                                                    <path d="M32 38.08a8.51 8.51 0 0 1-5.13-1.71L3.52 18.71a1.5 1.5 0 1 1 1.81-2.39L28.68 34a5.55 5.55 0 0 0 6.64 0l23.35-17.68a1.5 1.5 0 1 1 1.81 2.39L37.13 36.37A8.51 8.51 0 0 1 32 38.08Z"/>
                                                    <path d="M4.17 49.14a1.5 1.5 0 0 1-1-2.62l18.4-16.41a1.5 1.5 0 0 1 2 2.24L5.17 48.76a1.46 1.46 0 0 1-1 .38zm55.66 0a1.46 1.46 0 0 1-1-.38l-18.4-16.41a1.5 1.5 0 1 1 2-2.24l18.39 16.41a1.5 1.5 0 0 1-1 2.62z"/>
                                                </svg>
                                            </a></Tooltip>;
    
    const profileView = editState === 0 ? <div style={{marginTop: "6%", marginRight: "3%"}}>
        <Stack spacing={7}>
            <div style={{display: "flex", flexDirection: "row",}}>
                <Heading style={{ paddingRight: "20px" }} size="lg">My Profile</Heading>
                <Button onClick={() => {setEditState(1)
                                        setAnyChanges(false)}} variant="outline" leftIcon={<EditIcon />}>Edit Profile</Button>
            </div>
            <Stack spacing={7}>
                <ProfileReadView profileImage={profileImage} firstName={firstName} lastName={lastName} major={major} gradYear={year} userBio={bio} pronouns={pronouns} />
                <div style={{display: "flex", flexDirection: "row", gap: "10px"}}>
                    {fbIcon}
                    {igIcon}
                    {scIcon}
                    {emailIcon}
                </div>
            </Stack>
        </Stack>
    </div>:<div style={{width: "45%", height: "650px", overflowY: "auto", overflowX: "hidden", marginRight: "2%"}}>
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
                handleChangeProfile(anyError);
            }}>
            <Stack spacing={3} style={{marginRight: "20px"}}>
                <Heading size="lg">My Profile</Heading>
                <ProfileEditView profileImage={profileImage} firstName={firstName} lastName={lastName} major={major} gradYear={year} userBio={bio} pronouns={pronouns} fbURL={fbURL} igURL={igURL} scURL={scURL} setMajor={setMajor} setYear={setYear} setFirstName={setFirstName} setLastName={setLastName} setBio={setBio} setPronouns={setPronouns} setFBURL={setFBURL} setIGURL={setIGURL} setSCURL={setSCURL} isMajorError={isMajorError} isYearError={isYearError} isFirstNameError={isFirstNameError} isLastNameError={isLastNameError} setIsMajorError={setIsMajorError} setIsYearError={setIsYearError} setIsFirstNameError={setIsFirstNameError} setIsLastNameError={setIsLastNameError} email={email} isEmailError={isEmailError} setEmail={setEmail} setIsEmailError={setIsEmailError} profileImageFile={profileImageFile} setProfileImageFile={setProfileImageFile} />
                <ButtonGroup gap={4}>
                    <Button type="submit" colorScheme="messenger">Save</Button>
                    <Button onClick={handleCancel} colorScheme="gray">Cancel</Button>
                </ButtonGroup>
            </Stack>
        </form>
    </div>
    const courseListView = editState === 0 ? <div style={{marginLeft: "4%", marginTop: "2%", width: "58%"}}>
        <Text style={{paddingBottom: "10px", textAlign: "center", color: "#A73CFC", fontWeight: "700"}}>My Classes</Text>
        <Divider style={{backgroundColor: "#D8D8D8"}} variant="solid" />
            <div onScroll={() => setAllClosed(!allClosed)} className="scrollingDiv" style={{height: "65vh", overflowY: "auto", overflowX: "hidden"}}>
                {userCourseData.map(function(d) {
                    return (
                        <div key={d._id.toString()}>
                            <CourseListItemUpper courseListing={d.courseAbrName} courseFullName={d.courseLongName} allClosed={allClosed}/>
                            <CourseListItemLower classNumber={d.classNumber} classDis={d.disNumber} classLab={d.labNumber} />
                            <Divider style={{backgroundColor: "#D8D8D8"}} variant="solid" />
                        </div>
                    );
                })}
            </div>
    </div>: <div style={{width: "46%", marginLeft: "2%", marginTop: "2%"}}>
        <Text style={{paddingBottom: "10px", textAlign: "center", color: "#A73CFC", fontWeight: "700"}}>My Classes</Text>
                <div>
                    <Divider style={{backgroundColor: "#D8D8D8"}} variant="solid" />
                    <div onScroll={() => setAllClosed(!allClosed)} className="scrollingDiv" style={{height: "30vh", overflowY: "auto", overflowX: "hidden"}}>
                        {userCourseData.map(function(d) {
                                return (
                                    <div key={d._id.toString()}>
                                        <div style={{display: "grid", gridTemplateColumns: "93% 5%", }}>
                                            <CourseListItemUpper courseListing={d.courseAbrName} courseFullName={d.courseLongName} allClosed={allClosed}/>
                                            <Tooltip label="Delete course" aria-label="remove course" openDelay={350}><CloseButton style={{marginTop: "15px"}} onClick={() => handleDeleteCourse(d._id.toString())} /></Tooltip>
                                        </div>
                                            <CourseListItemLower classNumber={d.classNumber} classDis={d.disNumber} classLab={d.labNumber} />
                                        <Divider style={{backgroundColor: "#D8D8D8"}} variant="solid" />
                                    </div>
                                );
                            })}
                    </div>
                </div>
                <AddCourseForm addCourseClick={handleAddCourse}></AddCourseForm>
    </div>
    return (
        <div>
            <NavBar profileImage={profileImage} page={router.pathname} firstName={firstName} lastName={lastName} email={email}/>
            <div style={{display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                {profileView}
                {courseListView}
            </div>
            {spinner}
        </div>
    );
}