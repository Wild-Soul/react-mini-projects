const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    user: "root",
    password: "password",
    host: "localhost",
    database: "movies"
});

app.get('/api/register', (req, res) => {
    let reqBody = req.body;
    const user = {
        username: reqBody.username,
        password: reqBody.password
    };

    if (!user) {
        res.json({
            status: "failed",
            message: "USER DETAILS ARE NEEDED"
        });
    }

    db.query("INSERT INTO users (username, password) VALUES (?,?)", [user.username, user.password], (err, result) => {
        // create and send jwt token.
        if(!err) {
            jwt.sign({user: user}, 'secretkey', (err, token) => {
                console.log(err, token);
                res.json({
                    token
                })
            });
        } else {
            console.error("ERROR WHILE INSERTING USER: ", err);
            res.sendStatus(400);
        }
    });
});

app.get('/api/login', (req, res) => {
    let reqBody = req.body;
    if (reqBody) {
        let user =  {
            username: reqBody.username,
            password: reqBody.password
        };
        console.log("LOGGIN IN: ", user);
        db.query("SELECT * FROM users WHERE username=(?) AND password=(?)", [user.username, user.password], (err, result) => {
            if(err) {
                console.error("ERROR WHILE FETCHING USER: ", err);
                res.sendStatus(400);
            } else if( result.length > 0 ) {
                console.log(result[0]);
                user.id = result[0].id; // add user id as well so that it can be used while adding movies in favourites.
                jwt.sign({user: user}, 'secretkey', (err, token) => {
                    console.log(err, token);
                    res.json({
                        "status": "success",
                        "message": `Welcome user: ${user.username}`,
                        token
                    });
                });
            } else {
                res.sendStatus(400);
            }
        });
    } else {
        res.sendStatus(400);
    }
});

function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

app.post('/api/favourites', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            let user = authData && authData.user;
            let reqBody = req.body;
            console.log(reqBody);
            if(reqBody) {
                let movieId = reqBody.movieId;
                db.query("INSERT INTO favourites (userId, movieId) VALUES (?,?)", [user.id, movieId], (err, result) => {
                    if(err) {
                        console.log("ERROR WHILE ADDDING MOVIES TO FAVOURITES:", err);
                        res.sendStatus(400);
                    } else {
                        console.log("------db insertion ", result);
                        res.json({
                            status: "success",
                            "message": `movie added to favourites for user ${user.username}`
                        });
                    }
                });
            } else {
                res.sendStatus({
                    "status": "failed",
                    "message": "Missing body"
                });
            }
        }
    })
});

app.get('/api/favourites', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretkey', (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            let user = authData && authData.user;
            db.query("SELECT * from favourites WHERE userId=(?)", [user.id], (err, result) => {
                if(err) {
                    console.log("ERROR WHILE GETTING ALL FAVOURITES FOR :",user.id, err);
                    res.sendStatus(400);
                } else {
                    console.log(result);
                    res.json({
                        status: "success",
                        data: result
                    });
                }
            });
        }
    });
});

app.listen(4000, () => {
    console.log("Server listening on 4000");
});
