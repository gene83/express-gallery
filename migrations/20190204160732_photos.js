exports.up = function(knex, Promise) {
  return knex.schema.createTable('photos', table => {
    table.increments();
    table
      .integer('user_id')
      .references('id')
      .inTable('users');
    table.string('link');
    table.string('title');
    table.string('author');
    table.string('description', 2048);
    table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('photos');
};
