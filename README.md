# Sumary
This is just a simple starter app that uses primsa with postgresql as the ORM replacement. It uses graphql in the backend and react.js for the front end.

## Prerequisites
1. docker with docker-compose for the dev enviornment
2. node 8+

## Development server
1. Start the database server
   ```
   npm run db:start
   ```
2. Run database migrations
   ```
   npm run db:migrate
   ```
2. Seed the database
   ```
   npm run db:seed
   ```
2. Reset the database with seed
   ```
   npm run db:reset
   ```
3. Start node server
   ```
   npm run server:start
   ```
4. Start the client
   ```
   npm run client:start
   ```
5. Navigate to http://localhost:8080

