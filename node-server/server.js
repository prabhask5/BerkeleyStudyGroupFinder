const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const PORT = 4000;
app.use(bodyParser.json());

app.listen(PORT, (req, res) => {
    console.log(`Server started at port ${PORT}`);
});