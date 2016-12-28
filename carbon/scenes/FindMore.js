import {
  ActivityIndicator,
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
import {FacebookURI} from '../common/FacebookURI';

class PotentialFriendRow extends Component {
  constructor(props) {
    super(props);
    
    this.onAddFriend = this.onAddFriend.bind(this);
  }
  
  onAddFriend() {
  	ParseDispatcher.addFriend(this.props.loggedInUser, this.props.friend.id, this.props.onAddFriendCallback);
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
      <AddButton onClick={this.onAddFriend} />
    );
  }

  render() {
    let uri = new FacebookURI(this.props.accessToken, this.props.friend.id + '/picture');
  
    return (
      <View style={styles.friendRow}>
        <Image
          style={{width: 50, height: 50}}
          source={{uri: uri.getURI()}}
        />
        <Text style={styles.friendName}>
          {this.props.friend.name}
        </Text>
        {this._renderRightRowSection(this.props.friend)}
      </View>
    );
  }
}

class FindMoreScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
    
    this.onAddFriendCallback = this.onAddFriendCallback.bind(this);
  }

  async componentWillMount() {
    await this.props.refreshFriends();
    this.setState({
      isLoading: false,
    });
  }

  _renderPotentialFriends() {
    if (this.state.isLoading) {
      return <ActivityIndicator />;
    }
  
    let authData = this.props.loggedInUser.get('authData').facebook;
    
    return this.props.potentialFriends.map(friend =>
      <PotentialFriendRow
        accessToken={authData.access_token}
        friend={friend}
        key={friend.id}
        loggedInUser={this.props.loggedInUser}
        onAddFriendCallback={this.onAddFriendCallback}
      />
    );
  }
  
  onAddFriendCallback(friend_id) {
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
          onSwitchNav={this.props.onSwitchNav}
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
