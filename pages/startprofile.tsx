import {Button, Heading} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/router";
import ProfileEditView from "../components/ProfileEditView";
import placeHolderData from "../testdata";

export default function StartProfile(){
    const router = useRouter();
    const [major, setMajor] = useState("");
    const [year, setYear] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [bio, setBio] = useState("");
    const [pronouns, setPronouns] = useState("");
    const [fbURL, setFBURL] = useState("");
    const [scURL, setSCURL] = useState("");
    const [igURL, setIGURL] = useState("");
    const [isMajorError, setIsMajorError] = useState(false);
    const [isYearError, setIsYearError] = useState(false);
    const [isFirstNameError, setIsFirstNameError] = useState(false);
    const [isLastNameError, setIsLastNameError] = useState(false);
    const handleNext = (major: string, year: string, firstName: string, lastName: string, bio: string, pronouns: string, fbURL: string, scURL: string, igURL: string) => {
        console.log(`Major: ${major}, Year: ${year}, First Name: ${firstName}, LastName: ${lastName}, Bio: ${bio}, Pronoun: ${pronouns}, fbURL: ${fbURL}, scURL: ${scURL}, igURL: ${igURL}`);
        router.push("/startcourses");
    }
    return (
        <form onSubmit={e => {
            e.preventDefault();
            handleNext(major, year, firstName, lastName, bio, pronouns, fbURL, scURL, igURL)
        }}>
            <div style={{display: "flex", flexDirection: "row"}}>
                <div style={{margin: "auto", textAlign: "center", width: "30%"}}>
                    <Heading size="xl">Welcome! Start building your profile by first entering some basic information.</Heading>
                </div>
                <div style={{margin: "auto", width: "50%"}}>
                    <ProfileEditView profileImage={""} firstName={""} lastName={""} major={""} gradYear={""} userBio={"Enter a short biography, introducing yourself and highlighting your academic and nonacademic interests"} pronouns={""} fbURL={"Enter your facebook profile link"} igURL={"Enter your instagram profile link"} scURL={"Enter your snapchat profile link"} setMajor={setMajor} setYear={setYear} setFirstName={setFirstName} setLastName={setLastName} setBio={setBio} setPronouns={setPronouns} setFBURL={setFBURL} setIGURL={setIGURL} setSCURL={setSCURL} isMajorError={isMajorError} isYearError={isYearError} isFirstNameError={isFirstNameError} isLastNameError={isLastNameError} setIsMajorError={setIsMajorError} setIsYearError={setIsYearError} setIsFirstNameError={setIsFirstNameError} setIsLastNameError={setIsLastNameError} />
                </div>
                <Button style={{marginRight: "2%", marginTop: "50%"}} type="submit" variant="start">Next</Button>
            </div>
        </form>
    );
}