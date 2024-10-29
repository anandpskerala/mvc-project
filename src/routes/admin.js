const express = require("express");
const auth = require("../middlewares/adminAuthentication");
const controller = require("../controllers/adminController");
const routes = express.Router();

routes.get("/", auth.authenticateAdmin, controller.LoadAdminPanel);

routes.get("/login", auth.isLogged, ((req, res) => {
    res.render(
        "admin/login", 
        {
            logged: req.session.admin ? 'logout': 'Go Home',
            logoutlink: "",
            title: req.session.admin ? `Hi ${req.session.admin.name}`: "Home"
        }
    );
}));

routes.post("/login", controller.AdminLogin);

routes.get("/logout", controller.logOutAdmin);

routes.post("/edituser", auth.apiAuthentication, controller.editCredentials);

routes.post("/deleteuser", auth.apiAuthentication, controller.deleteCredentials);

module.exports = routes;