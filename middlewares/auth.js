export function isLoggedIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.status(401).send('Please sign in first :p');
  }
}

export function isTeacher(req, res, next) {
  if (req.session.user) {
    if (req.session.user.role === 'teacher') {
      next();
    } else {
      res.status(403).send('u r not teacher :p');
    }
  } else {
    res.status(401).send('Please sign in first :p');
  }
}
