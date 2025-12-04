import { BadgeCheck, Box, Circle, CircleDashed, CircleUser, Contact, Tag, X } from "lucide-react"

export const getIconById = (id: string) => {
    switch (id) {
        case 'Todo':
            return Circle;
        case 'Backlog':
            return CircleDashed;
           case 'ENG':
            return Contact;
        case 'Done':
            return BadgeCheck;
        case 'Cancelled':
            return X;
        case 'Duplicate':
            return X;
        case 'assignee':
            return CircleUser;
        case 'project':
            return Box;
        case 'label':
            return Tag;
        default:
            return X;
    }
}