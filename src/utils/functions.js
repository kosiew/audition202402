export function debounce(func, delay) {
  if (typeof func !== 'function') {
    throw new TypeError('First argument to debounce must be a function');
  }
  if (typeof delay !== 'number') {
    throw new TypeError('Second argument to debounce must be a number');
  }

  let timeoutId;
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
