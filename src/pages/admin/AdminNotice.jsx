export default function AdminNotice({ notice }) {
  if (!notice) return null;
  return (
    <p className={`admin-notice ${notice.error ? 'admin-notice--error' : ''}`.trim()} role={notice.error ? 'alert' : 'status'}>
      {notice.title}
      {notice.text && <><br />{notice.text}</>}
    </p>
  );
}