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

export const getFormattedTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return 'invalid date';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 0) return 'future';
  
  const intervals = [
    { unit: 'y', seconds: 31536000 },
    { unit: 'mo', seconds: 2628000 },
    { unit: 'd', seconds: 86400 },
    { unit: 'h', seconds: 3600 },
    { unit: 'm', seconds: 60 }
  ];

  for (const { unit, seconds } of intervals) {
    const count = Math.floor(diffInSeconds / seconds);
    if (count >= 1) {
      return `${count}${unit} ago`;
    }
  }

  return 'just now';
};

