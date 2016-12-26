import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';

import React, { Component } from 'react';
import AddButton from '../components/AddButton'
import FacebookDispatcher from '../dispatchers/FacebookDispatcher'
import ParseDispatcher from '../dispatchers/ParseDispatcher'
import TopNavMultiple from '../components/TopNavMultiple'
import {SCENES} from '../common/constants'

class FindMoreScene extends Component {
  _renderPotentialFriends() {
    let data = this.props.loggedInUser.get('authData').facebook;
    return this.props.potentialFriends.map(friend =>
      <View key={friend.id} style={styles.friendRow}>
        <Image
          style={{width: 50, height: 50}}
          source={{uri: 'https://graph.facebook.com/v2.7/' + friend.id + '/picture?access_token='+data.access_token}}
        />
        <Text style={styles.friendName}>
          {friend.name}
        </Text>
        {this._renderRightRowSection(friend)}
      </View>
    );
  }
  
  _renderRightRowSection(friend) {
  	if (friend.friended) {
    	return (
        <Text style={styles.addedText}>
          Added!
        </Text>
      );
    }
    
    return (
      <AddButton onClick={() => this._onAddFriend(friend.id)} />
    );
  }
  
  _onAddFriend(friend_id) {
  	ParseDispatcher.addFriend(this.props.loggedInUser, friend_id, this._onAddFriendCallback.bind(this));
  }
  
  _onAddFriendCallback(friend_id) {
  	let index = this.props.potentialFriends.findIndex(friend => friend.id === friend_id);
    this.props.potentialFriends[index].friended = true;
    this.forceUpdate();
  }

  render() {
    return (
      <View style={styles.container}>
        <TopNavMultiple
          items={[
            {id: SCENES.FOLLOWING_FRIENDS, name: 'Following'},
            {id: SCENES.FIND_FRIENDS, name: 'Find More'},
          ]}
          selected={SCENES.FIND_FRIENDS}
          onSwitchNav={(id) => this.props.onSwitchNav(id)}
        />
        {this._renderPotentialFriends()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#575757',
  },
  addedText: {
    color: 'white',
  },
  friendRow: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  friendName: {
    color: 'white',
    fontSize: 20,
    textAlign: 'left',
    margin: 10,
  },
});

module.exports = FindMoreScene;
