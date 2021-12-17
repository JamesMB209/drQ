class Doctor {
	constructor(doctor) {
		this.id = doctor.id;
		this.fName = doctor.f_name;
		this.lName = doctor.l_name;
		this.room = doctor.room;
		
		this.fullName = `${doctor.f_name} ${doctor.l_name}`;
		this.queue = ["patient1", "patient2", "patient3"];
	}

	addToQueue () {
		
	}

}

module.exports = Doctor;