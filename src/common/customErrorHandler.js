import NotifyModal from '@/components/NotifyModal';

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
                document.body.style.paddingRight = vm.$store.state.scrollbarWidth + 'px';
            },
            closed: () => {
                document.body.style.overflow = null;
                document.body.style.paddingRight = null;
            },
        }
    );
}

export default customErrorHandler;
