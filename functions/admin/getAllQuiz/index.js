const { sendResponse, sendError } = require('../../../responses/index');
const { db } = require('../../../database/db');
const middy = require('@middy/core');

async function getAllQuiz() {
  console.log('Function getAllQuiz was called'); // Debug log

  try {
    const results = await db.scan({ TableName: 'quizDB' });
    console.log('Retrieved results:', results); // Log the retrieved results

    return sendResponse(200, { success: true, results: results.Items });
  } catch (error) {
    console.error('Error retrieving quizzes:', error); // Log any errors
    return sendError(500, { success: false, message: 'Error' });
  }
}

module.exports.handler = middy(getAllQuiz);
