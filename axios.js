'use strict';

var utils = require('./utils');
var bind = require('./helpers/bind');
var Axios = require('./core/Axios');
var mergeConfig = require('./core/mergeConfig');
var defaults = require('./defaults');

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */


function createInstance(defaultConfig) {
    // 实例化 Axios
    var context = new Axios(defaultConfig);


    // 暂时没搞懂 回来再看
    // 自定义 bind 方法 返回一个函数（）=> {Axios.prototype.request.apply(context,args)}
    var instance = bind(Axios.prototype.request, context);

    // 将 Axios.prototype 上的所有方法的执行上下文绑定到 context , 并且继承给 instance
    utils.extend(instance, Axios.prototype, context);
     // 将 context 继承给 instance
    utils.extend(instance, context);

    return instance;
}

// 创建一个默认的配置
// defaults 暂时没搞懂
var axios = createInstance(defaults);

// 下面都是为 axios 实例化的对象增加不同的方法。
axios.Axios = Axios;

// 利用工厂函数创建 新的实例
axios.create = function create(instanceConfig) {
    return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = require('./cancel/Cancel');
axios.CancelToken = require('./cancel/CancelToken');
axios.isCancel = require('./cancel/isCancel');

// Expose all/spread
axios.all = function all(promises) {
    return Promise.all(promises);
};
axios.spread = require('./helpers/spread');

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;
