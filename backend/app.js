const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const db = require('./src/database/db'); // Updated file path for db.js

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//Routes
app.use('/users', require('./src/routes/usersRoutes')); // Updated file path for userRoutes
// app.use('/api/items', require('./src/routes/itemRoutes')); // Updated file path for itemRoutes
// app.use('/api/reviews', require('./src/routes/reviewRoutes')); // Updated file path for reviewRoutes
// app.use('/api/transactions', require('./src/routes/transactionRoutes')); // Updated file path for transactionRoutes
// app.use('/api/negotiations', require('./src/routes/negotiationRoutes')); // Updated file path for negotiationRoutes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Start the server
const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
