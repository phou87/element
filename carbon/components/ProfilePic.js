import React, { Component } from 'react';
import {
  Image,
} from 'react-native';

class ProfilePic extends Component {
  render() {
    const source = 'https://graph.facebook.com/v2.7/' +
      this.props.id +
      '/picture?access_token=' +
      this.props.accessToken;
		console.debug(source);
    return (
      <Image
        source={{uri: source}}
        style={{width: this.props.width, height: this.props.height}}
      />
    );
  }
}

module.exports = ProfilePic;
