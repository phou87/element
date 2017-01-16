import React, { Component } from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';

import {Button, Container, Content, Footer, FooterTab, Header, Icon, Title} from 'native-base';

class MainViewFrame extends Component {
  render() {
    return (
      <Container>
        <Header>
          <Button transparent>
            <Icon name='ios-arrow-back' />
          </Button>
          <Title>Sharefolio</Title>
          <Button transparent>
            <Icon name='ios-menu' />
          </Button>
        </Header>
        <Content>
          <StatusBar />
          <View style={styles.content}>
            {this.props.children}
          </View>
        </Content>
        <Footer>
          <FooterTab>
            <Button>
              Apps
              <Icon name='ios-apps-outline' />
            </Button>
            <Button>
              Camera
              <Icon name='ios-camera-outline' />
            </Button>
            <Button active>
              Navigate
              <Icon name='ios-compass' />
            </Button>
            <Button>
              Contact
              <Icon name='ios-contact-outline' />
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
  },
});

export {
  MainViewFrame,
};
