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
          loginBehavior={FBLoginManager.LoginBehaviors.Native}
          onLogin={this.props.onLogin}
          onLoginFound={this.props.onLogin}
          onLogout={this.props.onLogout}
        onLoginNotFound={function(){
          console.log("No user logged in.");
        }}
        onError={function(data){
          console.log("ERROR");
          console.log(data);
        }}
        onCancel={function(){
          console.log("User cancelled.");
        }}
        onPermissionsMissing={function(data){
          console.log("Check permissions!");
          console.log(data);
        }}
        />
      </View>
    );
  }
}

module.exports = Login;
