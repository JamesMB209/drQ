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

async function main() {
    let queue = null;
    let arrayOfDoctors =[];
    let office = await knex("doctor")
        .select("id", "f_name", "l_name", "room")

    // Create doctors.
    office.forEach((doctor) => {
        arrayOfDoctors.push(new Doctor(doctor));
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
            console.log(arrayOfDoctors[data-1].queue.shift());
            
            io.to(chatroom).emit("update")
        })
      });
      
    // Set up requests
    // Doctor dashboard -- needs auth
    app.get("/doctor/:id", (req, res) => {
        res.render("doctor", {
            doctor:arrayOfDoctors[parseInt(req.params.id)-1],
        });
    });

    // Patient dashboard.
    app.get("/queue/:doctor/:patient", (req, res) => {
        let patient = arrayOfDoctors[parseInt(req.params.doctor)-1].nextInLine();
        console.log(patient);
        res.render("patient", {
            patient:patient,
        })
    });
    
    // Patient checkin point.
    app.get("/checkin", (req, res) => {
        res.render("patientCheckIn", {
            doctor: office,
        });
    });


    //route to create new patient
    // app.post("/patient", (req, res) => {
    //     // console.log(req.body);
    //     //#######Code Me########
    //     // Need to sanitise input.

    //     // If valid create new patient.

    //     // Add this paitent to the doctors queue.

    //     //on submission of data send a post to the endpoint /patients/:patientName
    //     // res.redirect(200, `/patient/${req.body.doctorName}/${req.body.patientName}`) //not sanatised.

    // })

    // let patientRouter = new PatientRouter(axios);
    // app.use("/patient", patientRouter.router());

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