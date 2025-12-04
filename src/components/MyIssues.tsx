import { ListFilter } from 'lucide-react';
import { useEffect, useState } from 'react'
import IssueListItem, { type Issue } from './ui/IssueListItem';
import IssuePropertySideBar from './ui/IssuePropertySideBar';
import IssueContainer from './ui/IssueContainer';
const MyIssues = () => {
    const [myIssues, setMyIssues] = useState<[]>([]);
    const [selectedTab, setSelectedTab] = useState<string>('assigned');
    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

    const fetchIssues = async () => {
        const response = await fetch("http://localhost:8080/api/issues", {
            method: 'GET'
        }).then((response) => response.json());
        setMyIssues(response.issues);
    }
    useEffect(() => {
        fetchIssues();
    }, [])

    const tabs = [
        {
            id: 'assigned',
            title: 'Assigned',
            onClick: () => setSelectedTab('assigned')
        },
        {
            id: 'created',
            title: 'Created',
            onClick: () => setSelectedTab('created')
        },
    ]


    const getIssueListsView = () => {
        return (<div className='h-[100%] w-[100%] flex flex-col'>
            <div className="header w-full">
                <div className="left flex gap-[10px] pl-[30px] h-[40px] items-center border-b-[1px] border-[var(--task-border-color-light)]">
                    <p className='m-[0]'>My Issues</p>
                    {tabs.map((t) => {
                        return <button key={t.id} onClick={t.onClick} className={`py-[2px] cursor-pointer px-[8px] border-1 border-[var(--task-border-color-light)] rounded-[4px] ${t.id === selectedTab ? 'bg-[whitesmoke]' : 'bg-[white]'}`}>{t.title}</button>

                    })}
                </div>
            </div>
            <div className="filters flex w-full pl-[30px] h-[40px] items-center border-b-[1px] border-[var(--task-border-color-light)]">
                <div className="left flex gap-2 items-center">
                    <ListFilter size={16} />
                    Filter
                </div>
            </div>

            <div className='flex flex-col'>
                {myIssues.map((item: Issue) => {
                    return (
                        <IssueListItem onClick={()=> setSelectedIssue(item)} key={item._id} item={item} />
                    )
                })}
            </div>
        </div>)
    }

    const getIssueDescriptionView = () =>{
        return (
            <div className='h-[100%] w-[100%] flex justify-between'>
                <IssueContainer onBack={()=> setSelectedIssue(null)} issue={selectedIssue}/>
                <IssuePropertySideBar issue={selectedIssue}/>
            </div>
        )
    }

    return selectedIssue ? getIssueDescriptionView() : getIssueListsView();
}

export default MyIssues
