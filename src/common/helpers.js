export const debounce = function (func, wait, immediate) {
    let timeout;
    return function () {
        const context = this,
            args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

export const throttle = function (func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function () {
        previous = options.leading === false ? 0 : Date.now();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function () {
        var now = Date.now();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
};

export const measureScrollbar = function (force = false) {
    // return cached value if we have some
    if (force !== true && typeof measureScrollbar.__cache === 'number') {
        console.log('returned from cache');
        return measureScrollbar.__cache;
    }

    const el = document.createElement('div');
    const { style } = el;

    style.display = 'block';
    style.position = 'absolute';
    style.width = '100px';
    style.height = '100px';
    style.left = '-999px';
    style.top = '-999px';
    style.overflow = 'scroll';

    document.body.insertBefore(el, null);

    const { clientWidth } = el;

    if (clientWidth === 0) {
        document.body.removeChild(el);
        return undefined;
    }

    measureScrollbar.__cache = 100 - clientWidth;
    document.body.removeChild(el);

    return measureScrollbar.__cache;
};

const setCookie = function (key, value, expiry) {
    const expires = new Date();
    expires.setTime(expires.getTime() + expiry * 24 * 60 * 60 * 1000);
    document.cookie = key + '=' + value + '; path=/ ;expires=' + expires.toUTCString();
};

/**
 * @param {string} value email input value
 * @returns {boolean}
 */
function isEmailValid(value) {
    const emailRegex = /(?:[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.))+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]/i;
    const result = value.match(emailRegex);
    if (result && result[0]) return true;
    return false;
}

function isPhoneValid(phone) {
    return Inputmask.isValid(phone, {
        mask: phoneMask,
    });
}

function validatePhone(phone) {
    const isValid = Inputmask.isValid(phone.value, {
        mask: phoneMask,
    });

    if (isValid) {
        phone.parentElement.classList.add('valid');
    } else {
        showInputError(phone, 'Не верно введен номер телефона');
    }

    return isValid;
}

function validateBirthday(date) {
    const isValid = Inputmask.isValid(date.value, { alias: 'datetime', inputFormat: 'dd.mm.yyyy' });

    if (isValid) {
        date.parentElement.classList.add('valid');
    } else {
        showInputError(date, 'Неверная дата рождения');
    }

    return isValid;
}

/**
 * @param {NodeList} inputs
 */
function hideInputErrors(inputs) {
    inputs.forEach((input) => {
        const wrapper = input.parentElement;
        wrapper.classList.remove('error');
    });
}

/**
 * @param {HTMLInputElement} input
 * @param {string} [errorText] set custom error text
 */
function showInputError(input, errorText) {
    const wrapper = input.parentElement;
    wrapper.classList.add('error');
    wrapper.classList.remove('valid');

    if (errorText) {
        const error = wrapper.querySelector('.error');
        error.textContent = errorText;
    }
}

/**
 * @param {HTMLInputElement} input
 */
function hideSingleInputError(input) {
    const wrapper = input.parentElement;
    wrapper.classList.remove('error');
}

export function createNewEvent(eventName, data) {
    (function () {
        if (typeof window.CustomEvent === 'function') return false;

        function CustomEvent(event, params) {
            params = params || {
                bubbles: false,
                cancelable: false,
                detail: undefined,
            };
            const evt = document.createEvent('CustomEvent');
            evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
            return evt;
        }

        CustomEvent.prototype = window.Event.prototype;

        window.CustomEvent = CustomEvent;
    })();

    let event = new CustomEvent(eventName, data);
    return event;
}

function numberWithSpaces(n) {
    return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export function lazyLoadImages(imagesNodes, opts = {}) {
    const options = {
        rootMargin: opts.rootMargin || '0px 0px 100% 0px',
        root: opts.root || null,
        threshold: opts.threshold || 0,
    };
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const image = entry.target;
                        const src = image.getAttribute('data-src');
                        if (!src) return;

                        image.addEventListener('load', () => {
                            image.classList.add('loaded');
                            observer.unobserve(entry.target);
                        });
                        image.src = src;
                    }
                });
            },
            { rootMargin: options.rootMargin, root: options.root, threshold: options.threshold }
        );
        imagesNodes.forEach((image) => observer.observe(image));
    } else {
        imagesNodes.forEach((image) => {
            const src = image.getAttribute('data-src');
            if (!src) return;
            image.src = src;
            image.classList.add('loaded');
        });
    }
}

export function lazyLoadPictures(imagesContainers, opts = {}) {
    const options = {
        rootMargin: opts.rootMargin || '0px 0px 100% 0px',
        root: opts.root || null,
        threshold: opts.threshold || 0,
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const imageContainer = entry.target;
                        const image = imageContainer.querySelectorAll('img, source');

                        image.forEach((img) => {
                            if (img.dataset && img.dataset.src) {
                                img.src = img.dataset.src;
                            }

                            if (img.dataset && img.dataset.srcset) {
                                img.srcset = img.dataset.srcset;
                            }
                        });
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: options.rootMargin, root: options.root, threshold: options.threshold }
        );

        imagesContainers.forEach((container) => observer.observe(container));
    } else {
        imagesContainers.forEach((container) => {
            const image = container.querySelector('img');
            const source = container.querySelector('source');

            image.src = source.dataset.srcset;
        });
    }
}

export function triggerAnimation(items, opts = {}) {
    const options = {
        rootMargin: opts.rootMargin || '0px 0px -20% 0px',
        root: opts.root || null,
        threshold: opts.threshold || 0,
    };

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');

                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: options.rootMargin, root: options.root, threshold: options.threshold }
        );
        items.forEach((item) => observer.observe(item));
    } else {
        setTimeout(() => {
            items.forEach((item) => {
                item.classList.add('animated');
            });
        }, 300);
    }
}

/**
 * Returns an array with arrays of the given size.
 *
 * @param {[]} arr  array to split
 * @param {number} chunk_size  Size of every group
 */
function chunkArray(arr, chunk_size) {
    let index = 0;
    const arrayLength = arr.length;
    let tempArray = [];

    for (index = 0; index < arrayLength; index += chunk_size) {
        const chunk = arr.slice(index, index + chunk_size);
        tempArray.push(chunk);
    }

    return tempArray;
}

export const getSiblings = function (elem) {
    // Setup siblings array and get the first sibling
    var siblings = [];
    var sibling = elem.parentNode.firstChild;

    // Loop through each sibling and push to the array
    while (sibling) {
        if (sibling.nodeType === 1 && sibling !== elem) {
            siblings.push(sibling);
        }
        sibling = sibling.nextSibling;
    }

    return siblings;
};
