import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {FBLoginManager} from 'react-native-facebook-login';

import {SCENES} from '../common/constants'

import Button from './Button'
import ProfilePic from './ProfilePic'

class Header extends Component {
	onClick() {
    FBLoginManager.logout((error, data) => {
      this.props.onLogout();
    });
  }

  render() {
    let authData = this.props.loggedInUser.get('authData').facebook;
  	console.debug(authData);
    return (
      <View style={styles.container}>
        <ProfilePic
          height={50}
          width={50}
          id={authData.id}
          accessToken={authData.access_token}
          onClick={() => this.props.onSwitchNav(SCENES.PORTFOLIO)}
        />
        <Button onClick={() => this.onClick()} buttonStyle={styles.logoutButton} textStyle={styles.logoutText}>
          Log Out
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'black',
    flexDirection: 'row',
    height: 85,
    justifyContent: 'space-between',
    padding: 10,
    paddingTop: 15,
  },
  logoutButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    height: 30,
    width: 75,
  },
  logoutText: {
    color: 'deepskyblue',
  },
});

module.exports = Header;
