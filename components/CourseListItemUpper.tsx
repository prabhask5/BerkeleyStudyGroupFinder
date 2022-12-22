import {Text, Popover, PopoverTrigger, PopoverContent, PopoverBody, PopoverArrow, useDisclosure} from "@chakra-ui/react";
import { useEffect } from "react";

interface CourseListItemUpperProps{
    courseListing: string;
    courseFullName: string;
    allClosed: boolean;
}


export default function CourseListItemUpper(props: CourseListItemUpperProps) {
    const { onOpen, onClose, isOpen } = useDisclosure();
    useEffect(() => {
        onClose();
    }, [onClose, props.allClosed]);
    return (
        <div>
            <Popover trigger="hover" openDelay={400} closeDelay={0} isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
            <PopoverTrigger>
                <Text variant="courseMain" noOfLines={1}>{props.courseListing + " - " + props.courseFullName}</Text>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverBody style={{fontWeight: "590", color: "#414141",}}>{props.courseListing + " - " + props.courseFullName}</PopoverBody>
            </PopoverContent>
            </Popover>
        </div>
    );
}