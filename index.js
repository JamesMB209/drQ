const fs = require("fs");
const path = require("path");
const express = require("express");
// const handlebars = require("express-handlebars");
const { engine } = require("express-handlebars");

const knexFile = require('./knexfile.js').development;
const knex = require('knex')(knexFile);
const Queue = require("./service/queueService");
const Doctor = require("./service/doctorService");

var app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);

const viewsPath = path.join(__dirname, "./views");

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", viewsPath);



//////////////////////////////////
let doctorRoom = "/doctor1";

app.get("/", (req, res) => {
    res.render("doctor", {
        room:doctorRoom,
    });
});

const nameSpaceOne = io.of(doctorRoom);

nameSpaceOne.on("connection", (socket) => {
    
    socket.on("next", ()=> {
        console.log("remove from queue send next person")
    })
});
////////////////////////////////////
let doctorRoom2 = "/doctor2";

app.get("/doc2", (req, res) => {
    res.render("doctor", {
        room:doctorRoom2,
    });
});

const nameSpaceTwo = io.of(doctorRoom2);

nameSpaceTwo.on("connection", (socket) => {
    
    socket.on("next", ()=> {
        console.log("remove from agasfgasdfd next person")
    })
});






http.listen(8000);





















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