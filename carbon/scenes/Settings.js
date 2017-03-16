import React, { Component } from 'react';
import Parse from 'parse/react-native';
import {AppState, PushNotificationIOS, Switch} from 'react-native';

import {Button, Icon, List, ListItem, Text} from 'native-base';

import ParseDispatcher from '../dispatchers/ParseDispatcher'

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      followerCount: 0,
      permissions: {},
    };

    this.checkPermissions = this.checkPermissions.bind(this);
  }

  componentWillMount() {
    AppState.addEventListener('change', this.checkPermissions);
		this.checkPermissions();
    this.getFollowerCount();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.checkPermissions);
  }

  checkPermissions() {
    PushNotificationIOS.checkPermissions(permissions => this.setState({permissions}));
  }

  async getFollowerCount() {
    let followerCount = await ParseDispatcher.getFollowerCount(this.props.loggedInUser);
    this.setState({
      followerCount,
    });
  }

  render() {
    return (
      <List>
        <ListItem iconLeft>
          <Text>Followers: {this.state.followerCount}</Text>
        </ListItem>
        <ListItem iconLeft>
          <Icon name="ios-notifications" style={{ color: '#5bc0de' }} />
          <Text>Push Notifications are {this.state.permissions.alert ? 'On' : 'Off'}</Text>
        </ListItem>
        <ListItem iconLeft>
          <Button block info onPress={this.props.onLogout}>Logout</Button>
        </ListItem>
      </List>
    );
  }
}

export {
  Settings,
};
