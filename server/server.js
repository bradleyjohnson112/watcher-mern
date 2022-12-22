const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

const app = require('./app');
const port = process.env.PORT || '5000';
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true })
.then(() => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  })
})
.catch(err => console.log(err));