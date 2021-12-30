const History = require("./historyService");

class Patient extends History {
	constructor(patient) {
		super();
		this.fName = patient.fName;
		this.lName = patient.lName;
		this.temperature = patient.temperature 
		this.assignedDoctor = patient.doctor;
		this.hkid = patient.hkid;
		this.dob = patient.dob;
		this.gender = patient.gender;
		this.visitReason = patient.visitReason;

		this.fullName = `${this.fName} ${this.lName}`;
		this.arrived = new Date();
		
		this.id;
		this.queuePosition;
		this.history = [];

		this.init();
	}

	async init() {
		try {
			[this.id] = await this.addPatient(this);
			this.history = await this.diaganosisHistory(this.id);
		} catch (err) {
			console.log(err);
		}
	}
}

module.exports = Patient;