function toCamelCase(str) {
  return str
    .split(/[_-]/)
    .map((a, i) => (i ? a.slice(0, 1).toUpperCase() + a.slice(1) : a))
    .join('');
}

console.log(toCamelCase('the_stealth_warrior'));
