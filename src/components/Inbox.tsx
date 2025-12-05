import { useEffect, useState, useRef } from "react"
import ListItem from "./ui/ListItem"
import { Ellipsis, ListFilter, Settings2 } from "lucide-react";
import DescriptionEditor from "./ui/DecriptionEditor";
import IssuePropertySideBar from "./ui/IssuePropertySideBar";
import type { Issue } from "./ui/IssueListItem";
import { getFormattedTime } from "../shared/utils/helperFunctions";
import { useSelector } from "react-redux";
import Loading from "./ui/Loading";
import Avatar from "./ui/Avatar";
import useDebounce from "./hooks/useDebounce";

const IconSize = 16;

const Inbox = () => {
    const isInitialMount = useRef(true);
    const [myIssues, setMyIssues] = useState<Issue[]>([]);
    const [selectedItem, setSelectedItem] = useState<Issue | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const user = useSelector((state: any) => state.loggedInUser)

    // FIX 1: Initialize states to an empty string ("") instead of relying on selectedItem?.property.
    // This ensures they are controlled inputs from the start (value is never undefined).
    const [originalTitle, setOriginalTitle] = useState<string | undefined>("");
    const [originalDescription, setOriginalDescription] = useState<string | undefined>("");

    const [updatedTitle, setUpdatedTitle] = useState<string | undefined>("");
    const [description, setDescription] = useState<string | undefined>("");

    const debouncedTitle = useDebounce(updatedTitle, 500);
    const debouncedDescription = useDebounce(description, 500);

    const handleUpdate = async (whatToUpdate: 'title' | 'description') => {
        if (whatToUpdate === 'title' && debouncedTitle && selectedItem?._id) {
            const response = await fetch(`http://localhost:8080/api/issues/${selectedItem._id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: debouncedTitle
                })
            }).then((res) => res.json());

            console.log(response);
        } else if (whatToUpdate === 'description' && debouncedDescription && selectedItem?._id) {
            const response = await fetch(`http://localhost:8080/api/issues/${selectedItem._id}`, {
                method: 'PATCH',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    description: debouncedDescription
                })
            }).then((res) => res.json());

            console.log(response);
        }
    }

    useEffect(() => {
        if (!isInitialMount.current && debouncedDescription !== originalDescription) {
            handleUpdate('description');
            setOriginalDescription(debouncedDescription);
        }
    }, [debouncedDescription]);


    useEffect(() => {
        if (!isInitialMount.current && debouncedTitle !== originalTitle) {
            handleUpdate('title')
            setOriginalTitle(debouncedTitle);
        }
    }, [debouncedTitle]);

    useEffect(() => {
        if (selectedItem) {
            // Use || "" to guarantee a string type for the state
            setUpdatedTitle(selectedItem.title || "");
            setDescription(selectedItem.description || ""); 
            setOriginalTitle(selectedItem.title || "");
            setOriginalDescription(selectedItem.description || "");
        }
        console.log(selectedItem)
        isInitialMount.current = true;
    }, [selectedItem]);

    useEffect(() => {
        isInitialMount.current = false;
    }, []);

    const handleSave = (content: string) => {
        setDescription(content);
    }

    const fetchIssues = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/issues?assignee=${user._id}`, {
                method: 'GET'
            });
            const data = await response.json();
            setMyIssues(data.issues);
            setLoading(false);
        } catch (error) {
            console.error("Failed to fetch issues:", error);
        }
    }

    useEffect(() => {
        fetchIssues();
    }, [])

    if (loading) {
        return <Loading fullScreen={true} variant="dots" />
    }

    const handleTitleChange = (e: any) => {
        setUpdatedTitle(e.target.value);
    }
    return (
        <div className="h-full w-full flex">
            <div className="content-sidebar-wrapper flex-shrink-0 w-[320px] h-full border-r border-[var(--task-border-color-light)]">
                <div className="px-[15px] h-[40px] flex items-center justify-between box-border border-b border-[var(--task-border-color-light)]">
                    <div className="flex gap-[10px] items-center">
                        Inbox
                        <Ellipsis size={IconSize} />
                    </div>
                    <div className="flex gap-[8px]">
                        <ListFilter size={IconSize} />
                        <Settings2 size={IconSize} />
                    </div>
                </div>

                <div className="overflow-y-auto h-[calc(100%-40px)]">
                    {myIssues.map((issue) => {
                        return (
                            <ListItem
                                key={issue._id}
                                user={issue.assignee}
                                titleText={issue.title}
                                classNames={selectedItem && selectedItem._id === issue._id ? 'bg-[whitesmoke]' : ''}
                                subtitleText={issue.description}
                                subtitleTailViewText={getFormattedTime(new Date(issue.createdAt).toDateString())}
                                handleListItemClick={() => {
                                    setSelectedItem(issue);
                                }}
                            />
                        );
                    })}
                    {myIssues.length === 0 && <div className="h-full w-full flex items-center justify-center">
                        No Tickets assgined to you yet!
                    </div>}
                </div>
            </div>

            {selectedItem && (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="px-[15px] h-[40px] flex items-center box-border border-b border-[var(--task-border-color-light)] flex-shrink-0">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="hover:underline cursor-pointer">Inbox</span>
                            <span>/</span>
                            <span className="font-medium text-gray-800">{selectedItem.ticketId}</span>
                        </div>
                    </div>

                    <div className="flex flex-1 overflow-hidden">
                        <div className="flex-1 overflow-y-auto">
                            <div className="p-[20px]">
                                <input type="text" onChange={handleTitleChange} value={updatedTitle} className="outline-none text-[24px] w-full font-bold" placeholder="Enter issue title" />
                            </div>
                            <div className="mb-4 mx-3 flex items-center gap-4 text-xs text-gray-600">
                                <div className="flex items-center gap-2">
                                    <Avatar name={selectedItem.createdBy?.name || 'User'} avatarUrl={selectedItem.createdBy?.avatar} />
                                    <span>{selectedItem.createdBy?.name || 'Unknown'}</span>
                                </div>
                                <span>•</span>
                                <span>Created {getFormattedTime(new Date(selectedItem.createdAt).toDateString())}</span>
                                {selectedItem.dueDate && (
                                    <>
                                        <span>•</span>
                                        <span className={`font-medium ${new Date(selectedItem.dueDate) < new Date()
                                            ? 'text-red-600'
                                            : 'text-blue-600'
                                            }`}>
                                            Due {new Date(selectedItem.dueDate).toLocaleDateString()}
                                        </span>
                                    </>
                                )}
                            </div>
                            <div className="px-[20px] pb-[20px]">
                                Issue Description:
                                <div className="min-h-[300px]">
                                    <DescriptionEditor
                                        onSave={handleSave}
                                        initialValue={description || ""} 
                                    />
                                </div>
                            </div>

                        </div>

                        <IssuePropertySideBar issue={selectedItem} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default Inbox;