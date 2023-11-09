import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar, Alert, FlatList, Image, ImageBackground, Dimensions } from 'react-native';
import axios from 'axios';

export default class MeteorScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meteors: {},
    };
  }

  componentDidMount() {
    this.getMeteors();
  }

  getMeteors = () => {
    axios
      .get(
        'https://api.nasa.gov/neo/rest/v1/feed?&api_key=5bXVptYdKh2p7Y6KTxRxgbvL0df4X89FiMjsdh8B'
      )
      .then((response) => {
        this.setState({ meteors: response.data.near_earth_objects });
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  //Desafio 01: Construção da função renderItem, responsável por mostrar na tela, as imagens dos meteoros, de acordo com a pontuação de ameaça


  render() {
    if (Object.keys(this.state.meteors).length === 0) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text>Carregando...</Text>
        </View>
      );
    } else {
      let meteor_arr = Object.keys(this.state.meteors).map((meteor_date) => {
        return this.state.meteors[meteor_date];
      });
      console.log(meteor_arr);
      
      let meteors = [].concat.apply([], meteor_arr);
      console.log(meteors);

      meteors.forEach(function (element) {
        let diameter =
          (element.estimated_diameter.kilometers.estimated_diameter_min +
            element.estimated_diameter.kilometers.estimated_diameter_max) /
          2;
        
        let threatScore = (diameter / element.close_approach_data[0].miss_distance.kilometers) * 1000000000;
        element.threat_score = threatScore;
      });

      //Aula 93 - Classificação dos meteoros dentro do vetor "meteors" com base na pontuação de ameaça
      meteors.sort(function (a, b) {
        return b.threat_score - a.threat_score; //comparação descrescente
      });
      meteors = meteors.slice(0, 5);

      //Aula 93: E para mostrar na tela, temos 1º o View (com estilos de contêiner)
      //Aula 93: 2º o SafeAreaView (para evitar problemas de Interface de Usuário em diferentes sistemas operacionais)
      //Aula 93: 3º o FlatList para exibir os dados dos meteoros estruturados
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.androidSafeArea} />
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={meteors}
            renderItem={this.renderItem}
            horizontal={true}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  androidSafeArea: {
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});
