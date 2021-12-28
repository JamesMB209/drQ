const passport = require("passport");

module.exports = (express) => {
    const router = express.Router();

    router.get("/", (req, res) => {
        res.redirect('/login');
    })
    router.get("/login", (req, res) => {
        res.render("login");
        req.flash('message', "incorrect login credentials")
    })

    router.get("/signup", (req, res) => {
        res.render("signup")
    })

    router.get("/logout", (req, res) => {
        console.log(`Logging out.`)
        req.logout()
        res.redirect("/")
    })

    router.post("/login", passport.authenticate('local-login', {
        successRedirect: "/reception",
        failureRedirect: "/",
    }));
    
    router.post("/signup", passport.authenticate('local-signup', {
        successRedirect: "/login",
        failureRedirect: "/signup",
    }));

    return router;
};