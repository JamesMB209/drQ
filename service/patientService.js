class Patient extends Queue {
	constructor(fName, lName) {
	super();
	this.fName = fName;
	this.lName = lName;
	this.fullName = `${fName} ${lName}`; 

	this.arrived = new Date;
	this.departed = "";
	}

	//index in queue (can be some logic in here to calculate and return average waiting time)
}
