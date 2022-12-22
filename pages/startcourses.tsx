import { EditIcon } from "@chakra-ui/icons";
import {Button, CloseButton, Divider, Heading, IconButton, Text, useToast} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";
import AddCourseForm from "../components/AddCourseForm";
import CourseListItemLower from "../components/CourseListItemLower";
import CourseListItemUpper from "../components/CourseListItemUpper";
import placeHolderData from "../testdata";

export default function StartCourses(){
    const router = useRouter();
    const toast = useToast();
    const [userCourseData, setUserCourseData] = useState(placeHolderData.myData.courses);
    const [allClosed, setAllClosed] = useState(false);
    const [courseId, setCourseId] = useState(10);
    const handleAddCourse = (courseShortHand: string, courseTitle: string, courseID: string, courseDisID: string, courseLabID: string) => {
        console.log(`Course Shorthand: ${courseShortHand}, Course Title: ${courseTitle}, Course ID: ${courseID}, Course Dis ID: ${courseDisID}, Course Lab ID: ${courseLabID}`);
        const newElement = {
            id: courseId,
            courseListing: courseShortHand,
            courseFullName: courseTitle,
            classNumber: courseID,
            classDis: courseDisID,
            classLab: courseLabID,
        };
        setUserCourseData([newElement, ...userCourseData]);
        setCourseId(courseId + 1);
        toast({
            title: 'Course Successfully Added',
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
    }

    const handleDeleteCourse = (courseDataID: number) => {
        setUserCourseData(userCourseData.filter(a => a.id !== courseDataID));
        toast({
            title: 'Course Successfully Removed',
            status: 'success',
            duration: 2000,
            isClosable: true,
          })
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
                        <div style={{height: "300px", overflowY: "auto", overflowX: "hidden"}}>
                            {userCourseData.map(function(d) {
                            return (
                                <div key={d.id}>
                                    <div onScroll={() => setAllClosed(!allClosed)} style={{display: "grid", gridTemplateColumns: "93.2% 1%", }}>
                                        <CourseListItemUpper courseListing={d.courseListing} courseFullName={d.courseFullName} allClosed={allClosed}/>
                                        <IconButton style={{marginTop: "10px"}} aria-label="edit course" icon={<EditIcon />} colorScheme="gray" variant="ghost"></IconButton>
                                    </div>
                                    <div style={{display: "grid", gridTemplateColumns: "93.50% 1%", }}>
                                        <CourseListItemLower classNumber={d.classNumber} classDis={d.classDis} classLab={d.classLab} />
                                        <CloseButton onClick={() => handleDeleteCourse(d.id)} />
                                    </div>
                                    <Divider style={{backgroundColor: "#D8D8D8"}} variant="solid" />
                                </div>
                            );
                        })}
                        </div>
                    </div>
                    <AddCourseForm addCourseClick={handleAddCourse}></AddCourseForm>
                </div>
            </div>
            <Button onClick={() => router.push("/myprofile")} style={{marginRight: "2%", marginTop: "50%"}} variant="start">Finish Setup</Button>
        </div>
    );
}