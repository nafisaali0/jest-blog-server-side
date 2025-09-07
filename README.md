# JestBlog Backend

This is the backend for the JestBlog project, built with **Node.js**, **Express.js**, and **MongoDB**. It provides REST APIs for blogs, authentication, likes, comments, and wishlist functionality.

---

## 📋 Prerequisites

- Node.js (LTS recommended)  
- MongoDB (local installation or Atlas)

---

## 📥 Installation

```bash
git clone https://github.com/your-username/jest-blog-server-side.git
cd jest-blog-server-side
npm install
```

## 🔑 Environment Variables

Create a `.env` file in the **root directory**:

```env
DB_USER = your_mongodb_connection_name
DB_PASS = your_mongodb_connection_password
```
Then, in your backend code, you can connect to MongoDB using:

```JavaScript
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nlu12w4.mongodb.net/?retryWrites=true&w=majority`;
```

## ▶️ Run the Server

Start the backend server:

```bash
npm start
# or if you use nodemon
```

## 🌐 API Base URL

- **Base URL:** [http://localhost:5000](http://localhost:5000)




