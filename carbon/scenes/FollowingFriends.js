import {
  Image,
  LayoutAnimation,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';

import {Button, Icon, List, ListItem, Spinner, Thumbnail, Text} from 'native-base';

import React, { Component } from 'react';
import {SCENES} from '../common/constants'
import ParseDispatcher from '../dispatchers/ParseDispatcher'
import {FacebookURI} from '../common/FacebookURI';
import mytheme2 from '../common/mytheme2';

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
    return (
            <View>
                <Button small rounded block onPress={this.onRemoveFriend} style={styles.removeButton} success>
                    <Icon name='ios-remove-circle' />
                    <Text style={styles.friendName}>Unfollow</Text>
                </Button>
                <Button small rounded block onPress={this.onSwitchPortfolio} style={styles.removeButton} info>
                    <Icon name='ios-trending-up' />
                    <Text style={styles.friendName}>See Portfolio</Text>
                </Button>
            </View>
    );
  }

  render() {
		if (this.props.friend.unfriended) {
			return null;
    }

    let uri = new FacebookURI(this.props.accessToken, this.props.friend.id + '/picture');
    uri.addParam('height', '128');
    uri.addParam('width', '128');

    return (
      <ListItem theme={mytheme2}>
        <Thumbnail square size={75} source={{uri: uri.getURI()}} />
        <Text style={styles.friendName}>{this.props.friend.name}</Text>
            <Text note>Followers: {this.props.followerCount ? this.props.followerCount : 0}</Text>
        {this.renderRightRowSection(this.props.friend)}
      </ListItem>
    );
  }
}

class FollowingFriends extends Component {
  constructor(props) {
    super(props);
    this.state = {
      counts: {},
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
      return <Spinner color="green" />;
    }
  
    let authData = this.props.loggedInUser.get('authData').facebook;
    
    return this.props.existingFriends.map(friend =>
      <FriendRow
        accessToken={authData.access_token}
        followerCount={this.props.followerCounts[friend.id]}
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
    LayoutAnimation.easeInEaseOut();
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
    alignItems: 'center',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
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
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'left',
    margin: 5,
  },
  removedText: {
    color: 'white',
  },
  removeButton: {
    marginTop: 10,
  },
});

export {
  FollowingFriends,
};
