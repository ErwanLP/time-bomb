require('module-alias/register');
const UsersService = require('@services/UsersService');
let chai = require('chai');
const uuidv4 = require('uuid/v4');

var assert = chai.assert;
// Configure chai
chai.should();
describe('UserServiceTest', () => {
  describe('Create', () => {
    // Test to get all students record
    it('create new user', (done) => {
      UsersService.create(uuidv4(), 'Erwan').then(
          data => {
            console.log(data);
            done();
          },
      );
    });
    it('create new user', (done) => {
      UsersService.create(uuidv4(), 'Erwan').then(
          data => {
            console.log(data);
            done();
          },
      );
    });
    it('create new user', (done) => {
      UsersService.create(uuidv4(), 'Erwan').then(
          data => {
            console.log(data);
            done();
          },
      );
    });
  });
});
