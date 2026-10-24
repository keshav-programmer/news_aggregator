// localStorage can throw (private mode, quota, disabled), so never trust it.
export function readStorage(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key, value) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Persistence is a nice-to-have; the app keeps working without it.
  }
}
