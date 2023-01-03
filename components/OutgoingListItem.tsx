import { CloseIcon } from "@chakra-ui/icons";
import {Heading, IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody,
    Text,
    Divider,
    Avatar,
    Tooltip} from "@chakra-ui/react";
import ObjectID from "bson-objectid";
import { MouseEventHandler, useState } from "react";
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

interface OutgoingListItemProps{
    color: string;
    profileImage: string;
    firstName: string;
    lastName: string;
    major: string;
    gradYear: string;
    userBio: string;
    pronouns: string;
    courseList: CourseListProps[];
    closeClick: MouseEventHandler;
}

export default function OutgoingListItem(props: OutgoingListItemProps){
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: isOpenTooltip, onOpen: onOpenTooltip, onClose: onCloseTooltip } = useDisclosure();
    const [allClosed, setAllClosed] = useState(false);
    return (
        <Tooltip label="Click to open detailed view" aria-label="detailed view" isOpen={isOpenTooltip} onOpen={onOpenTooltip} onClose={onCloseTooltip} openDelay={300}>
            <div style={{ backgroundColor: props.color, padding: "10px", display: "flex", flexDirection: "row", border: "solid #E3E3E3", borderRadius: "5px"}}>
                <div onClick={onOpen} style={{display: "flex", flexDirection: "row",cursor: "pointer", width: "100%"}}>
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
                    <Avatar draggable="false" style={{borderRadius: "100%", width: '50px', height: '50px', marginRight: "30px"}} name={props.firstName + " " + props.lastName === " " ? "": props.firstName + " " + props.lastName} src={props.profileImage} />
                    <Heading style={{marginTop: "12px", fontSize: "20px", fontWeight: "590"}}>{props.firstName + " " + props.lastName}</Heading>
                </div>
                <div style={{marginLeft: "auto", display: "flex", flexDirection: "row", marginRight: "10px"}}>
                    <Tooltip onOpen={onCloseTooltip} label="Delete request" aria-label="delete request" openDelay={300}><div onClick={props.closeClick} style={{marginTop: "6px"}}><IconButton variant="ghost" icon={<CloseIcon />} aria-label={"Delete element"}/></div></Tooltip>
                </div>
            </div>
        </Tooltip>
    );
}