import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import ApolloClient from "apollo-boost";
import { ApolloProvider, graphql } from "react-apollo";
import gql from "graphql-tag"

const client = new ApolloClient({
  uri: "http://localhost:4000/"
});

@graphql(gql`
  query quotes {
    Quote {
      text
    }
  }
`)
class Quote extends Component {
  render() {
    const { data: { Quote }} = this.props
    return (
      <View>
        {Quote && Quote.map(quote =>
          <Text style={styles.welcome}>{quote.text}</Text>
        )}
      </View>
    )
  }
}

export default class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <View style={styles.container}>
          <Quote />
        </View>
      </ApolloProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: 'black',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
