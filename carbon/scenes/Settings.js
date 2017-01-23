import React, { Component } from 'react';
import Parse from 'parse/react-native';
import {AppState, PushNotificationIOS, Switch} from 'react-native';

import {Button, Icon, List, ListItem, Text} from 'native-base';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      permissions: {},
    };

    this.checkPermissions = this.checkPermissions.bind(this);
  }

  componentWillMount() {
    AppState.addEventListener('change', this.checkPermissions);
		this.checkPermissions();
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.checkPermissions);
  }

  checkPermissions() {
    PushNotificationIOS.checkPermissions(permissions => this.setState({permissions}));
  }

  render() {
    return (
      <List>
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
