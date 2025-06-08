import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    images: [String],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    stock: {
        type: Number,
        default: 0,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
            localField: '_id',
            foreignField: 'product',
        },
    ],
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);