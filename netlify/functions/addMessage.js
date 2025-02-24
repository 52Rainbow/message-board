const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
    const client = new faunadb.Client({ secret: process.env.FAUNADB_SECRET });
    const { userName, message, imageUrl } = JSON.parse(event.body);

    try {
        const result = await client.query(
            q.Create(q.Collection('messages'), {
                data: {
                    userName,
                    message,
                    imageUrl,
                    time: new Date().toLocaleString()
                }
            })
        );
        return {
            statusCode: 200,
            body: JSON.stringify(result)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};