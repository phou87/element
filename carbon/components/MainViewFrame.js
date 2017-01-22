import React, { Component } from 'react';
import {Animated, Dimensions, StatusBar, StyleSheet, View} from 'react-native';

import {Button, Container, Content, Footer, FooterTab, Header, Icon, Title} from 'native-base';

import {Settings} from '../scenes';
import {SCENES} from '../common/constants';

import mytheme from '../common/mytheme';

const deviceScreen = Dimensions.get('window');

class MainViewFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settingsHidden: false,
      settingsOffset: new Animated.Value(deviceScreen.width),
      settingsOpened: false,
    };
    
    this.onToggleMenu = this.onToggleMenu.bind(this);
    this.onSwitchFindFriends = this.onSwitchNav.bind(this, SCENES.FIND_FRIENDS);
    this.onSwitchFriends = this.onSwitchNav.bind(this, SCENES.FOLLOWING_FRIENDS);
    this.onSwitchPortfolio = this.onSwitchNav.bind(this, SCENES.PORTFOLIO);
    this.onSwitchBuySell = this.onSwitchNav.bind(this, SCENES.BUY_SELL);
  }

  onToggleMenu() {
    Animated.spring(this.state.settingsOffset, {
      toValue: this.state.settingsOpened ? deviceScreen.width : 0,
      friction: 7,
    }).start();
    this.setState({settingsHidden: false, settingsOpened: !this.state.settingsOpened});
  }
  
  onSwitchNav(scene) {
    this.setState({
      settingsHidden: true,
      settingsOffset: new Animated.Value(deviceScreen.width),
      settingsOpened: false,
    });
    this.props.onSwitchNav(scene);
  }
  
  renderSettings() {
    if (this.state.settingsHidden) {
      return null;
    }
  
    let transformStyle = {
      transform: [
        {translateX: this.state.settingsOffset},
      ],
    };
  
    return (
      <Animated.View style={[styles.settingsContainer, transformStyle]}>
        <Settings onLogout={this.props.onLogout} />
      </Animated.View>
    );
  }

  render() {
    return (
      <Container theme={mytheme}>
        <Header iconRight>
          <Title>{this.props.title}</Title>
          <Button onPress={this.onToggleMenu} transparent>
            <Icon name='ios-menu' />
          </Button>
        </Header>
        <Content style={styles.content}>
          <StatusBar />
          {this.props.children}
          {this.renderSettings()}
        </Content>
        <Footer>
          <FooterTab>
            <Button active={this.props.scene === SCENES.FIND_FRIENDS} onPress={this.onSwitchFindFriends}>
              Find More
              <Icon name='ios-person-add' />
            </Button>
            <Button active={this.props.scene === SCENES.FOLLOWING_FRIENDS} onPress={this.onSwitchFriends}>
              Following
              <Icon name='ios-body' />
            </Button>
            <Button active={this.props.scene === SCENES.PORTFOLIO} onPress={this.onSwitchPortfolio}>
              Portfolio
              <Icon name='ios-trending-up' />
            </Button>
            <Button active={this.props.scene === SCENES.BUY_SELL} onPress={this.onSwitchBuySell}>
              Trade
              <Icon name='logo-usd' />
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#F8F9F9',
    flex: 1,
  },
  drawerContainer: {
    flex: 1,
  },
  settingsContainer: {
    backgroundColor: '#F8F9F9',
    height: deviceScreen.height,
    position: 'absolute',
    width: deviceScreen.width,
  },
});

export {
  MainViewFrame,
};
