const bcrypt = require("bcryptjs");
const user = require("../models/userModel");

const loadHome = (req, res) => {
    let products = [{
          "image": "https://imgeng.jagran.com/images/2023/mar/best%20laptops1679305053832.jpg",
          "title": "Macbook Pro 13",
          "description": "Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat. Vestibulum sed magna at nunc commodo placerat.\n\nPraesent blandit. Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.\n\nMorbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem."
        }, {
          "image": "https://dlcdnrog.asus.com/rog/media/1674705497799.webp",
          "title": "Asus ROG Strix",
          "description": "Fusce consequat. Nulla nisl. Nunc nisl."
        }, {
          "image": "https://images.anandtech.com/doci/10113/lenovo-laptop-thinkpad-x1-carbon-gen-9-14-subseries-gallery-7_575px.png",
          "title": "Lenovo ThinkPad X1 Carbon",
          "description": "Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.\n\nPraesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio."
        }, {
          "image": "https://images.anandtech.com/doci/10113/XPS13_575px.jpg",
          "title": "Dell XPS 13",
          "description": "Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst.\n\nMaecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.\n\nCurabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem."
        }, {
          "image": "https://images.anandtech.com/doci/10113/SP8_575px.jpg",
          "title": "Microsoft Surface Pro 8",
          "description": "In congue. Etiam justo. Etiam pretium iaculis justo.\n\nIn hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus.\n\nNulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi."
        }, {
          "image": "https://images.anandtech.com/doci/10113/XPS17_575px.jpg",
          "title": "Dell XPS 17",
          "description": "Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem."
        }, {
          "image": "https://cdn.mos.cms.futurecdn.net/Bk7reZYJiHsnPLVvtRriEV-1200-80.jpg.webp",
          "title": "MacBook Air 13-inch",
          "description": "Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum."
        }, {
          "image": "https://cdn.mos.cms.futurecdn.net/rBiQq66U5xmmMoxefaJhsf-1200-80.jpg.webp",
          "title": "MSI GF63 Thin",
          "description": "Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.\n\nCurabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem."
        }, {
          "image": "https://www.cnet.com/a/img/resize/6c5477a1e132842c60136989c784ef0ca300a888/hub/2023/08/15/f511b8a1-6be3-498e-afed-3e4e0331c3e5/hp-pavilion-aero-2023-01.jpg?auto=webp&fit=crop&height=360&width=640",
          "title": "HP Pavilion Aero 13",
          "description": "Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi."
        }
      ]
      return res.render(
        "user/home", 
        {
          products, 
          logged: req.session.user ? 'logout': 'login',  
          logoutlink: "logout",
          title: req.session.user ? `Hi ${req.session.user.firstname}`: "Home"
        }
      );
};

const loginUser = async (req, res) => {
    const { email, password} = req.body;
  
    if (!email || !password) {
      return res.status(400).json({success: false, message: "Email or Password required"});
    }

    const userData = await user.findUserbyEmail(email);
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

    if (req.session.admin) {
      req.session.user = {firstname: userData.firstname, lastname: userData.lastname, email: userData.email, password: userData.password};
      return res.status(200).json({success: true, message: "login successful"});
    } else {
      req.session.regenerate((err) => {
        if (err) {
          console.log("Error regenerating session:"+ err);
          return res.status(500).json({success: false, message: "Session error"});
        }
        req.session.user = {firstname: userData.firstname, lastname: userData.lastname, email: userData.email, password: userData.password};
        return res.status(200).json({success: true, message: "login successful"});
      });
    }
};

const logoutUser = (req, res) => {
  if (req.session.admin) {
    delete req.session.user;
  } else {
    req.session.destroy((err) => {
      if (err) {
        console.log("Logout Error : " + err);
      }
    });
  }
    return res.redirect("/login");
};

const signupUser = async (req, res) => {
    const {firstname, lastname, email, password} = req.body;
    let newUser = new user.User({
      firstname,
      lastname,
      email,
      password
    })
  
    const result = await user.createUser(newUser);
  
    if (result) {
      return res.status(201).json({
        success: true,
        message: "credentials saved"
      });
    }
  
    return res.status(409).json({
      success: false,
      message: "User already exists"
    });
};

module.exports = {loadHome, loginUser, logoutUser, signupUser};