import makeApp from './app';
import mongoose from 'mongoose';
import { createProduct, getProductById }  from './database';

const port = process.env.PORT || 8081;

const app = makeApp({ createProduct, getProductById })

mongoose.connect('mongodb://localhost:27017/webshop').then(() => {
    app.listen(port, () => {
        console.log(`Listening to port ${port}`);
    })
})