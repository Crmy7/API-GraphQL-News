const { gql } = require("apollo-server-express");

const typeDefs = gql`
  scalar Date

  type Post {
    id: ID!
    title: String!
    content: String!
    author: String!
    createdAt: Date!
    comments: [Comment]
  }

  type Comment {
    id: ID!
    content: String!
    author: String!
    postId: ID!
    createdAt: Date!
  }

  type Query {
    posts(orderBy: String, order: String): [Post!]!
    post(id: ID!): Post
  }

  type Mutation {
    createPost(title: String!, content: String!, author: String!): Post!
    addComment(postId: ID!, content: String!, author: String!): Comment!
    deletePost(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;
