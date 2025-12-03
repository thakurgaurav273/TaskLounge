import bcrypt from 'bcryptjs'; // Make sure bcrypt is imported
import userModel from "../model/user.model.js";

async function createUser(req, res) {
    try {
        const { username, email, password, status, avatar } = req.body;

        if (username || email || password) {
            res.status(400).json({
                message: "Required fields are missing"
            })
        }
        const newUserDetails = {
            username,
            email,
            password,
            ...(status && { status }),
            ...(avatar && { avatar })
        }

        let hashedPassword = "";
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const existingUser = await userModel.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(409).json({
                message: "User already exists",
            });
        }

        const newUser = new userModel({
            ...newUserDetails,
            password: hashedPassword,
        });

        const response = await newUser.save();

        if (response) {
            const userObj = response.toObject();
            delete userObj.password; // Remove password from the returned object

            res.status(200).json({
                success: true,
                user: userObj
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message
        });
    }
}

async function getUsers(req, res) {
    try {
        const users = await userModel.find({});
        res.status(200).json({
            success: true,
            users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error
        })
    }
}

export { createUser, getUsers };
