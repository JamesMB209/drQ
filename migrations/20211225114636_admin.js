
exports.up = function(knex) {
  return knex.schema.createTable("admin", (table) => {
      table.increments();
      table.string("f_name");
      table.string("l_name");
      table.string("username");
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("admin");
};
