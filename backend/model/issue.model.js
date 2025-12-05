import mongoose from "mongoose";

// Destructuring Mongoose types for cleaner code
const { Schema } = mongoose;
const { ObjectId } = Schema.Types;

// 1. Define the Reply Subdocument Schema
const replySchema = new Schema({
    replyText: {
        type: String,
        required: true,
        trim: true,
    },
    attachments: {
        type: Array, 
        required: false,
    },
    author: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },

}, { _id: true, timestamps: true });

// 2. Define the Comment Subdocument Schema
const commentSchema = new Schema({
    commentText: {
        type: String,
        required: true,
        trim: true,
    },
    attachments: {
        type: Array,
        required: false,
    },
    author: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    replies: [replySchema],
}, { _id: true, timestamps: true }); 

// 3. Define the Main Issue Schema
const issueSchema = new Schema({
    ticketId: {
        type: String,
        unique: true,
        trim: true
    },
    team: {
        type: String,
        enum: ['ENG', 'PRO', 'DEV', 'BUGS', 'QA'], 
        default: 'ENG'
    },
    label: {
        type: Array,
        required: false
    },
    project: {
        type: String,
        required: false,
        trim: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: false,
    },
    attachments: {
        type: Array,
        required: false
    },
    priority: {
        type: String,
        enum: ['No Priority', 'Urgent', 'High', 'Medium', 'Low'],
        default: 'No Priority'
    },
    status: {
        type: String,
        enum: ['Backlog', 'In Progress', 'Todo', 'Cancelled', 'Duplicate', 'Triage', 'Done'],
        default: 'Backlog'
    },
    assignee: {
        type: ObjectId,
        ref: 'User',
        required: false
    },
    comments: [commentSchema],

    createdBy: {
        type: ObjectId,
        ref: 'User',
        required: false,
    }
}, {
    timestamps: true
});

const IssueModel = mongoose.model('Issue', issueSchema);

export default IssueModel;