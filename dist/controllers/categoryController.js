var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Category from '../models/category.js';
import Item from '../models/item.js';
import { body, validationResult } from 'express-validator';
import asyncHandler from 'express-async-handler';
// Display list of all Categories.
const category_list = asyncHandler(
// eslint-disable-next-line @typescript-eslint/no-unused-vars
(req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const allCategories = yield Category.find().sort({ name: 1 }).exec();
    res.render('index', {
        title: 'Category List',
        list_categories: allCategories,
    });
}));
// Display detail page for a specific Category.
const category_details = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get details of category and all associated items (in parallel)
    const [category, itemsInCategory] = yield Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, 'name _id').exec(),
    ]);
    if (category === null) {
        // No results.
        const err = new Error('Category not found');
        // err.status = 404;
        return next(err);
    }
    res.render('categoryDetails', {
        title: 'Category Details',
        category: category,
        category_items: itemsInCategory,
    });
}));
// Display Category create form on GET.
const category_create_get = (req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    res.render('createCategory', {
        title: 'Create Category',
        category: Category,
    });
};
// Handle Category create on POST.
const category_create_post = [
    // Validate and sanitize name and description fields.
    body('name', 'Category name must contain at least 3 characters')
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body('description', 'Category description must contain at least 5 characters')
        .trim()
        .isLength({ min: 5 })
        .escape(),
    // Process request after validation and sanitization.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        // Create a category object with escaped and trimmed data.
        const category = new Category({
            name: req.body.name,
            description: req.body.description,
        });
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values/error messages.
            res.render('createCategory', {
                title: 'Create Category',
                category: category,
                errors: errors.array(),
            });
            return;
        }
        else {
            // Data from form is valid.
            // Check if Category with same name already exists.
            const categoryExists = yield Category.findOne({
                name: req.body.name,
            }).exec();
            if (categoryExists) {
                // Category exists, redirect to its detail page.
                res.redirect(categoryExists.url);
            }
            else {
                yield category.save();
                // New category saved. Redirect to category detail page.
                res.redirect('/category/categories');
            }
        }
    })),
];
// Display Category delete form on GET.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const category_delete_get = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get details of category and all associated items (in parallel)
    const [category, itemsInCategory] = yield Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, 'name').exec(),
    ]);
    if (category === null) {
        // No results.
        res.redirect('/category/categories');
    }
    res.render('deleteCategory', {
        title: 'Delete Category',
        category: category,
        category_items: itemsInCategory,
    });
}));
// Handle Category delete on POST.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const category_delete_post = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Get details of category and all associated items (in parallel)
    const [category, itemsInCategory] = yield Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({ category: req.params.id }, 'title summary').exec(),
    ]);
    if (itemsInCategory.length > 0) {
        // Category has items. Render in same way as for GET route.
        res.render('deleteCategory', {
            title: 'Delete Category',
            category: category,
            category_items: itemsInCategory,
        });
        return;
    }
    else {
        // Category has no items. Delete object and redirect to the list of categories.
        yield Category.findByIdAndRemove(req.body.id);
        res.redirect('/category/categories');
    }
}));
// Display category update form on GET.
const category_update_get = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield Category.findById(req.params.id).exec();
    if (category === null) {
        // No results.
        const err = new Error('Category not found');
        return next(err);
    }
    res.render('createCategory', {
        title: 'Update Category',
        category: category,
    });
}));
// Handle Category update on POST.
const category_update_post = [
    // Validate and sanitize name and description fields.
    body('name', 'Category name must contain at least 3 characters')
        .trim()
        .isLength({ min: 3 })
        .escape(),
    body('description', 'Category description must contain at least 5 characters')
        .trim()
        .isLength({ min: 5 })
        .escape(),
    // Process request after validation and sanitization.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        // Create a category object with escaped and trimmed data (and the old id!)
        const category = new Category({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id,
        });
        if (!errors.isEmpty()) {
            // There are errors. Render the form again with sanitized values and error messages.
            res.render('createCategory', {
                title: 'Update Category',
                category: category,
                errors: errors.array(),
            });
            return;
        }
        else {
            // Data from form is valid. Update the record.
            yield Category.findByIdAndUpdate(req.params.id, category);
            res.redirect('/category/' + (category === null || category === void 0 ? void 0 : category._id));
        }
    })),
];
export { category_list, category_details, category_create_get, category_create_post, category_delete_get, category_delete_post, category_update_get, category_update_post, };
