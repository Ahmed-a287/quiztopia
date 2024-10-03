const { checkUsername } = require('../../../middleware/user');
const { sendResponse, sendError } = require('../../../responses/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');

async function login(event) {
  const { username, password } = event.body;

  try {
    const result = await checkUsername(username);
    if (result.Count === 0) {
      return sendError(404, { success: false, message: 'User not found' });
    }

    const userData = result.Items[0];
    const storedPasswordHash = userData.password;

    const passwordMatch = await bcrypt.compare(password, storedPasswordHash);

    if (!passwordMatch) {
      return sendError(400, { success: false, message: 'Invalid password' });
    }

    const token = jwt.sign(
      { userId: userData.userId },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    return sendResponse(200, {
      success: true,
      message: `User ${username} successfully logged in!`,
      token: token,
      userId: userData.userId,
    });
  } catch (error) {
    console.error('Error during login:', error);
    return sendError(500, { success: false, error: error.message });
  }
}

module.exports.handler = middy(login).use(jsonBodyParser());
