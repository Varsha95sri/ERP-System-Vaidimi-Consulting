const express = require('express');
const router = express.Router();
const {
  login,
  getMe,
  logout,
  changePassword,
  testAdminOnly,
  forgotPassword,
  verifyResetOtp,
  resetPasswordWithOtp,
} = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { ROLES } = require('../config/constants');

// Public routes
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOtp);
router.post('/reset-password-with-otp', resetPasswordWithOtp);

// Protected routes (any authenticated user: Admin, HR, Employee, Intern)
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.put('/change-password', authenticate, changePassword);

// Role-protected test route (Admin / Manager only)
router.get('/admin-only-test', authenticate, authorizeRoles(ROLES.ADMIN, ROLES.MANAGER), testAdminOnly);

module.exports = router;
