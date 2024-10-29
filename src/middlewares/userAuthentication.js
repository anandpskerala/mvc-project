const authenticateUser = (req, res, next) => {
    if (req.session.user) {
        next();
    } else {
        return res.redirect("/login");
    }
}

const isLogged = ((req, res, next) => {
    if (req.session.user) {
        return res.redirect("/");
    } else {
        next();
    }
})

module.exports = { authenticateUser, isLogged };