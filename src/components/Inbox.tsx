import { useState } from "react"
import { issues } from "../shared/utils/sampleIssues"
import ListItem from "./ui/ListItem"
import { Ellipsis, Files, GitBranch, Link, ListFilter, Settings2 } from "lucide-react";
import DescriptionEditor from "./ui/DecriptionEditor";

const IconSize = 16;
const Inbox = () => {
    const [selectedItem, setSelectedItem] = useState<any>(null);

    return (
        <div className="h-[100%] w-[100%] flex">
            <div className="content-sidebar-wrapper flex-shrink-0 w-[320px] h-[100%] border-r border-[var(--task-border-color-light)]">
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
                {issues.map((ele) => {
                    return <ListItem key={ele.id} user={ele.user} titleText={ele.titleText} classNames={selectedItem && selectedItem.id === ele.id ? 'bg-[whitesmoke]' : ''} subtitleText={ele.subtitleText} subtitleTailViewText={ele.subtitleTailViewText} handleListItemClick={() => {
                        setSelectedItem(ele);
                        console.log("ele", ele)
                    }} />
                })}
            </div>
            {selectedItem && (
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    <div className="px-[15px] h-[40px] flex items-center box-border border-b border-[var(--task-border-color-light)] flex-shrink-0">
                        breadcrum
                    </div>

                    <div className="flex flex-1">
                        <div className="flex-1 overflow-y-auto ">
                            <div className="p-[10px]">
                                <h3 className="m-[0]">{selectedItem.titleText}</h3>
                            </div>

                            <div className="px-[10px] pb-[10px]">
                                <DescriptionEditor
                                    initialValue={""}
                                />
                            </div>
                        </div>
                        <div className="w-[230px] flex-shrink-0 border-l border-[var(--task-border-color-light)] px-[20px]">
                            <div className="prop-header flex justify-between h-[40px] items-center">
                                Properties
                                <Link size={IconSize}/>
                                <Files size={IconSize}/>
                                <GitBranch size={IconSize}/>
                            </div>
                            <div className="flex flex-col">
                                {selectedItem.status}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Inbox
