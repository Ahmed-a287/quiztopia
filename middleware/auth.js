const jwt = require('jsonwebtoken');
const { sendError } = require('../responses');

const tokenCheck = {
  before: async (request) => {
    // Log all headers for debugging
    console.log('All Headers:', request.event.headers);

    // Extract the Authorization header correctly, considering case sensitivity
    const token =
      request.event.headers.Authorization ||
      request.event.headers.authorization; // Change here
    console.log('Extracted Token:', token); // Log the token for debugging
    const bodyId = request.event.body?.userId;

    if (!token || !token.startsWith('Bearer ')) {
      return sendError(400, { success: false, error: 'No token provided' });
    }

    // Remove Bearer
    const cleanedToken = token.replace('Bearer ', '');

    try {
      const data = jwt.verify(cleanedToken, process.env.JWT_SECRET); // Use environment variable for secret

      if (bodyId && bodyId !== data.userId) {
        return sendError(401, {
          success: false,
          error: "UserId doesn't match token",
        });
      }

      request.event.userId = data.userId; // Attach userId to the event for later use

      return request.response; // You can also call next() if needed
    } catch (error) {
      console.error('Token verification error:', error); // Log error for debugging
      return sendError(401, {
        success: false,
        error: 'Invalid or expired token',
      });
    }
  },
  onError: async (request) => {
    request.event.error = '401';
    return sendError(401, { success: false, error: 'Unauthorized' }); // Consistent error response
  },
};

module.exports = { tokenCheck };
/*const jwt = require('jsonwebtoken');
const { sendError } = require('../responses');

const tokenCheck = {
  before: async (request) => {
    // Log all headers for debugging
    //console.log('All Headers:', request.event.headers);

    // Extract the Authorization header correctly
    const token = request.event.headers.Authorization; // Change here
    console.log('Authorization Header:', request.event.headers.Authorization);
    console.log(
      'Authorization Header (lowercase):',
      request.event.headers.authorization
    );
    console.log('Extracted Token:', token); // Log the token for debugging
    const bodyId = request.event.body?.userId;

    if (!token || !token.startsWith('Bearer ')) {
      return sendError(400, { success: false, error: 'No token provided' });
    }

    // Remove Bearer
    const cleanedToken = token.replace('Bearer ', '');

    try {
      const data = jwt.verify(cleanedToken, process.env.JWT_SECRET); // Use environment variable for secret

      if (bodyId && bodyId !== data.userId) {
        return sendError(401, {
          success: false,
          error: "UserId doesn't match token",
        });
      }

      request.event.userId = data.userId; // Attach userId to the event for later use

      return request.response; // You can also call next() if needed
    } catch (error) {
      console.error('Token verification error:', error); // Log error for debugging
      console.log('Authorization Header:', request.event.headers.Authorization);
      console.log(
        'Authorization Header (lowercase):',
        request.event.headers.authorization
      );
      return sendError(401, {
        success: false,
        error: 'Invalid or expired token',
      });
    }
  },
  onError: async (request) => {
    request.event.error = '401';
    return sendError(401, { success: false, error: 'Unauthorized' }); // Consistent error response
  },
};

module.exports = { tokenCheck };*/
