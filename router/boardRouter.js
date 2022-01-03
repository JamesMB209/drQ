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
                socket: "http://13.213.209.141/"
            })
    }
}


module.exports = Board;
