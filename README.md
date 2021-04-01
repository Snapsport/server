# SnapSport TypeScript Node / Express Server

### Description
The server which handles authentication, session creation & management for SnapSport. Written in Node.js, Express.js & TypeScript

#### What you need to run this code
1. Node (14.15.4)
2. NPM (7.5.2)
3. MongoDB (4.2.8)

####  How to run this code
1. Make sure MongoDB is running on your system or create an account at https://www.mongodb.com/atlas-signup-from-mlab
2. Clone this repository.
3. Run ```cp example.env .env``` and fill in your Mongo URI to the newely created .env file.
4. Grab a generated JWT token from <a href="https://jwt.io/">Here</a> under `Encoded` and fill it in after `JWT_SECRET` in the newely created `.env` file.
5. Open command line in the cloned folder,
   - To install dependencies, run ```  npm install  ```
   - To run the application in development, run ```  npm run dev  ```
   - To build the application, run ```  npm run build  ```
6. Open [localhost:3000](http://localhost:3000/) in the browser
---- 
