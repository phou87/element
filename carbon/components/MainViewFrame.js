import React, { Component } from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';

import {Button, Container, Content, Footer, FooterTab, Header, Icon, Title} from 'native-base';

import {Settings} from '../scenes';
import {SCENES} from '../common/constants';

class MainViewFrame extends Component {
  constructor(props) {
    super(props);
    this.state = {
      settingsOpened: false,
    };
    
    this.onCloseMenu = this.onCloseMenu.bind(this);
    this.onOpenMenu = this.onOpenMenu.bind(this);
    this.onSwitchFindFriends = this.props.onSwitchNav.bind(this, SCENES.FIND_FRIENDS);
    this.onSwitchFriends = this.props.onSwitchNav.bind(this, SCENES.FOLLOWING_FRIENDS);
    this.onSwitchPortfolio = this.props.onSwitchNav.bind(this, SCENES.PORTFOLIO);
    this.onSwitchBuySell = this.props.onSwitchNav.bind(this, SCENES.BUY_SELL);
  }

  onCloseMenu() {
    this.setState({settingsOpened: false});
  }
  
  onOpenMenu() {
    this.setState({settingsOpened: true});
  }
  
  renderSettings() {
    return <Settings />;
  }

  render() {
    let children = this.state.settingsOpened ? this.renderSettings() : this.props.children;

    return (
      <Container>
        <Header>
          <Button transparent>
            <Icon name='ios-arrow-back' onPress={this.onCloseMenu} />
          </Button>
          <Title>{this.props.title}</Title>
          <Button onPress={this.onOpenMenu} transparent>
            <Icon name='ios-menu' />
          </Button>
        </Header>
        <Content style={styles.content}>
          <StatusBar />
          {children}
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
});

export {
  MainViewFrame,
};
