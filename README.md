# Store Backend API
This repository contains the source code for a simple online store backend, built with Node.js and Express. The API provides endpoints for user authentication, user management, shopping cart, customers, and products.

<p align="left">
 <a href="#technologies">Technologies</a> • 
 <a href="#how-to-use">Getting Started</a> • 
 <a href="#contributing">Contributing</a> •
 <a href="#license">License</a>
</p>

# <a name="technologies"></a>🚀 Technologies
This project was developed with the following technologies:

![Node.js](https://img.shields.io/badge/Node.Js-6AA35E?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-ffffff?style=for-the-badge&logo=express&logoColor=black)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
![SQLite](https://img.shields.io/badge/Sqlite-3495CF?style=for-the-badge&logo=sqlite&logoColor=white)


# <a name="how-to-use"></a>ℹ️ Getting Started
To clone and run this application, you'll need:
* Git
* Node.js v18 or higher installed on your computer.

## Installation
### Clone the repository

(It is recommended to clone the [front-end](https://github.com/ramoncibas/store) repository as well)
```
$ git clone https://github.com/ramoncibas/store-backend
$ cd store
```

### Install NPM packages
Before running the server, make sure to install the necessary dependencies. Run the following command:
```bash
$ npm install
```

### Starting the server
```bash
$ npm run dev     #The server will start on port 5000 by default.
```

### Swagger
This backend includes API documentation using Swagger. After starting the server, you can access the documentation at:
http://localhost:5000/docs/

### Project Structure
The source code is organized into separate modules for better clarity and maintainability. Key modules include:

| Key Modules  | Description |
| ------------- | ------------- |
| **Auth**  | Functions related to authentication  |
| **User**  | User management  |
| **Cart**  | Shopping cart operations  |
| **Customer**  | Customer information |
| **Product**  | Product management  | 

Each module has its own routes defined in their respective files.

### Tests
To run the application tests, it is necessary for the server to be running, as there are various tests that simulate a user's request, going through the entire server flow.
```bash
$ npm run dev     #The server will start on port 5000 by default.
```
Next, execute the following command:
```bash
$ npm run test     #The test suite will be executed.
```

# <a name="contributing"></a>🤝 Contributing 
This project is for study purposes too, so send me an email telling me what you are doing and why you are doing it, teach me what you know

All kinds of contributions are very welcome and appreciated!

* ⭐️ Star the project
* 🐛 Find and report issues
* 📥 Submit PRs to help solve issues or add features
* ✋ Give me suggestions for new features
And make sure to read the Contributing Guide before making a pull request.

# <a name="license"></a>📝 License
This project is under the MIT license. See the [MIT](./LICENSE). for more information.

Made with ♥ by Ramon Cibas 👋 [Get in touch](https://www.linkedin.com/in/ramoncibas/)!
