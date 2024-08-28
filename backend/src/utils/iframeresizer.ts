// iframeresizer.ts

const generateIframeResizerScript = (): string => {
  return `
(function() {
    const IFRAME_ID = 'resizable-iframe';
    const ALLOWED_ORIGIN = 'http://localhost:5173'; // Adjust this to match your iframe's origin
    const INITIAL_HEIGHT = 500;
    const HEIGHT_ADJUSTMENT = 16;
    const RESIZE_INTERVAL = 100;

    function setupIframeResizer() {
        const iframe = document.getElementById(IFRAME_ID);
        if (!iframe) {
            console.error('Iframe with id "' + IFRAME_ID + '" not found');
            return;
        }

        iframe.style.height = INITIAL_HEIGHT + 'px';

        let resizeTimer = null;

        window.addEventListener('message', function(event) {
            if (event.origin !== ALLOWED_ORIGIN) return;
            
            if (event.data && event.data.type === 'resize') {
                console.log('Received height:', event.data.height);
                iframe.style.height = (event.data.height + HEIGHT_ADJUSTMENT) + 'px';
            }
        });

        function requestIframeHeight() {
            if (iframe.contentWindow) {
                iframe.contentWindow.postMessage({ type: 'requestHeight' }, ALLOWED_ORIGIN);
            }
        }

        function startResizeCheck() {
            if (resizeTimer) clearInterval(resizeTimer);
            resizeTimer = setInterval(requestIframeHeight, RESIZE_INTERVAL);
        }

        iframe.onload = function() {
            requestIframeHeight();
            startResizeCheck();
        };

        window.addEventListener('resize', requestIframeHeight);
        startResizeCheck();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupIframeResizer);
    } else {
        setupIframeResizer();
    }
})();
`;
};

export default generateIframeResizerScript;