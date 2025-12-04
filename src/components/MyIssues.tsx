import { Filter } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import IssueListItem, { type Issue } from './ui/IssueListItem';
const MyIssues = () => {
    const [myIssues, setMyIssues] = useState<[]>([]);

    const fetchIssues = async () => {
        const response = await fetch("http://localhost:8080/api/issues", {
            method: 'GET'
        }).then((response) => response.json());
        setMyIssues(response.issues);
    }
    useEffect(() => {
        fetchIssues();
    }, [])
    return (
        <div className='h-[100%] w-[100%] flex flex-col'>
            <div className="header w-full">
                <div className="left flex gap-[10px] pl-[30px] h-[35px] items-center border-b-[1px] border-[var(--task-border-color-light)]">
                    <p className='m-[0]'>My Issues</p>
                    <button className='py-[4px] px-[8px] bg-[white] border-1 border-[var(--task-border-color-light)] rounded-[4px]'>Assigned</button>
                    <button className='py-[4px] px-[8px] bg-[white] border-1 border-[var(--task-border-color-light)] rounded-[4px]'>Created</button>
                </div>
            </div>
            <div className="filters flex w-full pl-[30px] h-[35px] items-center border-b-[1px] border-[var(--task-border-color-light)]">
                <Filter />
            </div>

            <div className='flex pl-[30px] pr-[20px] flex-col'>
                {myIssues.map((item: Issue) => {
                return (
                    <IssueListItem item={item} />
                )
            })}
            </div>
        </div>
    )
}

export default MyIssues
