/* eslint-disable @next/next/no-img-element */
import {Button, Heading, Text, Stack, Divider, Image, Avatar} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { MouseEventHandler } from "react";

interface ProfileReadViewProps{
    profileImage: string;
    firstName: string;
    lastName: string;
    major: string;
    gradYear: string;
    userBio: string;
    pronouns: string;
}


export default function ProfileReadView(props: ProfileReadViewProps) {
    return (
        <div style={{width: "450px"}}>
            <Stack spacing={7}>
                <div style={{display: "flex", flexDirection: "row"}}>
                    <Avatar style={{width: "100px", height: "100px", borderRadius: "100%"}} name={props.firstName + " " + props.lastName} draggable="false" src={props.profileImage}/>
                    <div style={{ paddingLeft: "20px", paddingTop: "10px"}}>
                        <div style={{display: "flex", flexDirection: "row"}}>
                            <Heading style={{ paddingBottom: "5px" }} size="md">{props.firstName + " " + props.lastName}</Heading>
                            <Text style={{paddingTop: "4px", paddingLeft: "10px", fontWeight: "700"}} variant="underText">{props.pronouns}</Text>
                        </div>
                        <Text>{props.major + " Major"}</Text>
                        <Text variant="underText">{"Graduating " + props.gradYear}</Text>
                    </div>
                </div>
                <Text>{props.userBio}</Text>
                <Divider style={{backgroundColor: "#D8D8D8"}} variant="solid" />
            </Stack>
        </div>
    );
}