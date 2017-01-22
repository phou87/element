import React, { Component } from 'react';
import Parse from 'parse/react-native';
import {Switch} from 'react-native';

import {Button, Icon, List, ListItem, Text} from 'native-base';

class Settings extends Component {
  render() {
    return (
      <List>
        <ListItem iconLeft>
          <Icon name="ios-notifications" style={{ color: '#5bc0de' }} />
          <Text>Push Notifications</Text>
          <Switch
            onValueChange={this.setNotifyFriendsSwitch}
            value={true}
          />
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
