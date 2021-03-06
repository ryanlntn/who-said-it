import { ApolloServer, gql, makeExecutableSchema } from "apollo-server"
import { augmentSchema, neo4jgraphql } from "neo4j-graphql-js"
import { v1 as neo4j } from "neo4j-driver"
import dotenv from "dotenv"
import fs from 'fs'
import path from 'path'

global.btoa = global.btoa || require("btoa")
global.fetch = global.fetch || require("node-fetch")
global.Headers = global.Headers || require("fetch-headers")

dotenv.config()

const { GRAPHQL_SCHEMA, NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD } = process.env

const typeDefs =
  fs.readFileSync(GRAPHQL_SCHEMA || path.join(__dirname, "schema.graphql"))
    .toString('utf-8')

const resolvers = {
  Query: {
    quotesByQuoteeSubstring: neo4jgraphql
  }
}

const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

// augmentSchema will add autogenerated mutations based on types in schema
const augmentedSchema = augmentSchema(schema)

const driver = neo4j.driver(
  NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.basic(NEO4J_USER || "neo4j", NEO4J_PASSWORD || "neo4j")
)

const server = new ApolloServer({
  // using augmentedSchema (executable GraphQLSchemaObject) instead of typeDefs and resolvers
  //typeDefs,
  //resolvers,
  context: { driver },
  // remove schema and uncomment typeDefs and resolvers above to use original (unaugmented) schema
  schema: augmentedSchema
})

server.listen(process.env.PORT || 4000, "0.0.0.0").then(({ url }) => {
  console.log(`GraphQL API ready at ${url}`)
})