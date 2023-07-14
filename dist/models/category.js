import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const CategorySchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    description: { type: String, required: true, maxLength: 500 },
}, {
    timestamps: true,
    virtuals: {
        url: {
            get() {
                return `/category/${this._id}`;
            },
        },
    },
});
// Export model
const Category = mongoose.model('Category', CategorySchema);
export default Category;
