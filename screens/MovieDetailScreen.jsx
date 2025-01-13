import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ImageBackground, Button } from 'react-native';
import { connectAxios } from '../lib/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MovieDetailScreen = ({ route }) => {
  const { movie } = route.params;
  
  const handleAddToCart = async() => {
    const axiosInstance = await connectAxios();
    
    try {
        const cartResponse = await axiosInstance.get('/cart');
        const cartMovies = cartResponse.data;
        const existingMovie = cartMovies.find((cartMovie) => cartMovie.movieId === movie.id);

        if (existingMovie) {
            await axiosInstance.put(`/cart/${existingMovie.id}`, {
                ...existingMovie,
                quantity: existingMovie.quantity + 1,
            });
            alert('Movie quantity updated in cart');
        } else {
            await axiosInstance.post('/cart', {
                movieId: movie.id,
                moviePoster: movie.poster_path,
                movieTitle: movie.title,
                movieOverview: movie.overview,
                quantity: 1,
                price: 20000
            });
            alert('Movie added to cart successfully');
        }
    } catch (error) {
        console.error(error);
        alert('Failed to add movie to cart');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        style={styles.poster}
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
      />
      <Text style={styles.title}>{movie.title}</Text>
      <Text style={styles.subtitle}>Release Date: {movie.release_date}</Text>
      <Text style={styles.subtitle}>Rating: {movie.vote_average} / 10</Text>
      <Text style={styles.subtitle}>Popularity: {movie.popularity}</Text>
      <Text style={styles.overview}>{movie.overview}</Text>
      <Button title="Add to Cart" onPress={handleAddToCart} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#000',
  },
  poster: {
    width: '100%',
    height: 500,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 5,
    color: '#fff',
  },
  overview: {
    fontSize: 14,
    marginTop: 10,
    color: '#fff',
    marginBottom: 20,
  },
});

export default MovieDetailScreen;
