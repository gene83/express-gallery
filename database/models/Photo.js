const bookshelf = require('./bookshelf');

class Photo extends bookshelf.Model {
  get tableName() {
    return 'photos';
  }
  get hasTimestamps() {
    return true;
  }

  users() {
    return this.belongsTo('users');
  }
}

module.exports = bookshelf.model('Photo', Photo);
