import axios from 'axios';
import { cacheAdapterEnhancer, throttleAdapterEnhancer } from 'axios-extensions';
import NotifyModal from '@/components/NotifyModal';

const http = axios.create({
    // baseURL: 'http://109.167.251.52/app/ajax/',
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

        return Promise.reject(error);
    }
);

function customErrorHandler(type = 'error') {
    const vm = window.onlineAppointmentInstance;
    vm.$modal.show(
        NotifyModal,
        { type },
        {
            adaptive: true,
            scrollable: true,
            width: '90%',
            maxWidth: 920,
            height: 'auto',
            minHeight: Infinity,
        },
        {
            'before-open': () => {
                document.body.style.overflow = 'hidden';
                document.body.style.paddingRight =
                    vm.$store.state.scrollbarWidth + 'px';
            },
            closed: () => {
                document.body.style.overflow = null;
                document.body.style.paddingRight = null;
            },
        }
    );
}


export default http;
