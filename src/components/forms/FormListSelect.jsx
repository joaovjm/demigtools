const FormListSelect = ({ 
    label,
    value,
    onChange,
    disabled,
    options,
    className,
    style, 
}) => (

  <div className="div-inputs">
    <label htmlFor="dropdown" className={className}>
      {label}
    </label>
    <select
      onChange={onChange}
      value={value}
      disabled={disabled}
      style={style}
      id="dropdown"
    >
    {options.map((item) => (
        <option key={item} value={item}>
            {item}
        </option>
    ))}
    {console.log(options)}
    </select>
  </div>
)   
export default FormListSelect;
