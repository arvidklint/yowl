export default function Input({
  type = 'text',
  label,
  name,
  placeholder,
  onChange = () => {},
  onBlur = () => {},
  onEnter = () => {},
}) {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onEnter(e.target.value)}
        type={type}
        name={name}
        placeholder={placeholder || null}
        className="py-2 px-4 rounded width-full text-black"
      />
    </>
  )
}
