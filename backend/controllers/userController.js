import Profile from "../models/profileModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import PDFdocument from "pdfkit";
import fs from "fs";
import ConnectionRequest from "../models/connectionModel.js";


const convertUserDataTOPDF = async (userData) => {
    const doc = new PDFdocument();

    const outputPath = crypto.randomBytes(32).toString("hex") + ".pdf";

    const stream = fs.createWriteStream("uploads/" + outputPath);

    doc.pipe(stream);

    doc.image(`uploads/${userData.userId.profilePicture}`, { align: "center", width: 100 });

    doc.fontSize(14).text(`Name : ${userData.userId.name}`);
    doc.fontSize(14).text(`Username : ${userData.userId.username}`);
    doc.fontSize(14).text(`Email : ${userData.userId.email}`);
    doc.fontSize(14).text(`Bio : ${userData.bio}`);
    doc.fontSize(14).text(`Current position : ${userData.currentPost}`);

    doc.fontSize(14).text("past work :")
    userData.pastWork.forEach((work, index) => {
        doc.fontSize(14).text(`Company Name : ${work.company}`);
        doc.fontSize(14).text(`Position : ${work.position}`);
        doc.fontSize(14).text(`Years : ${work.years}`);
    });

    doc.end();

    return outputPath;

}

export const register = async (req, res) => {

    try {

        const { name, email, password, username } = req.body;
        if (!name || !email || !password || !username) {
            return res.status(400).json({ message: "All fields are required!" }); // ✅
        }
        //temparly
        // console.log(req.body);

        const user = await User.findOne({
            email
        })

        if (user) return res.status(400).json({ message: "User Already exists" }); // ✅

        const hashedpassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name,
            email,
            password: hashedpassword,
            username
        });

        await newUser.save();

        const profile = new Profile({ userId: newUser._id });

        await profile.save();

        return res.json("User created");

    } catch (err) {
        return res.status(500).json({ message: err.message })
    }

}



export const login = async (req, res) => {

    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required!" });
        }

        const user = await User.findOne({
            email
        });

        if (!user) return res.status(404).json({ message: "User Does not exists" });

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) return res.status(404).json({ message: "Invalid creadentials" });

        const token = crypto.randomBytes(32).toString("hex");

        await User.updateOne({ _id: user._id }, { token });

        return res.json({ token: token })
    }
    catch (error) {

    }

}

export const uploadProfilePicture = async (req, res) => {
    const { token } = req.body;

    try {

        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.profilePicture = req.file.filename;

        await user.save();

        return res.json({ message: "Profile picture updated!" });
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
};



export const updateUserProfile = async (req, res) => {
    try {
        const { token, ...newUserData } = req.body;

        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const { username, email } = newUserData;

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            if (existingUser || String(existingUser._id) !== String(user._id)) {
                return res.status(404).json({ message: "User already exists" });
            };
        }


        Object.assign(user, newUserData);

        await user.save();

        return res.json({ message: "user updated!" });
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
};


export const getUserAndProfile = async (req, res) => {

    try {
        const { token } = req.query;

        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userProfile = await Profile.findOne({ userId: user._id })
            .populate('userId', 'name email username profilePicture');

        return res.json(userProfile);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }

};

export const updateProfileData = async (req, res) => {
    try {

        const { token, ...newProfileData } = req.body;

        const userProfile = await User.findOne({ token: token });

        if (!userProfile) {
            return res.status(404).json({ message: "User not found" });
        }

        const post_to_update = await Profile.findOne({ userId: userProfile._id });

        Object.assign(post_to_update, newProfileData);

        await post_to_update.save();

        return res.json({ message: "Profile updated!" });

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getAllUserProfile = async (req, res) => {
    try {

        const profiles = await Profile.find().populate('userId', 'name username email profilePicture');

        return res.json({ profiles });

    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const downloadProfile = async (req, res) => {


    const user_id = req.query.id;

    const userProfile = await Profile.findOne({ userId: user_id })
        .populate('userId', 'name username email profilePicture');

    let outputPath = await convertUserDataTOPDF(userProfile);

    return res.json({ "message": outputPath });

}


export const sendConnectionRequest = async (req, res) => {

    const { token, connectionId } = req.body;

    try {

        const user = await User.findOne({ token: token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const connectionUser = await User.findOne({ _id: connectionId });

        if (!connectionUser) {
            return res.status(404).json({ message: "connection user not found" });
        }

        const existingRequest = await ConnectionRequest.findOne({
            userId: user._id,
            connectionId: connectionUser._id
        })

        if (existingRequest) {
            return res.status(404).json({ message: "Request already sent" });
        }

        const request = new ConnectionRequest({
            userId: user._id,
            connectionId: connectionUser._id
        });

        await request.save();

        return res.json({ message: "Request send" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyConnectionsRequests = async (req, res) => {

    const { token } = req.query;

    try {

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const connections = await ConnectionRequest.find({ userId: user._id })
            .populate('connectionId', 'name username email profilePicture');

        return res.json({ connections });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

};


export const whatAreMyConnections = async (req, res) => {

    const { token } = req.query;

    try {

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const connections = await ConnectionRequest.find({ connectionId: user._id })
            .populate('userId', 'name username email profilePicture');


        return res.json({ connections });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

};

export const acceptConnectionRequest = async (req, res) => {

    const { token, requestId, action_type } = req.body;

    try {

        const user = await User.findOne({ token });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const connection = await ConnectionRequest.findOne({ _id: requestId });

        if (!connection) {
            return res.status(404).json({ message: "Connection not found" });
        }

        if (action_type == "accept") {
            connection.status_accepted = true;
        } else {
            connection.status_accepted = false;
        }

        await connection.save();
        return res.json({ message: "Request updated" });

    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }

};

export const getUserProfileAndUserBasedOnUsername = async (req, res) => {
    const { username } = req.query;

    try {

        const user = await User.findOne({
            username
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const userProfile = await Profile.findOne({ userId: user._id })
            .populate('userId', 'name username email profilePicture');

        return res.json({ "profile": userProfile })

    }
    catch (err) {
        return res.status(500).json({ message: err.message });
    }
}