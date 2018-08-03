import { version } from "../../package.json";
import { Router } from "express";
const bodyParser = require('body-parser');
const router = Router();

var Meal = require('../models/models').Meal;

router.get('/:id', (req, res) => {
  console.log('fetching');
  Meal.findById(req.params.id)
      .populate('chef')
      // .populate('reviews')
      .exec()
      .then(meal => {console.log(meal); res.json(meal)})
      .catch(err => console.error(err))
})

router.post('/:id/save', (req, res) => {
  console.log('saving meal');
  Meal.findById(req.params.id).then(meal => console.log("meal", meal));
  // Meal.findByIdAndUpdate(req.params.id, {title: req.body.title,
  //                                        description: req.body.description,
  //                                        ingredients: req.body.ingredients,
  //                                        price: req.body.price,
  //                                        cuisine: req.body.cuisine
  //                                      })
  //     .then(meal => {console.log('!!!!!updated meal!!!!', meal); res.json(meal)})
  //     .catch(err => console.error(err))
})

// router.get('/listings', (req, res) => {
//   Meal.findById("5b636285711e341d7bd448ff")
//       .then(meals => {console.log(meals)})
// })

export default router;
