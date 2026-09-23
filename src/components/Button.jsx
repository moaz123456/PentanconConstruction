// A parallelogram button that echoes the slanted stem of the logo.
export default function Button({ as: Tag = 'button', variant = 'primary', className = '', children, ...rest }) {
  return (
    <Tag className={`btn btn--${variant} ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
