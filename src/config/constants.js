const devConfig = {
    MONGO_URL: 'mongodb://localhost/udaanticketbookingapi',
  };
  
  const testConfig = {
    MONGO_URL: 'mongodb://localhost/udaanticketbookingapitest',
  };
  
  const prodConfig = {
    MONGO_URL: 'mongodb://<sathish-mirra>:<node123>@ds045087.mlab.com:45087/udaanticketbookingapi',
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
  