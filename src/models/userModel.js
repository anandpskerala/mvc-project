const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})

const User = mongoose.model('Users', UserSchema);

const createUser = async (user) => {
    const data = await findUserbyEmail(user.email);
    if (data) {
        return false;
    } else {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        return true;
    }
}

const findUserbyEmail = async (email) => {
    const data = await User.findOne({email}, {_id: 0, __v: 0});
    return data;
}

const getAllUsers = async () => {
    const data = await User.find({}, {_id: 0, __v: 0});
    return data
}

const updateUser = async (user) => {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await User.updateOne({email: user.email}, {$set: {email: user.newemail, password: user.password}});
};

const deleteUser = async (email) => {
    const data = await User.findOne({email}, {__id: 0, __v: 0});
    if (data) {
        await User.deleteOne({email});
    }
}

module.exports = { User, createUser, findUserbyEmail, getAllUsers, updateUser, deleteUser };