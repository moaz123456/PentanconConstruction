export default function StatusMessage({ title, text, children, tone = 'neutral' }) {
  return (
    <div className={`status status--${tone}`} role={tone === 'error' ? 'alert' : 'status'}>
      <p className="status__title">{title}</p>
      {text && <p className="status__text">{text}</p>}
      {children}
    </div>
  );
}
