const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

var jwt = require('jsonwebtoken');


const app = express();

// middleware
app.use(cors());
app.use(express.json());


const verifyjwt = (req, res, next) => {
    const authorHeader = req.headers.authorization
    if (!authorHeader) {
        return res.status(401).send({ message: "unothorized" })
    }
    const authToken = authorHeader.split(' ')[1]

    jwt.verify(authToken, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            res.status(403).send({ message: 'forbidden' })
        }
        req.decoded = decoded
        next()
    });


}

app.get('/', (req, res) => {
    res.send('Hello from simple JWT Server')
});


app.post('/login', (req, res) => {
    const user = req.body
    if (user.password === '123456') {

        const accesToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN, { expiresIn: '2h' })

        res.send({
            success: true,
            accesToken: accesToken
        })
    } else {

        res.send({
            success: false,

        })
    }
})

app.get('/orders', verifyjwt, (req, res) => {

    res.send([{ id: 1, item: "first" }, { id: 2, item: "second" }])
})




app.listen(port, () => {
    console.log('Listening to port', port);
})
