import IssueModel from "../model/issue.model.js"
async function createIssue(req, res) {
    try {
        {
            const {
                ticketId,
                team,
                label,
                project,
                title,
                description,
                attachments,
                priority,
                status,
                assignee,
                createdBy,
                comments
            } = req.body;

            if (!ticketId || !title) {
                return res.status(400).json({ message: "Missing required fields: ticketId or title." });
            }

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
                ...(createdBy && { createdBy }),
                ...(comments && { comments })
            };
            const newIssue = await IssueModel.create(newIssueData);
            res.status(201).json({
                message: "Issue created successfully",
                issue: newIssue
            });
        }
    } catch (error) {

        // Handle MongoDB duplicate key error (code 11000), typically for 'ticketId'
        if (error.code === 11000) {
            return res.status(409).json({ message: `Ticket ID '${ticketId}' already exists.` });
        }

        // Handle Validation Errors (e.g., if 'priority' or 'status' is not a valid enum value, or an ObjectId fails casting)
        if (error.name === 'ValidationError') {
            // Extract meaningful error messages from Mongoose's error object
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ message: "Validation failed", errors: messages });
        }
        console.log(error);
        res.status(500).json({ message: "Internal server error during issue creation." });
    }
}

async function getIssues(req, res) {
    try {
        const issues = await IssueModel.find();

        res.status(200).json({
            success: true,
            issues: issues
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        })
    }
}

export { createIssue, getIssues };