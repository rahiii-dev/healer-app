<p align="center">
  <img src="src/public/images/logo.png" width="150" />
</p>

# Healer API

Healer API is the backend service for a therapy app, providing authentication, appointment scheduling, chat functionality, and payment processing.

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Docker Support](#docker-support)
- [Contributing](#contributing)
- [License](#license)

## Features
- User authentication & authorization (JWT-based)
- Therapist & patient management
- Appointment scheduling
- Real-time chat using Socket.IO
- Payment processing with Razorpay
- Cloud storage integration with Cloudinary
- API documentation using Swagger

## Installation

Clone the repository:
```sh
git clone https://github.com/rahiii-dev/healer-app.git
cd healer-app
```

Install dependencies:
```sh
npm install
```

## Environment Variables
Create a `.env` file inside the `src/` directory and configure the variables from `src/.env-example`.


## Running the Server

### Development Mode
```sh
npm run dev
```

### Production Mode
```sh
npm start
```

## API Documentation
API documentation is available using Swagger.

After running the server, open your browser and visit:
```
http://localhost:5000/api-docs
```

## Docker Support
To run the application using Docker:

1. Build the Docker image:
   ```sh
   docker build -t healer-api .
   ```
2. Run the container:
   ```sh
   docker run -p 5000:5000 healer-api
   ```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the [MIT License](LICENSE).

