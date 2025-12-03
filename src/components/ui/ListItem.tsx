import { CircleX } from "lucide-react"
import Avatar from "./Avatar"
import type { JSX } from "react";

const IconSize = 16;
type IListItemProps = {
    titleText: string,
    subtitleText: string,
    subtitleTailViewText: string,
    user: {
        name: string,
        avatarUrl?: string
    },
    leadingView?: JSX.Element;
    subtitleTailView?: JSX.Element,
    handleListItemClick?:()=> void,
    classNames?: string
}
const ListItem = ({ leadingView, user, titleText, subtitleText, subtitleTailViewText, subtitleTailView, handleListItemClick, classNames}: IListItemProps) => {
    return (
        <div className={`${classNames} flex w-full p-[10px] box-border gap-[10px] hover:bg-[whitesmoke] cursor-pointer`} onClick={handleListItemClick}>
            {leadingView ? leadingView : <Avatar name={user.name} />}
            <div className="flex flex-col w-full">
                <div className="flex justify-between">
                    <span className="text-[14px]">{titleText}</span>
                    <span> <CircleX size={IconSize} /> </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-[12px]">{subtitleText}</span>
                    {subtitleTailView ? subtitleTailView : <span className="text-[13px]">{subtitleTailViewText}</span>}
                </div>
            </div>
        </div>
    )
}

export default ListItem
