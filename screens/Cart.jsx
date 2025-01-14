import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, ActivityIndicator, RefreshControl, Button, ImageBackground } from 'react-native';
import {connectAxios} from '../lib/axios';
import midtransClient from 'midtrans-client';

const Cart = () => {
  const [movies, setMovies] = useState([]);
  const [empty, setEmpty] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);

  const snap = new midtransClient.Snap({
    isProduction : false,
    serverKey : ''
  });

  const dataCheckout = {
    "transaction_details": {
      "order_id": "test-movieApp-1234567",
      "gross_amount": totalPrice
    },
  };

  const Checkout = () => {
    const totalPrice = movies.reduce((total, item) => total + item.price * item.quantity, 0);
    setTotalPrice(totalPrice);
    console.log("Checkout Rp " + totalPrice);
    snap.createTransaction(dataCheckout).then((transaction)=>{
      const transactionToken = transaction.token;
      console.log('transactionToken:',transactionToken);
      console.log('https://app.sandbox.midtrans.com/snap/v2/vtweb/'+transactionToken);
    })
  }

  const coreApi = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: '',
    clientKey: ''
});

  const checkTransactionStatus = async()  => {
    console.log('Checking transaction status...');
    try {
        const transactionStatus = await coreApi.transaction.status('test-movieApp-1234567');
        console.log('Transaction status:', transactionStatus.transaction_status);
    } catch (error) {
        console.error('Error checking transaction:', error);
        return {
            success: false,
            message: error.message,
            data: null
        };
    }
  };
  
  const fetchMovies = async () => {
    console.log("Fetching movies...");
    try {
      const axiosInstance = await connectAxios();
      const response = await axiosInstance.get('/cart');
      const data = response.data;
      setMovies(data);
      console.log(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }

    if (movies.length > 0) {
      setEmpty(false);
      console.log("Show cart");
    }
    console.log(movies.length);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMovies();
    setRefreshing(false);
  };
  
  useEffect(() => {
    fetchMovies();
    onRefresh();
  }, []);
  
  const handleDelete = async (id) => {
    try {
      const axiosInstance = await connectAxios();
      await axiosInstance.delete(`/cart/${id}`);
      console.log("Movie deleted successfully");
      fetchMovies();
    } catch (error) {
      console.error('Error deleting movie:', error);
    }
  };

  const renderMovie = ({ item }) => (
    <View>
    <View style={styles.movieItem}>
      <Image
        style={styles.movieImage}
        source={{ uri: `https://image.tmdb.org/t/p/w500${item.moviePoster}` }}
        />
      <View style={styles.movieDetails}>
        <Text style={styles.movieTitle}>{item.movieTitle}</Text>
        <Text style={styles.movieOverview} numberOfLines={2}>
          {item.movieOverview}
        </Text>
        <Text style={styles.moviePrice}>Rp {item.price} x {item.quantity}</Text>
        <Text style={styles.movieTotal}>Rp {item.price * item.quantity}</Text>
      </View>
    </View>
    <Button title="Delete" style={styles.deleteButton} onPress={() => {
      handleDelete(item.id);
    }} />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading Cart...</Text>
      </View>
    );
  }

  const renderEmpty = () => {
    return(
      <ImageBackground source={require('../assets/bg.jpg')} resizeMode="cover" style={styles.imagebackgroud}>
        <View style={styles.logoPlaceholder}>
          <Image
            style={styles.logo}
            source={require('../assets/Netflix.png')}
          />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Keranjang Anda Kosong</Text>
        </View>
      </ImageBackground>
    )
  }

  if (empty) {
    return (
      <FlatList
      renderItem={renderEmpty}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        />
          
    );
  } else{

  return (
    <ImageBackground source={require('../assets/bg.jpg')} resizeMode="cover" style={styles.imagebackgroud}> 
    <View style={styles.container}>
      <View style={styles.logoPlaceholder}>
          <Image
            style={styles.logo}
            source={require('../assets/Netflix.png')}
          />
        </View>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderMovie}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        />
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonCheckout} onPress={Checkout}>Checkout Rp {movies.reduce((total, item) => total + item.price * item.quantity, 0)}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonCheck} onPress={checkTransactionStatus}>Check Status</Text>
      </View>
    </View>
        </ImageBackground>
  );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00090',
  },
  imagebackgroud: {
    flex: 1,
    justifyContent: 'left',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00080',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoPlaceholder: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 50,
    resizeMode: 'contain',
  },
  listContainer: {
    padding: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  movieItem: {
    flexDirection: 'row',
    marginTop: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
  },
  movieImage: {
    width: 100,
    height: 150,
  },
  movieDetails: {
    flex: 1,
    padding: 10,
  },
  moviePrice: {
    flex: 1,
    paddingTop: 10,
  },
  movieTotal: {
    flex: 1,
    textAlign: 'right',
    color: '#007bff',
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  movieOverview: {
    fontSize: 14,
    color: '#666',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  buttonContainer: {
    backgroundColor: '#007bff',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    margin: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    margin: 10,
  },
  buttonCheckout: {
    alignItems: 'center',
    padding: 3,
    color: '#fff',
  },
  buttonCheck: {
    alignItems: 'center',
    padding: 3,
    color: '#fff',
  },
});

export default Cart;
