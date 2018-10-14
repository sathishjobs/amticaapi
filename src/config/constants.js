const devConfig = {
    MONGO_URL: 'mongodb://localhost:27017/udaanticketbookingapi',
  };
  
  const testConfig = {
    MONGO_URL: 'mongodb://localhost:27017/udaanticketbookingapitest',
  };
  
  const prodConfig = {
    MONGO_URL: `mongodb://sathish-mirra:node123@ds131903.mlab.com:31903/udaanchallange`,
  };
  
  const defaultConfig = {
    PORT: process.env.PORT || 9090,
  };
  
  function envConfig(env) {
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
  