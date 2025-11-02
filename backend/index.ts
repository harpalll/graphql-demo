import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";

const books = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
    reviews: [
      {
        id: "rv-001",
        body: "this is a good book",
      },
    ],
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
    reviews: [],
  },
];

const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.
  # This "Book" type defines the queryable fields for every book in our data source.
  type Review {
    id: ID
    body: String
  }

  type Author {
    name: String! # Can't return null
    books: [Book!]! # This list can't be null AND its list *items* can't be null
  }

  type Book {
    title: String
    author: String
    reviews: [Review]
    isPublished: Boolean
  }
  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    numberSeven: Int! # Should always return 7
  }

  type AddBookMutationResponse{
    code: String!
    success: Boolean!
    message: String!
    book: Book
  }

  
  type Mutation {
    addBook(title: String, author: String, isPublished: Boolean): AddBookMutationResponse
  }

`;

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    numberSeven: () => 7,
  },
  Mutation: {
    addBook: (_, { title, author, isPublished }) => {
      const book = { title, author, isPublished, reviews: [] };
      books.push(book);
      return {
        code: 201,
        success: true,
        message: "book created successfully",
        book,
      };
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 3000 },
});

console.log(`🚀  Server ready at: ${url}`);
