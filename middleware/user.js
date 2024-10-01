const { db } = require('../database/db');

async function checkUsername(username) {
  const params = {
    TableName: 'quizUsersDb',
    IndexName: 'UsernameIndex', // Specify the GSI
    KeyConditionExpression: 'username = :username', // Use KeyConditionExpression for the GSI
    ExpressionAttributeValues: {
      ':username': username,
    },
  };
  try {
    const result = await db.query(params); // Use query instead of scan
    return result; // Return the result to be used in your handler
  } catch (error) {
    console.error('Error checking username:', error);
    throw new Error('Could not check username'); // Propagate the error
  }
}

module.exports = { checkUsername };
