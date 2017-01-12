import React, { Component } from 'react';
import {
  View
} from 'react-native';

const {FBLogin, FBLoginManager} = require('react-native-facebook-login');

class Login extends Component {
  render() {
    return (
      <View>
        <FBLogin
          style={this.props.style}
          permissions={["user_friends"]}
          onLogin={this.props.onLogin}
          onLoginFound={this.props.onLogin}
        />
      </View>
    );
  }
}

module.exports = Login;
