/**
 * 网络请求配置
 */
import axios from 'axios';
// import qs from 'qs';

/**
 * 如果有多个请求都是 403 就需要这个开关 来控制message的展示个数
 * 展示一个之后  关闭阀门
 */
let messageFlag = false;

const goLoginFun = () => {
  if (messageFlag === false) {
    messageFlag = true;
    window.location.hash = '#/login';
    setTimeout(() => {
      messageFlag = false;
    }, 2000);
  }
};

axios.defaults.timeout = 100000;
// console.log('process xxxxxxxx', process.env, process.env.REACT_APP_BASE_URL)
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
// axios.defaults.baseURL = 'https://jpsite.kafukeji.com';
// axios.defaults.baseURL = 'https://www.partsbankjp.com'; // 线上
// axios.defaults.baseURL = 'http://101.43.127.93:8380';

// const paramsSerializer = params => {
//   return qs.stringify(params, { arrayFormat: 'repeat' });
// };

/**
 * http request 拦截器
 */
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('X-Litemall-Token');
    config.data = JSON.stringify(config.data);
    config.headers = {
      'Content-Type': 'application/json',
      'X-Litemall-Token': token,
    };
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

/**
 * http response 拦截器
 */
axios.interceptors.response.use(
  response => {
    if (response.data.errno === 501) {
      goLoginFun();
      throw new Error('未登录');
    }
    return response;
  },
  error => {
    console.log('请求出错：', error);
  }
);

/**
 * 封装get方法
 * @param url  请求url
 * @param params  请求参数
 * @returns {Promise}
 */
export function get(url, params = {}) {
  const flag = Object.keys(params).some(
    key => Array.isArray(params[key]) && params[key].length > 0
  );
  let _url = url;
  let _params = params;
  if (flag) {
    // _url = `${url}?${paramsSerializer(params)}`;
    _params = {};
  }
  return new Promise((resolve, reject) => {
    axios
      .get(_url, {
        params: _params,
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data) {
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(
      response => {
        //关闭进度条
        resolve(response.data);
      },
      err => {
        reject(err);
      }
    );
  });
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data).then(
      response => {
        resolve(response.data);
      },
      err => {
        msag(err);
        reject(err);
      }
    );
  });
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data).then(
      response => {
        resolve(response.data);
      },
      err => {
        msag(err);
        reject(err);
      }
    );
  });
}

//统一接口处理，返回数据
const request = function (fecth, url, param, config) {
  return new Promise((resolve, reject) => {
    switch (fecth) {
      case 'get':
        get(url, param)
          .then(function (response) {
            if (config?.isFull) {
              resolve(response);
            } else {
              resolve(response?.data);
            }
          })
          .catch(function (error) {
            console.log('get request GET failed.', error);
            reject(error);
          });
        break;
      case 'post':
        post(url, param)
          .then(function (response) {
            resolve(response);
          })
          .catch(function (error) {
            console.log('get request POST failed.', error);
            reject(error);
          });
        break;
      default:
        break;
    }
  });
};
export default request;

//失败提示
function msag(err) {
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        alert(err.response.data.error.details);
        break;
      case 401:
        alert('未授权，请登录');
        break;

      case 403:
        alert('拒绝访问');
        break;

      case 404:
        alert('请求地址出错');
        break;

      case 408:
        alert('请求超时');
        break;

      case 500:
        alert('服务器内部错误');
        break;

      case 501:
        alert('服务未实现');
        break;

      case 502:
        alert('网关错误');
        break;

      case 503:
        alert('服务不可用');
        break;

      case 504:
        alert('网关超时');
        break;

      case 505:
        alert('HTTP版本不受支持');
        break;
      default:
    }
  }
}
