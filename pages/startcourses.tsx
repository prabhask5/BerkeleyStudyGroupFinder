import { EditIcon } from "@chakra-ui/icons";
import {Button, CloseButton, Divider, Heading, IconButton, Spinner, Text, Tooltip, useToast} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import AddCourseForm from "../components/AddCourseForm";
import CourseListItemLower from "../components/CourseListItemLower";
import CourseListItemUpper from "../components/CourseListItemUpper";
import ObjectID from "bson-objectid";
import nookies from "nookies";
import axios from "axios";

interface CourseListProps {
    _id: ObjectID;
    courseAbrName: string;
    courseLongName: string;
    classNumber: string;
    disNumber: string;
    labNumber: string;
}

interface StartCoursesPageProps{
    id: string;
    courseList: CourseListProps[];
    newUser: boolean;
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
                    if(!res.data.completedStartProfile) redirectPath = 4;
                    else if(res.data.newUser){
                        props = {
                            id: res.data._id ? res.data._id: "",
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
    } else if(redirectPath === 4){
        return {
            redirect: {
                permanent: false,
                destination: "/startprofile"
            }
        }
    } else{
        return {
            props: props
        }
    }
}


export default function StartCourses(props: StartCoursesPageProps){
    const router = useRouter();
    const toast = useToast();
    const [userCourseData, setUserCourseData] = useState(props.courseList);
    const [showSpinner, setShowSpinner] = useState(false);
    const [allClosed, setAllClosed] = useState(false);
    const spinner = showSpinner ? <Spinner style={{position: "fixed", bottom: "2%", left: "50%", zIndex: "10"}} size="xl" thickness="4px" speed='0.65s' emptyColor='gray.200' color='#A73CFC'/>: null;
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

    const handleNext = () => {
        const newData = {
            id: props.id,
            courseList: userCourseData,
        }
        setShowSpinner(true);
        axios.post("http://localhost:4000/user/updateCourseInfo", newData)
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
                        router.push("/myprofile");
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

    return (
        <div style={{display: "flex", flexDirection: "row"}}>
            <div style={{margin: "auto", textAlign: "center", width: "30%"}}>
                <Heading size="xl">Next, add your current courses to find students who share your learning interests.</Heading>
            </div>
            <div style={{margin: "auto", width: "50%"}}>
                <div>
                    <Text style={{paddingBottom: "10px", textAlign: "center", color: "#A73CFC", fontWeight: "700"}}>My Classes</Text>
                    <div>
                        <Divider style={{backgroundColor: "#D8D8D8"}} variant="solid" />
                        <div onScroll={() => setAllClosed(!allClosed)} style={{height: "300px", overflowY: "auto", overflowX: "hidden"}}>
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
            </div>
            <Button onClick={handleNext} style={{marginRight: "2%", marginTop: "50%"}} variant="start">Finish Setup</Button>
            {spinner}
        </div>
    );
}