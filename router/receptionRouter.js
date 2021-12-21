const express = require("express");

class Reception {
    constructor(doctors, patient) {
        this.doctors = doctors;
        this.patient = patient;
        this.router();
    }

   router() {
    let router = express.Router();
    router.get("/", this.get.bind(this));
    // router.post("/", this.somefucntion.bind(this));
    return router;
   }
   
   get(req, res) {
    res.render("admin")
   }
}


module.exports = Reception;