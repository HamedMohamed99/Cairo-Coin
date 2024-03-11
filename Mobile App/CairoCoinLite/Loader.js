import React from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';

export default class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.animatedValues = Array.from({ length: 5 }, () => new Animated.Value(0));
  }

  componentDidMount() {
    this.animate();
  }

  animate() {
    const animations = this.animatedValues.map((animatedValue) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      )
    );
  
    const staggeredAnimations = Animated.stagger(200, animations); // Adjust the stagger delay
  
    Animated.loop(staggeredAnimations).start();
  }

  render() {
    const pulseStyles = this.animatedValues.map((animatedValue) => ({
      ...styles.dot,
      transform: [{ scale: animatedValue.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.8, 1.2, 0.8] }) }],
    }));

    return (
      <View style={styles.dotsContainer}>
        {this.animatedValues.map((_, index) => (
          <Animated.View key={index} style={[pulseStyles[index], index === 4 ? { marginRight: 0 } : { marginRight: 10 }]} />
        ))}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    height: 20,
    width: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff30',
  },
});
