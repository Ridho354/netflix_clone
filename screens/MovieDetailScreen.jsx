import {React, useState, useEffect} from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ImageBackground, Button } from 'react-native';
import { connectAxios } from '../lib/axios';
import YoutubePlayer from 'react-native-youtube-iframe';
import { TMDB_API_KEY } from '@env'

const MovieDetailScreen = ({ route }) => {
  const { movie } = route.params;
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  
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

  const fetchTrailer = async (movieId) => {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const data = await response.json();
      const trailer = data.results.find(
        (video) => video.type === 'Trailer' && video.site === 'YouTube'
      );
      if (trailer) {
        const youtubeUrl = `https://www.youtube.com/watch?v=${trailer.key}`;
        setTrailerUrl(youtubeUrl);
        setShowTrailer(true);
      } else {
        console.log('No trailer found');
      }
    } catch (error) {
      console.error('Error fetching trailer:', error);
    }
  };

  const getYoutubeVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);
    return match ? match[2] : null;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{movie.title}</Text>
      <Image
        style={styles.poster}
        source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
      />

      <Button 
        title="Watch Trailer" 
        onPress={() => fetchTrailer(movie.id)} 
      />
      
      {showTrailer && trailerUrl && (
        <View style={styles.trailerContainer}>
          <YoutubePlayer
            height={220}
            videoId={getYoutubeVideoId(trailerUrl)}
            play={false}
          />
        </View>
      )}

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
  trailerContainer: {
    width: '100%',
    marginVertical: 10,
  },
  imagebackgroud: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default MovieDetailScreen;
