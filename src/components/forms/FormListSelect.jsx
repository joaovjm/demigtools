const FormListSelect = ({ 
    label,
    value,
    name,
    id,
    onChange,
    disabled,
    options,
    defaultValue,
}) => (

  <div className="input-field">
    <label htmlFor={id}>
      {label}
    </label>
    <select
      onChange={onChange}
      value={value}
      name={name}
      disabled={disabled}
      id={id}
      defaultValue={defaultValue}
    >
      <option value="" disabled>selecione...</option>
    {options && options.map((item) => (
        <option key={item} value={item}>
            {item}
        </option>
    ))}
    </select>
  </div>
)   
export default FormListSelect;
