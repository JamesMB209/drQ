const express = require("express");

class PatientRouter {
    constructor(axios) {
        this.axios = axios;
        this.router();
    }

    router() {
        let router = express.Router();
        router.get("/:doctor/:patient", this.get.bind(this));
        return router;
    }

    async get(req, res) {
        //Render the details about their position in the queue.
        console.log(req.params.doctor);
        try {
            let queue = await this.axios
                .get(`/doctor/${req.params.doctor}`)
        } catch {
            console.log('error')
        }

        res.render("patient", {
            room: "/james",
            //         fName: "paitent.fName",
            //         lName: "paitent.LName",
            //         quePos: "paitent.quePosition())the first one)"
        });
    };
}

module.exports = PatientRouter;