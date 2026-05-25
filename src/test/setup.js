import '@testing-library/jest-dom'

// Radix UI uses pointer capture APIs not implemented in jsdom
window.Element.prototype.hasPointerCapture = () => false
window.Element.prototype.setPointerCapture = () => {}
window.Element.prototype.releasePointerCapture = () => {}
