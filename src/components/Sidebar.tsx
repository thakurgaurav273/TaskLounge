import { ArrowDown, ChevronDown, ChevronsDownIcon, InboxIcon, PenBoxIcon, ScanLine, Search, type LucideProps } from "lucide-react"

type ListItem = {
    id: string;
    icon: any;
    label: string;
    onClick: () => void;
}
const IconSize = 20;
const Sidebar = () => {
    const topListItems: ListItem[] = [
        {
            id: "inbox",
            icon: <InboxIcon size={IconSize} />,
            label: "Inbox",
            onClick: () => {
                alert("Feature will be added soon")
            },
        },
        {
            id: "my_issue",
            icon: <ScanLine size={IconSize} />,
            label: "My issues",
            onClick: () => {
                alert("Feature will be added soon")
            },
        }
    ]
    return (
        <div className="h-[100%] w-[220px] p-[10px] bg-[var(--task-background-color-100)] box-border">
            <nav className="flex gap-[10px] items-center justify-between mb-[20px]">
                <div className="brand-logo flex items-center gap-[4px]">
                    Gaurav's Team
                    <ChevronDown size={IconSize} />
                </div>
                <div className="flex gap-[10px] items-center">
                    <Search size={IconSize} />
                    <div className="flex items-center bg-[white] p-[5px]">
                        <PenBoxIcon size={IconSize} />
                    </div>
                </div>
            </nav>
            <ul className="list-none w-[100%] item-list flex flex-col gap-[10px]">
                {topListItems.map((item) => {
                    return (
                        <li key={item.id} onClick={item.onClick} className="flex items-center gap-[10px] w-[100%]">
                            {item.icon}
                            {item.label}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}

export default Sidebar
