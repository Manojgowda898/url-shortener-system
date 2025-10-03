// ============================================
// FILE: src/utils/exportUtils.js
// ============================================

/**
 * Export utilities for data export
 */

/**
 * Export URLs to CSV format
 * @param {Array} urls - Array of URL objects
 * @returns {void} - Downloads CSV file
 */
export const exportToCSV = (urls) => {
  const headers = ['Short URL', 'Original URL', 'Clicks', 'Created', 'Expires'];
  const rows = urls.map(url => [
    `https://${url.short}`,
    url.long,
    url.clicks,
    new Date(url.created).toLocaleString(),
    url.expiresAt ? new Date(url.expiresAt).toLocaleString() : 'Never'
  ]);

  const csv = [headers, ...rows].map(row => 
    row.map(cell => `"${cell}"`).join(',')
  ).join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `shortened-urls-${Date.now()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

/**
 * Export URLs to JSON format
 * @param {Array} urls - Array of URL objects
 * @returns {void} - Downloads JSON file
 */
export const exportToJSON = (urls) => {
  const json = JSON.stringify(urls, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `shortened-urls-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};
