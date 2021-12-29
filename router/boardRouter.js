const express = require("express");

class Board {
    constructor(doctors, patient) {
        this.doctors = doctors;
        this.patient = patient;
        this.router();
    }

   router() {
    let router = express.Router();
    router.get("/", this.get.bind(this));
    router.post("/", this.put.bind(this));
    return router;
   }
   
    get(req, res) {
            res.render("board", {
                doctor: this.doctors,
                socket: "http://localhost:8000"
            })
    }

    put(req, res) {
        if(Array.isArray(this.doctors[0].queue)) {
            if(this.doctors[0].queue.length === 0) {
                console.log(`No one in queue`)
            } 
        }
    }
}


module.exports = Board;