import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

// @desc    Auth user & get token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && user.status === "blocked")
        throw new Error(`The user with email "${email}" is blocked and is not allowed to log in.`);

    if (user && (await user.matchPasswords(password))) {
        generateToken(res, user._id);
        await user.updateOne({ lastLoginDate: new Date() });
        res.json({user});
    } else {
        res.status(400);
        throw new Error("Invalid email or password.");
    }
});

// @desc    Signup a new user
// @route   POST /api/users/signup
// @access  Public
const signupUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await User.create({
            name,
            email,
            password,
        });
        if (user) {
            generateToken(res, user._id);
            res.status(201).json({user});
        }
    } catch (err) {
        throw new Error(err);
    }
});

// @desc    Logout user
// @route   POST /api/users/logout
// @access  Public
const logoutUser = (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully" });
};

// @desc    Get user profiles
// @route   GET /api/users/dashboard
// @access  Private
const getUserProfiles = asyncHandler(async (req, res) => {
    const users = await User.find();
    if (users.length >= 1) res.status(200).json(users);
});

// @desc    Block users
// @route   POST /api/users/dashboard/block
// @access  Private
const blockUsers = asyncHandler(async (req, res) => {
    try {
        const { selectedUsers } = req.body;
        await User.updateMany({ _id: { $in: selectedUsers }, status: "active" }, { $set: { status: "blocked" } });

        res.status(200).json({ selectedUsers });
    } catch (err) {
        throw new Error(err);
    }
});

// @desc    Unblock users
// @route   POST /api/users/dashboard/unblock
// @access  Private
const unblockUsers = asyncHandler(async (req, res) => {
    try {
        const { selectedUsers } = req.body;
        await User.updateMany({ _id: { $in: selectedUsers }, status: "blocked" }, { $set: { status: "active" } });

        res.status(200).json({ selectedUsers });
    } catch (err) {
        throw new Error(err);
    }
});

// @desc    Delete users
// @route   DELETE /api/users/dashboard/delete
// @access  Private
const deleteUsers = asyncHandler(async (req, res) => {
    try {
        const { selectedUsers } = req.body;
        await User.deleteMany({ _id: { $in: selectedUsers } });
        res.status(200).json({ message: "User profile deleted" });
    } catch (err) {
        res.status(404);
        throw new Error("User not found");
    }
});

export {
    authUser,
    signupUser,
    logoutUser,
    getUserProfiles,
    blockUsers,
    unblockUsers,
    deleteUsers
};