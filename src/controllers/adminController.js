const bcrypt = require("bcryptjs");
const admin = require("../models/adminModel");
const user = require("../models/userModel");



const AdminLogin = async (req, res) => {
    const { email, password} = req.body;
  
    if (!email || !password) {
      return res.status(400).json({success: false, message: "Email or Password required"});
    }

    const userData = await admin.findAdminbyEmail(email);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    const verifyPassword = await bcrypt.compare(password, userData.password);
  
    if (email != userData.email || !verifyPassword) {
      return res.status(401).json({success: false, message: "Invalid Email or Password"});
    }

    if (req.session.user) {
      req.session.admin = { name: userData.name, email: userData.email, role: userData.role };
      return res.status(200).json({ success: true, message: "login successful" });
    } else {
      req.session.regenerate((err) => {
          if (err) {
              console.log("Error regenerating session:", err);
              return res.status(500).json({ success: false, message: "Session error" });
          }
          req.session.admin = { name: userData.name, email: userData.email, role: userData.role };
          return res.status(200).json({ success: true, message: "login successful" });
      });
    }
}

const LoadAdminPanel = async (req, res) => {
    const users = await user.getAllUsers();
    res.render(
      "admin/table", 
      {
        logged: req.session.admin ? 'logout': 'Go Home', 
        logoutlink: "adminpanel/logout", 
        users: users,
        title: req.session.admin ? `Hi ${req.session.admin.name}`: "Home"
      }
    );
};

const logOutAdmin = (req, res) => {
  if (req.session.user) {
    delete req.session.admin;
  } else {
    req.session.destroy((err) => {
      if (err) {
        console.log("Logout Error : " + err);
      }
    });
  }
    return res.redirect("/adminpanel/login");
};

const editCredentials = async (req, res) => {
  const {email, newemail, password} = req.body;
  try {
    await user.updateUser({email, newemail, password});
    return res.status(201).json({
      success: true,
      message: "User updated"
    })
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Unknown error"
    })
  }
}

const deleteCredentials = async (req, res) => {
  const {email} = req.body;
  try {
    await user.deleteUser(email);
    return res.status(200).json({
      success: true,
      message: "User deleted"
    })
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Unknown error"
    })
  }
};

module.exports = { AdminLogin, LoadAdminPanel, logOutAdmin, editCredentials, deleteCredentials };