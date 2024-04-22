export function isTokenValid() {
  const expiryTime = localStorage.getItem("token_expiry");
  if (!expiryTime) return false;

  return Date.now() < parseInt(expiryTime);
}

export function getToken() {
  if (isTokenValid()) {
    return localStorage.getItem("token");
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("token_expiry");
    return null;
  }
}
