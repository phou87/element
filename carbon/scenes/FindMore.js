import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';

import React, { Component } from 'react';
import TopNavMultiple from '../components/TopNavMultiple'
import {SCENES} from '../common/constants'

const FBSDK = require('react-native-fbsdk');
const {
  GraphRequest,
  GraphRequestManager,
} = FBSDK;

class FindMoreScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      potentialFriends: [],
    };
  }

  componentWillMount() {
    const infoRequest = new GraphRequest(
      '/me/friends?fields=name,picture',
      null,
      this._responseInfoCallback.bind(this),
    );

    new GraphRequestManager().addRequest(infoRequest).start();
  }

  _responseInfoCallback(error: ?Object, result: ?Object) {
    if (error) {
      alert('Error fetching data: ' + error.toString());
    } else {
      console.debug(result);
      this.setState({
        potentialFriends: result.data,
      });
    }
  }

  _renderPotentialFriends() {
    console.debug(this.state);
    return this.state.potentialFriends.map(friend =>
      <View key={friend.id} style={styles.friendRow}>
        <Text style={styles.friendName}>
          {friend.name}
        </Text>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TopNavMultiple
          items={[
            {id: SCENES.FOLLOWING_FRIENDS, name: 'Following'},
            {id: SCENES.FIND_FRIENDS, name: 'Find More'},
          ]}
          selected={SCENES.FIND_FRIENDS}
          onSwitchNav={(id) => this.props.onSwitchNav(id)}
        />
        {this._renderPotentialFriends()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#F5FCFF',
  },
  friendRow: {
    alignSelf: 'stretch',
    backgroundColor: '#A4D2A4',
  },
  friendName: {
    fontSize: 20,
    textAlign: 'left',
    margin: 10,
  },
});

module.exports = FindMoreScene;
