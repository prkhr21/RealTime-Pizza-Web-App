require('dotenv').config()
const express  = require('express')
const app = express()
const ejs = require('ejs')
const expressLayout = require('express-ejs-layouts')
const path = require('path')
const PORT = process.env.PORT || 3300
const mongoose = require('mongoose')
const MongoDbStore = require('connect-mongo')
const session = require('express-session')
const flash = require('express-flash')
const passport = require('passport')
const Emitter = require('events')

// Database connection
const url = 'mongodb://localhost/realtime_pizza';
mongoose.connect(url, {
    useNewUrlParser: true,
    // useCreateIndex: true,
    useUnifiedTopology: true
    // useFindAndModify: true
});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database Connected...');
})
.on('error', (err) => {
    console.log('connection failed...');
})

// Assets
app.use(express.static('public'))
app.use(flash())
app.use(express.urlencoded({extended: false}))
app.use(express.json())

// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter',eventEmitter)

// Session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: MongoDbStore.create({
        mongoUrl: url
    }),
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 60 * 24} // 24 hours
}))


// Passport config
const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

// global middleware
app.use((req, res, next) =>{
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})



// set template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)

const server = app.listen(PORT, () => {
    console.log(`listning on port ${PORT}`)
})

// Socket
const io = require('socket.io')(server)
io.on('connection', () => {
    
})