const express = require('express');
const app = express();
const PORT = 500;
 
app.get('/', (req, res) => {
  res.send('Hello, Express server running on port 500!');
});
 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
 