const express = require('express')
const router = express.Router()
const controller = require('../controllers/analytic');
const passport = require('passport')

router.get('/overview', passport.authenticate('jwt', {session: false}), controller.overview)

router.get('/analytics', passport.authenticate('jwt', {session: false}), controller.analytics)

module.exports = router
