import { Link, Files, GitBranch, icons } from 'lucide-react'
import StatusIcon from './StatusIcon';
import type { FilterButton, PopupState } from './CreateIssue';
import { useCallback, useState } from 'react';
import Popover from './Popover';
import { Labels, Project, Status } from '../../shared/utils/data';
import { useSelector } from 'react-redux';
import { getIconById } from '../../shared/utils/helperFunctions';
import Avatar from './Avatar';

const IconSize = 18;
const IssuePropertySideBar = ({ issue }: { issue: any }) => {
    const [currentStatus, setCurrentStatus] = useState<string>(issue ? issue.status : 'Status');
    const [currentPriority, setCurrentPriority] = useState<string>(issue ? issue.priority : 'Priority');
    const [project, setProject] = useState<string>("Project");
    const [label, setLabel] = useState<Array<string>>([]);
    const users = useSelector((state: any) => state.usersList);
    const [assignee, setAssignee] = useState<{ title: string, id: string }>({
        title: issue.assignee ? issue.assignee.name : 'Assignee',
        id: issue.assignee ? issue.assignee._id : ''
    });
    const [popupState, setPopupState] = useState<PopupState>({
        isOpen: false,
        x: 0,
        y: 0,
        context: null
    });

    const avatarStyleProps = { height: 18, width: 18 };

    const options = [
        {
            id: 'status',
            title: issue.status,
            icon: <StatusIcon status={issue.status} />
        },
        {
            id: 'priority',
            title: issue.priority === 'No Priority' ? '--- Set priority' : issue.priority,
            icon: <StatusIcon status={issue.priority} />
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
            title: currentStatus,
            icon: <StatusIcon status={issue.status} />,
            options: Status
        },
        {
            id: "assignee",
            title: assignee.title,
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
            title: currentPriority,
            icon: <StatusIcon status={issue.priority} />,
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

    return (
        <div className="w-[230px] flex-shrink-0 border-l border-[var(--task-border-color-light)] px-[20px]">
            <div className="prop-header flex justify-between h-[40px] items-center">
                <p className='m-0 text-sm'>Properties</p>
                <Link size={IconSize} />
                <Files size={IconSize} />
                <GitBranch size={IconSize} />
            </div>
            <div className="flex flex-col gap-3 pt-3">
                {options.map((item) => {
                    return (<div onClick={(e: any) => handleButtonClick(e, item.title)}
                        key={item.id} className='flex items-center gap-2'>
                        {item.icon}
                        {item.title}
                    </div>)
                })}
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
                        filtersButtons.find(f => f.title === popupState.context)?.options.map((option, index) => (
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
