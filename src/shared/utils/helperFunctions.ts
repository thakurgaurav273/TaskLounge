import { Circle, Cross } from "lucide-react"

export const getIconById = (id: string) => {
    switch (id) {
        case 'todo':
            return Circle;
        default:
            return Cross;
    }
}