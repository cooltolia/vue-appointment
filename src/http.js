import customErrorHandler from '@/common/customErrorHandler';
import axios from 'axios';
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions';

const http = axios.create({
    // baseURL: 'https://mc21.ru/app/ajax/',
    baseURL: '/app/ajax/',
    // headers: { 'Cache-Control': 'no-cache' },
    adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter, 2 * 1000)),
});

http.defaults.timeout = 30000;

http.interceptors.response.use(
    function(response) {
        if (response.data.error) {
            customErrorHandler(response.data.error);
        }
        return response;
    },
    function(error) {
        const {code, message, response} = error;
        console.log(code, message, response);
        if (message === 'Network Error') {
            customErrorHandler('error_network')
        }

        if (code === 'ECONNABORTED') {
            customErrorHandler('error');
        }

        if (response?.status === 400) {
            customErrorHandler('error');
        }

        return Promise.reject(error);
    }
);


export default http;
