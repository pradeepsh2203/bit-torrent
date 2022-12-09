import { Request, Response, Express } from "express";
import { LiveReloadServer } from "livereload";
const express = require("express");
const livereload: LiveReloadServer = require("livereload");
require("dotenv").config();
// Configuring our Express App
const app: Express = express();
app.set("view engine", "ejs");

// The Landing route
app.get("/", (req: Request, res: Response) => {
	res.render("template/index.ejs");
});

// Running our server on a port
app.listen(process.env.PORT || 5000, () => {
	console.log("The server is running at port ", process.env.PORT || 5000);
});
livereload.watch(__dirname + "../views");
