import { Link, Files, GitBranch, icons } from 'lucide-react'
import StatusIcon from './StatusIcon';
import type { FilterButton, PopupState } from './CreateIssue';
import { useCallback, useState, useEffect } from 'react';
import Popover from './Popover';
import { Labels, Project, Status } from '../../shared/utils/data';
import { useSelector } from 'react-redux';
import { getIconById } from '../../shared/utils/helperFunctions';
import Avatar from './Avatar';
import AlertBox from './AlertBox';

const IconSize = 18;
const IssuePropertySideBar = ({ issue }: { issue: any }) => {
    const [currentStatus, setCurrentStatus] = useState<string>(issue?.status || 'Status');
    const [currentPriority, setCurrentPriority] = useState<string>(issue?.priority || 'Priority');
    const [project, setProject] = useState<string>("Project"); 
    const [label, setLabel] = useState<Array<string>>(issue?.label || []);
    const [showBanner, setShowBanner] = useState<boolean>(false);
    const users = useSelector((state: any) => state.usersList);
    const [assignee, setAssignee] = useState<{ title: string, id: string }>({
        title: issue?.assignee?.name || 'Assignee',
        id: issue?.assignee?._id || ''
    });
    const [popupState, setPopupState] = useState<PopupState>({
        isOpen: false,
        x: 0,
        y: 0,
        context: null
    });

    const avatarStyleProps = { height: 18, width: 18 };

    const handleUpdate = async (field: 'status' | 'priority' | 'assignee' | 'label' | 'project', value: string | string[]) => {
        if (!issue?._id) return;
        
        const body: { [key: string]: string | string[] } = {};
        
        if (field === 'assignee') {
            body[field] = value; 
        } else if (field === 'label') {
            body[field] = value; 
        } else {
            body[field] = value; 
        }

        try {
            const response = await fetch(`http://localhost:8080/api/issues/${issue._id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                throw new Error(`Failed to update ${field}`);
            }

            const data = await response.json();
            console.log(`Updated ${field}:`, data);
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
        }
    }

    const options = [
        {
            id: 'status',
            title: currentStatus, 
            icon: <StatusIcon status={currentStatus} /> 
        },
        {
            id: 'priority',
            title: currentPriority === 'No Priority' ? '--- Set priority' : currentPriority, 
            icon: <StatusIcon status={currentPriority} /> 
        },
        {
            id: 'assignee',
            title: assignee.title, 
            icon: (
                <Avatar
                    name={assignee.title}
                    avatarUrl={issue.assignee?.avatar}
                    avatarStyle={avatarStyleProps}
                />
            )
        }
    ]

    const filtersButtons: FilterButton[] = [
        {
            id: "status",
            title: "Status", 
            icon: <StatusIcon status={currentStatus} />,
            options: Status
        },
        {
            id: "assignee",
            title: "Assignee", 
            icon: (
                <Avatar
                    name={assignee.title}
                    avatarUrl={issue.assignee?.avatar}
                    avatarStyle={avatarStyleProps}
                />
            ),
            options: users.map((ele: any) => ({
                title: ele.name,
                ...ele
            }))
        },
        {
            id: "priority",
            title: "Priority", 
            icon: <StatusIcon status={currentPriority} />,
            options: [
                { title: 'Low' },
                { title: 'Medium' },
                { title: 'High' },
                { title: 'No Priority' } 
            ]
        },
        {
            id: "project",
            title: "Project", 
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

    const handleClose = useCallback(() => {
        setPopupState((prev) => ({ ...prev, isOpen: false }));
    }, []);

    const handleButtonClick = (e: React.MouseEvent<HTMLDivElement>, context: string) => {
        e.stopPropagation();
        setPopupState({
            isOpen: true,
            x: e.clientX,
            y: e.clientY,
            context: context
        });
    };

    const handleAction = (action: any) => {
        const context = popupState.context;

        switch (context) {
            case 'Status':
                setCurrentStatus(action.title);
                handleUpdate('status', action.title);
                break;
            case 'Priority':
                setCurrentPriority(action.title);
                handleUpdate('priority', action.title);
                break;
            case 'Assignee':
                setAssignee({
                    title: action.title, 
                    id: action._id 
                });
                handleUpdate('assignee', action._id); 
                break;
            case 'Project':
                setProject(action.title);
                handleUpdate('project', action.title);
                break;
            case 'Labels': 
                const newLabels = [...label, action.title];
                setLabel(newLabels);
                handleUpdate('label', newLabels); 
                break;
            default:
                console.log(`Unhandled context: ${context}`);
        }
        handleClose();
    };

    // New function to handle label removal
    const handleRemoveLabel = (labelToRemove: string) => {
        const updatedLabels = label.filter(item => item !== labelToRemove);
        setLabel(updatedLabels);
        handleUpdate('label', updatedLabels);
    };
    
    useEffect(() => {
        if (issue) {
            setCurrentStatus(issue.status || 'Status');
            setCurrentPriority(issue.priority || 'Priority');
            setLabel(issue.label || []);
            setAssignee({
                title: issue.assignee?.name || 'Assignee',
                id: issue.assignee?._id || ''
            });
        }
    }, [issue]);

    const getContextTitle = (title: string) => {
        if (title === currentStatus) return 'Status';
        if (title === currentPriority) return 'Priority';
        if (title === assignee.title) return 'Assignee';
        return title;
    };

    return (
        <div className="w-[230px] flex-shrink-0 border-l border-[var(--task-border-color-light)] px-[20px]">
            <div className="prop-header flex justify-between h-[40px] items-center">
                <p className='m-0 text-sm'>Properties</p>
                <Link size={IconSize} />
                <Files size={IconSize} onClick={async () => {
                    await navigator.clipboard.writeText(issue.ticketId);
                    setShowBanner(true);
                    setTimeout(() => {
                        setShowBanner(false);
                    }, 1000);
                }} />
                <GitBranch size={IconSize} />
            </div>
            {showBanner && <AlertBox text={`${issue.ticketId} copied to clipboard`} id='generic' />}
            <div className="flex flex-col gap-3 pt-3">
                {options.map((item) => {
                    return (<div onClick={(e) => handleButtonClick(e, getContextTitle(item.title))} 
                        key={item.id} className='flex items-center gap-2 cursor-pointer'>
                        {item.icon}
                        <span className='capitalize'>{item.title}</span>
                    </div>)
                })}
                <p className='m-0'>Labels</p>
                <div className="labels-wrapper flex flex-wrap gap-2">
                    {label.map((item) => {
                        return (
                            <span 
                                key={item} 
                                onClick={() => handleRemoveLabel(item)} // Added onClick handler
                                className='flex items-center px-3 border-1 border-[var(--task-border-color-light)] rounded-xl justify-center w-[fit-content] cursor-pointer hover:bg-red-100 transition duration-150' // Added cursor and hover style for feedback
                            >
                                {item}
                            </span>
                        )
                    })}
                    <button onClick={(e: any) => handleButtonClick(e, 'Labels')}> + </button>
                </div>
            </div>
            <Popover
                x={popupState.x}
                y={popupState.y}
                isOpen={popupState.isOpen}
                onClose={handleClose}
                leftAdjustment={200}
            >
                <div className="flex flex-col gap-[5px]">
                    <input type="text" placeholder={`Change ${popupState.context}`} className="border-0 text-[14px] outline-0 p-[8px] border-b-[1px]" />

                    {
                        filtersButtons.find(f => f.title === popupState.context)?.options.map((option: any, index: number) => (
                            <button
                                key={index}
                                className="w-full border-[0] cursor-pointer text-left bg-[transparent] p-[6px] text-[14px] text-[#4a5568] hover:bg-[#ebf4ff] hover:text-[#4f46e5] rounded-[6px] transition duration-150"
                                onClick={() => handleAction(option)}
                            >
                                {option.title}
                            </button>
                        ))
                    }
                </div>
            </Popover>

        </div>
    )
}

export default IssuePropertySideBar