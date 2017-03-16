import {FacebookURI} from '../common/FacebookURI';
import ParseDispatcher from './ParseDispatcher';

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

    let followerCounts = await ParseDispatcher.getFollowerCounts(data.map(friend => friend.id));
    let getFollowerCount = friend => followerCounts[friend.id] ? followerCounts[friend.id] : 0;

    existingFriends.sort((b, a) => getFollowerCount(a) - getFollowerCount(b));
    potentialFriends.sort((b, a) => getFollowerCount(a) - getFollowerCount(b));

    return [potentialFriends, existingFriends, followerCounts];
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
