# joShop Backend

Backend REST API for the **joShop Multi-Vendor E-Commerce Platform**.

## Features

- User Authentication (JWT)
- Password Hashing
- Vendor Registration Requests
- Product Management
- Store Management
- Admin Dashboard APIs
- Image Upload using Cloudinary
- MongoDB Database Integration

## Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- JWT Authentication
- Cloudinary
- Render

## Frontend Repository

https://github.com/suleman500/frontend_joShop

## Installation

Clone the repository

```bash
git clone https://github.com/suleman500/backend_joShop.git
```

Install dependencies

```bash
npm install
```

Create a `.env` file with the following variables:

```env
MONGO_URL=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Run the server

```bash
npm start
```

## API

The backend exposes RESTful APIs for:

- Authentication
- Users
- Products
- Stores
- Vendor Requests
- Admin Dashboard

