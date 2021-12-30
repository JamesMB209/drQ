const passport = require("passport");
const knexFile = require('../knexfile').development;
const knex = require('knex')(knexFile);

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

    router.post("/login", (req,res) => {
        console.log("LOGGING IN")
        passport.authenticate("local-login", async (err, user) => {
            let id;
            if (err) {
                console.log(err)
                return res.redirect("/login")
            } else if (user.tag == "Doctor") {
                let getDoctorId = await knex('doctor').where({username: user.username})
                .then((ok) => {
                    console.log(ok[0].id)
                    id = ok[0].id
                })
                req.login(user, err => console.log(err))
                console.log(`The id of this ducker is ${id}`)
                return res.redirect(`/doctor/${id}`)
            } else if (user.tag == "admin") {
                let getAdminId = await knex('admin').where({username: user.username})
                .then((ok) => {
                    console.log(ok[0].id)
                    id = ok[0].id
                })
                req.login(user, err => console.log(err))
                console.log(`The id of this adminucker is ${id}`)
                return res.redirect(`/reception`)
            }
        })(req,res)
    });

    router.post("/signup", passport.authenticate('local-signup', {
        successRedirect: "/login",
        failureRedirect: "/signup",
    }));

    return router;
};