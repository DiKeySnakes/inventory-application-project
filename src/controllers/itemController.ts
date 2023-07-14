import Category from '../models/category.js';
import Item from '../models/item.js';

import { body, Result, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';

// Display list of all items.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const items_list = asyncHandler(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (req: Request, res: Response, next: NextFunction) => {
    const allItems = await Item.find({}, 'title category')
      .sort({ title: 1 })
      .populate('category')
      .exec();

    res.render('items_list', { title: 'Items List', items_list: allItems });
  }
);

// Display detail page for a specific Item.
const item_details = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate('category').exec();
  if (item === null) {
    // No results.
    const err = new Error('Item not found');
    return next(err);
  }

  res.render('itemDetails', {
    title: 'Item Details',
    item: item,
  });
});

// Display item create form on GET.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const item_create_get = asyncHandler(async (req, res, next) => {
  // Get all categories, which we can use for adding to our item.
  const allCategories = await Category.find().sort({ name: 1 }).exec();

  res.render('createItem', {
    title: 'Create Item',
    categories: allCategories,
    item: Item,
  });
});

// Handle item create on POST.
const item_create_post = [
  // Validate and sanitize fields.
  body('name', 'Name must not be empty. Min: 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('description', 'Description must not be empty. Min: 5 characters')
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body('category').escape(),
  body('price', 'Price must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('number_in_stock', 'Number_in_stock must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors: Result = validationResult(req);

    // Create an Item object with escaped and trimmed data.
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all categories for form.
      const allCategories = await Category.find().sort({ name: 1 }).exec();

      res.render('createItem', {
        title: 'Create Item',
        categories: allCategories,
        item: item,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Save item.
      await item.save();
      res.redirect(item.url);
    }
  }),
];

// Display Item delete form on GET.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate('category').exec();

  res.render('deleteItem', {
    title: 'Delete Item',
    item: item,
  });
});

// Handle item delete on POST.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const item_delete_post = asyncHandler(async (req, res, next) => {
  // Delete object and redirect to the list of categories.
  const item = await Item.findByIdAndRemove(req.body.id);
  res.redirect('/category/' + item?.category);
});

// Display item update form on GET.
const item_update_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();
  // Get all categories, which we can use for adding to our item.
  const allCategories = await Category.find().sort({ name: 1 }).exec();

  if (item === null) {
    // No results.
    const err = new Error('Item not found');
    return next(err);
  }

  res.render('createItem', {
    title: 'Update Item',
    categories: allCategories,
    item: item,
  });
});

// Handle Item update on POST.
const item_update_post = [
  // Validate and sanitize fields.
  body('name', 'Name must not be empty. Min: 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('description', 'Description must not be empty. Min: 5 characters')
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body('category').escape(),
  body('price', 'Price must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('number_in_stock', 'Number_in_stock must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),

  // Process request after validation and sanitization.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors: Result = validationResult(req);

    // Create an item object with escaped and trimmed data (and the old id!)
    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.

      // Get all categories for form.
      const allCategories = await Category.find().sort({ name: 1 }).exec();
      console.log('allCategories', allCategories);

      res.render('createItem', {
        title: 'Update Item',
        categories: allCategories,
        item: item,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      await Item.findByIdAndUpdate(req.params.id, item);
      res.redirect('/item/' + item?._id);
    }
  }),
];

export {
  items_list,
  item_details,
  item_create_get,
  item_create_post,
  item_delete_get,
  item_delete_post,
  item_update_get,
  item_update_post,
};
