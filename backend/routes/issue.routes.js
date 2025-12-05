import express from "express";
import {createIssue, getIssues, updateIssue} from '../controller/issues.controller.js' 
const router = express.Router();

router.post("/create", createIssue);
router.patch('/:id',updateIssue)
router.get("/", getIssues)

export default router;