import React, { Component } from 'react';
import {Animated, Dimensions, PanResponder} from 'react-native';

const deviceScreen = Dimensions.get('window');

const SwipeableComponent = El => class extends Component {
  constructor(props) {
    super(props);
		this.state = {
			offset: new Animated.ValueXY(),
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
			onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetResponderCapture: () => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderGrant: () => null,
      onPanResponderMove: (e, gestureState) => {
        Animated.event([null, {dx: this.state.offset.x, dy: this.state.offset.y}])(e, gestureState);
			},
      onPanResponderRelease: (e, gestureState) => {
        console.debug(gestureState, deviceScreen.width / 2);
        if (gestureState.dx > deviceScreen.width / 3) {
          Animated.decay(this.state.offset, {
            velocity: {x: 3, y: gestureState.vy},
            deceleration: 0.98,
          }).start();
        } else {
          Animated.spring(this.state.offset, {
            toValue: {x: 0, y: 0},
          }).start();
        }
      },
    });
  }

  onStartSwipe() {
    Animated.spring(this.state.offset, {
      toValue: deviceScreen.width,
      friction: 7,
    }).start();
  }

  getStyles() {
		let {offset} = this.state;

		return {
      transform: [
        {translateX: offset.x},
        {translateY: offset.y},
      ],
    };
  }

  render() {
    return (
      <Animated.View {...this._panResponder.panHandlers} style={this.getStyles()}>
        <El {...this.props} />
      </Animated.View>
    );
  }
}

export {
  SwipeableComponent,
};
