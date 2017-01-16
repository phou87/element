import React, { Component } from 'react';
import {
  View
} from 'react-native';

const {FBLogin, FBLoginManager} = require('react-native-facebook-login');

class Login extends Component {
  constructor(props) {
    super(props);
    
    this.logStuff = this.logStuff.bind(this);
  }
  
  logStuff() {
    console.debug('hi');
  }

  render() {
    return (
      <View>
        <FBLogin
          style={this.props.style}
          permissions={["user_friends"]}
          onLogin={this.props.onLogin}
          onLoginFound={this.props.onLogin}
          onLogout={this.logStuff}
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
