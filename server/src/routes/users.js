import { version } from "../../package.json";
import { Router } from "express";
const bodyParser = require('body-parser');
const router = Router();

var User = require('../models/models').User;

router.get('/:id', (req, res) => {
  User.findById(req.params.id)
      .then(user => {console.log(user); res.json(user)})
      .catch(err => console.error(err))
})

export default router;
