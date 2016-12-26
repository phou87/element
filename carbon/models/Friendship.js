import Parse from 'parse/react-native';

class Friendship extends Parse.Object {
  constructor(friend_id, user_id) {
    super('Friendship');
    this.set('friend_id', friend_id);
    this.set('user_id', user_id);
  }
}

Parse.Object.registerSubclass('Friendship', Friendship);

module.exports = Friendship;
