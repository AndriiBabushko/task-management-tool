process.env.NODE_ENV = 'test';

import * as chai from 'chai';
import chaiHttp from 'chai-http';
import { app } from '../app.js';
import { mongooseModel as taskModel } from '../models/task-model.js';
import { mongooseModel as userModel } from '../models/user-model.js';

chai.should();
chai.use(chaiHttp);

describe('Task App', () => {
  before(async () => {
    await taskModel.deleteMany({});
    await userModel.deleteMany({});
  });

  let token, user1ID, user2ID, task1ID, task3ID;

  it('Реєстрація користувача User1 з помилкою валідації', function (done) {
    const user1 = {
      username: 'user1',
      email: 'user1gmail.com',
      password: '12345',
    };

    chai
      .request(app)
      .post('/api/users/signup')
      .send(user1)
      .end((err, res) => {
        try {
          res.status.should.be.equal(422);
          res.body.should.be.an('object');
          res.body.should.have.property('message', 'Email seem to be wrong.');
          done();
        } catch (e) {
          done(e);
        }
      });
  });

  it('Реєстрація користувача User1 без помилок', function (done) {
    const user1 = {
      username: 'user1',
      email: 'user1@gmail.com',
      password: '12345',
    };

    chai
      .request(app)
      .post('/api/users/signup')
      .send(user1)
      .end((err, res) => {
        try {
          res.status.should.be.equal(201);
          res.body.should.be.an('object');
          res.body.should.have.property('message', 'Successfully signed up!');
          user1ID = res.body.userId;
          done();
        } catch (e) {
          done(e);
        }
      });
  });

  it('Реєстрація користувача User2 без помилок', function (done) {
    const user2 = {
      username: 'user2',
      email: 'user2@gmail.com',
      password: '12345',
    };

    chai
      .request(app)
      .post('/api/users/signup')
      .send(user2)
      .end((err, res) => {
        try {
          res.status.should.be.equal(201);
          res.body.should.be.an('object');
          res.body.should.have.property('message', 'Successfully signed up!');
          user2ID = res.body.userId;
          done();
        } catch (e) {
          done(e);
        }
      });
  });

  it('Вхід під User1 з вірними даними', function (done) {
    const user1 = {
      email: 'user1@gmail.com',
      password: '12345',
    };

    chai
      .request(app)
      .post('/api/users/login')
      .send(user1)
      .end((err, res) => {
        try {
          res.status.should.be.equal(200);
          res.body.should.be.an('object');
          res.body.should.have.property('message', 'Successfully logged in!');
          res.body.should.have.property('token');
          done();
        } catch (e) {
          done(e);
        }
      });
  });

  it('Вхід під User1 з вірними даними', function (done) {
    const user2 = {
      email: 'user1@gmail.com',
      password: '12345',
    };

    chai
      .request(app)
      .post('/api/users/login')
      .send(user2)
      .end((err, res) => {
        try {
          res.status.should.be.equal(200);
          res.body.should.be.an('object');
          res.body.should.have.property('message', 'Successfully logged in!');
          res.body.should.have.property('token');
          token = res.body.token;
          done();
        } catch (e) {
          done(e);
        }
      });
  });

  it('Додавання задачі Task1', function (done) {
    const task1 = {
      title: 'Task1',
      description: 'Task 1',
      deadlineDate: '2023-12-18',
      creator: user1ID.toString(),
      tags: ['IT', 'Team work'],
    };

    chai
      .request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(task1)
      .end((err, res) => {
        try {
          task1ID = res.body.task._id;
          res.status.should.be.equal(201);
          res.body.should.be.an('object');
          res.body.should.have.property('task');
          res.body.should.have.property('success', true);
          done();
        } catch (e) {
          done(e);
        }
      });
  });

  it('Додавання задачі Task2', function (done) {
    const task2 = {
      title: 'Task2',
      description: 'Task 2',
      deadlineDate: '2023-12-28',
      creator: user1ID.toString(),
      tags: ['IT', 'Team work'],
    };

    chai
      .request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send(task2)
      .end((err, res) => {
        try {
          res.status.should.be.equal(201);
          res.body.should.be.an('object');
          res.body.should.have.property('task');
          res.body.should.have.property('success', true);
          done();
        } catch (e) {
          done(e);
        }
      });
  });

  it('Отримання задач користувача User1', function (done) {
    chai
      .request(app)
      .get(`/api/tasks/user/${user1ID}`)
      .end((err, res) => {
        try {
          res.status.should.be.equal(201);
          res.body.should.be.an('object');
          res.body.should.be.property('tasks');
          res.body.should.be.property('success', true);
          res.body.tasks.length.should.be.eql(2);
          done();
        } catch (e) {
          done(e);
        }
      });
  });

  it('Отримуємо задачу Task1 по ідентифікатору', function (done) {
    chai
      .request(app)
      .get(`/api/tasks/${task1ID}`)
      .end((err, res) => {
        try {
          res.status.should.be.equal(201);
          res.body.should.be.an('object');
          res.body.should.have.property('task');
          res.body.should.be.property('success', true);
          done();
        } catch (e) {
          done(e);
        }
      });
  });

  it('Вхід під User2 з вірними даними', function (done) {
    const user2 = {
      email: 'user2@gmail.com',
      password: '12345',
    };

    chai
      .request(app)
      .post('/api/users/login')
      .send(user2)
      .end((err, res) => {
        try {
          res.status.should.be.equal(200);
          res.body.should.be.an('object');
          res.body.should.have.property('message', 'Successfully logged in!');
          res.body.should.have.property('token');
          token = res.body.token;
          done();
        } catch (e) {
          done(e);
        }
      });
  });

  it('Додавання задачі Task3', function (done) {
    const task3 = {
      title: 'Task3',
      description: 'Task 3',
      deadlineDate: '2023-12-08',
      creator: user2ID,
      tags: ['IT', 'Team work'],
    };

    chai
      .request(app)
      .post('/api/tasks')
      .send(task3)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        try {
          res.status.should.be.equal(201);
          res.body.should.be.an('object');
          res.body.should.have.property('task');
          res.body.should.have.property('success', true);
          task3ID = res.body.task._id;
          done();
        } catch (e) {
          done(e);
        }
      });
  });

  it('Отримання задач користувача User2', function (done) {
    chai
      .request(app)
      .get(`/api/tasks/user/${user2ID}`)
      .end((err, res) => {
        try {
          res.status.should.be.equal(201);
          res.body.should.be.an('object');
          res.body.should.be.property('tasks');
          res.body.should.be.property('success', true);
          res.body.tasks.length.should.be.eql(1);
          done();
        } catch (e) {
          done(e);
        }
      });
  });

  it('Отримуємо задачу Task1 по ідентифікатору', function (done) {
    chai
      .request(app)
      .get(`/api/tasks/${task1ID}`)
      .end((err, res) => {
        try {
          res.status.should.be.equal(201);
          res.body.should.be.an('object');
          res.body.should.have.property('task');
          res.body.should.be.property('success', true);
          done();
        } catch (e) {
          done(e);
        }
      });
  });

  it('Отримуємо задачу по не правильному ідентифікатору', function (done) {
    chai
      .request(app)
      .get(`/api/tasks/${task1ID}1`)
      .end((err, res) => {
        try {
          res.status.should.be.equal(500);
          res.body.should.be.an('object');
          res.body.should.have.property('message', 'Something went wrong while searching for some task by task ID.');
          done();
        } catch (e) {
          done(e);
        }
      });
  });

  it('Видалення Task 3 по його ідентифікатору', function (done) {
    chai
      .request(app)
      .delete(`/api/tasks/${task3ID}`)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        try {
          res.status.should.be.equal(200);
          res.body.should.be.an('object');
          res.body.should.be.property('success', true);
          done();
        } catch (e) {
          done(e);
        }
      });
  });
});
