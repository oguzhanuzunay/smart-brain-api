import express, { response } from 'express';
import bcrypt, { hash } from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import register from './controllers/register.js';
import signIn from './controllers/signIn.js';
import profile from './controllers/profile.js';
import image from './controllers/image.js';

const PORT = process.env.PORT;

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'test',
    database: 'smart-brain',
  },
});

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('success');
});

app.post('/signin', signIn.handleSignIn(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));
app.get('/profile/:id', profile.handleProfileGet(db));
app.put('/image', image.handleImage(db));
app.post('/imageurl', image.handleApıCall());

app.listen(PORT, () => {
  console.log('app is working on port 3000');
});
