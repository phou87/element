import React, { Component } from 'react';
import {
  View
} from 'react-native';

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
} = FBSDK;

class Login extends Component {
  render() {
    return (
      <View>
        <LoginButton
          readPermissions={["user_friends"]}
          onLoginFinished={
            (error, result) => {
              this.props.onLogin(result, error);
            }
          }
          onLogoutFinished={() => alert("User logged out")}/>
      </View>
    );
  }
}

module.exports = Login;
