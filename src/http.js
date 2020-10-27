import axios from 'axios';
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions';

const http = axios.create({
    baseURL: 'http://mc21.glavnaya.com/app/ajax/order',
    // headers: { 'Cache-Control': 'no-cache' },
    adapter: throttleAdapterEnhancer(cacheAdapterEnhancer(axios.defaults.adapter, 2 * 1000)),
});

export default http;
