
# Employee GraphQL Backend

## Overview
Node.js + Express + Apollo Server GraphQL backend for Employee POC.
Features:
- GraphQL schema with queries & mutations
- Pagination, sorting, filtering
- JWT-based authentication with role-based access (ADMIN, EMPLOYEE)
- Simple file-based persistence (data/employees.json) for demo

## Run
1. cd backend
2. npm install
3. copy .env.example to .env and adjust JWT_SECRET
4. npm run start

Default GraphQL endpoint: http://localhost:4000/graphql

Demo users:
- admin / adminpass  (role ADMIN)
- employee / employeepass (role EMPLOYEE)
