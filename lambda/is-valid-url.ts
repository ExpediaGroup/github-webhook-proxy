export function isValidUrl(url: string) {
  try {
    new URL(url);
  } catch (e) {
    console.error('Endpoint is not a valid encoded url');
    return false;
  }
  return true;
}
