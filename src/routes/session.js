const router = require('express').Router();
const { 
      getSessions,
      ownSessions,
      getSession,
      addSession,
      addComment,
      manageSession
      } = require('../controller/sessionController');
const { isAuthenticate } = require('../middlewire/common');

router.get('/sessions', isAuthenticate, getSessions);
router.get('/own-sessions', isAuthenticate, ownSessions);
router.get('/session', isAuthenticate, getSession);
router.post('/session', isAuthenticate, addSession);
router.post('/comment', isAuthenticate, addComment);
router.put('/session', isAuthenticate, manageSession);

module.exports = router;