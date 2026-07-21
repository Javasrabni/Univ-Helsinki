const express = require('express');
const router = express.Router();
const { getAsync } = require('../redis');

router.get('/statistics', async (req, res) => {
  try {
    const addedTodos = await getAsync('added_todos');
    res.send({
      added_todos: addedTodos ? parseInt(addedTodos) : 0
    });
  } catch (error) {
    res.send({ added_todos: 0 });
  }
});

module.exports = router;
