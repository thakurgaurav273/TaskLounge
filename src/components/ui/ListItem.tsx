import { CircleX } from "lucide-react"
import Avatar from "./Avatar"
import type { JSX } from "react";

const IconSize = 16;
type IListItemProps = {
    titleText: string,
    subtitleText: string,
    subtitleTailViewText: string,
    user: any;
    leadingView?: JSX.Element;
    subtitleTailView?: JSX.Element,
    handleListItemClick?:(issue: any)=> void,
    classNames?: string
}
const ListItem = ({ leadingView, user, titleText, subtitleText, subtitleTailViewText, subtitleTailView, handleListItemClick, classNames}: IListItemProps) => {
    return (
        <div className={`${classNames} flex w-full p-[10px] box-border gap-[10px] hover:bg-[whitesmoke] cursor-pointer`} onClick={handleListItemClick}>
            {leadingView ? leadingView : user ? <Avatar name={user.name} /> : null}
            <div className="flex flex-col w-full min-w-0">
                <div className="flex justify-between gap-2">
                    <span className="text-[14px] truncate">{titleText}</span>
                    <span className="flex-shrink-0"> <CircleX size={IconSize} /> </span>
                </div>
                <div className="flex justify-between gap-2">
                    <span className="text-[12px] overflow-hidden whitespace-nowrap text-ellipsis flex-1 min-w-0">{subtitleText}</span>
                    {subtitleTailView ? subtitleTailView : <span className="text-[13px] flex-shrink-0">{subtitleTailViewText}</span>}
                </div>
            </div>
        </div>
    )
}

export default ListItem