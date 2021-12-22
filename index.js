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
const CheckinRouter = require("./router/checkinRouter");
const DoctorRouter = require("./router/doctorRouter");
const PatientRouter = require("./router/patientRouter.js");

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
    
    // set up routers dependent on our doctor objects.
    const checkinRouter = new CheckinRouter(doctors);
    const apiRouter = new ApiRouter(doctors);
    
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

            io.to(doctor.room).emit("updatePatient")
        })

        socket.on("newPatient", (data) => {
            let doctor = doctors[data - 1];
            console.log("new patient added.")
            io.to(doctor.room).emit("updatePatient")
            io.to(doctor.room).emit("updateDoctor")
        })

        socket.on("updatePatient", (data) => {
            let doctor = doctors[data - 1];
            console.log("updating all patients.")
            io.to(doctor.room).emit("updatePatient")
        })

        socket.on("updateDoctor", (data) => {
            let doctor = doctors[data - 1];
            console.log(doctor.fName + " is updating.")
            io.to(doctor.room).emit("updateDoctor")
        })
    });

    // Set up routes
    // Doctor dashboard -- needs auth
    app.get("/doctor/:id", (req, res) => {
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
}
main();
