/**
 * Dynamic API URL resolver to support cross-platform builds like Capacitor APKs.
 * Directs mobile and local network traffic to the live web API server,
 * while maintaining relative routing for local preview and development web servers.
 */
export function getApiUrl(path: string): string {
  const origin = window.location.origin;
  
  // Check if we are running under Capacitor webviews or pure offline environments
  const isCapacitor = origin.startsWith('capacitor://') || origin.startsWith('http://localhost') && !origin.includes(':3000');
  const isLocalFile = origin.startsWith('file://') || origin === 'null' || !origin;
  
  if (isCapacitor || isLocalFile) {
    // Direct mobile app instances to the fully certified production endpoint
    return `https://ais-pre-gp5s3wykc7zynnbtlllldv-848685434200.europe-west2.run.app${path}`;
  }
  
  return path;
}
