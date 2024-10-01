const { sendResponse, sendError } = require('../../../responses/index');
const { db } = require('../../../database/db');
const middy = require('@middy/core');
// Uncomment if using body parser middleware
//const jsonBodyParser = require('@middy/http-json-body-parser');

async function getAllUsers() {
  try {
    const results = await db.scan({ TableName: 'quizUsersDb' });

    return sendResponse(200, { success: true, users: results.Items });
  } catch (error) {
    console.error('Error getting users:', error); // Log the error for debugging
    return sendError(500, { success: false, message: 'Could not get users' });
  }
}

// Export the handler correctly
module.exports.handler = middy(getAllUsers);
