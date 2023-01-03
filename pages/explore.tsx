import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import {Heading, Icon, Link, SimpleGrid, Stack, useToast, Text, InputGroup, InputLeftElement, Input, FormControl, Tag, TagLabel, TagCloseButton} from "@chakra-ui/react";
import ProfileSummaryBox from "../components/ProfileSummaryBox";
import { useState } from "react";
import { FiFilter } from "react-icons/fi";
import { SearchIcon } from "@chakra-ui/icons";
import nookies from "nookies";
import axios from "axios";
import ObjectID from "bson-objectid";

interface tagListProps{
    _id: ObjectID;
    course: string;
}

interface CourseListProps {
    _id: ObjectID;
    courseAbrName: string;
    courseLongName: string;
    classNumber: string;
    disNumber: string;
    labNumber: string;
}

interface StudentProfileProps {
    _id: string;
    profileImage: string;
    firstName: string;
    lastName: string;
    major: string;
    gradYear: string;
    userBio: string;
    pronouns: string;
    courseList: CourseListProps[],
}

interface ExplorePageProps{
    id: string;
    profileImage: string;
    firstName: string;
    lastName: string;
    email: string;
    studentProfileList: StudentProfileProps[];
}

export async function getServerSideProps(context: any) {
    const cookies = nookies.get(context);
    let redirectPath = 0; //0 for startprofile page, 1 for login page, 2 for error page
    let props = {}
    await axios.get("http://localhost:4000/access/allOthers", { headers: {"Authentication" : `Bearer ${cookies.authToken}`, "Authorization": `Bearer ${cookies.signature}`} })
            .then(res => {
                if (res.status === 201 || res.status === 202){
                    nookies.destroy(context, "authToken");
                    nookies.destroy(context, "signature");
                    redirectPath = 1;
                } else if(res.status === 203){
                    redirectPath = 3;
                } else if(res.status === 200){
                    if(!res.data.user.newUser){
                        props = {
                            id: res.data.user._id,
                            profileImage: res.data.user.profileImage,
                            firstName: res.data.user.firstName,
                            lastName: res.data.user.lastName,
                            email: res.data.user.email,
                            studentProfileList: res.data.users.filter((d: StudentProfileProps) => !(res.data.user.friendsList.includes(d._id) || res.data.user.incomingRequestsList.includes(d._id) || res.data.user.outgoingRequestsList.includes(d._id))),
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

export default function Explore(props: ExplorePageProps) {
    const router = useRouter();
    const toast = useToast();
    const [studentData, setStudentData] = useState(props.studentProfileList);
    const startList: tagListProps[] = [];
    const [tagList, setTagList] = useState(startList);
    const [course, setCourse] = useState("");
    const [courseId, setCourseId] = useState(0);

    const handleFriend = (studentId: string) => {
        const newData = {
            id: props.id,
            friendId: studentId,
        };
        axios.post("http://localhost:4000/requests/sendFriend", newData)
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
                        title: 'Friend Request Sent',
                        status: 'success',
                        duration: 2000,
                        isClosable: true,
                    });
                }
                setStudentData(studentData.filter(d => d._id != studentId));
            })
            .catch(error => {
                toast({
                    title: 'Unexpected Server Error',
                    description: "Please try again",
                    status: 'error',
                    duration: 2000,
                    isClosable: true,
                });
            });
    };

    const handleTempDelete = (studentId: string) => {
        toast({
            title: 'Profile Temporarily Hidden',
            description: "Refresh the page to see this profile again",
            status: "success",
            duration: 2000,
            isClosable: true,
        })
        setStudentData(studentData.filter(d => d._id != studentId));
    };

    const handleAddTag = (newCourse: string) => {
        const newData: tagListProps = {
            _id: ObjectID(),
            course: newCourse,

        }
        setTagList([...tagList, newData]);
        setCourse("");
        setCourseId(courseId + 1);
    };

    const handleDeleteTag = (courseId: string) => {
        setTagList(tagList.filter(t => t._id.toString () !== courseId));
    };
    
    const tagFilter = (student: StudentProfileProps) => {
        const specTagMatch = []
        for(let i = 0; i < tagList.length; i++){
            specTagMatch[i] = false;
        }
        const courseList = student.courseList;
        for(const course of courseList){
            for(let i = 0; i < tagList.length; i++){
                if(course.courseAbrName == tagList[i].course) specTagMatch[i] = true;
            }
        }
        return specTagMatch.every(e => e === true) || tagList.length === 0;
    }
    return (
        <div>
            <NavBar profileImage={props.profileImage} page={router.pathname} firstName={props.firstName} lastName={props.lastName} email={props.email} />
            <div style={{display: "flex", flexDirection: "row"}}>
                <form style={{padding: "40px", width:"25%", borderRight: "solid #D8D8D8", height: "87vh"}} onSubmit={e => {
                    e.preventDefault();
                    handleAddTag(course);
                }}>
                    <Stack spacing={4}>
                        <div style={{display: "grid", gridTemplateColumns: "40px 70px auto"}}>
                            <Icon boxSize="1.5em" as={FiFilter} />
                            <Heading size="md">Filters</Heading>
                            <Link onClick={() => setTagList(startList)} style={{paddingTop: "1px"}} variant="filter">Reset</Link>
                        </div>
                        <Text variant="underText">Type in a class abbreviation to filter students by classes to find students who share your learning interests.</Text>
                        <FormControl isRequired>
                            <InputGroup>
                                <InputLeftElement pointerEvents='none'>
                                    <SearchIcon />
                                </InputLeftElement>
                                <Input style={{borderRadius: "10px"}} placeholder="Search for a class..." onChange={e => setCourse(e.target.value)} value={course}/>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={2} style={{height: "60vh", overflowY: "auto", overflowX: "hidden", overflow: "auto"}}>
                            {tagList.map(d => {
                                return (
                                    <Tag key={d._id.toString()} borderRadius='full' variant='solid' colorScheme='green'>
                                        <TagLabel>{d.course}</TagLabel>
                                        <TagCloseButton style={{marginLeft: "auto"}} onClick={() => handleDeleteTag(d._id.toString())}/>
                                    </Tag>
                                );
                            })}
                        </Stack>
                    </Stack>
                </form>
                <div style={{backgroundColor: "#fafafa", width: "90%"}}>
                    <SimpleGrid style={{height: "87vh", overflowY: "auto", overflowX: "hidden", overflow: "auto"}} minChildWidth='400px' spacing="30px">
                        {studentData.filter(d => tagFilter(d)).map(d => <div style={{marginTop: "50px", marginLeft: "50px"}} key={d._id}><ProfileSummaryBox profileImage={d.profileImage} firstName={d.firstName} lastName={d.lastName} major={d.major} gradYear={d.gradYear} userBio={d.userBio} pronouns={d.pronouns} courseList={d.courseList} likeClick={() => handleFriend(d._id)} deleteClick={() => handleTempDelete(d._id)} delToolTip={"Temporarily hide profile"} likeToolTip={"Add friend"}/></div>)}
                    </SimpleGrid>
                </div>
            </div>
        </div>
    );
}