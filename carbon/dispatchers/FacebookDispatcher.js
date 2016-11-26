const FacebookDispatcher = {
  async fetchFriends(loggedInUser) {
    let authData = loggedInUser.get('authData').facebook;
    let api = 'https://graph.facebook.com/v2.7/' +
      authData.id +
      '/friends?fields=name,email&access_token=' +
      authData.access_token;

    response = await fetch(api);
    responseJSON = await response.json();
    
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
}

module.exports = FacebookDispatcher;