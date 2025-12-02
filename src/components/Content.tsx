import { issues } from "../shared/utils/sampleIssues"
import ListItem from "./ui/ListItem"

const Content = () => {
  return (
    <div className="flex flex-1 w-[100%] flex-col h-[100%] box-border">
      <div className="flex h-[40px] justify-center items-center w-full bg-[var(--task-background-color-100)]">
        Inbox
      </div>
      <div className="flex w-[99%] flex-1 border-1 box-border">
        <div className="content-sidebar-wrapper w-[300px]">
          {issues.map((ele) => {
            return <ListItem user={ele.user} titleText={ele.titleText} subtitleText={ele.subtitleText} subtitleTailViewText={ele.subtitleTailViewText} />
          })}
        </div>
        <div className="content-main-wrapper">

        </div>
      </div>
    </div>
  )
}

export default Content
