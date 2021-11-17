const express = require('express');
const app = express();
const PORT = process.env.PORT || 2021;
app.listen(PORT,
  console.log("Clientele on port:", PORT),
  console.log("Local: http://localhost:"+PORT)
)