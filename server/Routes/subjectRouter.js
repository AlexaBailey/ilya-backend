const subjectRouter=require('express').Router();
const subjectController=require('../controllers/subjectController');

subjectRouter.get('/', subjectController.getAll);
subjectRouter.get('/:id', subjectController.getById);
subjectRouter.post('/', subjectController.create);
subjectRouter.delete('/:id', subjectController.delete);
subjectRouter.put('/:id',subjectController.put);
subjectRouter.get('/:id/download', subjectController.getFileById);

module.exports = subjectRouter;