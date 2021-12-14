
exports.up = function(knex) {
	return knex.schema.createTable("doctor", (table) => {
	table.increments().unique();
	table.string("f_name");
	table.string("l_name");
	table.string("room");
	})  
};

exports.down = function(knex) {
  	return knex.schema.dropTable("doctor");
};
