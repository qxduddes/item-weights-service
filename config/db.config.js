require('dotenv').config();
const {
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_HOST,
    MONGODB_LOCAL_PORT,
    MONGODB_DOCKER_PORT,
    MONGODB_DATABASE,
    MONGODB_URI
  } = process.env;
  module.exports = {
    local: `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_DOCKER_PORT}/${MONGODB_DATABASE}?authSource=admin`,
    live: MONGODB_URI
  };