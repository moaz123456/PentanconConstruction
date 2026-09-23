export const slugify = (text = '') =>
  text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06ff]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const initials = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

export const formatArea = (area) =>
  area == null ? null : `${Number(area).toLocaleString('en-US', { maximumFractionDigits: 2 })} m²`;

export const formatDuration = (months) => {
  if (months == null) return null;
  if (months === 1) return '1 month';
  if (months % 12 === 0 && months >= 12) {
    const years = months / 12;
    return years === 1 ? '1 year' : `${years} years`;
  }
  return `${months} months`;
};

export const formatDate = (isoDate) => {
  if (!isoDate) return null;
  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
};

export const statusLabel = (status) =>
  ({ Planned: 'Planned', InProgress: 'In progress', Completed: 'Completed' })[status] ?? status;
