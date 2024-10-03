const { sendResponse, sendError } = require('../../../responses/index');
const { db } = require('../../../database/db');
const middy = require('@middy/core');

async function getAllQuiz(event) {
  try {
    const result = await db.scan({ TableName: 'quizDB' });
    const quizzes = result.Items.map((item) => ({
      quizName: item.quizName,
      quizId: item.quizId,
      userId: item.userId,
      scores: item.scores,
      questions: item.questions,
    }));

    return sendResponse(200, { success: true, results: quizzes });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return sendError(500, { success: false, error: error.message });
  }
}

module.exports.handler = middy(getAllQuiz);
