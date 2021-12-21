//Passport-local with bcrypt --------------------------------------------- Passport-Local
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const hashFunctions = require("./brcypt") // use hashPassword and checkPassword
const session = require("express-session")
const passport = require("passport");
const session = require("express-session")
//Passport-local with bcrypt --------------------------------------------- Passport-Local
const LocalStrategy = require("passport-local").Strategy;
const hashFunctions = require("./brcypt") // use hashPassword and checkPassword

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Initilizing passport and setting up session --------------------------------------------- Passport-Local
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session())
//Passport-local with bcrypt --------------------------------------------- Passport-Local
passport.use("local-login", new LocalStrategy(async(username, password, done) => {
    try {
        let users = await knex("users").where({ username: username });
        if (users.length === 0) {
            done(null, false, {message: `User with that username not found!`})
        } else {
            let user = users[0]
            let check = await hashFunctions.checkPassword(password, user.password);
            if (check) {
                done(null, user)
            } else {
                done(null, false, {message: `Incorrect username or password.`})
            }
        }
    } catch (error) {
        if (error) {
            console.log(error)
        }
    }
}));

passport.use("local-signup", new LocalStrategy(async(username, password, tag, done) => {
    try {
        let users = await knex("users").where({username: username})
        if (users.length > 0) {
            return done(null, false, {message: `Username already exists`})
        } else {
            let hash = await hashFunctions.hashPassword(password)
            let newUser = { username: username, password: hash, tag: "hi"}
            let userId = await knex("users").insert(newUser).returning("id")
            console.log(newUser)
            done(null, newUser) //// TypeError: done is not a function <-- why?
        }
    } catch (error) {
        if (error) {
            console.log(error)
        }
    }
}))

passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})

function isLoggedIn(req, res, next) {
    console.log(req.isAuthenticated())
    if(req.isAuthenticated()) {
        return next()
    } else {
        res.redirect("/signup")
    }
}

app.get("/", (req, res) => {
    res.render("login")
    console.log("hello", req.body.users)
})
app.get("/login", (req, res) => {
    res.render("login")
    console.log("hello", req.body.users)
})

app.get("/signup", (req, res) => {
    res.render("signup")
})

// app.post(`/:user`, (req, res) => {
//     let user = req.params.user
//     res.render("login", {
//         user: user
//     })
// })


// logic gone brrrrrr
// app.get(`/`, isLoggedIn, async (req, res) => {
//     let doctor = await knex("users").where({tag: doctor})
//     let reception = await knex("users").where({tag: reception})
//     let doc = await doctor[0]
//     let admin = await reception[0]
//     if (doc.username == req.body.username) {
//         res.render("doctor")
//     }
//     if (reception.username == req.body.username) {
//         res.render("admin")
//     }
// })

app.post("/doctor/1", passport.authenticate('local-login', {
    successRedirect: "/doctor/1",
    failureRedirect: "/login"
}));
app.post("/login", passport.authenticate('local-signup', {
    successRedirect: "/login",
    failureRedirect: "/"
}));









