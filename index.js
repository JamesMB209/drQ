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
    let office = await knex("doctor")
        .select("id", "f_name", "l_name", "room")

            let arrayofDoctors = [];
    // Create nameSpaces from doctors.
    office.forEach((doctor) => {
        app.use("/doctor", new DoctorRouter(new Doctor(doctor), io).router());

    })

    app.get("/doctor", (req, res) => {
        res.render("doctor", {
            nameSpace: `/james`,
            fName: "james",
            lName: "betts",
            fullName: "james betts",
            queue: ["test","test","test"],
        });
    });

    //Patient logic, This is the check in form that will dynamicly create patients
    app.get("/checkin", (req, res) => {
        res.render("patientCheckIn", {
            doctor: office,
        });
    });

    //route to create new patient
  

    let patientRouter = new PatientRouter(axios);
    app.use("/patient", patientRouter.router());

    // app.get("/patient/james", (req, res) => {
    //     res.render("patient", {
    //         room: "/james",
    //         fName: "paitent.fName",
    //         lName: "paitent.LName",
    //         quePos: "paitent.quePosition())the first one)"
    //     });
    // });
}
main();

//for pris to check form data
app.post("/patient", (req, res) => {
    console.log(req.body);
    // DOCTOR[req.body.doctorId].add(new patient(re.body.fname, req.body.lname, req.body.hkid))
})












// ////////////////////////////////////

// io.of("/james").on("connection", (socket) => {

//     socket.on("next", () => {
//         console.log("remove from queue send next person")
//         io.of("/james").emit("queue_update", {
//             quePos: "paitent.quePosition())the next one)"
//         })
//     })
// });
// ////////////////////////////////////
// let doctorRoom2 = "/doctor2";

// app.get("/doc2", (req, res) => {
//     res.render("doctor", {
//         room: doctorRoom2,
//     });
// });

// const nameSpaceTwo = io.of(doctorRoom2);

// nameSpaceTwo.on("connection", (socket) => {

//     socket.on("next", () => {
//         console.log("remove from agasfgasdfd next person")
//     })
// });
// ////////////////////////////////////


// // a place for us to test our code right now
// async function test() {
//     let testingQue = new Queue(knex);
//     let firstDoctor = new Doctor(1, knex, "placeholder");

//     console.log(firstDoctor.fname);
//     console.log(firstDoctor.lname);
//     console.log(firstDoctor.room);


// 	// testingQue.list(1).then((data) => (console.log(data)));
// 	// testingQue.add(2, 1,true).then((data) => (console.log(data)));
// 	// testingQue.remove(10).then((data) => (console.log(data)));
// 	// console.log("finished");
// }

// test();