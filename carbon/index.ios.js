/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

import BottomNav from './components/BottomNav'
import Login from './components/Login'
import FindMore from './scenes/FindMore'
import FollowingFriends from './scenes/FollowingFriends'
import {SCENES} from './common/constants'

class carbon extends Component {
  state: {
    scene: number,
  };

  constructor(props) {
    super(props);
    this.state = {
      scene: SCENES.FOLLOWING_FRIENDS,
    };
  }

  _onLogin(result, error) {
    this.setState({
      scene: SCENES.FOLLOWING_FRIENDS,
    });
  }

  _onSwitchNav(id) {
    console.debug('**', id);
    this.setState({
      scene: id,
    });
  }

  _renderScene() {
    switch (this.state.scene) {
      case SCENES.LOGIN:
        return (
          <View style={styles.loginContainer}>
            <Text style={styles.welcome}>
              Sharefolio
            </Text>
            <Login onLogin={this._onLogin.bind(this)} />
          </View>
        );
      case SCENES.FIND_FRIENDS:
        return (
          <FindMore
            onSwitchNav={(id) => this._onSwitchNav(id)}
          />
        );
      case SCENES.FOLLOWING_FRIENDS:
        return (
          <FollowingFriends
            onSwitchNav={(id) => this._onSwitchNav(id)}
          />
        );
    }
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        {this._renderScene()}
        <BottomNav />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: 50,
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
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('carbon', () => carbon);
