/**
 * @module @github/textarea-autosize
 */
export default function autosize(textarea) {
    var previousValue = null;
    var isUserResized = false;
    var x;
    var y;
    var height;
    function onUserResize(event) {
        if (x !== event.clientX || y !== event.clientY) {
            var newHeight = textarea.style.height;
            if (height && height !== newHeight) {
                isUserResized = true;
                textarea.style.maxHeight = '';
                textarea.removeEventListener('mousemove', onUserResize);
            }
            height = newHeight;
        }
        x = event.clientX;
        y = event.clientY;
    }
    var document = textarea.ownerDocument;
    var documentElement = document.documentElement;
    function overflowOffset() {
        var offsetTop = 0;
        var el = textarea;
        while (el !== document.body && el !== null) {
            offsetTop += el.offsetTop || 0;
            el = el.offsetParent;
        }
        var top = offsetTop - document.defaultView.pageYOffset;
        var bottom = documentElement.clientHeight - (top + textarea.offsetHeight);
        return { top: top, bottom: bottom };
    }
    function sizeToFit() {
        if (isUserResized)
            return;
        if (textarea.value === previousValue)
            return;
        if (textarea.offsetWidth <= 0 && textarea.offsetHeight <= 0)
            return;
        var _a = overflowOffset(), top = _a.top, bottom = _a.bottom;
        if (top < 0 || bottom < 0) {
            return;
        }
        var textareaStyle = getComputedStyle(textarea);
        var topBorderWidth = Number(textareaStyle.borderTopWidth.replace(/px/, ''));
        var bottomBorderWidth = Number(textareaStyle.borderBottomWidth.replace(/px/, ''));
        var isBorderBox = textareaStyle.boxSizing === 'border-box';
        var borderAddOn = isBorderBox ? topBorderWidth + bottomBorderWidth : 0;
        var maxHeight = Number(textareaStyle.height.replace(/px/, '')) + bottom;
        textarea.style.maxHeight = maxHeight - 100 + "px";
        var container = textarea.parentElement;
        if (container instanceof HTMLElement) {
            var containerHeight = container.style.height;
            container.style.height = getComputedStyle(container).height;
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + borderAddOn + "px";
            container.style.height = containerHeight;
            height = textarea.style.height;
        }
        previousValue = textarea.value;
    }
    function onFormReset() {
        isUserResized = false;
        textarea.style.height = '';
        textarea.style.maxHeight = '';
    }
    textarea.addEventListener('mousemove', onUserResize);
    textarea.addEventListener('input', sizeToFit);
    textarea.addEventListener('change', sizeToFit);
    var form = textarea.form;
    if (form)
        form.addEventListener('reset', onFormReset);
    if (textarea.value)
        sizeToFit();
    return {
        unsubscribe: function () {
            textarea.removeEventListener('mousemove', onUserResize);
            textarea.removeEventListener('input', sizeToFit);
            textarea.removeEventListener('change', sizeToFit);
            if (form)
                form.removeEventListener('reset', onFormReset);
        }
    };
}
