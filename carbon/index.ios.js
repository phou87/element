import React, { Component } from 'react';
import {Alert, AppRegistry, PushNotificationIOS} from 'react-native';

import Parse from 'parse/react-native';
const {FBLoginManager} = require('react-native-facebook-login');

import {BuySell, FindMore, FollowingFriends, LoginScreen, Portfolio} from './scenes';
import {SCENES} from './common/constants'
import {MainViewFrame} from './components/MainViewFrame'
import FacebookDispatcher from './dispatchers/FacebookDispatcher'
import ParseDispatcher from './dispatchers/ParseDispatcher'

export default class carbon extends Component {
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
    Parse.initialize("1000");
    Parse.serverURL = 'https://api.elementapp.co/parse/';
    //Parse.initialize("4444");
    //Parse.serverURL = 'http://localhost:1337/parse';
    
    this.onLogout = this.onLogout.bind(this);
    this.onRegistered = this.onRegistered.bind(this);
    this.onSwitchNav = this.onSwitchNav.bind(this);
    this.onSwitchPortfolio = this.onSwitchPortfolio.bind(this);
    this.refreshFriends = this.refreshFriends.bind(this);
  }
  
  componentWillMount() {
    PushNotificationIOS.addEventListener('register', this.onRegistered);
    PushNotificationIOS.addEventListener('notification', this.onRemoteNotification);
    PushNotificationIOS.addEventListener('localNotification', this._onLocalNotification);

    PushNotificationIOS.requestPermissions();
  }

  componentWillUnmount() {
    PushNotificationIOS.removeEventListener('register', this.onRegistered);
    PushNotificationIOS.removeEventListener('notification', this.onRemoteNotification);
    PushNotificationIOS.removeEventListener('localNotification', this._onLocalNotification);
  }
  
  onRegistered(deviceToken) {
    this.setState({deviceToken});
    if (this.state.loggedInUser) {
      ParseDispatcher.attachDeviceTokenToUser(this.state.loggedInUser, deviceToken);
    }
  }

  onRemoteNotification(notification) {
    Alert.alert(
      'Friend Activity',
      notification.getMessage(),
      [{
        text: 'Dismiss',
        onPress: null,
      }]
    );
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
      scene: SCENES.BUY_SELL,
    });
  }
  
  onLogout() {
    FBLoginManager.logout((error, data) => {
      this.setState({
        loggedInUser: null,
        scene: SCENES.LOGIN,
      });
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
        scene: SCENES.FRIEND_PORTFOLIO,
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
  
  getTitle() {
    switch (this.state.scene) {
      case SCENES.FIND_FRIENDS:
        return "Find Friends";
      case SCENES.FOLLOWING_FRIENDS:
        return "Following";
      case SCENES.PORTFOLIO:
        return "Portfolio";
      case SCENES.BUY_SELL:
        return "Create Transaction";
      case SCENES.FRIEND_PORTFOLIO:
        return this.state.portfolioUser.get('name') + '\'s Portfolio';
    }
    
    return "Sharefolio";
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
        child = (
          <Portfolio
            {...this.state}
            loggedInUser={this.state.loggedInUser}
            ownPortfolio={true}
            superUser={this.state.loggedInUser}
          />
        );
        break;
      case SCENES.FRIEND_PORTFOLIO:
        child = (
          <Portfolio
            {...this.state}
            loggedInUser={this.state.portfolioUser}
            ownPortfolio={false}
            superUser={this.state.loggedInUser}
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
        title={this.getTitle()}
      >
        {child}
      </MainViewFrame>
    );
  }

  render() {
    return this._renderScene();
  }
}

AppRegistry.registerComponent('carbon', () => carbon);
