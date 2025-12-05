import StatusIcon from "./StatusIcon";

export type Issue = {
    _id: string;
    ticketId: string;
    team: string;
    label: Array<string>;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    createdBy:any;
    attachments?: Array<string>;
    priority: string;
    status: string;
    dueDate?:any;
    comments?: Array<any>;
    assignee?: Array<any>;
}

const IssueListItem = ({item, onClick}: {item: Issue, onClick?: () => void}) => {
  return (
    <div className="flex items-center h-[40px] w-full justify-between cursor-pointer hover:bg-[whitesmoke] py-2 px-[30px]" onClick={onClick}>
      <div className="left flex gap-[10px] items-center">
        <StatusIcon status={item.status ? item.status : 'Done'} size={18} />
        <p className="title m-0">
          {item.ticketId}
        </p>
        <p className="title m-0 font-[500]">
          {item.title}
        </p>
      </div>
      <div className="right flex gap-2">
          {item.label.map((lab)=>{
            return <span key={lab} className="bg-[white] text-sm rounded-[20px] border-1 border-[var(--task-border-color-light)] py-1 px-2">{lab}</span>
          })}
      </div>
    </div>
  )
}

export default IssueListItem
