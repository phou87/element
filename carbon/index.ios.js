/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import Parse from 'parse/react-native';
import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import BuySell from './scenes/BuySell'
import Login from './components/Login'
import MainViewFrame from './components/MainViewFrame'
import FindMore from './scenes/FindMore'
import FollowingFriends from './scenes/FollowingFriends'
import {Portfolio} from './scenes/Portfolio'
import {SCENES} from './common/constants'

import FacebookDispatcher from './dispatchers/FacebookDispatcher'
import ParseDispatcher from './dispatchers/ParseDispatcher'

class carbon extends Component {
  state: {
  	loggedInUser: object,
    scene: number,
    potentialFriends: array<object>,
    existingFriends: array<object>,
  };

  constructor(props) {
    super(props);
    this.state = {
      scene: SCENES.LOGIN,
    };
    Parse.initialize("4444");
    Parse.serverURL = 'http://localhost:1337/parse';
  }

  _onLogin(results) {
    console.log(results);
		ParseDispatcher.loginWithFacebook(results.credentials, user => this._onLoginCallback(user));
  }
  
  async _onLoginCallback(user) {
		let [potentialFriends, existingFriends] = await FacebookDispatcher.fetchFriends(user);
    this.setState({
      potentialFriends,
      existingFriends,
    	loggedInUser: user,
      scene: SCENES.FOLLOWING_FRIENDS,
    });
  }
  
  _onLogout() {
    this.setState({
      loggedInUser: null,
      scene: SCENES.LOGIN,
    });
  }

  _onSwitchNav(id) {
    this.setState({
      scene: id,
    });
    this._refreshFriends().done();
  }
  
  async _refreshFriends() {
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
          <View style={styles.loginContainer}>
            <Text style={styles.welcome}>
              SHAREFOLIO
            </Text>
            <Text style={styles.description}>
              Portfolio Sharing Made Easy
            </Text>
            <Login onLogin={this._onLogin.bind(this)} />
          </View>
        );
      case SCENES.FIND_FRIENDS:
        child = (
          <FindMore
            {...this.state}
            onSwitchNav={(id) => this._onSwitchNav(id)}
          />
        );
        break;
      case SCENES.FOLLOWING_FRIENDS:
        child = (
          <FollowingFriends
            {...this.state}
            onSwitchNav={(id) => this._onSwitchNav(id)}
          />
        );
        break;
      case SCENES.PORTFOLIO:
        child = (
          <Portfolio
            {...this.state}
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
        onLogout={() => this._onLogout()}
        onSwitchNav={(id) => this._onSwitchNav(id)}
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
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  description: {
    marginBottom: 50,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('carbon', () => carbon);
