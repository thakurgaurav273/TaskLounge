import dotenv from "dotenv";
dotenv.config();
import express from "express";
import issuesRoute from "./routes/issue.routes.js"; 
import userRoutes from "./routes/user.routes.js"; 

import mongoose from "mongoose";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/issues', issuesRoute);
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/test';

async function main() {
  await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("MongoDB connected successfully!");
}).catch(err => console.log(err));

app.get("/", (req,res)=>{
   res.send("hello")
})

app.listen(PORT, ()=>{
    console.log("Server is up and running!", PORT);
})