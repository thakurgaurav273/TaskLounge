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
}
const ListItem = ({ leadingView, user, titleText, subtitleText, subtitleTailViewText, subtitleTailView }: IListItemProps) => {
    return (
        <div className="flex w-full p-[10px] box-border gap-[5px]">
            {leadingView ? leadingView : <Avatar name={user.name} />}
            <div className="flex flex-col w-full">
                <div className="flex justify-between">
                    <span>{titleText}</span>
                    <span> <CircleX size={IconSize} /> </span>
                </div>
                <div className="flex justify-between">
                    {subtitleText}
                    <span className="text-[13px]">{subtitleTailViewText}</span>
                </div>
            </div>
        </div>
    )
}

export default ListItem
