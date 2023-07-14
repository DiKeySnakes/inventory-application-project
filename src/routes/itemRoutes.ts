import express from 'express';
import {
  items_list,
  item_details,
  item_create_get,
  item_create_post,
  item_delete_get,
  item_delete_post,
  item_update_get,
  item_update_post,
} from '../controllers/itemController.js';

const router = express.Router();

// GET request for creating an Item. NOTE This must come before routes that display Item (uses id).
router.get('/create', item_create_get);

// POST request for creating Book.
router.post('/create', item_create_post);

// GET request for list of all Items.
router.get('/items', items_list);

// GET request for one Item.
router.get('/:id', item_details);

// GET request to delete Item.
router.get('/:id/delete', item_delete_get);

// POST request to delete Item.
router.post('/:id/delete', item_delete_post);

// GET request to update Item.
router.get('/:id/update', item_update_get);

// POST request to update Item.
router.post('/:id/update', item_update_post);

export default router;
