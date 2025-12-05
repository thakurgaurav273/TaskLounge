import { ChevronRight } from "lucide-react"
import type { Issue } from "./IssueListItem"
import DescriptionEditor from "./DecriptionEditor"
import Composer from "./Composer"
import { useState } from "react"
import Comment from "./Comment"
const IssueContainer = ({ issue, onBack }: { issue: Issue | null, onBack?: () => void }) => {
  const [updatedTitle, setUpdatedTitle] = useState<string | undefined>(issue?.title);

  const tabs = [
    {
      id: 'my_issues',
      title: 'My issues',
      onClick: () => {
        if (onBack) {
          onBack()
        }
      }
    },
    {
      id: 'ticket_id',
      title: issue?.ticketId,
      onClick: () => { }
    }
  ]

  const handleTitleChange = (e: any) => {
    setUpdatedTitle(e.target.value);
  }
  return (
    <div className="flex flex-col w-full overflow-scroll mb-10">
      <div className="breadcrum flex-shrink-0 flex items-center h-[40px] border-b-[1px] border-[var(--task-border-color-light)] px-10 text-sm">
        {tabs.map((t, idx) => {
          return (<span onClick={t.onClick} key={t.id} className="flex items-center cursor-pointer">
            {t.title}
            {idx !== tabs.length - 1 && <ChevronRight />}
          </span>)
        })}
      </div>
      <div className="content flex flex-col mx-18 my-10 flex-1 h-full box-border">
        <div className="flex flex-col min-h-[100px]">
          <input type="text" onChange={handleTitleChange} value={issue?.title} className="outline-none text-[24px] font-bold" placeholder="Enter issue title" />
          <DescriptionEditor initialValue={issue?.description} classNames="text-[18px]" handleSaveDirectly={true} />
        </div>
        <div className="flex flex-col gap-2 h-auto">
          {issue?.comments?.map((comment) => {
            return (<Comment key={comment._id} comment={comment} />)
          })}
        </div>
        <Composer issue={issue} />
      </div>
    </div>
  )
}

export default IssueContainer;
