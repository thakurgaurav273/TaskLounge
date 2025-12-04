import { useSelector } from "react-redux"
import Inbox from "./Inbox"
import MyIssues from "./MyIssues"

const Content = () => {
  const contentToDisplay = useSelector((state:any)=> state.selectedTab)
  return (
    <div className="flex flex-1 w-[100%] flex-col h-[100%] box-border bg-[var(--task-background-color-100)]">
      <div className="flex h-[40px] justify-center items-center w-ful">
        Inbox
      </div>
      <div className="flex w-[99%] h-[94%] border-1 box-border bg-[white] border-[var(--task-border-color-light)] rounded-[8px]">
        {contentToDisplay === 'inbox'
          ? <Inbox/> : contentToDisplay === 'my_issues' ? <MyIssues/>: null
        }
      </div>
    </div>
  )
}

export default Content
