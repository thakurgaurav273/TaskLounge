import { getFormattedTime } from "../../shared/utils/helperFunctions";
import Avatar from "./Avatar";

const Comment = ({ comment }: { comment: any }) => {
    const avatarStyle = {
        height: 24,
        width: 24
    }
    console.log(comment);
    return (
        <div className="w-full h-[80%] border border-gray-300 shadow-sm rounded-xl p-4 transition-all duration-300 flex flex-col gap-2">
            <div className="header flex items-center gap-2">
                <Avatar name={comment.author.name} status="comment.author.status" avatarUrl={comment.author.avatar} avatarStyle={avatarStyle}/>
                <span>{comment.author.name}</span>
                <span>{getFormattedTime(comment.createdAt)}</span>
            </div>
            {comment.attachments.map((item: string)=>{
                return <img src={item} key={comment._id} className="h-[80%] w-[100%] object-cover"/>
            })}
            <div>{comment.commentText}</div>
        </div>
    )
}

export default Comment;
