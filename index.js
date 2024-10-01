/*module.exports.handler = async (event) => {
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "The serverless runing successfully!",
          input: event,
        },
        null,
        2
      ),
    };
  }; */ // THE orignal version remove if th other one works

module.exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'The serverless running successfully!',
    }),
  };
};
