import { ChevronDown, ChevronRight, InboxIcon, Mic, PenBoxIcon, ScanLine, Search } from "lucide-react"
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTab, setShowCreateIssue, setShowVoiceCommand } from "../app/slices/appSlice";
import { Teams } from "../shared/utils/data";
import { useState } from "react";

type ListItem = {
    id: string;
    icon: any;
    label: string;
    onClick: () => void;
}
const IconSize = 20;
const Sidebar = () => {
    const selectedTab = useSelector((state: any) => state.selectedTab);
    const dispatch = useDispatch();
    const [openTeamsDropdown, setOpenTeamsDropdown] = useState<boolean>(false);
    const topListItems: ListItem[] = [
        {
            id: "inbox",
            icon: <InboxIcon size={IconSize} />,
            label: "Inbox",
            onClick: () => {
                dispatch(setSelectedTab('inbox'));
            },
        },
        {
            id: "my_issue",
            icon: <ScanLine size={IconSize} />,
            label: "My issues",
            onClick: () => {
                dispatch(setSelectedTab('my_issues'));
            },
        },
        {
            id: "create_issue",
            icon: <Mic/>,
            label: "Create Ticket Voice Command",
            onClick: ()=>{
                dispatch(setShowVoiceCommand(true));
            }
        }
    ]
    return (
        <div className="h-[100%] w-[230px] p-[10px] bg-[var(--task-background-color-100)] box-border">
            <nav className="flex gap-[10px] items-center justify-between mb-[20px]">
                <div className="brand-logo flex items-center gap-[4px]">
                    Gaurav's Team
                    <ChevronDown size={IconSize} />
                </div>
                <div className="flex gap-[10px] items-center">
                    <Search size={IconSize} />
                    <div className="flex items-center bg-[white] p-[5px] rounded-[10px]" onClick={()=> dispatch(setShowCreateIssue(true))}>
                        <PenBoxIcon size={IconSize} />
                    </div>
                </div>
            </nav>
            <ul className="list-none w-[100%] item-list flex flex-col gap-[10px]">
                {topListItems.map((item) => {
                    return (
                        <li key={item.id} onClick={item.onClick} className={`${selectedTab === item.id ? 'bg-[white]' : ''} flex items-center min-h-[30px] gap-[10px] w-[100%] hover:bg-[white] px-[4px] cursor-pointer rounded-[4px] text-[14px]`}>
                            {item.icon}
                            {item.label}
                        </li>
                    )
                })}
            </ul>

            <h6 style={{ marginTop: '40px', marginBottom: '10px'}} className="text-[15px] flex items-center cursor-pointer" onClick={()=>{
                setOpenTeamsDropdown(!openTeamsDropdown);
            }}>Your Teams {!openTeamsDropdown ? <ChevronRight/> : <ChevronDown/>} </h6>
            {openTeamsDropdown && <ul className="list-none w-[100%] item-list flex flex-col gap-[10px]">
                {Teams.map((item) => {
                    return <li key={item.id} className={`${selectedTab === item.id ? 'bg-[white]' : ''} text-[14px] flex items-center h-[30px] gap-[10px] w-[100%] hover:bg-[white] px-[4px] cursor-pointer rounded-[4px]`}>
                        {<item.icon />}
                        {item.title}
                    </li>
                })}
            </ul>}

        </div>
    )
}

export default Sidebar
