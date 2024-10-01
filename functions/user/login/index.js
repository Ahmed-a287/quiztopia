const { checkUsername } = require('../../../middleware/user');
const { sendResponse, sendError } = require('../../../responses/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');

async function login(event) {
  const { username, password } = event.body;

  try {
    // Check if the username exists in the database
    const result = await checkUsername(username);
    if (result.Count === 0) {
      return sendError(404, { success: false, message: 'User not found' });
    }

    // Retrieve the user's stored password hash
    const userData = result.Items[0];
    const storedPasswordHash = userData.password;

    // Compare provided password with the stored password
    const passwordMatch = await bcrypt.compare(password, storedPasswordHash);

    if (!passwordMatch) {
      return sendError(400, { success: false, message: 'Invalid password' });
    }

    // Generate JWT token upon successful login
    const token = jwt.sign(
      { userId: userData.userId },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    );

    // Send success response along with the token
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
