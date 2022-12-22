import {Heading, Text, Avatar, PopoverTrigger, Popover, PopoverContent, PopoverBody, PopoverCloseButton, Button, PopoverFooter, Divider} from '@chakra-ui/react';
import Link from "next/link";

interface navBarProps {
  profileImage: string;
  page: string;
  firstName: string;
  lastName: string;
  email: string;
}

const NavBar = (props: navBarProps) => {
  const explore = props.page === "/explore" ? <Text style={{marginLeft: "auto", marginTop: "auto", marginBottom: "auto"}} variant="currPageNavBar">Explore</Text>: <Link style={{marginLeft: "auto", marginTop: "auto", marginBottom: "auto"}} href="/explore" passHref><Text variant="navbar">Explore</Text></Link>;
  const requests = props.page === "/requests" ? <Text style={{ marginTop: "auto", marginBottom: "auto"}} variant="currPageNavBar">My Requests</Text>: <Link style={{marginTop: "auto", marginBottom: "auto"}} href="/requests" passHref><Text variant="navbar">My Requests</Text></Link>;
  return (
      <div style={{padding: "1.5%", display: "flex", flexDirection: "row", borderBottom: "solid #D8D8D8"}}>
        <Link style={{paddingLeft: "1.5%", marginTop: "auto", marginBottom: "auto"}} href="/explore" passHref><Heading variant="logo" size="lg">matchr</Heading></Link>
        {explore}
        {requests}
        <Popover>
          <PopoverTrigger>
            <Avatar draggable="false" style={{ borderRadius: "100%", width: '57px', height: '57px', cursor: "pointer",}} name={props.firstName + " " + props.lastName === " " ? "": props.firstName + " " + props.lastName} src={props.profileImage} />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverCloseButton />
            <PopoverBody style={{margin: "auto", paddingTop: "20px"}}>
              <Avatar draggable="false" style={{borderRadius: "100%", width: '100px', height: '100px'}} name={props.firstName + " " + props.lastName === " " ? "": props.firstName + " " + props.lastName} src={props.profileImage} />
            </PopoverBody>
            <PopoverBody style={{margin: "0px", padding: "0px", textAlign: "center", fontWeight: "590"}}>
              {props.firstName + " " + props.lastName}
            </PopoverBody>
            <PopoverBody style={{marginTop: "0px", paddingTop: "0px", textAlign: "center", fontWeight: "590"}}>
              {props.email}
            </PopoverBody>
            <PopoverBody style={{margin: "auto", marginBottom: "10px"}}>
              <Link href="/myprofile" passHref><Button variant="navbar">Edit Profile</Button></Link>
            </PopoverBody>
            <Divider style={{width: "100%"}}/>
            <PopoverBody style={{margin: "auto", marginTop: "10px", marginBottom: "10px"}}>
              <Link href="/login" passHref><Button variant="navbar">Sign Out</Button></Link>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </div>
  );
};

export default NavBar;