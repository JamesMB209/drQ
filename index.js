const fs = require("fs");
const path = require("path");
const express = require("express");
const { engine } = require("express-handlebars");
const knexFile = require('./knexfile.js').development;
const knex = require('knex')(knexFile);
const axios = require('axios')
const Doctor = require("./service/doctorService");
const Patient = require("./service/patientService");
// const Queue = require("./service/queueService");
const ApiRouter = require("./router/apiRouter");
const ReceptionRouter = require("./router/receptionRouter")
const CheckinRouter = require("./router/checkinRouter");
// const DoctorRouter = require("./router/doctorRouter");
const History = require("./service/historyService");
const history = new History;
// const DoctorRouter = require("./router/doctorRouter");
// const PatientRouter = require("./router/patientRouter.js");
const setPassport = require("./passport")
const passportRouter = require("./router/passportRouter")(express)


var app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const viewsPath = path.join(__dirname, "./views");

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", viewsPath);
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

//pris added index for handlebars
const Handlebars = require("handlebars");
Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});
//end pris added index for handlebars

app.use(express.static('public'));


// Passport-local --------------------------------------------- Passport-Local
// const passport = require("passport");
// const LocalStrategy = require("passport-local").Strategy;
// const hashFunctions = require("./brcypt");
const session = require("express-session");

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true
}))

// **Passport**
setPassport(app);
app.use('/', passportRouter);
// **Passport**

http.listen(8000);
console.log("App listening to port 8000")

async function main() {
    // Check for logged in auth
    function isLoggedIn(req, res, next) {
        console.log(req.isAuthenticated())
        if(req.isAuthenticated()) {
            return next()
        } else {
            res.redirect("/login")
        }
    }

    // Load doctors from db.
    let doctors = [];
    let db_doctor = await knex("doctor")
        .select("id", "f_name", "l_name", "room")

    db_doctor.forEach((row) => {
        doctors.push(new Doctor(row, knex));
    })

    // set up routers dependent on our doctor objects.
    const checkinRouter = new CheckinRouter(doctors);
    const apiRouter = new ApiRouter(doctors);

    // Set up Socket IO
    io.on("connection", (socket) => {
        socket.on("start", (data) => {
            let doctor = doctors[data - 1];

            socket.join(doctor.room);
            console.log(`A user has connected to room ${doctor.fullName}`);
        });

        socket.on("next", (data) => {
            let doctor = doctors[data - 1];
            console.log(`${doctor.fullName} is asking for the next patient`);

            //logic for what happens on a doctor pressing "next".
            history.addBooking(doctor.queue[0]);
            doctor.next();

            io.to(doctor.room).emit("updatePatient")
        })

        socket.on("newPatient", (data) => {
            let doctor = doctors[data - 1];

            io.to(doctor.room).emit("updatePatient")
            io.to(doctor.room).emit("updateDoctor")
            socket.emit("updateMain") // update /reception when new patient is connected
        })

        socket.on("updatePatient", (data) => {
            let doctor = doctors[data - 1];

            io.to(doctor.room).emit("updatePatient")
        })

        socket.on("updateDoctor", (data) => {
            let doctor = doctors[data - 1];

            io.to(doctor.room).emit("updateDoctor")
        })

        socket.on("moveUp", (data) => {
            let doctor = doctors[data.doctor -1];

            doctor.move(`${data.hkid}`)
            io.to(doctor.room).emit("updatePatient")
            socket.emit("updateMain")
        })

        socket.on("removeQ", (data => {
            console.log("this is data this is data", data)
            console.log("and this is the doctors array", doctors)
            let doctor = doctors[data.doctor - 1];

            doctor.remove(data.hkid)
            io.to(doctor.room).emit("updatePatient")
            socket.emit("updateMain")
        }))

        // socket.on("refreshThat", () => {
        //     socket.emit("updateMain")
        // })
    });

    // Set up routes
    // Doctor dashboard -- needs auth
    app.get("/doctor/:id", isLoggedIn, (req, res) => {
        res.render("doctor", {
            doctor: req.params.id,
            socket: "http://localhost:8000"
        });
    });

    // Patient dashboard.
    app.get("/queue/:doctor/:patient", async (req, res) => {
        res.render("patient", {
            patient: req.params.patient,
            doctor: req.params.doctor,
            socket: "http://localhost:8000"
        })
    });

    app.use("/checkin", checkinRouter.router());
    app.use("/api", apiRouter.router());
    const receptionRouter = new ReceptionRouter(doctors);
    app.use("/reception", isLoggedIn, receptionRouter.router());

    //   //27/12 pris added board render
    //   app.get("/board", (req, res) => {
    //     res.render("board")
    // })

    //25/12 pris added 404 page render (this needs to put at the end of GET req)
    app.all('*', (req, res) => {
        res.status(404).render('error');
    })

    // this code inputs some testing data for everyones styling.
    axios
    .get("https://randomuser.me/api/?results=5")
    .then((response) => {
        for (i of response.data.results) {
            let docID = Math.floor(Math.random() * doctors.length); 
            let hkid = `${i.location.postcode}`.split(' ').join('');

            doctors[docID].addToQueue(new Patient({
                fName:i.name.first,
                lName:i.name.last,
                temperature:Math.floor(Math.random()*3)+36,
                hkid: hkid,
                dob:i.dob.date,
                gender:i.gender,
                doctor: docID + 1,
            }));

            console.log(`${i.name.first} ${i.name.last}:http://localhost:8000/queue/${docID +1}/${hkid}`)
            
        }
    })
}
main();

