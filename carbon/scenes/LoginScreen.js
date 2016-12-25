import React, { Component } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View
} from 'react-native';

import Login from '../components/Login'
import ParseDispatcher from '../dispatchers/ParseDispatcher'

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
    };
  }

  _onLogin(results) {
    console.debug('loading?', this.state.isLoading);
    if (this.state.isLoading) {
      return;
    }
    this.setState({
      isLoading: true,
    });
		ParseDispatcher.loginWithFacebook(results.credentials, user => this._onLoginCallback(user));
  }
  
  _onLoginCallback(user) {
    this.props.onLogin(user);
  }
  
  render() {
  	let indicator = this.state.isLoading ? <ActivityIndicator /> : null;
    let loginStyle = this.state.isLoading ? {opacity: 0} : undefined;
    
    return (
      <View style={styles.loginContainer}>
        <Text style={styles.welcome}>
          SHAREFOLIO
        </Text>
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
