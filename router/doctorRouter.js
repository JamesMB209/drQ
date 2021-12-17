const express = require("express");

class DoctorRouter {
    constructor(doctor, io) {
        this.doctor = doctor;
        this.io = io;
        this.router();
        this.listen();
    }

    router() {
        let router = express.Router();
        router.get(`/${this.doctor.fName}`, this.get.bind(this));
        router.post(`/${this.doctor.fName}`, this.get.bind(this));
        return router;
    }

    listen() {
        this.io.of(`/${this.doctor.fName}`).on("connection", (socket) => {
			socket.on("next", () => {
				console.log("remove from queue send next person")
				this.io.of(`/${this.doctor.fName}`).emit("queue_update", {
					quePos: "paitent.quePosition())the next one)"
				})
			})
		});
    }

    get(req, res) {
        res.render("doctor", {
            nameSpace: `/${this.doctor.fName}`,
            fName: this.doctor.fName,
            lName: this.doctor.lName,
            fullName: this.doctor.fullName,
            queue: this.doctor.queue,
        });
    };

    post(req, res) {
        // add to que
    }

    put(req, res) {
        // move inside que? update details?
    }

    del(req, res) {
        // dell from que
    }
}

module.exports = DoctorRouter;