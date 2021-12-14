class Patient extends Queue {
	constructor(fName, lName, socket) {
	super();
	this.socket = socket;
	this.fName = fName;
	this.lName = lName;
	this.fullName = `${fName} ${lName}`; 
	}

	//index in queue (can be some logic in here to calculate and return average waiting time)
}
