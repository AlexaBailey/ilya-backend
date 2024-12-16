const groupRouter=require('express').Router();
const groupController=require('../controllers/groupController');

groupRouter.get('/', groupController.getAll);
groupRouter.get('/:id', groupController.getById);
groupRouter.post('/', groupController.create);
groupRouter.delete('/:id', groupController.delete);
groupRouter.put('/:id', groupController.put);
groupRouter.get('/:id/download', groupController.getFileById)

module.exports = groupRouter;