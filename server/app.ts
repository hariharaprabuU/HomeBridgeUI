import * as express from "express";
import { join } from "path";
import * as favicon from "serve-favicon";
import { json, urlencoded } from "body-parser";

import { loginRouter } from "./routes/login";
import { protectedRouter } from "./routes/protected";
import { metalRouter } from "./routes/metal";
import { homebridgeRouter } from "./routes/homebridge";
import { homebridgePluginRouter } from "./routes/homebridge-plugin";
import { npmRouter } from "./routes/npm";

const app: express.Application = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
io.on('connection', function(socket){
    socket.emit('cmd', 'hi');
});
app.disable("x-powered-by");

//app.use(favicon(join(__dirname, "./dist", "favicon.ico")));
app.use(express.static(join(__dirname, './dist')));

app.use(function(req, res, next){
  (<any>res).io = io;
  next();
});

app.use(json());
app.use(urlencoded({ extended: true }));

// api routes
app.use("/api", protectedRouter);
app.use("/login", loginRouter);
app.use("/client", express.static(join(__dirname, '../client')));
app.use("/metal", metalRouter);
app.use("/homebridge", homebridgeRouter);
app.use("/homebridgeplugin", homebridgePluginRouter);
app.use("/npm", npmRouter);

// error handlers
// development error handler
// will print stacktrace

if (app.get("env") === "development") {
    console.log("Environment:development");
    app.use(express.static(join(__dirname, '../node_modules')));

    app.use(express.static(join(__dirname, '../tools')));

    app.use(function(err, req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(err.status || 500);
        res.json({
            error: err,
            message: err.message
        });
    });
}

// catch 404 and forward to error handler
app.use(function(req: express.Request, res: express.Response, next) {
    let err = new Error("Not Found");
    next(err);
});

// production error handler
// no stacktrace leaked to user
app.use(function(err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    console.log("Request" + req.url);
    res.status(err.status || 500);
    res.json({
        error: {},
        message: err.message
    });
});

export { app, server }
