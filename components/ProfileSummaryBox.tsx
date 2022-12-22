import {Box, Heading, Text, Icon, IconButton, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter,
ModalBody, ModalCloseButton, useDisclosure, Divider, Avatar} from "@chakra-ui/react";
import { MouseEventHandler, useEffect, useState} from "react";
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai";
import CourseListItemLower from "./CourseListItemLower";
import CourseListItemUpper from "./CourseListItemUpper";
import ProfileReadView from "./ProfileReadView";

interface CourseListProps{
    id: number;
    courseListing: string;
    courseFullName: string;
    classNumber: string;
    classDis: string;
    classLab: string;
}

interface ProfileSummaryBoxProps{
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
    courseList: CourseListProps[];
    likeClick: MouseEventHandler;
}

export default function ProfileSummaryBox(props: ProfileSummaryBoxProps){
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [allClosed, setAllClosed] = useState(false);
    const [heartState, setHeartState] = useState(false);
    return (
        <div>
            <Box style={{cursor: "pointer"}} onClick={onOpen} backgroundColor="#FFFFFF" maxW='sm' borderWidth='2px' borderRadius='3xl' overflow='hidden'>
                <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
                    <ModalOverlay />
                    <ModalContent maxW="80%">
                        <ModalCloseButton />
                        <ModalBody>
                            <div style={{display: "flex", flexDirection: "row"}}>
                                <div style={{margin: "auto"}}>
                                    <ProfileReadView profileImage={props.profileImage} firstName={props.firstName} lastName={props.lastName} major={props.major} gradYear={props.gradYear} userBio={props.userBio} fbURL={props.fbURL} igURL={props.igURL} scURL={props.scURL} pronouns={props.pronouns}/>
                                </div>
                                <div style={{marginTop: "3%", marginBottom: "40px", width: "50%", marginLeft: "auto", marginRight: "5%"}}>
                                    <Text style={{paddingBottom: "10px", textAlign: "center", color: "#A73CFC", fontWeight: "700"}}>Classes</Text>
                                    <div>
                                        <Divider style={{backgroundColor: "#D8D8D8"}} variant="solid" />
                                        <div onScroll={() => setAllClosed(!allClosed)} style={{height: "65vh", overflowY: "auto", overflowX: "hidden"}}>
                                            {props.courseList.map(function(d) {
                                                return (
                                                    <div key={d.id}>
                                                        <CourseListItemUpper courseListing={d.courseListing} courseFullName={d.courseFullName} allClosed={allClosed} />
                                                        <CourseListItemLower classNumber={d.classNumber} classDis={d.classDis} classLab={d.classLab} />
                                                        <Divider style={{backgroundColor: "#D8D8D8"}} variant="solid" />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </ModalBody>
                    </ModalContent>
                </Modal>
                <Box p="6" pb="0" style={{display: "flex", flexDirection: "row"}}>
                    <Avatar draggable="false" style={{borderRadius: "100%", width: '100px', height: '100px'}} name={props.firstName + " " + props.lastName === " " ? "": props.firstName + " " + props.lastName} src={props.profileImage} />
                    <div style={{paddingTop: "15px", paddingLeft: "30px"}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <Heading style={{ paddingBottom: "5px" }} size="md">{props.firstName + " " + props.lastName}</Heading>
                            <Text style={{paddingTop: "4px", paddingLeft: "10px", fontWeight: "700"}} variant="underText">{props.pronouns}</Text>
                        </div>
                        <Text>{props.major + " Major"}</Text>
                        <Text variant="underText">{"Graduating " + props.gradYear}</Text>
                    </div>
                </Box>
                <Box p='6'>
                    <Text noOfLines={3}>{props.userBio}</Text>
                </Box>
            </Box>
            <Box marginLeft="350px" width="55px" marginTop="-30px" backgroundColor="#FFFFFF" borderRadius="full" borderWidth='2px'>
                <Box p="1.5" pb="1">
                    <IconButton aria-label='Like profile' variant="like" onClick={props.likeClick} _hover={{color: "#B01E28"}} onMouseOver={() => setHeartState(true)} onMouseOut={() => setHeartState(false)} icon={<Icon boxSize="2.5em" as={heartState ? AiFillHeart: AiOutlineHeart} />} />
                </Box>
            </Box>
        </div>
    )
}