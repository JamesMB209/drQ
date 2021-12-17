const express = require("express");

class PatientRouter {
    constructor(http) {
        this.http = http;
        this.router();
    }

    router() {
        let router = express.Router();
        router.get("/:doctor/:patient", this.get.bind(this));
        return router;
    }

    get(req, res) {
        //Render the details about their position in the queue.
        console.log(req.params)
        console.log(this.http);
        this.http.get(`/doctor/${req.params.doctor}`, (res) => {
            console.log(res)
        })
        res.render("patient", {
                room: "/james",
    //         fName: "paitent.fName",
    //         lName: "paitent.LName",
    //         quePos: "paitent.quePosition())the first one)"
        });
    };
}

module.exports = PatientRouter;