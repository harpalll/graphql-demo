import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { readFileSync } from "fs";
import GraphQLJSON from "graphql-type-json";
import { randomUUID } from "crypto"; // built into Node.js 19+

type Review = {
  id: string;
  body: string;
};

type Book = {
  id: string;
  title: string;
  author: string;
  reviews: Review[];
  isPublished: boolean;
};

const books: Book[] = [
  {
    id: "1",
    title: "The Awakening",
    author: "Kate Chopin",
    reviews: [
      {
        id: "rv-001",
        body: "this is a good book",
      },
    ],
    isPublished: true,
  },
];

const typeDefs = `#graphql
  scalar JSON
  # Comments in GraphQL

  type Review {
    id: ID
    body: String
  }

  type Author {
    name: String! # Can't return null
    books: [Book!]! # This list can't be null AND its list *items* can't be null
  }

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    id: ID!
    title: String!
    author: String!
    reviews: [Review]
    isPublished: Boolean!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
    book(id: ID!): Book
  }

  type ApiResponse{
    code: String!
    success: Boolean!
    message: String!
    data: JSON
  }

  # type AddBookMutationResponse{
  #   code: String!
  #   success: Boolean!
  #   message: String!
  #   book: Book
  # }

  
  type Mutation {
    addBook(title: String, author: String, isPublished: Boolean): ApiResponse
    updateBook(id: ID, title: String, author: String, isPublished: Boolean): ApiResponse
    deleteBook(id: ID): ApiResponse
  }

`;

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    books: () => books,
    book: (_: any, { id }: { id: string }) => {
      const book = books.find((book) => book.id === id);
      return book;
    },
  },
  Mutation: {
    addBook: (
      _: any,
      {
        title,
        author,
        isPublished,
      }: { title: string; author: string; isPublished: boolean }
    ) => {
      const book: Book = {
        id: randomUUID(),
        title,
        author,
        isPublished,
        reviews: [],
      };
      books.push(book);
      return {
        code: 201,
        success: true,
        message: "book created successfully",
        data: { book },
      };
    },
    updateBook: (
      _: any,
      {
        id,
        title,
        author,
        isPublished,
      }: { id: string; title: string; author: string; isPublished: boolean }
    ) => {
      const book: Book = books.find((book) => book.id === id);
      book.title = title;
      book.author = author;
      book.isPublished = isPublished;
      return {
        code: 201,
        success: true,
        message: "book updated successfully",
        data: { book },
      };
    },
    deleteBook: (_: any, { id }: { id: string }) => {
      const index: number = books.findIndex((book) => book.id === id);
      if (index !== -1) books.splice(index, 1);
      return {
        code: 200,
        success: true,
        message: "Book deleted",
        data: { books },
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
