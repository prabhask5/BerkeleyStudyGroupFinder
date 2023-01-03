import { ChevronDownIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, MenuList, MenuItem, Button, useToast, SimpleGrid} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react"
import MatchedListItem from "../components/MatchedListItem";
import NavBar from "../components/NavBar";
import OutgoingListItem from "../components/OutgoingListItem";
import ProfileSummaryBox from "../components/ProfileSummaryBox";
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

interface FriendsProps {
    _id: string;
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

interface RequestsProps {
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

interface RequestsPageProps{
    id: string;
    profileImage: string;
    firstName: string;
    lastName: string;
    email: string;
    friendsList: FriendsProps[];
    incomingRequestsList: RequestsProps[];
    outgoingRequestsList: RequestsProps[];
}

export async function getServerSideProps(context: any) {
    const cookies = nookies.get(context);
    let redirectPath = 0; //0 for startprofile page, 1 for login page, 2 for error page
    let props = {}
    await axios.get("http://localhost:4000/access/allRequests", { headers: {"Authentication" : `Bearer ${cookies.authToken}`, "Authorization": `Bearer ${cookies.signature}`} })
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
                            email: res.data.user.email,
                            profileImage: res.data.user.profileImage,
                            firstName: res.data.user.firstName,
                            lastName: res.data.user.lastName,
                            friendsList: res.data.friendsList,
                            incomingRequestsList: res.data.incomingRequestsList,
                            outgoingRequestsList: res.data.outgoingRequestsList,
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

export default function Requests(props: RequestsPageProps) {
    const router = useRouter();
    const toast = useToast();
    const [friendsState, changeFriendsState] = useState(0); //0 is friends, 1 is incoming, 2 is outgoing
    const [incomingRequests, setIncomingRequests] = useState(props.incomingRequestsList);
    const [outgoingRequests, setOutgoingRequests] = useState(props.outgoingRequestsList);
    const [friends, setFriends] = useState(props.friendsList);
    const handleAcceptIncomingRequest = (studentId: string) => {
        const newData = {
            id: props.id,
            friendId: studentId,
        }
        axios.post("http://localhost:4000/requests/acceptIncoming", newData)
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
                        title: 'Friend Request Accepted',
                        status: 'success',
                        duration: 2000,
                        isClosable: true,
                    });
                    setIncomingRequests(incomingRequests.filter(s => s._id !== studentId));
                    setFriends(res.data.friendsList);
                }
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
    const handleDeleteIncomingRequest = (studentId: string) => {
        const newData = {
            id: props.id,
            friendId: studentId,
        }
        axios.post("http://localhost:4000/requests/deleteIncoming", newData)
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
                        title: 'Request Deleted',
                        status: 'success',
                        duration: 2000,
                        isClosable: true,
                    });
                    setIncomingRequests(incomingRequests.filter(s => s._id !== studentId));
                }
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
    const handleDeleteFriend = (studentId: string) => {
        const newData = {
            id: props.id,
            friendId: studentId,
        }
        axios.post("http://localhost:4000/requests/deleteFriend", newData)
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
                        title: "Friend Deleted",
                        status: 'success',
                        duration: 2000,
                        isClosable: true,
            
                    });
                    setFriends(friends.filter(s => s._id !== studentId));
                }
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
    const handleDeleteOutgoingRequest = (studentId: string) => {
        const newData = {
            id: props.id,
            friendId: studentId,
        }
        axios.post("http://localhost:4000/requests/deleteOutgoing", newData)
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
                        title: "Outgoing Request Deleted",
                        status: 'success',
                        duration: 2000,
                        isClosable: true,
                
                    });
                    setOutgoingRequests(outgoingRequests.filter(s => s._id !== studentId));
                }
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
    let mainState: string = "";
    let otherState: any = null;
    let pageState: any = null;
    if(friendsState === 0){
        mainState = "Friends";
        otherState = (<div><MenuItem onClick={() => changeFriendsState(1)}>Incoming Requests</MenuItem> <MenuItem onClick={() => changeFriendsState(2)}>Outgoing Requests</MenuItem></div>);
        pageState = <div style={{margin: "auto", marginTop: "20px", height: "78vh", overflowY: "auto", overflowX: "hidden", overflow: "auto", backgroundColor: "#fafafa", borderTop: "solid #D8D8D8"}}>
            {friends.map(function(d, index){
            return (
                <MatchedListItem key={d._id} color={index % 2 === 0 ? "#E3E3E3" : "#FFFFFF"} profileImage={d.profileImage} firstName={d.firstName} lastName={d.lastName} fbURL={d.fbURL} igURL={d.igURL} scURL={d.scURL} closeClick={() => handleDeleteFriend(d._id)} major={d.major} gradYear={d.gradYear} userBio={d.userBio} pronouns={d.pronouns} courseList={d.courseList} email={props.email} />
            );
        })}
        </div>
    }
    else if(friendsState === 1){
        mainState = "Incoming Requests";
        otherState = (<div><MenuItem onClick={() => changeFriendsState(2)}>Outgoing Requests</MenuItem> <MenuItem onClick={() => changeFriendsState(0)}>Friends</MenuItem></div>);
        pageState = <div style={{backgroundColor: "#fafafa", borderTop: "solid #D8D8D8"}}>
                        <SimpleGrid style={{height: "78vh", overflowY: "auto", overflowX: "hidden", overflow: "auto"}} minChildWidth='400px' spacingX="30px" spacingY="30px">
                            {incomingRequests.map(d => <div style={{marginTop: "30px", marginLeft: "30px"}} key={d._id}><ProfileSummaryBox profileImage={d.profileImage} firstName={d.firstName} lastName={d.lastName} major={d.major} gradYear={d.gradYear} userBio={d.userBio} pronouns={d.pronouns} courseList={d.courseList} likeClick={() => handleAcceptIncomingRequest(d._id)} deleteClick={() => handleDeleteIncomingRequest(d._id)} delToolTip={"Delete request"} likeToolTip={"Accept request"}/></div>)}
                        </SimpleGrid>
                    </div>
    }
    else if(friendsState === 2){
        mainState = "Outgoing Requests";
        otherState = (<div><MenuItem onClick={() => changeFriendsState(0)}>Friends</MenuItem> <MenuItem onClick={() => changeFriendsState(1)}>Incoming Requests</MenuItem></div>);
        pageState = <div style={{margin: "auto", marginTop: "20px", height: "78vh", overflowY: "auto", overflowX: "hidden", overflow: "auto", backgroundColor: "#fafafa", borderTop: "solid #D8D8D8"}}>
        {outgoingRequests.map(function(d, index){
        return (
            <OutgoingListItem key={d._id} color={index % 2 === 0 ? "#E3E3E3" : "#FFFFFF"} profileImage={d.profileImage} firstName={d.firstName} lastName={d.lastName} closeClick={() => handleDeleteOutgoingRequest(d._id)} major={d.major} gradYear={d.gradYear} userBio={d.userBio} pronouns={d.pronouns} courseList={d.courseList} />
        );
    })}
    </div>
    }
    return (
        <div>
            <NavBar profileImage={props.profileImage} page={router.pathname} firstName={props.firstName} lastName={props.lastName} email={props.email} />
            <div style={{marginTop: "1%", marginLeft: "1.5%", marginBottom: "1%"}}>
                <Menu variant="requests ">
                    <Button variant="navbar" as={MenuButton} rightIcon={<ChevronDownIcon />}>
                        {mainState}
                    </Button>
                    <MenuList>
                        {otherState}
                    </MenuList>
                </Menu>
            </div>
            {pageState}
        </div>
    );
}