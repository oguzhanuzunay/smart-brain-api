import express, { response } from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'test',
    database: 'smart-brain',
  },
});

const search = (tableName) => {
  db.select('*')
    .from(tableName)
    .then((r) => console.log(r))
    .catch((e) => console.log(e));
};

const app = express();
app.use(express.json());
app.use(cors());

const database = {
  users: [
    {
      id: '1234',
      name: 'oguzhan',
      email: 'oguzhanzny@gmail.com',
      password: 'jsIsAwsome',
      entries: 0,
      joined: new Date(),
    },
    {
      id: '1235',
      name: 'serhat',
      email: 'serhatslck@gmail.com',
      password: 'painting',
      entries: 0,
      joined: new Date(),
    },
  ],
};
app.get('/', (req, res) => {
  res.send(database.users);
});

app.post('/signin', (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json(database.users[0]);
  } else {
    res.status(400).json('error loging in');
  }
});

app.post('/register', (req, res) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, null, null, async function (err, hash) {
    db('users')
      .returning('*')
      .insert({
        email: email,
        name: name,
        joined: new Date(),
      })
      .then((user) => res.json(user[0]))
      .catch((err) => res.status(400).json('Unable to register'));
  });
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*')
    .from('users')
    .where({ id })
    .then((user) =>
      user.length ? res.json(user[0]) : res.status(400).json('Not Found')
    )
    .catch((err) => res.status(400).json('error getting user'));
});

app.put('/image', (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      return res.json(user.entries);
    }
  });
  if (!found) {
    res.status(404).json('not Found');
  }
});

app.listen(3000, () => {
  console.log('working now');
});
