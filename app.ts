import express, { json } from 'express';
import { isValidId } from './database';
import { convertCurrencyFromUSDToSEK } from './currency';

const makeApp = ({ createProduct, getProductById }: any) => {

    const app = express();
    app.use(json());

    app.post('/product', async (req, res) => {

        const errors = [];

        if (!req.body.name || req.body.name.length === 0) {
            errors.push({
                "error": "You must provide a name"
            })
        }

        if (!req.body.description || req.body.description.length === 0) {
            errors.push({
                "error": "You must provide a description"
            })
        }

        if (!req.body.price || isNaN(Number(req.body.price))) {
            errors.push({
                "error": "You must provide a correct price, should be number"
            })
        }

        if (!req.body.currency || req.body.currency.length != 3) {
            errors.push({
                "error": "You must provide a currency, should be 3 letters"
            })
        }

        if (errors.length) {
            res.status(400).json(errors);
        } else {
            const product = await createProduct(req.body);

            res.json(product);
        }
    })

    app.get('/product/:id', async (req, res) => {
        if (!isValidId(req.params.id)) {
            res.status(400).send();
        } else {
            const product = await getProductById(req.params.id);
            console.log(product);
            if (product === undefined) {
                res.status(404).send();
            } else {
                const priceInSEK = await convertCurrencyFromUSDToSEK(product.price);
                res.json({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    currency: product.currency,
                    priceInSEK
                });   
            }
        }
    })

    return app;

}

export default makeApp;