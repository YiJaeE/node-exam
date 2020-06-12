const http = require('http');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const mainRouter = require('./router/mainRouter');
const userRouter = require('./router/userRouter');

const db = require('./model/db');

class AppServer extends http.Server {
  constructor(config) {
    const app = express();
    super(app);
    this.config = config;
    this.app = app;

    this.currentConns = new Set();
    this.busy = new WeakSet();
    this.stop = false;
  }

  start() {
    this.set();
    this.middleWare();
    this.router();
    this.dbConnection();
    return this;
  }

  set() {
    this.app.engine('html', require('ejs').renderFile);
    this.app.set('views', __dirname + '/views');
    this.app.set('view engine', 'html');
  }

  middleWare() {
    this.app.use('/public', express.static(__dirname + '/public'));
    this.app.use(helmet());
    this.app.use(bodyParser());
    this.app.use(cookieParser());
    this.app.use((req, res, next) => {
      console.log('이거슨 미들웨어');
      // if (req.statusCode === '403') {
      //   res.send('에러닷');
      // }
      next();
    });
  }

  router() {
    this.app.use('/', mainRouter);
    this.app.use('/user', userRouter);
    this.app.use((req, res, next) => {
      res.status(404);
      res.send('접근이 잘못됏닥오');
    });
  }

  dbConnection() {
    db.sequelize
      .authenticate()
      .then(() => {
        console.log('db 접속 완료 꺆');
        // db.sequelize.sync({ force: true }) 이면 테이블만 남기고 데이터 다 지움
        // 개발 단계에서 사용하는 명령어라서 개발이 끝나면 죽인다
        return db.sequelize.sync({ force: false });
      })
      .then(() => {
        console.log('~db 접속 완료~ 이제 뭐해?');
      })
      .catch(err => {
        console.log('~db 접속 실패~ 에러처리하댜');
        console.log(err);
      });
  }
}

const createServer = (config = {}) => {
  const server = new AppServer();
  return server.start();
};

exports.createServer = createServer;
