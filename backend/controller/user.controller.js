import bcrypt from 'bcryptjs';
import userModel from "../model/user.model.js";

async function createUser(req, res) {
    try {
        const { username, name, email, password, status, avatar } = req.body;

        // Fix: Check if REQUIRED fields are MISSING (use && not ||)
        if (!username || !email || !password || !name) {
            return res.status(400).json({
                message: "Required fields (username, email, password) are missing"
            });
        }

        // Hash password BEFORE checking existing user
        const hashedPassword = await bcrypt.hash(password, 10);

        const existingUser = await userModel.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        const newUser = new userModel({
            username,
            email,
            name,
            password: hashedPassword,
            ...(status && { status }),
            ...(avatar && { avatar })
        });

        const response = await newUser.save();
        
        const userObj = response.toObject();
        delete userObj.password;

        return res.status(201).json({  // Use 201 for created resource
            success: true,
            user: userObj
        });
    } catch (error) {
        return res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

async function getUsers(req, res) {
    try {
        const users = await userModel.find({}, { password: 0 }); // Exclude password by default
        return res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export { createUser, getUsers };
