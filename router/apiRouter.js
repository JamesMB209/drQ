const express = require("express");

class ApiRouter {
    constructor(doctors) {
        this.doctors = doctors;
        this.router();
    }

    router() {
        let router = express.Router();
        router.get(`/:doctor/:patient`, this.getPatient.bind(this));
        router.get(`/:doctor`, this.getDoctor.bind(this));
        return router;
    }

    getPatient(req, res) {
        let doctor = this.doctors[parseInt(req.params.doctor) - 1];
        doctor.patient(req.params.patient).then((patient) => {
            res.send({
                patient: patient
            }); 
        }).catch((err) => {
            console.log(err);
            res.status(404).render('error');
            }
        );
    }

    getDoctor(req, res) {
        let doctor = this.doctors[req.params.doctor - 1];
        res.send({
            doctor: doctor,
            queueLength: doctor.length(),
        })
    }
}

module.exports = ApiRouter;