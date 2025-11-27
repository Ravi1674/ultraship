const { gql } = require("apollo-server-express");

module.exports = gql`
  enum Role {
    ADMIN
    EMPLOYEE
  }

  type Employee {
    id: ID!
    name: String!
    age: Int
    class: String
    subjects: [String!]
    attendance: Float
    flagged: Boolean
  }

  input EmployeeFilter {
    nameContains: String
    minAge: Int
    maxAge: Int
    classEquals: String
    flagged: Boolean
  }

  input EmployeeInput {
    name: String!
    age: Int
    class: String
    subjects: [String!]
    attendance: Float
    flagged: Boolean
  }

  type EmployeePage {
    items: [Employee!]!
    total: Int!
    page: Int!
    pageSize: Int!
  }

  type Query {
    listEmployees(
      filter: EmployeeFilter
      page: Int = 1
      pageSize: Int = 10
      sortBy: String = "name"
      sortDir: String = "asc"
    ): EmployeePage!
    getEmployee(id: ID!): Employee
    me: String
  }

  type Mutation {
    addEmployee(input: EmployeeInput!): Employee!
    updateEmployee(id: ID!, input: EmployeeInput!): Employee!
    deleteEmployee(id: ID!): Boolean!
    login(username: String!, password: String!): String! # returns JWT
  }
`;
