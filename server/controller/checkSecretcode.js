const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

async function checkSecretCode(request, response) {
    try {
        const { secretcode, userId } = request.body;

        if (!secretcode || !userId) {
            return response.status(400).json({
                message: "Missing secretcode or userId",
                error: true,
            });
        }

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return response.status(400).json({
                message: "Invalid userId",
                error: true,
            });
        }

        const user = await UserModel.findById(userId);

        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
            });
        }

        const verifySecretCode = await bcryptjs.compare(secretcode, user.secretcode);

        if (!verifySecretCode) {
            return response.status(400).json({
                message: "Please check secret code",
                error: true,
            });
        }

        const tokenData = {
            id: user._id,
            email: user.email,
        };
        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        };

        return response.cookie("token", token, cookieOptions).status(200).json({
            message: "Successfully",
            token: token,
            success: true,
        });
    } catch (error) {
        console.error(error);
        return response.status(500).json({
            message: error.message || error,
            error: true,
        });
    }
}

module.exports = checkSecretCode;