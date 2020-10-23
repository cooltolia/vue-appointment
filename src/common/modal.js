export function onModalOpen(modal) {
    // const scrollBarWidth = window.scrollBarWidth || getScrollbarWidth();
    // window.scrollBarWidth = scrollBarWidth;

    if (modal) modal.children[0].style.paddingRight = scrollBarWidth + 'px';
    document.body.style.paddingRight = scrollBarWidth + 'px';

    // const fixedNodes = [document.querySelector('.main-header--fixed')];
    // fixedNodes.forEach(node => {
    //     if (node) node.style.right = scrollBarWidth + 'px';
    // });

    // modal.addEventListener('animationend', function addPadding() {
    //     // modal.children[0].style.paddingRight = scrollBarWidth + 'px';
    //     document.body.style.overflow = 'hidden'
    //     document.body.style.paddingRight = scrollBarWidth + 'px';
    //     this.removeEventListener('animationend', addPadding);
    // });
}

export function onModalClose(modal, remove = true, modalCopy) {
    modal.children[0].style.paddingRight = '';
    document.body.style.paddingRight = '';

    const fixedNodes = [document.querySelector('.main-header--fixed')];
    fixedNodes.forEach(node => {
        if (node) node.style.right = '0';
    });

    if (remove) {
        modal.addEventListener('animationend', function removeModal() {
            this.remove();
            this.removeEventListener('animationend', removeModal);
        });
    }
    if (modalCopy) {
        // clone to delete all event listeners
        modal.addEventListener('animationend', function updateModal() {
            modalCopy.classList.remove('is-open');
            this.removeEventListener('animationend', updateModal);
            modal.remove();

            document.body.append(modalCopy);
        });
    }
}
