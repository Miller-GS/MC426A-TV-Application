import express, { Router } from "express";

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get(
    "/hello-world",
    (req, res) => {
        res.send('Hello00o, World!');
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
  });