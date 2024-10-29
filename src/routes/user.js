const express = require("express");
const auth = require("../middlewares/userAuthentication");
const controller = require("../controllers/userController");
const routes = express.Router();

routes.get("/", auth.authenticateUser, controller.loadHome);

routes.get("/login", auth.isLogged, (req, res) => {
    return res.render(
        "user/login", 
        { 
            image: '/login-bg.jpg', 
            logged: req.session.user ? 'logout': 'signup', 
            logoutlink: "signup",
            title: req.session.user ? `Hi ${req.session.user.firstname}`: "Home"
        }
    );
});

routes.get("/signup", auth.isLogged, (req, res) => {
    return res.render(
        "user/signup", 
        {
            image: '/signup-bg.png', 
            logged: req.session.user ? 'logout': 'login', 
            logoutlink: "login",
            title: req.session.user ? `Hi ${req.session.user.firstname}`: "Home"
        }
    );
})
  
  
routes.post("/login", controller.loginUser);
  
routes.get("/logout", controller.logoutUser);

routes.post("/signup", controller.signupUser);


module.exports = routes;