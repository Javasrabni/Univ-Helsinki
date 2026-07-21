const express = require('express');
const router = express.Router();

const configs = require('../util/config');
const { get } = require('../redis');

let visits = 0;

/* GET index data. */
router.get('/', async (req, res) => {
  visits++;

  res.send({
    ...configs,
    visits
  });
});

/* GET statistics data. */
router.get('/statistics', async (req, res) => {
  const addedTodos = await get('added_todos');

  res.send({
    added_todos: addedTodos ? parseInt(addedTodos, 10) : 0
  });
});

module.exports = router;
