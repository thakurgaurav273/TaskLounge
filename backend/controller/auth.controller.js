import userModel from "../model/user.model.js";
import bcrypt from "bcryptjs";

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const existingUser = await userModel.findOne({ email: email }).lean();

    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "User does not exist"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized Access"
      });
    }

    // Exclude password before sending user object
    const { password: _, ...safeUser } = existingUser;

    return res.status(200).json({
      success: true,
      user: safeUser
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error"
    });
  }
}

export { login };
