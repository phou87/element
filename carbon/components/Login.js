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
          permissions={["user_friends"]}
          onLogin={this.props.onLogin}
          onLoginFound={this.props.onLogin}
          onLogoutFinished={() => alert("User logged out")}/>
      </View>
    );
  }
}

module.exports = Login;
