const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const AdminSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: "admin" // can be admin and superadmin ---> May be in future there will be more update
    }
});

const Admin = mongoose.model("Admins", AdminSchema);

const createAdmin = async (user) => {
    const data = await findAdminbyEmail(user.email);
    if (data) {
        return false;
    } else {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
        return true;
    }
};

const findAdminbyEmail = async (email) => {
    const data = await Admin.findOne({email}, {_id: 0, __v: 0});
    return data;
};

module.exports = { Admin, createAdmin, findAdminbyEmail };