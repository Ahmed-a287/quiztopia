const jwt = require('jsonwebtoken');
const { sendError } = require('../responses');

const tokenCheck = {
  before: async (request) => {
    const token =
      request.event.headers.Authorization ||
      request.event.headers.authorization;

    const bodyId = request.event.body?.userId;

    if (!token || !token.startsWith('Bearer ')) {
      return sendError(400, { success: false, error: 'No token provided' });
    }

    const cleanedToken = token.replace('Bearer ', '');

    try {
      const data = jwt.verify(cleanedToken, process.env.JWT_SECRET);
      if (bodyId && bodyId !== data.userId) {
        return sendError(401, {
          success: false,
          error: "UserId doesn't match token",
        });
      }
      request.event.userId = data.userId;

      return request.response;
    } catch (error) {
      console.error('Token verification error:', error);
      return sendError(401, {
        success: false,
        error: 'Invalid or expired token',
      });
    }
  },
  onError: async (request) => {
    request.event.error = '401';
    return sendError(401, { success: false, error: 'Unauthorized' });
  },
};

module.exports = { tokenCheck };
