const expect = require('expect');

const {Users} = require('./users');

describe('Users', () => {
  let users;
  beforeEach(() => {
    users = new Users();
    users.users = [{
      id: '1',
      name: 'Mike',
      room: 'rm1'
    }, {
      id: '2',
      name: 'Jen',
      room: 'rm2'
    }, {
      id: '3',
      name: 'Julie',
      room: 'rm1'
    }];
  });

  it('should add new user', () => {
    const users = new Users();
    const user = {
      id: '123',
      name: 'Peter',
      room: 'Office'
    };
    const resUser = users.addUser(user.id, user.name, user.room);
    expect(users.users).toEqual([user]);
  });
});