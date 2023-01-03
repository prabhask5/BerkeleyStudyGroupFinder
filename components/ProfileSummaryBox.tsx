import {Box, Heading, Text, Icon, IconButton, Modal, ModalOverlay, ModalContent,
ModalBody, ModalCloseButton, useDisclosure, Divider, Avatar, CloseButton, Tooltip} from "@chakra-ui/react";
import ObjectID from "bson-objectid";
import { MouseEventHandler, useEffect, useState} from "react";
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai";
import CourseListItemLower from "./CourseListItemLower";
import CourseListItemUpper from "./CourseListItemUpper";
import ProfileReadView from "./ProfileReadView";

interface CourseListProps {
    _id: ObjectID;
    courseAbrName: string;
    courseLongName: string;
    classNumber: string;
    disNumber: string;
    labNumber: string;
}

interface ProfileSummaryBoxProps{
    profileImage: string;
    firstName: string;
    lastName: string;
    major: string;
    gradYear: string;
    userBio: string;
    pronouns: string;
    courseList: CourseListProps[];
    likeClick: Function;
    deleteClick: Function;
    delToolTip: string;
    likeToolTip: string;
}

export default function ProfileSummaryBox(props: ProfileSummaryBoxProps){
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenTooltip, onOpen: onOpenTooltip, onClose: onCloseTooltip } = useDisclosure();
    const [allClosed, setAllClosed] = useState(false);
    const [heartState, setHeartState] = useState(false);
    return (
        <div style={{position: "relative"}}>
            <Tooltip label="Click to open detailed view" aria-label="detailed view" isOpen={isOpenTooltip} onOpen={onOpenTooltip} onClose={onCloseTooltip} openDelay={300}>
                <Box style={{cursor: "pointer"}} onClick={onOpen} backgroundColor="#FFFFFF" maxW='sm' borderWidth='2px' borderRadius='3xl' overflow='hidden'>
                    <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
                        <ModalOverlay />
                        <ModalContent maxW="80%">
                            <ModalCloseButton />
                            <ModalBody>
                                <div style={{display: "flex", flexDirection: "row"}}>
                                    <div style={{margin: "auto"}}>
                                        <ProfileReadView profileImage={props.profileImage} firstName={props.firstName} lastName={props.lastName} major={props.major} gradYear={props.gradYear} userBio={props.userBio} pronouns={props.pronouns}/>
                                    </div>
                                    <div style={{marginTop: "3%", marginBottom: "40px", width: "50%", marginLeft: "auto", marginRight: "5%"}}>
                                        <Text style={{paddingBottom: "10px", textAlign: "center", color: "#A73CFC", fontWeight: "700"}}>Classes</Text>
                                        <div>
                                            <Divider style={{backgroundColor: "#D8D8D8"}} variant="solid" />
                                            <div onScroll={() => setAllClosed(!allClosed)} style={{height: "65vh", overflowY: "auto", overflowX: "hidden"}}>
                                                {props.courseList.map(function(d) {
                                                    return (
                                                        <div key={d._id.toString()}>
                                                            <CourseListItemUpper courseListing={d.courseAbrName} courseFullName={d.courseLongName} allClosed={allClosed} />
                                                            <CourseListItemLower classNumber={d.classNumber} classDis={d.disNumber} classLab={d.labNumber} />
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
                                <Heading noOfLines={1} style={{ paddingBottom: "5px" }} size="md">{props.firstName + " " + props.lastName}</Heading>
                                <Text style={{paddingTop: "4px", paddingLeft: "10px", fontWeight: "700"}} variant="underText">{props.pronouns}</Text>
                            </div>
                            <Text noOfLines={1}>{props.major + " Major"}</Text>
                            <Text variant="underText">{"Graduating " + props.gradYear}</Text>
                        </div>
                        <div style={{position: "absolute", marginLeft: "318px",}} onClick={e => {e.stopPropagation(); props.deleteClick()}}><Tooltip onOpen={onCloseTooltip} label={props.delToolTip} aria-label="del button" openDelay={300}><CloseButton/></Tooltip></div>
                    </Box>
                    <Box p='6'>
                        <Text noOfLines={3}>{props.userBio}</Text>
                    </Box>
                </Box>
            </Tooltip>
            <Box marginLeft="350px" width="55px" marginTop="-30px" backgroundColor="#FFFFFF" borderRadius="full" borderWidth='2px'>
                <Box p="1.5" pb="1">
                    <div onClick={() => props.likeClick()}><Tooltip label={props.likeToolTip} aria-label="like button" openDelay={300}><IconButton aria-label='Like profile' variant="like" _hover={{color: "#B01E28"}} onMouseOver={() => setHeartState(true)} onMouseOut={() => setHeartState(false)} icon={<Icon boxSize="2.5em" as={heartState ? AiFillHeart: AiOutlineHeart} />} /></Tooltip></div>
                </Box>
            </Box>
        </div>
    )
}