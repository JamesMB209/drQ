
exports.up = function(knex) {
	return knex.schema.createTable('patient', (table) => {
		table.increments().unique();
		table.string('f_name');
		table.string('l_name');
		table.string('id_card');
		table.date('dob');
	})  
};

exports.down = function(knex) {
	return knex.schema.dropTable('patient');  
};
