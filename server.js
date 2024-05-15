const http = require('http');
const fs = require('fs');
const { parse } = require('querystring');
const crypto = require('crypto');

const PORT = 3000;
const PRODUCTS_FILE_PATH = 'products.json';
const USERS_FILE_PATH = 'users.json';
let sessionToken = ''; // Global variable to store session token

const server = http.createServer((req, res) => {
  const { method, url } = req;

  // Retrieve all products
  if (url === '/products' && method === 'GET') {
    fs.readFile(PRODUCTS_FILE_PATH, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  }

  // Retrieve a product by ID
  else if (url.startsWith('/products/') && method === 'GET') {
    const productId = url.split('/')[2];
    fs.readFile(PRODUCTS_FILE_PATH, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
        return;
      }

      const products = JSON.parse(data);
      const product = products.find(p => p.id === productId);
      if (!product) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Product not found' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(product));
    });
  }

  // Create a new product
  else if (url === '/products' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const newProduct = JSON.parse(body);
      fs.readFile(PRODUCTS_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          return;
        }

        const products = JSON.parse(data);
        newProduct.id = products.length + 1; // Using simple ID generation for demo purposes
        products.push(newProduct);
        fs.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products), err => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
          }

          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(newProduct));
        });
      });
    });
  }

  // Update a product by ID
  else if (url.startsWith('/products/') && (method === 'PUT' || method === 'PATCH')) {
    const productId = url.split('/')[2];
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const updatedProduct = JSON.parse(body);
      fs.readFile(PRODUCTS_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          return;
        }

        let products = JSON.parse(data);
        const productIndex = products.findIndex(p => p.id === productId);
        if (productIndex === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Product not found' }));
          return;
        }

        updatedProduct.id = productId;
        products[productIndex] = updatedProduct;
        fs.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products), err => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(updatedProduct));
        });
      });
    });
  }

  // Delete a product by ID
  else if (url.startsWith('/products/') && method === 'DELETE') {
    const productId = url.split('/')[2];
    fs.readFile(PRODUCTS_FILE_PATH, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
        return;
      }

      let products = JSON.parse(data);
      const productIndex = products.findIndex(p => p.id === productId);
      if (productIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Product not found' }));
        return;
      }

      products.splice(productIndex, 1);
      fs.writeFile(PRODUCTS_FILE_PATH, JSON.stringify(products), err => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          return;
        }

        res.writeHead(204);
        res.end();
      });
    });
  }

  // Retrieve all users
  else if (url === '/users' && method === 'GET') {
    fs.readFile(USERS_FILE_PATH, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    });
  }

  // Retrieve a user by username
  else if (url.startsWith('/users/') && method === 'GET') {
    const username = url.split('/')[2];
    fs.readFile(USERS_FILE_PATH, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
        return;
      }

      const users = JSON.parse(data);
      const user = users.find(u => u.username === username);
      if (!user) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User not found' }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    });
  }

  // Create a new user
  else if (url === '/users' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { username, password } = JSON.parse(body);
      fs.readFile(USERS_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          return;
        }

        const users = JSON.parse(data);
        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'User already exists' }));
          return;
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        const newUser = { username, salt, hash };
        users.push(newUser);
        fs.writeFile(USERS_FILE_PATH, JSON.stringify(users), err => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
          }

          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'User registered successfully' }));
        });
      });
    });
  }

  // Update a user by username
  else if (url.startsWith('/users/') && (method === 'PUT' || method === 'PATCH')) {
    const username = url.split('/')[2];
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const updatedUser = JSON.parse(body);
      fs.readFile(USERS_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          return;
        }

        let users = JSON.parse(data);
        const userIndex = users.findIndex(u => u.username === username);
        if (userIndex === -1) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'User not found' }));
          return;
        }

        updatedUser.username = username;
        users[userIndex] = updatedUser;
        fs.writeFile(USERS_FILE_PATH, JSON.stringify(users), err => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(updatedUser));
        });
      });
    });
  }

  // Delete a user by username
  else if (url.startsWith('/users/') && method === 'DELETE') {
    const username = url.split('/')[2];
    fs.readFile(USERS_FILE_PATH, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal Server Error' }));
        return;
      }

      let users = JSON.parse(data);
      const userIndex = users.findIndex(u => u.username === username);
      if (userIndex === -1) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'User not found' }));
        return;
      }

      users.splice(userIndex, 1);
      fs.writeFile(USERS_FILE_PATH, JSON.stringify(users), err => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          return;
        }

        res.writeHead(204);
        res.end();
      });
    });
  }

  // User Authentication

  // Register a new user
  else if (url === '/register' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { username, password } = JSON.parse(body);
      fs.readFile(USERS_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          return;
        }

        const users = JSON.parse(data);
        const existingUser = users.find(u => u.username === username);
        if (existingUser) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'User already exists' }));
          return;
        }

        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        const newUser = { username, salt, hash };
        users.push(newUser);
        fs.writeFile(USERS_FILE_PATH, JSON.stringify(users), err => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Server Error' }));
            return;
          }

          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'User registered successfully' }));
        });
      });
    });
  }

  // Login user
  else if (url === '/login' && method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const { username, password } = JSON.parse(body);
      fs.readFile(USERS_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Internal Server Error' }));
          return;
        }

        const users = JSON.parse(data);
        const user = users.find(u => u.username === username);
        if (!user || !verifyPassword(password, user.salt, user.hash)) {
          res.writeHead(401, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Invalid username or password' }));
          return;
        }

        sessionToken = crypto.randomBytes(16).toString('hex'); // Update session token
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ token: sessionToken }));
      });
    });
  }

  // Protected route example
  else if (url === '/protected' && method === 'GET') {
    const token = req.headers['authorization'];
    if (token !== sessionToken) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized, Invalid token' }));
      return;
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Access granted to protected resource' }));
  }

  // Handle invalid endpoints
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Endpoint not found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

function verifyPassword(password, salt, hash) {
  const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashedPassword;
}
