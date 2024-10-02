const { sendResponse, sendError } = require('../../../responses/index');
const { db } = require('../../../database/db');
const middy = require('@middy/core');

/*async function getAllQuiz() {
  console.log('Function getAllQuiz was called'); // Debug log

  try {
    const results = await db.scan({ TableName: 'quizDB' });
    console.log('Retrieved results:', results); // Log the retrieved results

    return sendResponse(200, { success: true, results: results.Items });
  } catch (error) {
    console.error('Error retrieving quizzes:', error); // Log any errors
    return sendError(500, { success: false, message: 'Error' });
  }
}*/
async function getAllQuiz(event) {
  try {
    // Fetch all quizzes from DynamoDB
    const result = await db.scan({ TableName: 'quizDB' });

    // Structure the response to have quizName, quizId, userId before scores and questions
    const quizzes = result.Items.map((item) => ({
      quizName: item.quizName,
      quizId: item.quizId,
      userId: item.userId,
      scores: item.scores,
      questions: item.questions,
    }));

    // Send a success response with the formatted quizzes
    return sendResponse(200, { success: true, results: quizzes });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return sendError(500, { success: false, error: error.message });
  }
}

module.exports.handler = middy(getAllQuiz);
