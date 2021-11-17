const { app } = require('./app');
const userRouter = require('./routes/user');

const PORT = process.env.PORT || 8080;

app.use('/', userRouter);

app.listen(PORT, () => {
  console.log(`Q&A API is listening on port ${PORT}`);
});
