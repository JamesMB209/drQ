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
    return router;
   }
   
    get(req, res) {
            res.render("board", {
                doctor: this.doctors,
                socket: "http://localhost:8000"
            })
    }
}


module.exports = Board;