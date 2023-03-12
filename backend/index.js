import express from "express";

const app = express()
const PORT =  process.env.PORT || 5000 ;

app.get("/", (req, res, next) => {
  res.json({ message: "hello welcome to bug tracking api backend"})
});

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});