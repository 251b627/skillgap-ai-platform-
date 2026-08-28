/**
 * Generic multi-field text search helper.
 */
export function filterBySearchTerm(items, searchTerm, fields = []) {
  if (!searchTerm || !searchTerm.trim()) return items;
  const term = searchTerm.toLowerCase().trim();

  return items.filter((item) => {
    if (fields.length > 0) {
      return fields.some((field) => {
        const val = item[field];
        if (val === null || val === undefined) return false;
        return String(val).toLowerCase().includes(term);
      });
    }
    return Object.values(item).some((val) => {
      if (val === null || val === undefined) return false;
      if (typeof val === 'object') return false;
      return String(val).toLowerCase().includes(term);
    });
  });
}
