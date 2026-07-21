const express = require('express');
const { Todo } = require('../mongo');
const { getAsync, setAsync } = require('../redis');
const router = express.Router();

/* GET todos listing. */
router.get('/', async (req, res) => {
  const todos = await Todo.find({});
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  });

  // Langsung await karena getAsync/setAsync sekarang jalan normal
  const currentCount = await getAsync('added_todos');
  const count = currentCount ? parseInt(currentCount) + 1 : 1;
  await setAsync('added_todos', count);

  res.send(todo);
});

/* Middleware untuk mencari Todo berdasarkan ID */
const findWithId = async (req, res, next) => {
  const { id } = req.params;
  req.todo = await Todo.findById(id);
  if (!req.todo) return res.sendStatus(404);
  next();
};

const singleRouter = express.Router();

/* DELETE todo */
singleRouter.delete('/', async (req, res) => {
  await req.todo.deleteOne();
  res.sendStatus(200);
});

/* PUT todo */
singleRouter.put('/', async (req, res) => {
  req.todo.text = req.body.text;
  req.todo.done = req.body.done;
  await req.todo.save();
  res.send(req.todo);
});

router.use('/:id', findWithId, singleRouter);

module.exports = router;
