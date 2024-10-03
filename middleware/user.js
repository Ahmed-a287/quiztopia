const { db } = require('../database/db');

async function checkUsername(username) {
  const params = {
    TableName: 'quizUsersDb',
    IndexName: 'UsernameIndex',
    KeyConditionExpression: 'username = :username',
    ExpressionAttributeValues: {
      ':username': username,
    },
  };
  try {
    const result = await db.query(params);
    return result;
  } catch (error) {
    console.error('Error checking username:', error);
    throw new Error('Could not check username');
  }
}

module.exports = { checkUsername };
