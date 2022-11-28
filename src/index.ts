import { Request, Response, Express } from "express";
const express = require("express");
require("dotenv").config();
// Configuring our Express App
const app: Express = express();

// The Landing route
app.get("/", (req: Request, res: Response) => {
	res.send("This is my site Landing Page");
});

// Running our server on a port
app.listen(process.env.PORT || 5000, () => {
	console.log("The server is running at port ", process.env.PORT || 5000);
});
