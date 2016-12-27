/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import Parse from 'parse/react-native';
import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppRegistry,
  PushNotificationIOS,
  StyleSheet,
  Text,
  View
} from 'react-native';

import BuySell from './scenes/BuySell'
import MainViewFrame from './components/MainViewFrame'
import {LoginScreen} from './scenes/LoginScreen'
import FindMore from './scenes/FindMore'
import FollowingFriends from './scenes/FollowingFriends'
import {Portfolio} from './scenes/Portfolio'
import {SCENES} from './common/constants'

import FacebookDispatcher from './dispatchers/FacebookDispatcher'
import ParseDispatcher from './dispatchers/ParseDispatcher'

class carbon extends Component {
  state: {
    deviceToken: string,
  	loggedInUser: object,
    name: string,
    scene: number,
    potentialFriends: array<object>,
    existingFriends: array<object>,
    portfolioUser: object,
  };

  constructor(props) {
    super(props);
    this.state = {
      existingFriends: [],
      potentialFriends: [],
      scene: SCENES.LOGIN,
    };
    Parse.initialize("10000");
    Parse.serverURL = 'http://parseserver-hj59s-env.us-west-2.elasticbeanstalk.com/parse/';
    //Parse.initialize("4444");
    //Parse.serverURL = 'http://192.168.10.175:1337/parse';
    
    this.onLogout = this.onLogout.bind(this);
    this.onRegistered = this.onRegistered.bind(this);
    this.onSwitchNav = this.onSwitchNav.bind(this);
    this.onSwitchPortfolio = this.onSwitchPortfolio.bind(this);
    this.refreshFriends = this.refreshFriends.bind(this);
  }
  
  componentWillMount() {
    PushNotificationIOS.addEventListener('register', this.onRegistered);
    PushNotificationIOS.addEventListener('notification', this._onRemoteNotification);
    PushNotificationIOS.addEventListener('localNotification', this._onLocalNotification);

    PushNotificationIOS.requestPermissions();
  }

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('register', this.onRegistered);
    PushNotificationIOS.removeEventListener('notification', this._onRemoteNotification);
    PushNotificationIOS.removeEventListener('localNotification', this._onLocalNotification);
  }
  
  onRegistered(deviceToken) {
    this.setState({deviceToken});
    if (this.state.loggedInUser) {
      ParseDispatcher.attachDeviceTokenToUser(this.state.loggedInUser, deviceToken);
    }
  }

  _onRemoteNotification(notification) {
    /*
    Alert.alert(
      'Friend Activity',
      notification.getMessage(),
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
    */
  }

  _onLocalNotification(notification){
    /*
    Alert.alert(
      'Friend Activity',
      notification.getMessage(),
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
    */
  }
  
  async _onLoginCallback(user) {
    let name = await FacebookDispatcher.fetchName(user);
    ParseDispatcher.saveUserMetadata(user, name, user.get('authData').facebook.id, this.state.deviceToken);
    
    this.setState({
      name,
    	loggedInUser: user,
      scene: SCENES.FOLLOWING_FRIENDS,
    });
  }
  
  onLogout() {
    this.setState({
      loggedInUser: null,
      scene: SCENES.LOGIN,
    });
  }

  onSwitchNav(id) {
    this.setState({
      portfolioUser: null,
      scene: id,
    });
  }
  
  onSwitchPortfolio(friend) {
    ParseDispatcher.getUserForFriend(friend.id, friend => {
      if (!friend || !friend.length) {
        return;
      }
      this.setState({
        portfolioUser: friend[0],
        scene: SCENES.PORTFOLIO,
      });
    });
  }
  
  async refreshFriends() {
		let [potentialFriends, existingFriends] = await FacebookDispatcher.fetchFriends(this.state.loggedInUser);
    this.setState({
      potentialFriends,
      existingFriends,
    });
  }

  _renderScene() {
    let child = null;
    switch (this.state.scene) {
      case SCENES.LOGIN:
        return (
          <LoginScreen onLogin={this._onLoginCallback.bind(this)} />
        );
      case SCENES.FIND_FRIENDS:
        child = (
          <FindMore
            {...this.state}
            onSwitchNav={this.onSwitchNav}
            refreshFriends={this.refreshFriends}
          />
        );
        break;
      case SCENES.FOLLOWING_FRIENDS:
        child = (
          <FollowingFriends
            {...this.state}
            onSwitchNav={this.onSwitchNav}
            onSwitchPortfolio={this.onSwitchPortfolio}
            refreshFriends={this.refreshFriends}
          />
        );
        break;
      case SCENES.PORTFOLIO:
        let user = this.state.portfolioUser ? this.state.portfolioUser : this.state.loggedInUser;
        child = (
          <Portfolio
            {...this.state}
            loggedInUser={user}
            ownPortfolio={!this.state.portfolioUser}
          />
        );
        break;
      case SCENES.BUY_SELL:
        child = (
          <BuySell
            {...this.state}
          />
        );
        break;
    }
    
    return (
      <MainViewFrame
        {...this.state}
        onLogout={this.onLogout}
        onSwitchNav={this.onSwitchNav}
      >
        {child}
      </MainViewFrame>
    );
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        {this._renderScene()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  sceneContainer: {
  	flex: 1,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('carbon', () => carbon);
