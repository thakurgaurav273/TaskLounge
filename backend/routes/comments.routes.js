import express from "express";
import {addComment} from "../controller/comments.controller.js";
const router = express.Router();

router.patch('/update', addComment);

export default router;