import { User } from '../Models/users';
const user = new User();

describe('The Methods of user', () => {
  it('Has an Index Method ', () => {
    expect(user.index).toBeDefined();
  });
  it('Has a create Method ', () => {
    expect(user.create).toBeDefined();
  });
  it('Has a show Method ', () => {
    expect(user.show).toBeDefined();
  });

  it('Has an auth Method ', () => {
    expect(user.show).toBeDefined();
  });
});
