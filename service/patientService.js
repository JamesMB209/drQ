class Patient {
	constructor(patient) {
	this.fName = patient.fName;
	this.lName = patient.lName;
	this.temperature = patient.temperature 
	this.assignedDoctor = patient.doctor;

	this.fullName = `${this.fName} ${this.lName}`;
	this.url = `${this.fName}_${this.lName}`.toLowerCase();
	this.queuePosition;
	this.arrived = new Date;
	this.departed = "";

	//pris added
	this.hkid = patient.hkid;
	this.dob = patient.dob;
	this.gender = patient.gender;
	}

	//index in queue (can be some logic in here to calculate and return average waiting time)
}

module.exports = Patient;