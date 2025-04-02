const FormListSelect = ({ 
    label,
    value,
    name,
    id,
    onChange,
    disabled,
    options,
    className,
    style, 
}) => (

  <div className="div-inputs">
    <label htmlFor={id} className={className}>
      {label}
    </label>
    <select
      onChange={onChange}
      value={value}
      name={name}
      disabled={disabled}
      style={style}
      id={id}
    >
    {options && options.map((item) => (
        <option key={item} value={item}>
            {item}
        </option>
    ))}
    </select>
  </div>
)   
export default FormListSelect;
