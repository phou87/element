import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

import React, { Component } from 'react';
import TopNavMultiple from '../components/TopNavMultiple'
import {SCENES} from '../common/constants'
import ParseDispatcher from '../dispatchers/ParseDispatcher'
import RemoveButton from '../components/RemoveButton'
import {FacebookURI} from '../common/FacebookURI';

class FriendRow extends Component {
  constructor(props) {
    super(props);
    
    this.onRemoveFriend = this.onRemoveFriend.bind(this);
    this.onSwitchPortfolio = this.onSwitchPortfolio.bind(this);
  }
  
  onRemoveFriend() {
  	ParseDispatcher.removeFriend(this.props.loggedInUser, this.props.friend.id, this.props.onRemoveFriendCallback);
  }
  
  onSwitchPortfolio() {
    this.props.onSwitchPortfolio(this.props.friend);
  }

  _renderRightRowSection(friend) {
  	if (friend.unfriended) {
    	return (
        <Text style={styles.removedText}>
          Removed!
        </Text>
      );
    }
    
    return (
      <RemoveButton onClick={this.onRemoveFriend} />
    );
  }

  render() {
    let uri = new FacebookURI(this.props.accessToken, this.props.friend.id + '/picture');
    return (
      <View style={styles.friendRow}>
        <TouchableOpacity
          style={styles.friendRowTouchable}
          onPress={this.onSwitchPortfolio}
        >
          <Image
            style={{width: 50, height: 50}}
            source={{uri: uri.getURI()}}
          />
          <Text style={styles.friendName}>
            {this.props.friend.name}
          </Text>
        </TouchableOpacity>
        {this._renderRightRowSection(this.props.friend)}
      </View>
    );
  }
}

class FollowingFriendsScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
    
    this.onRemoveFriendCallback = this.onRemoveFriendCallback.bind(this);
    this.refreshFriends = this.refreshFriends.bind(this);
  }

  async componentWillMount() {
    this.setState({
      isLoading: true,
    }, this.refreshFriends);
  }
  
  async refreshFriends() {
    await this.props.refreshFriends();
    this.setState({
      isLoading: false,
    });
  }

  _renderFriends() {
    if (this.state.isLoading) {
      return <ActivityIndicator />;
    }
  
    let authData = this.props.loggedInUser.get('authData').facebook;
    
    return this.props.existingFriends.map(friend =>
      <FriendRow
        accessToken={authData.access_token}
        friend={friend}
        key={friend.id}
        loggedInUser={this.props.loggedInUser}
        onRemoveFriendCallback={this.onRemoveFriendCallback}
      />
    );
  }

  onRemoveFriendCallback(friend_id) {
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
  friendRowTouchable: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  friendName: {
    fontSize: 20,
    textAlign: 'left',
    margin: 10,
  },
  removedText: {
    color: 'white',
  },
});

module.exports = FollowingFriendsScene;
