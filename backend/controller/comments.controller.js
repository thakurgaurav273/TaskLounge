import IssueModel from "../model/issue.model.js";
import cloudinary from "./cloudinary.js";
async function addComment(req, res) {
    try {
        const { issueId, commentText, attachment, author } = req.body;

        // Validate required fields
        if (!issueId || !commentText || !author) {
            return res.status(400).json({ 
                success: false, 
                message: "issueId, commentText, and author are required" 
            });
        }

        let processedAttachments = [];
        // Handle base64 attachments and upload to Cloudinary
        if (attachment && Array.isArray(attachment)) {
            const uploadPromises = attachment.map(async (base64String) => {
                if (typeof base64String === 'string' && base64String.startsWith('data:')) {
                    try {
                        const result = await cloudinary.uploader.upload(base64String, {
                            folder: 'taskLongue/issues/comments',
                            resource_type: 'auto',
                            transformation: [
                                { quality: 'auto' },
                                { fetch_format: 'auto' }
                            ]
                        });
                        return result.secure_url;
                    } catch (uploadError) {
                        console.error('Cloudinary upload failed:', uploadError);
                        return null;
                    }
                }
                return base64String; // Return URL as-is if already uploaded
            });

            processedAttachments = (await Promise.all(uploadPromises)).filter(url => url);

            console.log(processedAttachments)
        }

        // Update issue with new comment
        const updatedIssue = await IssueModel.findByIdAndUpdate(
            issueId,
            {
                $push: {
                    comments: {
                        commentText: commentText.trim(),
                        attachments: processedAttachments,
                        author: author
                    }
                }
            },
            { 
                new: true,
                runValidators: true 
            }
        ).populate('comments.author', 'name email avatar'); // Optional: populate user data

        if (!updatedIssue) {
            return res.status(404).json({ 
                success: false, 
                message: "Issue not found" 
            });
        }

        res.status(200).json({
            success: true,
            issue: updatedIssue,
            newComment: updatedIssue.comments[updatedIssue.comments.length - 1]
        });

    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({
            message: "Internal server error!",
            error: error.message
        });
    }
}

export { addComment };
