import {Text} from "@chakra-ui/react";

interface CourseListItemLowerProps{
    classNumber: string;
    classDis: string;
    classLab: string;
}


export default function CourseListItem(props: CourseListItemLowerProps) {
    return (
        <div style={{display: "grid", gridTemplateColumns: "37% 33% 31%", }}>
            <Text style={{paddingTop: "4px"}} variant="courseUnder">{"Class # " + props.classNumber}</Text>
            <Text style={{paddingTop: "4px"}} variant="courseUnder">{"DIS " + props.classDis}</Text>
            <Text style={{paddingTop: "4px"}} variant="courseUnder">{"LAB " + props.classLab}</Text>
        </div>
    );
}