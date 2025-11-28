const jwt = require('jsonwebtoken'); // Assuming JWT for authentication

const auth = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // Extract token (assuming "Bearer TOKEN" format)
  const tokenString = token.split(' ')[1];

  // Verify token
  try {
    // Replace 'your_jwt_secret' with your actual secret key from environment variables
    // For this task, we'll use a placeholder. In a real app, this should be secure.
    const decoded = jwt.verify(tokenString, process.env.JWT_SECRET || 'supersecretjwtkey');
    
    // Attach user from token payload to request object
    // This assumes your JWT payload includes a 'user' object with 'id' and 'role'
    req.user = decoded.user; // e.g., { id: '...', role: 'admin' }
    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};

exports.auth = auth; // Use named export
