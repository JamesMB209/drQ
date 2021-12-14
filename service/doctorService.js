class Doctor extends Queue {
	constructor(socket, name, room){
	super();
	this.socket = socket;
	this.name = name;
	this.room = room;
	}

	popFromQueue () {
	// emits from socket/io "ID removed from Que"
	// all just notes
	// this.remove
	}

	
}
