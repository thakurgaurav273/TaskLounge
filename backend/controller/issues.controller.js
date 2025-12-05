import IssueModel from "../model/issue.model.js"

async function createIssue(req, res) {
    try {
        const {
            team,
            label,
            project,
            title,
            description,
            attachments,
            priority,
            status,
            assignee,
            dueDate,
            createdBy,
            comments
        } = req.body;

        const ticketId = await getNextTicketId(team);

        const newIssueData = {
            ticketId,
            title,
            description,
            ...(team && { team }),
            ...(label && { label }),
            ...(project && { project }),
            ...(attachments && { attachments }),
            ...(priority && { priority }),
            ...(status && { status }),
            ...(assignee && { assignee }),
            ...(dueDate && { dueDate: new Date(dueDate) }),
            ...(createdBy && { createdBy }),
            ...(comments && { comments })
        };
        
        const newIssue = await IssueModel.create(newIssueData);
        res.status(201).json({
            message: "Issue created successfully",
            issue: newIssue
        });
    } catch (error) {
        // Handle MongoDB duplicate key error (code 11000), typically for 'ticketId'
        if (error.code === 11000) {
            return res.status(409).json({ 
                message: `Ticket ID already exists.` 
            });
        }

        // Handle Validation Errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                message: "Validation failed", 
                errors: messages 
            });
        }
        
        console.log(error);
        res.status(500).json({ 
            message: "Internal server error during issue creation." 
        });
    }
}

async function getNextTicketId(team) {
    const regex = new RegExp(`^${team}-(\\d+)$`);

    const lastIssue = await IssueModel
        .find({ ticketId: { $regex: regex } })
        .sort({ ticketId: -1 })
        .limit(1)
        .lean();

    if (lastIssue.length === 0) {
        return `${team}-1`;
    }

    const lastTicketId = lastIssue[0].ticketId;
    const lastNumber = parseInt(lastTicketId.split('-')[1], 10);

    const nextNumber = lastNumber + 1;
    return `${team}-${nextNumber}`;
}

async function getIssues(req, res) {
    try {
        const { assignee, createdBy} = req.query;
        
        let query = {};
        
        if (assignee) {
            query = { assignee };
        }
        else if(createdBy){
            query = {createdBy};
        }
        console.log(query);
        const issues = await IssueModel.find(query)
            .populate('assignee', 'name status username avatar') 
            .populate('createdBy', 'name status username avatar')
            .populate('comments.author', 'name status username avatar')
            .populate('comments.replies.author', 'name status username avatar');

        res.status(200).json({
            success: true,
            issues: issues
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


async function updateIssue(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Convert dueDate string to Date object if provided
        if (updates.dueDate) {
            updates.dueDate = new Date(updates.dueDate);
        }

        const updatedIssue = await IssueModel.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        )
        .populate('assignee', 'name status username avatar')
        .populate('createdBy', 'name status username avatar');

        if (!updatedIssue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Issue updated successfully",
            issue: updatedIssue
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: messages
            });
        }

        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error during issue update"
        });
    }
}

export { createIssue, getIssues, updateIssue };