
exports.up = function(knex) {
  return knex.schema.table("queue", (table) => {
      table.string("arrival")
  })
};

exports.down = function(knex) {
  return knex.schema.table("queue", (table) => {
      table.dropColumn("arrival")
  })
};
