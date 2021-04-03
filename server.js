import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';

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
    database.users.push({
      id: '1236',
      name: name,
      email: email,
      password: hash,
      entries: 0,
      joined: new Date(),
    });
    res.json(database.users[database.users.length - 1]);
  });
});

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  database.users.forEach((user) => {
    user.id === id ? res.json(user) : res.status(404).json('no such user');
  });
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
