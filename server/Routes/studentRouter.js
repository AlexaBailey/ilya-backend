const studentRouter=require('express').Router();
const studentController=require('../controllers/studentController');

studentRouter.get('/', studentController.getAll);
studentRouter.get('/:id', studentController.getById);
studentRouter.post('/', studentController.create);
studentRouter.delete('/:id', studentController.delete);
studentRouter.put('/:id', studentController.put);
studentRouter.get('/:id/download', studentController.getFile);

module.exports = studentRouter;