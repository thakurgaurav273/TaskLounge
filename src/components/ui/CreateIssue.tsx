import { Contact, Maximize2, Minimize2, Paperclip, X } from "lucide-react";
import { useCallback, useState } from "react"
import DescriptionEditor from "./DecriptionEditor";
import { getIconById } from "../../shared/utils/helperFunctions";
import Popover from "./Popover";
import { Labels, Project, Status, Teams } from "../../shared/utils/data";
import { useDispatch, useSelector } from "react-redux";
import { setShowCreateIssue } from "../../app/slices/appSlice";

interface PopupState {
    isOpen: boolean;
    x: number;
    y: number;
    context: string | null;
}

interface FilterButton {
    id: string;
    title: string;
    icon: any;
    options: any[];
}

const CreateIssue = ({issue}: {issue?:any}) => {
    const [selectedTeam, setSelectedTeam] = useState<string>("ENG");
    const [isMaximized, setIsMaximized] = useState<boolean>(false);
    const [currentStatus, setCurrentStatus] = useState<string>(issue ? issue.status : 'Status');
    const [currentPriority, setCurrentPriority] = useState<string>(issue ? issue.priority : 'Priority');
    const [assignee, setAssignee] = useState<{ title: string, id: string }>({
        title: 'Assignee',
        id: ''
    });
    const user = useSelector((state:any)=> state.loggedInUser)
    const [title, setTitle] = useState<string>(issue ? issue.title : '');
    const [project, setProject] = useState<string>("Project");
    const [label, setLabel] = useState<Array<string>>([]);
    const [description, setDescription] = useState<string>(issue ? issue.description : '');
    const users = useSelector((state: any) => state.usersList);
    const dispatch = useDispatch();
    const [popupState, setPopupState] = useState<PopupState>({
        isOpen: false,
        x: 0,
        y: 0,
        context: null
    });

    const handleClose = useCallback(() => {
        setPopupState((prev) => ({ ...prev, isOpen: false }));
    }, []);

    const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>, context: string) => {
        e.stopPropagation();
        setPopupState({
            isOpen: true,
            x: e.clientX,
            y: e.clientY,
            context: context
        });
    };

    const handleAction = (action: any) => {
        console.log(action);
        switch (popupState.context) {
            case 'Team':
                setSelectedTeam(action.id);
                break;
            case 'Status':
                setCurrentStatus(action.title);
                break;
            case 'Priority':
                setCurrentPriority(action.title);
                break;
            case 'Assignee':
                setAssignee({
                    title: action.title,
                    id: action._id
                });
                break;
            case 'Project':
                setProject(action.title);
                break;
            case 'Label':
                setLabel((prev) => [...prev, action.title]);

        }
        console.log(popupState.context)
        handleClose();
    };

    const handleCreateIssue = async () => {
        await fetch("http://localhost:8080/api/issues/create", {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                team: selectedTeam,
                label: label,
                project,
                title,
                description,
                priority: currentPriority,
                status: currentStatus,
                assignee: assignee.id,
                createdBy: user._id
            })
        })
        dispatch(setShowCreateIssue(false))

    }

    const filtersButtons: FilterButton[] = [
        {
            id: "status",
            title: currentStatus,
            icon: getIconById('Backlog'),
            options: Status
        },
        {
            id: "assignee",
            title: assignee.title,
            icon: getIconById('assignee'),
            options: users.map((ele: any) => ({
                title: ele.name,
                ...ele
            }))

        },
        {
            id: "priority",
            title: currentPriority,
            icon: currentPriority,
            options: [
                {
                    title: 'Low',
                },
                {
                    title: 'Medium',
                },
                {
                    title: 'High',
                }
            ]
        },
        {
            id: "project",
            title: project,
            icon: getIconById('project'),
            options: Project

        },
        {
            id: "label",
            title: 'Labels',
            icon: getIconById('label'),
            options: Labels

        },

    ]

    return (
        <div className="h-screen w-screen fixed flex items-center justify-center" style={{
            background: 'rgba(0, 0, 0, 0.44)',
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)'
        }}>
            <div className={`h-[60%] w-[60%] max-w-[650px] flex flex-col bg-[white] relative justify-between p-[15px] rounded-[10px] ${isMaximized ? 'max-h-[500px]' : 'max-h-[300px]'}`}>
                <div>
                    <div className="header flex justify-between items-center">
                        <div className="left-buttons">
                            <button className="team flex border-[1px] border-[var(--task-border-color-light)] rounded-[5px] px-[8px] py-[4px] items-center gap-[5px]"
                                onClick={(e) => handleButtonClick(e, 'Team')} >
                                <Contact size={14} />
                                {selectedTeam}
                            </button>
                        </div>
                        <div className="right-buttons flex items-center gap-[10px]">
                            {isMaximized ? <Minimize2 className="cursor-pointer" onClick={() => setIsMaximized(!isMaximized)} /> : <Maximize2 size={18} className="cursor-pointer" onClick={() => setIsMaximized(!isMaximized)} />}
                            <X onClick={() => {
                                dispatch(setShowCreateIssue(false))
                            }} />
                        </div>
                    </div>
                    <div className="title my-[15px]">
                        <input type="text" placeholder="Issue title" value={title} onChange={(e) => setTitle(e.target.value)} className="outline-none border-0 w-full text-[18px] font-bold" />
                    </div>
                    <div className="description">
                        <DescriptionEditor 
                            initialValue={description}    
                            onSave={(content) => {
                                setDescription(content);
                        }} />
                    </div>
                </div>

                <div className="flex flex-col gap-[10px]">
                    <div className="footer flex gap-[10px]">
                        {filtersButtons.map((ele) => {
                            return (
                                <button
                                    onClick={(e) => handleButtonClick(e, ele.title)}
                                    key={ele.id}
                                    className="flex items-center border-[1px] border-[var(--task-border-color-light)] gap-[5px] p-[5px] rounded-[4px]"
                                >
                                    {ele.id === "priority" ? "-- " : <ele.icon size={16} />}
                                    {ele.title}
                                </button>
                            )
                        })}
                    </div>

                    <div className="submission flex items-center justify-between">
                        <div className="primary">
                            <Paperclip />
                        </div>
                        <div className="secondary">
                            <button className="border-0 bg-[#6134db] p-[8px] rounded-[4px] text-[white]" onClick={handleCreateIssue}>Create issue</button>
                        </div>
                    </div>
                </div>

                <Popover
                    x={popupState.x}
                    y={popupState.y}
                    isOpen={popupState.isOpen}
                    onClose={handleClose}
                >
                    <div className="flex flex-col gap-[5px]">
                        <input type="text" placeholder={`Change ${popupState.context}`} className="border-0 text-[14px] outline-0 p-[8px] border-b-[1px]" />

                        {
                            popupState.context === 'Team'
                                ? (
                                    Teams.map(option => (
                                        <button
                                            key={option.id}
                                            className="w-full border-[0] cursor-pointer text-left p-[6px] bg-[transparent] text-[14px] text-[#4a5568] hover:bg-[#ebf4ff] hover:text-[#4f46e5] rounded-[6px] transition duration-150"
                                            onClick={() => handleAction(option)} // Pass option directly to be the new team
                                        >
                                            {option.title}
                                        </button>
                                    ))
                                ) : (
                                    filtersButtons.find(f => f.title === popupState.context)?.options.map((option, index) => (
                                        <button
                                            key={index}
                                            className="w-full border-[0] cursor-pointer text-left bg-[transparent] p-[6px] text-[14px] text-[#4a5568] hover:bg-[#ebf4ff] hover:text-[#4f46e5] rounded-[6px] transition duration-150"
                                            onClick={() => handleAction(option)}
                                        >
                                            {option.title}
                                        </button>
                                    ))
                                )
                        }
                    </div>
                </Popover>
            </div>

        </div>
    )
}

export default CreateIssue