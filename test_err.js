const app = require('./app');
const request = require('supertest');
const mongoose = require('mongoose');
const config = require('./src/config');

async function run() {
    await mongoose.connect(config.mongoUri);
    const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
            clinicName: "TestClinic",
            clinicAddress: "123",
            userName: "TestUser",
            email: "test_new_email_" + Date.now() + "@test.com",
            password: "password123"
        });
    console.log(JSON.stringify(res.body, null, 2));
    process.exit(0);
}

run().catch(console.error);
