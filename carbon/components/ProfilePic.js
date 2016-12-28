import React, { Component } from 'react';
import {
  Image,
  TouchableOpacity,
} from 'react-native';

import {FacebookURI} from '../common/FacebookURI';

class ProfilePic extends Component {
  render() {
    let uri = new FacebookURI(this.props.accessToken, this.props.id + '/picture');
    
    return (
      <TouchableOpacity onPress={this.props.onClick}>
        <Image
          source={{uri: uri.getURI()}}
          style={{width: this.props.width, height: this.props.height}}
        />
      </TouchableOpacity>
    );
  }
}

module.exports = ProfilePic;
