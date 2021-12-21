const fs = require("fs");
const path = require("path");
const express = require("express");
const { engine } = require("express-handlebars");
const knexFile = require('./knexfile.js').development;
const knex = require('knex')(knexFile);
const axios = require('axios')
const Doctor = require("./service/doctorService");
const DoctorRouter = require("./router/doctorRouter");
const Patient = require("./service/patientService");
const PatientRouter = require("./router/patientRouter.js");
const ApiRouter = require("./router/apiRouter");
const ReceptionRouter = require("./router/receptionRouter")

var app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const viewsPath = path.join(__dirname, "./views");

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", viewsPath);
app.use(express.urlencoded({ extended: false }))
app.use(express.json());

app.use(express.static('public'));
http.listen(8000);
console.log("App listening to port 8000")

async function main() {
    // Load doctors from db.
    let doctors = [];
    let db_doctor = await knex("doctor")
    .select("id", "f_name", "l_name", "room")
    
    db_doctor.forEach((row) => {
        doctors.push(new Doctor(row));
    })

    // Set up Socket IO
    io.on("connection", (socket) => {
        socket.on("start", (data) => {
            let doctor = doctors[data - 1];
            socket.join(doctor.room);
            console.log(`A user has connected to room ${doctor.room}`);
        });

        socket.on("next", (data) => {
            let doctor = doctors[data - 1];

            console.log(`${doctor.fullName} is asking for the next patient`);
            //logic for what happens on a doctor pressing "next".
            doctor.next()

            io.to(doctor.room).emit("update")
        })
    });

    // Set up routes
    // Doctor dashboard -- needs auth
    app.get("/doctor/:id", (req, res) => {
        res.render("doctor", {
            doctor: doctors[parseInt(req.params.id) - 1],
        });
    });
    
    // Patient dashboard.
    app.get("/queue/:doctor/:patient", async (req, res) => {
        res.render("patient", {
                    patient: req.params.patient,
                    doctor: req.params.doctor
                })
    });

    // Patient checkin point.
    app.get("/checkin", (req, res) => {
        res.render("patientCheckIn", {
            doctor: doctors,
        });
    });
    
    //route to create new patient
    app.post("/patient", (req, res) => {
        let doctor = doctors[parseInt(req.body.doctor) - 1];
        //#######Code Me########
        // Need to sanitise input.
        // If valid create new patient.
        // Add this paitent to the doctors queue.
        doctor.addToQueue(new Patient(req.body));
        console.log("a new patient was created");
        
        //redirect to paitent dashboard "/queue/:doctor/:patient"
        let patientURL = `${req.body.fName}_${req.body.lName}`.toLowerCase();
        res.redirect(302, `/queue/${doctor.id}/${patientURL}`) //not sanatised.
    })

    // app.get("/reception", (req, res) => {
    //     console.log(doctors)
    //     res.render("admin", {
    //         doctor: doctors,
    //     })
    // })
    const apiRouter = new ApiRouter(doctors);
    app.use("/api", apiRouter.router());
    const receptionRouter = new ReceptionRouter(doctors);
    app.use("/reception", receptionRouter.router());
}
main();
