export function getValue(key) {
  return sessionStorage.getItem(key)
}

export function setValue(key, value) {
  if(typeof value === 'object') {
    value = JSON.stringify(value)
  }
  return sessionStorage.setItem(key, value)
}

export function removeValue(key) {
  return sessionStorage.removeItem(key)
}
