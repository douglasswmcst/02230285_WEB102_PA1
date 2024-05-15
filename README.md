# WEB102 CAP1
# Simple RESTful API with Node.js

This is a simple RESTful API built with Node.js that demonstrates basic CRUD operations on products and user registration/authentication. It provides endpoints to:

- Retrieve all products
- Retrieve a product by ID
- Create a new product
- Update a product by ID
- Delete a product by ID
- Retrieve all users
- Retrieve a user by username
- Create a new user
- Update a user by username
- Delete a user by username
- User registration
- User login
- Protected route example

## Installation

Clone the repository:

    git clone https://github.com/KeldenPDorji/02230285_WEB102_PA1.git

## Endpoints
Products

* GET /products: Retrieve all products
* GET /products/:id: Retrieve a product by ID
* POST /products: Create a new product
* PUT /products/:id or PATCH /products/:id: Update a product by ID
* DELETE /products/:id: Delete a product by ID

Users

* GET /users: Retrieve all users
* GET /users/:username: Retrieve a user by username
* POST /users: Create a new user
* PUT /users/:username or PATCH /users/:username: Update a user by username
* DELETE /users/:username: Delete a user by username

Authentication
* POST /register: Register a new user
    * Body: { "username": "example", "password": "password" }
* POST /login: Login a user
    * Body: { "username": "example", "password": "password" }

Protected Route
* GET /protected: Access granted to protected resource (Requires authentication)

Usage
You can use tools like Postman to test the API endpoints. Here's a basic workflow:

Register a new user:

* Send a POST request to /register with body { "username": "example", "password": "password" }

Login with the registered user:

* Send a POST request to /login with the same username and password
* Copy the received token

Use the token to access protected routes:

Send a GET request to /protected with the Authorization header:
* Key: Authorization
* Value: Bearer <token>