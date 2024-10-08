const express = require('express');
const cors = require('cors');
const {Sequelize, Model, DataTypes} = require('sequelize')
const app = express();

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite'    
});

// Define User model
class User extends Model {}
User.init({
    name: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
}, { sequelize, modelName: 'user' });

// Sync models with database
sequelize.sync();

const users = [
    { name: "John Doe",  isAdmin: true },
    { name: "Jane Smith", isAdmin: true },
    { name: "Mike Johnson", isAdmin: false  },
    { name: "Sarah Williams", isAdmin: false  },
    { name: "David Brown", isAdmin: false  }
];

app.use(cors());
app.use(express.json());
app.use(express.static('react-frontend/dist'));

app.get('/', (req, res) => {
    res.json('Hello Ikea!');
});

app.get('/api/seeds', async (req, res) => {
    users.forEach(user => User.create(user));
    res.json(users);
});

app.get('/api/users', async (req, res) => {
    const users = await User.findAll();
    res.json(users);
});

app.get('/api/users/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    res.json(user);
});

app.post('/api/users', async (req, res) => {
    const user = await User.create(req.body);
    res.json(user);
});

app.put('/api/users/:id', async (req, res) => {
    const { name, isAdmin } = req.body;

    const user = await User.findByPk(req.params.id);
    await user.update({ name, isAdmin });
    await user.save();
    res.json(user);
});

app.delete('/api/users/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id);
    await user.destroy()
    res.json({ data: `The user with id of ${req.params.id} has been deleted` });
})


const port = process.env.PORT || 8080;

app.listen(port, async () => {
    console.log(`Server started at ${port}`)
});

