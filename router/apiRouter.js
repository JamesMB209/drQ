const express = require("express");

class ApiRouter {
    constructor(doctors) {
        this.doctors = doctors;
    }

    router() {
        let router = express.Router();
        router.get(`/:doctor/:patient`, this.get.bind(this));
        return router;
    }

    async get (req, res) {
        console.log(req.params);
        try {
            let doctor = this.doctors[parseInt(req.params.doctor) - 1];
            console.log(doctor);
            doctor.patient(req.params.patient).then((patient) => {
            console.log(patient.queuePosition)
            res.send({
                patient:patient
            })
        });
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = ApiRouter;