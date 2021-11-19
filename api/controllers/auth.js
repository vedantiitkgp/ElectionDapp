const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const accessToken = jwt.sign(
    {
      data: req.adminID,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
  console.log(process.env.FRONTEND_URL.split('/')[2]);
  res.cookie('accessToken', accessToken, {
    maxAge: 24 * 3600000,
    secure: process.env.NODE_ENV == 'development' ? false : true,
    domain: process.env.FRONTEND_URL.split('/')[2],
    httpOnly: true,
    signed: true,
  });
  res.status(200).json({
    msg: 'Login Success',
  });
};

exports.logout = (req, res) => {
  res.clearCookie('accessToken');
  res.status(200).json({
    msg: 'Logout Success',
  });
};

exports.checkAuth = (req, res) => {
  const accessToken = req.signedCookies['accessToken'];
  if (accessToken) {
    try {
      const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET);
      return res.status(200).json({
        isAdmin: true,
      });
    } catch (err) {
      return res.status(200).json({
        isAdmin: false,
      });
    }
  } else {
    return res.status(200).json({
      isAdmin: false,
    });
  }
};
