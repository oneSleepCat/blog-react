import request from './request.js';

const login = async () => {
  // axios.post('');
};

const getBlogList = async () => {
  const res = await request('get', '/api/blog/list', {
    author: 'zs',
  });
  console.log('getBlogList xx', res);
};

export { login, getBlogList };
