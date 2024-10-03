const { tokenCheck } = require('../../middleware/auth');
const { sendResponse, sendError } = require('../../responses/index');
const { db } = require('../../database/db');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const { v4: uuidv4 } = require('uuid');

async function postQuiz(event) {
  const { quizName } = event.body;
  const userId = event.userId;

  if (!userId || !quizName) {
    return sendError(400, {
      success: false,
      message: !userId ? 'User ID is required.' : 'Quiz name is required.',
    });
  }

  try {
    const params = {
      TableName: 'quizDB',
      Item: {
        quizId: uuidv4(),
        quizName: quizName,
        userId: userId,
        questions: [],
        scores: [],
      },
    };

    await db.put(params);

    return sendResponse(200, { success: true, item: params.Item });
  } catch (error) {
    console.error('Error creating quiz:', error);
    return sendError(500, { success: false, error: error.message });
  }
}

module.exports.handler = middy(postQuiz).use(jsonBodyParser()).use(tokenCheck);
