"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inView = void 0;
function inView(node) {
    var observer = new IntersectionObserver(function (_a) {
        var entry = _a[0];
        if (entry.isIntersecting) {
            node.dispatchEvent(new CustomEvent('enterView'));
            observer.disconnect();
        }
    }, { threshold: 0.1 });
    observer.observe(node);
    return {
        destroy: function () {
            observer.disconnect();
        }
    };
}
exports.inView = inView;
