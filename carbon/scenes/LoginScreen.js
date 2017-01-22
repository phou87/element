import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Login from '../components/Login'
import ParseDispatcher from '../dispatchers/ParseDispatcher'
import {Button, Icon} from 'native-base';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  _onLogin(results) {
    if (this.state.isLoading) {
      return;
    }
    this.setState({
      isLoading: true,
    });
		ParseDispatcher.loginWithFacebook(results.credentials, user => this._onLoginCallback(user));
  }
  
  _onLoginCallback(user) {
    if (!user) {
      this.setState({
        isLoading: false,
      });
      Alert.alert(
        'Error',
        'Could not log in. Please try restarting Sharefolio.',
        [{text: 'OK'}],
      );
      return;
    }
    this.props.onLogin(user);
  }
  
  render() {
  	let indicator = this.state.isLoading ? <ActivityIndicator /> : null;
    let loginStyle = this.state.isLoading ? {opacity: 0} : undefined;
    
    return (
      <View style={styles.loginContainer}>
        <Text style={styles.welcome}>
          Sharefolio
        </Text>
        <Icon name='ios-trending-up' style={{fontSize: 100, color: 'green'}}/>
        <Text style={styles.description}>
          Portfolio Sharing Made Easy
        </Text>
        {indicator}
        <Login style={loginStyle} onLogin={this._onLogin.bind(this)} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
});

export {
  LoginScreen,
};
