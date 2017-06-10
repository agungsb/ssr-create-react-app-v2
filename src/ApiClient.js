import superagent from 'superagent';
// import config from '../config';

const methods = ['get', 'post', 'put', 'patch', 'del'];

// function formatUrl(path) {
//   const adjustedPath = path[0] !== '/' ? `/${path}` : path;
//   if (__SERVER__) {
//     // Prepend host and port of the API server to the path.
//     // return `http://${config.apiHost}:${config.apiPort + adjustedPath}`;
//     return `${config.apiHost}${adjustedPath}`;
//   }
//   // Prepend `/api` to relative URL, to proxy to API server.
//   // return `/api${adjustedPath}`;
//   return `${config.apiHost}${adjustedPath}`;
// }

export default class ApiClient {
  constructor(req) {
    methods.forEach(method => {
      this[method] = (path, { params, data, headers, files, fields } = {}, isExternal = false) => new Promise((resolve, reject) => {
        let request;
        // if (isExternal) {
        request = superagent[method](path);
        // request.set('X-Algolia-API-Key', '5f97501809f8c3b151b9e38979583138');
        // request.set('X-Algolia-Application-Id', 'UYC3TRXIO3');
        // } else {
        //   request = superagent[method](formatUrl(path));
        //   request.set('Content-Type', 'application/json');
        //   request.set('x-auth', 'kumkum');
        //   request.withCredentials();
        // }

        if (params) {
          request.query(params);
        }

        // if (__SERVER__ && req.get('cookie')) {
        //   request.set('cookie', req.get('cookie'));
        // }
        if (headers) {
          request.set(headers);
        }

        // if (this.token) {
        //   request.set('Authorization', `Bearer ${this.token}`);
        // }

        if (files) {
          files.forEach(file => request.attach(file.key, file.value));
        }

        if (fields) {
          fields.forEach(item => request.field(item.key, item.value));
        }

        if (data) {
          request.send(data);
        }
        request.end((err, { body } = {}) => (err ? reject(body || err) : resolve(body)));
      });
    });
  }

  // setJwtToken(token) {
  //   this.token = token;
  // }
}
