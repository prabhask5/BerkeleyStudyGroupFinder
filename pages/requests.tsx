import { ChevronDownIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, MenuList, MenuItem, Button, useToast, Grid, SimpleGrid} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { MouseEvent, useState } from "react"
import MatchedListItem from "../components/MatchedListItem";
import NavBar from "../components/NavBar";
import OutgoingListItem from "../components/OutgoingListItem";
import ProfileSummaryBox from "../components/ProfileSummaryBox";
import placeHolderData from "../testdata";

export default function Requests() {
    const router = useRouter();
    const toast = useToast();
    const [friendsState, changeFriendsState] = useState(0); //0 is friends, 1 is incoming, 2 is outgoing
    const [incomingRequests, setIncomingRequests] = useState(placeHolderData.otherData);
    const [outgoingRequests, setOutgoingRequests] = useState(placeHolderData.otherData);
    const [friends, setFriends] = useState(placeHolderData.otherData);
    const acceptF = (studentId: number) => {
        toast({
            title: 'Friend Request Accepted',
            description: "Your study group friend request was successfully accepted.",
            status: 'success',
            duration: 2000,
            isClosable: true,
        });
        setIncomingRequests(incomingRequests.filter(s => s.id !== studentId));
    };
    const deleteFriendF = (studentId: number) => {
        toast({
            title: "Friend Deleted",
            description: "You have successfully deleted this friend.",
            status: 'success',
            duration: 2000,
            isClosable: true,

        });
        setFriends(friends.filter(s => s.id !== studentId));
    };
    const deleteRequestF = (studentId: number) => {
        toast({
            title: "Request Deleted",
            description: "You have successfully deleted this request.",
            status: 'success',
            duration: 2000,
            isClosable: true,
    
        });
        setOutgoingRequests(outgoingRequests.filter(s => s.id !== studentId));
    };
    let mainState: string = "";
    let otherState: any = null;
    let pageState: any = null;
    if(friendsState === 0){
        mainState = "Friends";
        otherState = (<div><MenuItem onClick={() => changeFriendsState(1)}>Incoming Requests</MenuItem> <MenuItem onClick={() => changeFriendsState(2)}>Outgoing Requests</MenuItem></div>);
        pageState = <div style={{margin: "auto", marginTop: "20px", height: "78vh", overflowY: "auto", overflowX: "hidden", overflow: "auto"}}>
            {friends.map(function(d, index){
            return (
                <MatchedListItem key={d.id} color={index % 2 === 0 ? "#E3E3E3" : "#FFFFFF"} profileImage={d.profileImage} firstName={d.firstName} lastName={d.lastName} fbURL={d.fbURL} igURL={d.igURL} scURL={d.scURL} closeClick={() => deleteFriendF(d.id)} major={d.major} gradYear={d.gradYear} userBio={d.userBio} pronouns={d.pronouns} courseList={d.courses} />
            );
        })}
        </div>
    }
    else if(friendsState === 1){
        mainState = "Incoming Requests";
        otherState = (<div><MenuItem onClick={() => changeFriendsState(2)}>Outgoing Requests</MenuItem> <MenuItem onClick={() => changeFriendsState(0)}>Friends</MenuItem></div>);
        pageState = <div style={{backgroundColor: "#fafafa", borderTop: "solid #D8D8D8"}}>
                        <SimpleGrid style={{height: "78vh", overflowY: "auto", overflowX: "hidden", overflow: "auto"}} minChildWidth='400px' spacingX="30px" spacingY="30px">
                            {incomingRequests.map(d => <div style={{marginTop: "30px", marginLeft: "30px"}} key={d.id}><ProfileSummaryBox profileImage={d.profileImage} firstName={d.firstName} lastName={d.lastName} major={d.major} gradYear={d.gradYear} userBio={d.userBio} pronouns={d.pronouns} fbURL={d.fbURL} igURL={d.igURL} scURL={d.scURL} courseList={d.courses} likeClick={() => acceptF(d.id)}/></div>)}
                        </SimpleGrid>
                    </div>
    }
    else if(friendsState === 2){
        mainState = "Outgoing Requests";
        otherState = (<div><MenuItem onClick={() => changeFriendsState(0)}>Friends</MenuItem> <MenuItem onClick={() => changeFriendsState(1)}>Incoming Requests</MenuItem></div>);
        pageState = <div style={{margin: "auto", marginTop: "20px", height: "78vh", overflowY: "auto", overflowX: "hidden", overflow: "auto"}}>
        {outgoingRequests.map(function(d, index){
        return (
            <OutgoingListItem key={d.id} color={index % 2 === 0 ? "#E3E3E3" : "#FFFFFF"} profileImage={d.profileImage} firstName={d.firstName} lastName={d.lastName} fbURL={d.fbURL} igURL={d.igURL} scURL={d.scURL} closeClick={() => deleteRequestF(d.id)} major={d.major} gradYear={d.gradYear} userBio={d.userBio} pronouns={d.pronouns} courseList={d.courses} />
        );
    })}
    </div>
    }
    return (
        <div>
            <NavBar profileImage={placeHolderData.myData.profileImage} page={router.pathname} firstName={placeHolderData.myData.firstName} lastName={placeHolderData.myData.lastName} email={placeHolderData.myData.email} />
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