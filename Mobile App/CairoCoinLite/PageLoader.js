import React from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';

export default class PageLoader extends React.Component {
  constructor(props) {
    super(props);
    this.animatedValues = Array.from({ length: 5 }, () => new Animated.Value(0));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.progress !== this.props.progress) {
      this.animate();
    }
  }

  animate() {
    const { progress } = this.props;
    const dotCount = Math.ceil(progress / 19.5); // Each dot represents 20% progress

    Animated.parallel(
      this.animatedValues.map((animatedValue, index) =>
        Animated.timing(animatedValue, {
          toValue: index < dotCount ? 1.2 : 1,
          duration: 500, // Duration for smooth scaling
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        })
      )
    ).start();
  }

  render() {
    const pulseStyles = this.animatedValues.map((animatedValue) => ({
      ...styles.dot,
      transform: [{ scale: animatedValue }],
      backgroundColor: animatedValue.interpolate({
        inputRange: [1, 1.2],
        outputRange: ['#ffffff30', '#ffffff80'],
      }),
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
  },
});
