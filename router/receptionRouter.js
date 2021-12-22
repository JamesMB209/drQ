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
    router.post("/", this.put.bind(this));
    return router;
   }
   
    get(req, res) {
            res.render("admin", {
                doctor: this.doctors,
            })
    }

    put(req, res) {
        if(Array.isArray(this.doctors[0].queue)) {
            if(this.doctors[0].queue.length === 0) {
                console.log(`No one in que`)
            } 
        }
    }
}


module.exports = Reception;