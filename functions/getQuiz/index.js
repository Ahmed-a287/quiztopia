const { tokenCheck } = require('../../middleware/auth');
const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../database/db');
const middy = require('@middy/core');

async function getQuiz(event) {
  const { quizId } = event.pathParameters;
  const userId = event.userId;

  if (!quizId) {
    return sendError(400, { success: false, message: 'Quiz ID is required.' });
  }

  try {
    const params = {
      TableName: 'quizDB',
      Key: { quizId },
    };

    const result = await db.get(params);

    if (!result.Item) {
      return sendError(404, { success: false, message: 'Quiz not found.' });
    }

    if (result.Item.userId !== userId) {
      return sendError(403, {
        success: false,
        message: 'You are not authorized to access this quiz.',
      });
    }

    // Structure the response
    const quiz = {
      quizName: result.Item.quizName,
      quizId: result.Item.quizId,
      userId: result.Item.userId,
      scores: result.Item.scores,
      questions: result.Item.questions,
    };

    return sendResponse(200, { success: true, quiz });
  } catch (error) {
    console.error('Error fetching quiz:', error);
    return sendError(500, { success: false, error: error.message });
  }
}

module.exports.handler = middy(getQuiz).use(tokenCheck);
