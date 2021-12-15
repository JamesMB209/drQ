
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('doctor').del()
    .then(function () {
      // Inserts seed entries
      return knex('doctor').insert([
        {f_name: 'Peram', l_name: 'Kharel', room:'1'},
        {f_name: 'Pris', l_name: 'Cheng', room:'2'},
        {f_name: 'James', l_name: 'Betts', room:'3'},
	]);
    });
};
