const authenticateAdmin = (req, res, next) => {
    if (req.session.admin) {
        next();
    } else {
        return res.redirect("/adminpanel/login");
    }
}

const isLogged = ((req, res, next) => {
    if (req.session.admin) {
        return res.redirect("/adminpanel");
    } else {
        next();
    }
})

const apiAuthentication = (req, res, next) => {
    if (req.session.admin) {
        next();
    } else {
        return res.status(401).json({success:false, message : "Unauthorized Access"});
    }
}

module.exports = {authenticateAdmin, isLogged, apiAuthentication };