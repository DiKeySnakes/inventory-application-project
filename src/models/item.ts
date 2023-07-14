import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const ItemSchema = new Schema(
  {
    name: { type: String, required: true, maxLength: 100 },
    description: { type: String, required: true, maxLength: 500 },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    price: { type: Number, required: true },
    number_in_stock: { type: Number, required: true },
  },
  {
    timestamps: true,
    virtuals: {
      url: {
        get() {
          return `/item/${this._id}`;
        },
      },
    },
  }
);

// Export model
const Item = mongoose.model('Item', ItemSchema);
export default Item;
