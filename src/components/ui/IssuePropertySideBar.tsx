import { Link, Files, GitBranch } from 'lucide-react'


const IconSize = 16;
const IssuePropertySideBar = ({issue}: {issue: any}) => {
    return (
        <div className="w-[230px] flex-shrink-0 border-l border-[var(--task-border-color-light)] px-[20px]">
            <div className="prop-header flex justify-between h-[40px] items-center">
                Properties
                <Link size={IconSize} />
                <Files size={IconSize} />
                <GitBranch size={IconSize} />
            </div>
            <div className="flex flex-col">
                {issue.status}
            </div>
        </div>
    )
}

export default IssuePropertySideBar
