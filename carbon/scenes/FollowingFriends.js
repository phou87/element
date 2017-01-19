import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

import {Button, List, ListItem, Thumbnail, Text} from 'native-base';

import React, { Component } from 'react';
import {SCENES} from '../common/constants'
import ParseDispatcher from '../dispatchers/ParseDispatcher'
import {FacebookURI} from '../common/FacebookURI';

class FriendRow extends Component {
  constructor(props) {
    super(props);
    
    this.onRemoveFriend = this.onRemoveFriend.bind(this);
    this.onSwitchPortfolio = this.onSwitchPortfolio.bind(this);
    this.renderRightRowSection = this.renderRightRowSection.bind(this);
  }
  
  onRemoveFriend() {
  	ParseDispatcher.removeFriend(this.props.loggedInUser, this.props.friend.id, this.props.onRemoveFriendCallback);
  }
  
  onSwitchPortfolio() {
    this.props.onSwitchPortfolio(this.props.friend);
  }

  renderRightRowSection(friend) {
  	if (friend.unfriended) {
    	return (
        <Text style={styles.removedText}>
          Removed!
        </Text>
      );
    }
    
    return (
      <Button onPress={this.onRemoveFriend} style={styles.removeButton} warning>Remove</Button>
    );
  }

  render() {
    let uri = new FacebookURI(this.props.accessToken, this.props.friend.id + '/picture');
    return (
      <ListItem>
        <Thumbnail square size={80} source={{uri: uri.getURI()}} />
        <Text>{this.props.friend.name}</Text>
        {this.renderRightRowSection(this.props.friend)}
      </ListItem>
    );
  }
}

class FollowingFriends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
    
    this.onRemoveFriendCallback = this.onRemoveFriendCallback.bind(this);
  }

  async componentWillMount() {
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
        onSwitchPortfolio={this.props.onSwitchPortfolio}
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
    backgroundColor: 'white',
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
  removeButton: {
    marginTop: 20,
  },
});

export {
  FollowingFriends,
};
