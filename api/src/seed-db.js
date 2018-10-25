import ApolloClient from "apollo-client"
import gql from "graphql-tag"
import dotenv from "dotenv"
import fetch from "node-fetch"
import { HttpLink } from "apollo-link-http"
import { InMemoryCache } from "apollo-cache-inmemory"

dotenv.config()

const { GRAPHQL_URI } = process.env

const seedMutations = `mutation {
  player1: CreatePlayer(name: "ryan", avatar: "https://emojis.slackmojis.com/emojis/images/1525182573/3840/gopherlift.gif?1525182573") {
    name
  }
  quote1: CreateQuote(text: "You miss 100% of the shots you don't take. ~ Wayne Gretzky", quotee: "Michael Scott") {
    text
    quotee
  }
}`

const client = new ApolloClient({
  link: new HttpLink({ uri: GRAPHQL_URI, fetch }),
  cache: new InMemoryCache()
})

client
  .mutate({
    mutation: gql(seedMutations)
  })
  .then(data => console.log(data))
  .catch(error => console.error(error))
