module.exports.handler = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'The serverless running successfully!',
    }),
  };
};
