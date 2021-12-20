const fs = require("fs");
const path = require("path");
const express = require("express");
const { engine } = require("express-handlebars");
const knexFile = require('./knexfile.js').development;
const knex = require('knex')(knexFile);
const axios = require('axios')
// const Queue = require("./service/queueService");
const Doctor = require("./service/doctorService");
const DoctorRouter = require("./router/doctorRouter");
const Patient = require("./service/patientService");
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
    let doctors =[];
    let db_doctor = await knex("doctor")
        .select("id", "f_name", "l_name", "room")

    db_doctor.forEach((row) => {
        doctors.push(new Doctor(row));
    })
    
    // Set up Socket IO
    io.on("connection", (socket) => {
        socket.on("start", (room) => {
          chatroom = room;
          socket.join(room);
          console.log(`A user has connected to room ${room}`);
        });
      
        socket.on("next", (data)=>{
            console.log(`doctor pressed next ${data}`)
            
            io.to(chatroom).emit("update")
        })
      });
      
    // Set up routes
    // Doctor dashboard -- needs auth
    app.get("/doctor/:id", (req, res) => {
        res.render("doctor", {
            doctor:doctors[parseInt(req.params.id)-1],
        });
    });

    // Patient dashboard.
    app.get("/queue/:doctor/:patient", async (req, res) => {
        try {
            let doctor = doctors[parseInt(req.params.doctor)-1];
            let patient = await doctor.patient(req.params.patient);
            
            console.log(patient);
            res.render("patient", {
                patient:patient,
            })
        } catch(err) {
            console.log(err)
            res.send(404); // send to 404 page.
        }
    });

    // Patient checkin point.
    app.get("/checkin", (req, res) => {
        res.render("patientCheckIn", {
            doctor: doctors,
        });
    });

    //route to create new patient
    app.post("/patient", (req, res) => {
        let doctor = doctors[parseInt(req.body.doctor)-1];
        //#######Code Me########
        // Need to sanitise input.
        // If valid create new patient.
        // Add this paitent to the doctors queue.
        doctor.addToQueue(new Patient(req.body));

        //redirect to paitent dashboard "/queue/:doctor/:patient"
        let patientURL = `${req.body.fName}_${req.body.lName}`.toLowerCase();
        res.redirect(302, `/queue/${doctor.id}/${patientURL}`) //not sanatised.
    })
}
main();
