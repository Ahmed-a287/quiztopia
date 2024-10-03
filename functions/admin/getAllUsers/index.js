const { sendResponse, sendError } = require('../../../responses/index');
const { db } = require('../../../database/db');
const middy = require('@middy/core');

async function getAllUsers() {
  try {
    const results = await db.scan({ TableName: 'quizUsersDb' });

    return sendResponse(200, { success: true, users: results.Items });
  } catch (error) {
    console.error('Error getting users:', error);
    return sendError(500, { success: false, message: 'Could not get users' });
  }
}

module.exports.handler = middy(getAllUsers);
