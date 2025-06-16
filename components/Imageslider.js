import React, { useRef, useState, useEffect } from 'react';
import { View, ScrollView, Image, StyleSheet, Dimensions } from 'react-native';

const ImageSlider = ({ images }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const scrollTo = (index) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: index * Dimensions.get('window').width, animated: true });
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextIndex = (activeIndex + 1) % images.length;
      scrollTo(nextIndex);
    }, 3000);

    return () => clearInterval(intervalId);
  }, [activeIndex, images.length]);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={scrollRef}
        style={styles.sliderContainer}
      >
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.image} />
        ))}
      </ScrollView>
      {images.length > 1 && (
        <View style={styles.indicatorsContainer}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[
                styles.indicator,
                i === activeIndex && styles.activeIndicator,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  sliderContainer: {
    height: Dimensions.get('window').width * 0.5,
  },
  image: {
    width: Dimensions.get('window').width,
    height: '100%',
    resizeMode: 'cover',
  },
  indicatorsContainer: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  indicator: {
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
    margin: 5,
    borderRadius: 5,
    width: 10,
    height: 10,
  },
  activeIndicator: {
    backgroundColor: 'white',
  },
});

export default ImageSlider;
