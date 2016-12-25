import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';

import React, { Component } from 'react';
import TopNavMultiple from '../components/TopNavMultiple'
import {SCENES} from '../common/constants'
import ParseDispatcher from '../dispatchers/ParseDispatcher'
import RemoveButton from '../components/RemoveButton'

class FollowingFriendsScene extends Component {
  componentDidMount() {
    require('RCTDeviceEventEmitter').emit('remoteNotificationReceived', {
      aps: {
        alert: 'Sample notification',
        badge: '+1',
        sound: 'default',
        category: 'REACT_NATIVE'
      },
    });
  }

  _renderFriends() {
    let data = this.props.loggedInUser.get('authData').facebook;
    return this.props.existingFriends.map(friend =>
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
  	if (friend.unfriended) {
    	return (
        <Text>
          Removed!
        </Text>
      );
    }
    
    return (
      <RemoveButton onClick={() => this._onRemoveFriend(friend.id)} />
    );
  }

  _onRemoveFriend(friend_id) {
  	ParseDispatcher.removeFriend(this.props.loggedInUser, friend_id, this._onRemoveFriendCallback.bind(this));
  }

  _onRemoveFriendCallback(friend_id) {
  	let index = this.props.existingFriends.findIndex(friend => friend.id === friend_id);
    this.props.existingFriends[index].unfriended = true;
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
          selected={SCENES.FOLLOWING_FRIENDS}
          onSwitchNav={(id) => this.props.onSwitchNav(id)}
        />
        {this._renderFriends()}
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
  friendRow: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  friendName: {
    fontSize: 20,
    textAlign: 'left',
    margin: 10,
  },
});

module.exports = FollowingFriendsScene;
