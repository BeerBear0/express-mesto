const allowedCors = [
  'https://mesto.nikko.22.nomoredomains.monster',
  'http://mesto.nikko.22.nomoredomains.monster',
  'http://localhost:3001',
];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE, OPTIONS';

module.exports = (req, res, next) => {
  // console.log(res, req, 'qwerty');
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    console.log(origin, '12321');
    res.header('Access-Control-Allow-Origin', origin);
  }
  if (method === 'OPTIONS') {
    // console.log('123451', res);
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.status(200).send();
    return;
  }

  next();
};
