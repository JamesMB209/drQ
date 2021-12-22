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
        // //#######Code Me########
        // // Need to sanitise input.
        // // If valid create new patient.
        // // Add this paitent to the doctors queue.
        doctor.addToQueue(new Patient(req.body));

        // // redirect to paitent dashboard "/queue/:doctor/:patient"
        let patientURL = `${req.body.fName}_${req.body.lName}`.toLowerCase();
        res.redirect(302, `/queue/${doctor.id}/${patientURL}`) //not sanatised.
    }
}

module.exports = CheckinRouter;