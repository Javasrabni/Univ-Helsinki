const redis = require('redis');

const REDIS_URL = process.env.REDIS_URL || undefined;

let getAsync;
let setAsync;

if (REDIS_URL) {
  const client = redis.createClient({
    url: REDIS_URL
  });

  // Wajib connect di v4
  client.connect();

  // Langsung bind, JANGAN pakai promisify karena di v4 sudah otomatis async
  getAsync = client.get.bind(client);
  setAsync = client.set.bind(client);
} else {
  getAsync = async () => null;
  setAsync = async () => null;
}

module.exports = {
  getAsync,
  setAsync
};

