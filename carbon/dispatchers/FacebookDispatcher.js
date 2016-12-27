import {FacebookURI} from '../common/FacebookURI';

const FacebookDispatcher = {
  async fetchFriends(loggedInUser) {
    let authData = loggedInUser.get('authData').facebook;
    
    let uri = new FacebookURI(authData.access_token, authData.id + '/friends');
    uri.addParam('fields', 'name,email');
    
    let response = await fetch(uri.getURI());
    let responseJSON = await response.json();
    
    let data = responseJSON.data;
    let friendships = loggedInUser.relation("friendships");
    let list = await friendships.query().find();

    let friendIds = list.map(friend => friend.get("friend_id"));
    
    let potentialFriends = [];
    let existingFriends = [];
    
    for (let friend of data) {
      if (friendIds.indexOf(friend.id) === -1) {
        potentialFriends.push(friend);
      } else {
        existingFriends.push(friend);
      }
    }

    return [potentialFriends, existingFriends];
  },
  
  async fetchName(loggedInUser) {
    let authData = loggedInUser.get('authData').facebook;
    let uri = new FacebookURI(authData.access_token, 'me');

    let response = await fetch(uri.getURI());
    let responseJSON = await response.json();
    
    return responseJSON.name;
  },
}

module.exports = FacebookDispatcher;
