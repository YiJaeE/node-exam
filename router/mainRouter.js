const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  let data = {
    title: 'YiJaeE',
    html: '<h2>EJS에서 왔어염</h2>',
  };
  res.render('main', { data: data });
});

router.post('/', async (req, res) => {
  res.send('포스트 메인');
});

module.exports = router;
