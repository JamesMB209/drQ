const express = require("express");
const Patient = require("../service/patientService");

class CheckinRouter {
    constructor(doctors) {
        this.doctors = doctors;
        this.router();
    }

    router() {
        let router = express.Router();
        router.get(`/`, this.get.bind(this));
        router.post(`/`, this.post.bind(this));
        return router;
    }

    // Patient checkin point.
    get(req, res) {
        res.render("patientCheckIn", {
            doctor: this.doctors,
        });
    }

    //route to create new patient
    post(req, res) {
        let doctor = this.doctors[parseInt(req.body.doctor) - 1];
        doctor.addToQueue(new Patient(req.body));
        let patientURL = `${req.body.hkid}`.split(" ").join("");
        res.redirect(302, `/queue/${doctor.id}/${patientURL}`)
    }
}

module.exports = CheckinRouter;