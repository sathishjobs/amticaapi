const devConfig = {
    MONGO_URL: 'mongodb://localhost:27017/amticaChallange',
  };
  
  const testConfig = {
    MONGO_URL: 'mongodb://localhost:27017/amticaChallange',
  };
  
  const prodConfig = {
    // MONGO_UR `mongodb://sathish-mirra:node123@ds131903.mlab.com:31903/amticaChallange`,
    MONGO_URL : `mongodb://sathish:mirra123!@ds047940.mlab.com:47940/amtica`,
  };
  
  const defaultConfig = {
    JWTSecret : 'amtica123!',
    PORT: process.env.PORT || 9090,
  };
  
  function envConfig(env) {
    console.log("Env from envConfig");
    console.log(env);
    switch (env) {
      case 'development':
        return devConfig;
      case 'test':
        return testConfig;
      case 'production':
        return prodConfig;
      default:
        return devConfig;
    }
  }
  module.exports = {
    ...defaultConfig,
    ...envConfig(process.env.NODE_ENV),
  };
  