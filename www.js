'use strict';

const { createServer } = require('./app.js');

// option에 들어가는 것 : 서버의 포트, ssl(https 프로토콜을 만들어줌(port:443)), 아마존 키값, PG(페이게이트에 대한 상정 키값)
const option = {
  port: 80,
};

const www = async (config = {}) => {
  const server = await createServer(config);
  const port = config.port;
  server.listen(port, () => {
    console.log(`현지 위치 ${port} 포트 ::: 서버 돌아가욤`);
  });
};

www(option);
