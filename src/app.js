const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const { port } = require('./config/env.config');
const { errorHandler, notFoundHandler } = require('./middlewares/error.middleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static folder for file upload
app.use('/public/uploads', express.static(path.join(__dirname, '../public/uploads')));

// Root Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Blog API' });
});

// Routes
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
