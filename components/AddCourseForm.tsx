import {Button, FormControl, FormErrorMessage, FormLabel, Input, Stack, Text} from "@chakra-ui/react";
import { useState } from "react";

interface AddCourseFormProps{
    addCourseClick: Function;
}

export default function AddCourseForm(props: AddCourseFormProps) {
    const [courseShortHand, setCourseShortHand] = useState("");
    const [courseTitle, setCourseTitle] = useState("");
    const [courseID, setCourseID] = useState("");
    const [courseDisID, setCourseDisID] = useState("");
    const [courseLabID, setCourseLabID] = useState("");
    const [isCourseShortHandError, setIsCourseShortHandError] = useState(false);
    const [isCourseTitleError, setIsCourseTitleError] = useState(false);
    const [isCourseIDError, setIsCourseIDError] = useState(false);
    const [isCourseDisIDError, setIsCourseDisIDError] = useState(false);
    const [isCourseLabIDError, setIsCourseLabIDError] = useState(false);
    return (
        <div style={{marginTop: "5%"}}>
            <form onSubmit={e => {
                e.preventDefault();
                let anyError = false;
                if(courseShortHand.length === 0){
                    setIsCourseShortHandError(true);
                    anyError = true;
                }
                if(courseTitle.length === 0){
                    setIsCourseTitleError(true);
                    anyError = true;
                }
                if(courseID.length === 0){
                    setIsCourseIDError(true);
                    anyError = true;
                }
                if(courseDisID.length === 0){
                    setIsCourseDisIDError(true);
                    anyError = true;
                }
                if(courseLabID.length === 0){
                    setIsCourseLabIDError(true);
                    anyError = true;
                }
                if(!(isCourseShortHandError || isCourseTitleError || isCourseIDError || isCourseDisIDError || isCourseLabIDError || anyError)){
                    setCourseShortHand("");
                    setCourseTitle("");
                    setCourseID("");
                    setCourseDisID("");
                    setCourseLabID("");
                }
                props.addCourseClick(courseShortHand, courseTitle, courseID, courseDisID, courseLabID, isCourseShortHandError, isCourseTitleError, isCourseIDError, isCourseDisIDError, isCourseLabIDError, anyError);
            }}>
                <Stack spacing={6}>
                    <Text style={{fontSize: "15px", fontWeight: "700", textAlign: "center"}} variant="underText">Please fill in course information accurately for a more accurate filtering process.</Text>
                    <div style={{border: "solid #D8D8D8", padding: "20px", borderRadius: "25px"}}>
                        <Stack spacing={5}>
                            <Stack spacing={3}>
                                <div>
                                    <FormControl isInvalid={isCourseShortHandError}>
                                        <FormLabel style={{marginBottom: "0px"}}>Course Abbreviation <Text as="span" style={{color: "#E53E3E"}}>*</Text></FormLabel>
                                        <Input value={courseShortHand} onBlur={e => {if(e.target.value.length === 0) setIsCourseShortHandError(true); else setIsCourseShortHandError(false);}} onChange={e => setCourseShortHand(e.target.value)} style={{borderRadius: "10px"}} size="sm" placeholder="Course abbr" />
                                        {isCourseShortHandError ? <FormErrorMessage style={{margin: "0px", padding: "0px"}}></FormErrorMessage>: null}
                                    </FormControl>
                                </div>
                                <div>
                                    <FormControl isInvalid={isCourseTitleError}>
                                        <FormLabel style={{marginBottom: "0px"}}>Course Title <Text as="span" style={{color: "#E53E3E"}}>*</Text></FormLabel>
                                        <Input value={courseTitle} onBlur={e => {if(e.target.value.length === 0) setIsCourseTitleError(true); else setIsCourseTitleError(false);}} onChange={e => setCourseTitle(e.target.value)} style={{borderRadius: "10px"}} size="sm" placeholder="Course title" />
                                        {isCourseTitleError ? <FormErrorMessage style={{margin: "0px", padding: "0px"}}></FormErrorMessage>: null}
                                    </FormControl>
                                </div>
                                <div style={{display: "flex", flexDirection: "row"}}>
                                    <div style={{paddingRight: "10px"}}>
                                        <FormControl isInvalid={isCourseIDError}>
                                            <FormLabel style={{marginBottom: "0px"}}>Course ID <Text as="span" style={{color: "#E53E3E"}}>*</Text></FormLabel>
                                            <Input value={courseID} onBlur={e => {if(e.target.value.length === 0) setIsCourseIDError(true); else setIsCourseIDError(false);}} onChange={e => setCourseID(e.target.value)} style={{borderRadius: "10px"}} size="sm" placeholder="Course ID" />
                                            {isCourseIDError ? <FormErrorMessage style={{margin: "0px", padding: "0px"}}></FormErrorMessage>: null}
                                        </FormControl>
                                    </div>
                                    <div style={{paddingRight: "10px"}}>
                                        <FormControl isInvalid={isCourseDisIDError}>
                                            <FormLabel style={{marginBottom: "0px"}}>Discussion ID <Text as="span" style={{color: "#E53E3E"}}>*</Text></FormLabel>
                                            <Input value={courseDisID} onBlur={e => {if(e.target.value.length === 0) setIsCourseDisIDError(true); else setIsCourseDisIDError(false);}} onChange={e => setCourseDisID(e.target.value)} style={{borderRadius: "10px"}} size="sm" placeholder="Dis ID" />
                                            {isCourseDisIDError ? <FormErrorMessage style={{margin: "0px", padding: "0px"}}></FormErrorMessage>: null}
                                        </FormControl>
                                    </div>
                                    <div style={{paddingRight: "10px"}}>
                                        <FormControl isInvalid={isCourseLabIDError}>
                                            <FormLabel style={{marginBottom: "0px"}}>Lab ID <Text as="span" style={{color: "#E53E3E"}}>*</Text></FormLabel>
                                            <Input value={courseLabID} onBlur={e => {if(e.target.value.length === 0) setIsCourseLabIDError(true); else setIsCourseLabIDError(false);}} onChange={e => setCourseLabID(e.target.value)} style={{borderRadius: "10px"}} size="sm" placeholder="Lab ID" />
                                            {isCourseLabIDError ? <FormErrorMessage style={{margin: "0px", padding: "0px"}}></FormErrorMessage>: null}
                                        </FormControl>
                                    </div>
                                </div>
                            </Stack>
                            <Button style={{width: "18%"}} type="submit" colorScheme="messenger">Add Course</Button>
                        </Stack>
                    </div>
                </Stack>
            </form>
        </div>
    );
}