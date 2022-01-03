const fs = require("fs");
const path = require("path");
const express = require("express");
const { engine } = require("express-handlebars");
const knexFile = require('./knexfile.js').development;
const knex = require('knex')(knexFile);
const axios = require('axios')
const Doctor = require("./service/doctorService");
const Patient = require("./service/patientService");
const ApiRouter = require("./router/apiRouter");
const ReceptionRouter = require("./router/receptionRouter")
const BoardRouter = require("./router/boardRouter");
const CheckinRouter = require("./router/checkinRouter");
const History = require("./service/historyService");
const history = new History;
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
Handlebars.registerHelper("inc", function (value, options) {
    return parseInt(value) + 1;
});
//end pris added index for handlebars

app.use(express.static('public'));


// Passport-local --------------------------------------------- Passport-Local
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

http.listen(process.env.PORT);
console.log(`App listening to port ${process.env.PORT}`)

async function main() {
    // Check for logged in auth
    function isLoggedIn(req, res, next) {
        console.log(req.isAuthenticated())
        if (req.isAuthenticated()) {
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
        doctors.push(new Doctor(row));
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
            let doctor = doctors[data.doctorId - 1];
            console.log(`${doctor.fullName} is asking for the next patient`);

            //logic for what happens on a doctor pressing "next".
            //update the appointment history.
            history.saveDiagnosis(doctor.id, doctor.queue[0], data.diagnosis);
            history.saveBooking(doctor.queue[0], true);
            //advance the doctors queue.
            doctor.next();

            io.to(doctor.room).emit("updateDoctor");
            io.to(doctor.room).emit("updatePatient");
            socket.emit("updateMain");
        });

        socket.on("newPatient", (data) => {
            let doctor = doctors[data - 1];

            io.to(doctor.room).emit("updatePatient");
            io.to(doctor.room).emit("updateDoctor");
            socket.emit("updateMain");
        });

        socket.on("updatePatient", (data) => {
            let doctor = doctors[data - 1];
            io.to(doctor.room).emit("updatePatient");
        });

        socket.on("updateDoctor", (data) => {
            let doctor = doctors[data - 1];
            io.to(doctor.room).emit("updateDoctor");
            socket.emit("refreshThat")
        });

        socket.on("moveUp", (data) => {
            let doctor = doctors[data.doctor - 1];

            doctor.move(`${data.hkid}`);
            io.to(doctor.room).emit("updatePatient");
            socket.emit("updateMain");
        });

        socket.on("removeQ", (data => {
            let doctor = doctors[data.doctor - 1];

            //update the appointment history database.
            doctor.patient(data.hkid)
                .then((patient) => {
                    history.saveBooking(patient, false);
                })
                .catch(err => console.log(err));

            //remove from the doctors queue.
            doctor.remove(data.hkid);

            io.to(doctor.room).emit("updatePatient")
            socket.emit("updateMain")
            io.emit("updateDoctor");
        }))

        socket.on("refreshThat", () => {
            io.emit("updateMain");
        });
    });

    // Set up routes
    // Doctor dashboard -- needs auth
    app.get("/doctor/:id", isLoggedIn, (req, res) => {
        res.render("doctor", {
            doctor: req.params.id,
            socket: `${process.env.SOCKET}`
        });
    });

    // Patient dashboard.
    app.get("/queue/:doctor/:patient", async (req, res) => {
        res.render("patient", {
            patient: req.params.patient,
            doctor: req.params.doctor,
            socket: `${process.env.SOCKET}`
        })
    });

    app.use("/checkin", checkinRouter.router());
    app.use("/api", apiRouter.router());
    const receptionRouter = new ReceptionRouter(doctors);
    app.use("/reception", isLoggedIn, receptionRouter.router());

    //pris add Board Router
    const boardRouter = new BoardRouter(doctors);
    app.use("/board", boardRouter.router());

    //27/12 pris added board render
    /*    app.get("/board", (req, res) => {
         res.render("board")
     }) */

    //25/12 pris added 404 page render (this needs to put at the end of GET req)
    app.all('*', (req, res) => {
        res.status(404).render('error');
    })

    // this code inputs some testing data for everyones styling.

    axios
        .get("https://randomuser.me/api/?results=15")
        .then((response) => {
            for (i of response.data.results) {
                let docID = Math.floor(Math.random() * doctors.length);
                let hkid = `${i.location.postcode}`.split(' ').join('');

                doctors[docID].addToQueue(new Patient({
                    fName: i.name.first,
                    lName: i.name.last,
                    temperature: Math.floor(Math.random() * 3) + 36,
                    hkid: hkid,
                    dob: i.dob.date,
                    gender: i.gender,
                    doctor: docID + 1,
                }));

                console.log(`${i.name.first} ${i.name.last}:${process.env.SOCKET}/queue/${docID + 1}/${hkid}`)

            }
        })


    // setInterval(() => {
    //     axios
    //         .get("https://randomuser.me/api/?results=3")
    //         .then((response) => {
    //             for (i of response.data.results) {
    //                 let docID = Math.floor(Math.random() * doctors.length);
    //                 let hkid = `${i.location.postcode}`.split(' ').join('');

    //                 doctors[docID].addToQueue(new Patient({
    //                     fName: i.name.first,
    //                     lName: i.name.last,
    //                     temperature: Math.floor(Math.random() * 3) + 36,
    //                     hkid: hkid,
    //                     dob: i.dob.date,
    //                     gender: i.gender,
    //                     doctor: docID + 1,
    //                 }));

    //                 console.log(`${i.name.first} ${i.name.last}:http://localhost:8000/queue/${docID + 1}/${hkid}`)

    //             }
    //         })}, 90000);
}
main();

