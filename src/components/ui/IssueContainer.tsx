import { ChevronRight } from "lucide-react"
import type { Issue } from "./IssueListItem"

const IssueContainer = ({issue, onBack}: {issue: Issue | null, onBack?: ()=> void}) => {
  const tabs = [
    {
      id: 'my_issues',
      title: 'My issues',
      onClick: () => {
        if(onBack){
          onBack()
        }
      }
    },
    {
      id: 'ticket_id',
      title: issue?.ticketId,
      onClick: () => {}
    }
  ]
  return (
    <div className="flex flex-col w-full">
        <div className="breadcrum flex items-center h-[40px] border-b-[1px] border-[var(--task-border-color-light)] px-10 text-sm">
            {tabs.map((t, idx) =>{
              return (<span onClick={t.onClick} key={t.id} className="flex items-center cursor-pointer">
                {t.title}
                {idx !== tabs.length-1 && <ChevronRight/>}
              </span>)
            })}
        </div>
        <div className="content flex flex-col mx-18 my-10 flex-1 h-full box-border">
            <p className="title">
                {issue?.title}
            </p>
            <p>{issue?.description}</p>
        </div>
    </div>
  )
}

export default IssueContainer;
