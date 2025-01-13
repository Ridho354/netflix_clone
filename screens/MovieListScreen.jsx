import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ScrollView, TouchableOpacity, ActivityIndicator, ImageBackground } from 'react-native';
import LottieView from 'lottie-react-native';

const TMDB_API_KEY = '291559e9606687b9953ad4441693ca0f';
const MovieHomeScreen = ({ navigation }) => {
  const [genres, setGenres] = useState([]);
  const [bannerMovie, setBannerMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [popularMoviesData, setPopularMoviesData] = useState([]);
  const queue = useRef(0);

  useEffect(() => {
    fetchGenresAndMovies();
  }, []);

  const fetchGenresAndMovies = async () => {
    try {
      const genreResponse = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
      );
      const genreData = await genreResponse.json();

      const popularMoviesResponse = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
      );
      const popularMoviesData = await popularMoviesResponse.json();
      setPopularMoviesData(popularMoviesData);
      console.log(popularMoviesData);

      setGenres(
        await Promise.all(
          genreData.genres.map(async (genre) => {
            const moviesResponse = await fetch(
              `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&with_genres=${genre.id}`
            );
            const moviesData = await moviesResponse.json();
            return { ...genre, movies: moviesData.results };
          })
        )
      );
      setBannerMovie(popularMoviesData.results[0]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const changeBannerMovie = () => {
    queue.current += 1;
    const index = queue.current % popularMoviesData.results.length;
    setBannerMovie(popularMoviesData.results[index]);
  }

  const renderGenreRow = ({ item }) => (
    <View style={styles.genreSection}>
      <Text style={styles.genreTitle}>{item.name}</Text>
      <FlatList
        horizontal
        data={item.movies}
        keyExtractor={(movie) => movie.id.toString()}
        renderItem={({ item: movie }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Movie Details', { movie : movie})}>
            <Image
              style={styles.moviePoster}
              source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
            />
          </TouchableOpacity>
        )}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
      <LottieView
        autoPlay
        style={{
          width: 200,
          height: 200,
          backgroundColor: '#ffffff00',
        }}
        source={require('../assets/NetflixAnimation.json')}
      />
      </View>
    );
  }

  return (
    <ImageBackground source={require('../assets/bg.jpg')} resizeMode="cover" style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.logoPlaceholder}>
          <Image
            style={styles.logo}
            source={require('../assets/Netflix.png')}
          />
        </View>
      <Text style={styles.HeaderTitle}>Popular Movies</Text>
      <View style={styles.header}>
      </View>
        {bannerMovie && (
          <TouchableOpacity
            style={styles.bannerContainer}
            onPress={() => changeBannerMovie()}
          >
            <Image
              style={styles.bannerImage}
              source={{ uri: `https://image.tmdb.org/t/p/w500${bannerMovie.backdrop_path}` }}
            />
            <Text style={styles.bannerTitle}>{bannerMovie.title}</Text>
          </TouchableOpacity>
        )}

        <FlatList
          data={genres}
          keyExtractor={(genre) => genre.id.toString()}
          renderItem={renderGenreRow}
          showsVerticalScrollIndicator={false}
          />
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    backgroundColor: '#00000085',
  },
  logoPlaceholder: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  HeaderTitle: {
    top: 5,
    left: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  bannerContainer: {
    marginBottom: 20,
  },
  bannerImage: {
    width: '100%',
    height: 200,
  },
  bannerTitle: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  genreSection: {
    marginBottom: 20,
  },
  genreTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginHorizontal: 10,
    marginBottom: 10,
  },
  moviePoster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  header: {
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  }
});

export default MovieHomeScreen;
