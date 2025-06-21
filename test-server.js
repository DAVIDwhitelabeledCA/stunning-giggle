const express = require('express');
const app = express();
const PORT = process.env.PORT || 5904;

app.get('/', (req, res) => {
  res.json({ 
    message: 'Server is running',
    port: PORT,
    fixes: {
      departments_page: 'Created',
      port_config: 'Fixed to 5904',
      build_config: 'Updated'
    }
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on port ${PORT}`);
});