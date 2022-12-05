import { default as request } from 'supertest';
import makeApp from './app';
import nock from 'nock';

const createProduct = jest.fn();
const getProductById = jest.fn();

const app = makeApp({ createProduct, getProductById });
const validProductData = {
    name: "Macbook Pro",
    description: "Awesome computer that lags when connecting to external screen",
    price: 900,
    currency: "USD"
}

describe("POST /product", () => {

    beforeAll(() => {
        nock('https://api.api-ninjas.com')
            .get('/v1/exchangerate?pair=USD_SEK')
            .times(1)
            .reply(200, {
                "currency_pair": "USD_SEK",
                "exchange_rate": 10
            }, {
                'Content-Type': 'application/json',
            })
    })

    beforeEach(() => {

        createProduct.mockReset();
        createProduct.mockResolvedValue({
            name: 'Macbook Pro',
            description: 'Great machine!',
            price: 900,
            currency: 'USD',
            __v: 0
        })

        getProductById.mockResolvedValue({
            name: 'Macbook Pro',
            description: 'Great machine!',
            price: 900,
            currency: 'USD',
            __v: 0
        })
    })



    it("should return 200 status code when posting product with valid data", async () => {
        const response = await request(app).post("/product").send(validProductData);
        expect(response.statusCode).toBe(200);
    })

    it("should return content-type = json", async () => {
        const response = await request(app).post('/product');
        console.log(response.headers);
        expect(response.headers['content-type'].indexOf('json') > -1).toBeTruthy();
    })

    it("should return 400 status code if sending invalid post data", async () => {
        const response = await request(app).post('/product').send({
            name: "Macbook Pro",
            description: "Awesome computer that lags when connecting to external screen",
            price: 900
        })
        expect(response.statusCode).toBe(400);
    })

    it("should call createProduct 1 time", async () => {
        const response = await request(app).post("/product").send(validProductData);
        expect(createProduct.mock.calls.length).toBe(1);
    })

    it("should recive a Macbook when posting", async () => {
        const response = await request(app).post("/product").send(validProductData);
        expect(response.body.name).toBe('Macbook Pro');
    })
})

describe("GET /product/:id", () => {

    it("should return 400 if invalid mongo id is provided", async () => {
        const response = await request(app).get("/product/hejhej");
        expect(response.statusCode).toBe(400);
    })

    it("should return a correct converted price in SEK", async () => {
        const response = await request(app).get("/product/638dfd606c803c13707be651");
        console.log(response.statusCode);
        expect(response.body.priceInSEK).toBe(9000);
    })

})