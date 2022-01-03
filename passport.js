const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const hashFunctions = require("./brcypt")
const knexFile = require('./knexfile.js').development;
const knex = require('knex')(knexFile);
const flash = require('connect-flash')


module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session())
    app.use(flash())

    passport.use("local-login", new LocalStrategy({passReqToCallback: true}, async(req, username, password, done) => {
        try {
            let users = await knex("users").where({ username: username });
            if (users.length == 0) {
                done(null, false, {message: req.flash('error', `User with that username not found!`)})
            } else {
                let user = users[0]
                let check = await hashFunctions.checkPassword(password, user.password);
                if (check) {
                    done(null, user)
                } else {
                    done(null, false, {message: req.flash('error', `Incorrect username or password.`)})
                }
            }
        } catch (error) {
            if (error) {
                console.log(error)
            }
        }
    }));

    passport.use('local-signup', new LocalStrategy({usernameField: "username", passwordField: "password", passReqToCallback: true}, async (req, username, password, done) => {
        {
            try {
                let users = await knex("users").where({username: username})
                if (users.length > 0) {
                    return done(null, false, {message: req.flash(`Username already exists`)})
                } else {
                    let hash = await hashFunctions.hashPassword(password);
                    let newUser = { username: username, password: hash , tag: req.body.tag };
                    if(newUser.tag == "Doctor") {
                        let newDoctor = { f_name: req.body.f_name, l_name: req.body.l_name , username: username, room: req.body.room};
                        let doctorInput = await knex("doctor").insert(newDoctor);
                    } else {
                        let newAdmin = { f_name: req.body.f_name, l_name: req.body.l_name, username: username }
                        let adminInput = await knex("admin").insert(newAdmin);
                    }
                    let userId = await knex("users").insert(newUser).returning("id");
                    let newUserId = userId[0];
                    done(null, newUserId)
            }
            } catch (error) {
                if (error) {
                    console.log(`Error in signup: ${error}`)
                }
            }
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user)
    });

    passport.deserializeUser(async (user, done) => {
    //     try {
    //         let users = await knex("users").where({ user: user.username })
    //         console.log(`usersusersusers${users}`)
    //         if (users.length == 0) {
    //             return done(new Error(`Username '${user}' is incorrect.`))
    //         }
    //         user = users[0]
    //         done(null, user)
    //     } catch (error) {
    //         if (error) {
    //             console.log(`ERROR!!!!!! ${error}`)
    //         }
    // }
    done(null, user)
});
};
