import { useRouter } from "next/router";
import NavBar from "../components/NavBar";
import {Heading, Icon, Link, SimpleGrid, Stack, useToast, Text, InputGroup, InputLeftElement, Input, FormControl, Tag, TagLabel, TagCloseButton} from "@chakra-ui/react";
import ProfileSummaryBox from "../components/ProfileSummaryBox";
import placeHolderData from "../testdata";
import { useState } from "react";
import { FiFilter } from "react-icons/fi";
import { SearchIcon } from "@chakra-ui/icons";

interface tagListProps{
    id: number;
    course: string;
}

export default function Explore() {
    const router = useRouter();
    const toast = useToast();
    const [studentData, setStudentData] = useState(placeHolderData.otherData);
    const startList: tagListProps[] = [];
    const [tagList, setTagList] = useState(startList);
    const [course, setCourse] = useState("");
    const [courseId, setCourseId] = useState(0);
    const handleFriend = (studentId: number) => {
        toast({
            title: 'Friend Request Sent',
            description: "Your study group friend request was successfully sent.",
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
        setStudentData(studentData.filter(s => s.id !== studentId));
    };
    const handleAddTag = (newCourse: string) => {
        const newData: tagListProps = {
            id: courseId,
            course: newCourse,

        }
        setTagList([...tagList, newData]);
        setCourse("");
        setCourseId(courseId + 1);
    };
    const handleDeleteTag = (courseId: number) => {
        setTagList(tagList.filter(t => t.id !== courseId));
    };
    
    return (
        <div>
            <NavBar profileImage={placeHolderData.myData.profileImage} page={router.pathname} firstName={placeHolderData.myData.firstName} lastName={placeHolderData.myData.lastName} email={placeHolderData.myData.email} />
            <div style={{display: "flex", flexDirection: "row"}}>
                <form style={{padding: "40px", width:"25%", borderRight: "solid #D8D8D8", height: "87vh"}} onSubmit={e => {
                    e.preventDefault();
                    handleAddTag(course);
                    console.log(tagList);
                }}>
                    <Stack spacing={4}>
                        <div style={{display: "grid", gridTemplateColumns: "40px 70px auto"}}>
                            <Icon boxSize="1.5em" as={FiFilter} />
                            <Heading size="md">Filters</Heading>
                            <Link style={{paddingTop: "1px"}} variant="filter">Reset</Link>
                        </div>
                        <Text variant="underText">Filter students by classes to find students who share your learning interests.</Text>
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
                                    <Tag key={d.id} borderRadius='full' variant='solid' colorScheme='green'>
                                        <TagLabel>{d.course}</TagLabel>
                                        <TagCloseButton style={{marginLeft: "auto"}} onClick={() => handleDeleteTag(d.id)}/>
                                    </Tag>
                                );
                            })}
                        </Stack>
                    </Stack>
                </form>
                <div style={{backgroundColor: "#fafafa", width: "90%"}}>
                    <SimpleGrid style={{height: "87vh", overflowY: "auto", overflowX: "hidden", overflow: "auto"}} minChildWidth='400px' spacing="30px">
                        {studentData.map(d => <div style={{marginTop: "50px", marginLeft: "50px"}} key={d.id}><ProfileSummaryBox profileImage={d.profileImage} firstName={d.firstName} lastName={d.lastName} major={d.major} gradYear={d.gradYear} userBio={d.userBio} pronouns={d.pronouns} fbURL={d.fbURL} igURL={d.igURL} scURL={d.scURL} courseList={d.courses} likeClick={() => handleFriend(d.id)}/></div>)}
                    </SimpleGrid>
                </div>
            </div>
        </div>
    );
}