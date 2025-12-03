import express from "express";
import {createIssue, getIssues} from '../controller/issues.controller.js' 
const router = express.Router();

router.post("/create", createIssue);
router.get("/", getIssues)

export default router;