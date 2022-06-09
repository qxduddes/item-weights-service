const {
    MONGODB_USER,
    MONGODB_PASSWORD,
    MONGODB_HOST,
    MONGODB_LOCAL_PORT,
    MONGODB_DOCKER_PORT,
    MONGODB_DATABASE,
  } = process.env;
  module.exports = {
    url: `mongodb://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_HOST}:${MONGODB_DOCKER_PORT}/${MONGODB_DATABASE}?authSource=admin`
  };