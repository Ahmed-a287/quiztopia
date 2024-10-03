const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../database/db');
const { tokenCheck } = require('../../middleware/auth');
const middy = require('@middy/core');

async function deleteQuiz(event) {
  const quizId = event.pathParameters.quizId;
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
        message: 'You are not authorized to delete this quiz.',
      });
    }

    await db.delete(params);

    return sendResponse(200, {
      success: true,
      message: 'Quiz deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting quiz:', error);
    return sendError(500, { success: false, error: error.message });
  }
}

module.exports.handler = middy(deleteQuiz).use(tokenCheck);
