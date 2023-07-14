import express from 'express';
import {
  category_list,
  category_details,
  category_create_get,
  category_create_post,
  category_delete_get,
  category_delete_post,
  category_update_get,
  category_update_post,
} from '../controllers/categoryController.js';

const router = express.Router();

// GET request for creating a Category. NOTE This must come before route that displays Category (uses id).
router.get('/create', category_create_get);

// POST request for creating Category.
router.post('/create', category_create_post);

// GET request for list of all Categories.
router.get('/categories', category_list);

// GET request for one Category.
router.get('/:id', category_details);

// GET request to delete Category.
router.get('/:id/delete', category_delete_get);

// POST request to delete Category.
router.post('/:id/delete', category_delete_post);

// GET request to update Category.
router.get('/:id/update', category_update_get);

// POST request to update Category.
router.post('/:id/update', category_update_post);

export default router;
