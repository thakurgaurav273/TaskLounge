export type Issue = {
    _id: string;
    ticketId: string;
    team: string;
    label: Array<string>;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    attachments?: Array<string>;
    priority?: string;
    status?: string;
    comments?: Array<any>;
}

const IssueListItem = ({item}: {item: Issue}) => {
  return (
    <div className="flex items-center h-[40px] w-full justify-between">
      <div className="left flex gap-[10px]">
        <p className="title m-0">
          {item.ticketId}
        </p>
        <p className="title m-0 font-[500]">
          {item.title}
        </p>
      </div>
      <div className="right">
          {item.label.map((lab)=>{
            return <span className="bg-[white] border-1 border-[var(--task-border-color-light)]">{lab}</span>
          })}
      </div>
    </div>
  )
}

export default IssueListItem
