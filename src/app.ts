import express, { NextFunction,Request,Response } from "express";

const PORT = process.env.PORT || 5000;

const app  = express();

app.get("/",(req:Request,res:Response,next:NextFunction) => {
  res.json({message:"Hello world"});
})

app.listen(PORT,() => {
  console.log(`App listening on port:${PORT}`)
})