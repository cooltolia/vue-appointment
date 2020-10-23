const $$ = {
    currentRequestAnimationFrame: null,

    fadeIn(el, { display = 'block', speed = 200 } = {}) {
        return new Promise(resolve => {
            const animationSpeed = 16 / speed;
            el.style.opacity = 0;
            el.style.display = display;

            const fade = () => {
                let id;
                var val = parseFloat(el.style.opacity);
                if (!((val += animationSpeed) > 1)) {
                    el.style.opacity = val;
                    id = requestAnimationFrame(fade);
                } else {
                    el.style.opacity = 1;
                    resolve();
                }

                return id;
            };

            fade();
        });
    },

    fadeOut(el, { speed = 200 } = {}) {
        return new Promise(resolve => {
            const animationSpeed = 16 / speed;
            el.style.opacity = 1;

            const fade = () => {
                let id;
                if ((el.style.opacity -= animationSpeed) < 0) {
                    el.style.display = 'none';
                    resolve();
                } else {
                    id = requestAnimationFrame(fade);
                }

                return id;
            };

            fade();
        });
    },

    fadeToggle(el, { speed = 200, display = 'block' } = {}) {
        if ($$.isHidden(el)) {
            this.fadeIn(el, { speed: speed, display: display });
        } else {
            this.fadeOut(el, { speed: speed });
        }
    },

    /** @param {HTMLElement} el */
    show(el, { display = 'block', classList = '' } = {}) {
        el.style.display = display;
        if (classList.length > 0) el.classList.add(classList);
    },

    /** @param {HTMLElement} el */
    hide(el, { classList = '' } = {}) {
        el.style.display = 'none';
        if (classList.length > 0) el.classList.remove(classList);
    },

    /** @param {HTMLElement} el */
    toggle(el, { display = 'block', classList = '' } = {}) {
        if (getComputedStyle(el).display === 'none') {
            el.style.display = display;
            if (classList.length > 0) el.classList.add(classList);
        } else {
            el.style.display = 'none';
            if (classList.length > 0) el.classList.remove(classList);
        }
    },

    /** @param {HTMLElement} el */
    slideDown(el, { speed = 300, display = 'block' } = {}) {
        let resolve, reject;
        const promise = new Promise((promiseResolve, promiseReject) => {
            resolve = promiseResolve;
            reject = promiseReject;

            let startHeight = 0;
            let startPaddingTop = 0;
            let startPaddingBottom = 0;

            const elStyles = window.getComputedStyle(el);
            const paddingTop = parseInt(elStyles.paddingTop);
            const paddingBottom = parseInt(elStyles.paddingBottom);

            el.style.height = startHeight + 'px';
            el.style.overflow = 'hidden';
            el.style.display = 'block';
            const height = el.scrollHeight;

            el.style.paddingTop = startPaddingTop;
            el.style.paddingBottom = startPaddingBottom;

            const heightAnimationSpeed = (height / speed) * 16;
            const paddingTopAnimationSpeed = (paddingTop / speed) * 16;
            const paddingBottomAnimationSpeed = (paddingBottom / speed) * 16;
            el.style.display = display;

            const slide = () => {
                let id;
                let newHeight = (startHeight += heightAnimationSpeed);
                let newPaddingTop = (startPaddingTop += paddingTopAnimationSpeed);
                let newPaddingBottom = (startPaddingBottom += paddingBottomAnimationSpeed);
                el.style.height = newHeight + 'px';
                el.style.paddingTop = newPaddingTop + 'px';
                el.style.paddingBottom = newPaddingBottom + 'px';

                if (newHeight > height) {
                    this.currentRequestAnimationFrame = null;
                    el.style.cssText = `display: ${display}`;
                    resolve();
                } else {
                    this.currentRequestAnimationFrame = requestAnimationFrame(slide);
                }

                return id;
            };

            slide();
        });

        return {
            promise,
            cancel: () => {
                cancelled = true;
                reject({ reason: 'cancelled' });
            },
        };
    },

    /** @param {HTMLElement} el */
    slideUp(el, { speed = 300 } = {}) {
        let resolve, reject;
        const promise = new Promise((promiseResolve, promiseReject) => {
            resolve = promiseResolve;
            reject = promiseReject;

            const elStyles = window.getComputedStyle(el);
            const height = el.offsetHeight;
            const paddingTop = parseInt(elStyles.paddingTop);
            const paddingBottom = parseInt(elStyles.paddingBottom);

            let startHeight = height;
            let startPaddingTop = paddingTop;
            let startPaddingBottom = paddingBottom;

            el.style.height = startHeight + 'px';
            el.style.overflow = 'hidden';

            const heightAnimationSpeed = (height / speed) * 16;
            const paddingTopAnimationSpeed = (paddingTop / speed) * 16;
            const paddingBottomAnimationSpeed = (paddingBottom / speed) * 16;

            const slide = () => {
                let id;
                let newHeight = (startHeight -= heightAnimationSpeed);
                let newPaddingTop = (startPaddingTop -= paddingTopAnimationSpeed);
                let newPaddingBottom = (startPaddingBottom -= paddingBottomAnimationSpeed);
                el.style.height = newHeight + 'px';
                el.style.paddingTop = newPaddingTop + 'px';
                el.style.paddingBottom = newPaddingBottom + 'px';

                if (newHeight < 0) {
                    el.style.cssText = `display: none`;

                    this.currentRequestAnimationFrame = null;
                    resolve();
                } else {
                    this.currentRequestAnimationFrame = requestAnimationFrame(slide);
                }

                return id;
            };

            slide();
        });

        return {
            promise,
            cancel: () => {
                cancelled = true;
                reject({ reason: 'cancelled' });
            },
        };
    },

    slideToggle(el, { speed = 200, display = 'block' } = {}) {
        if ($$.isHidden(el)) {
            this.slideDown(el, { speed: speed, display: display });
        } else {
            this.slideUp(el, { speed: speed });
        }
    },

    scrollTo(target, offset = 50) {
        if (!target) {
            console.log('target: ', target);
            return;
        }
        const scrollPosition = target.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
            top: scrollPosition - offset,
            behavior: 'smooth',
        });
    },

    isHidden(el) {
        let style = window.getComputedStyle(el);
        return style.display === 'none';
    },
};

export default $$;
