import express from 'express'
import mongoose from 'mongoose'
import path from 'path';
import session from 'express-session'
import dotenv from 'dotenv'
import auth from './routes/auth.js'
import dashboard from './routes/dashboard.js'
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express()
const port = process.env.PORT || 3000

dotenv.config({path:'./config.env'});
const dbURI = process.env.DATABASE;

await mongoose.connect(dbURI , {
  useNewUrlParser : true,
  useUnifiedTopology : true
})
.then(()=> console.log("Mongo DB connecvted successfully"))
.catch(err => console.log("Mongo DB nopoo : ",err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'special_key', // Replace with your own secret
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using https
}));

app.set('view engine', 'ejs');
app.use('/auth' , auth);
app.use('/dashboard' , dashboard);

app.get('/', (req, res) => {
    const user = req.session.user;
    res.render('home' , {user});
})
app.get('/blog', (req, res) => {
    const user = req.session.user;
    res.render('blog' , {user});
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})