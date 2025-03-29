const FormDonorInput = (
 { label,
  type,
  value,
  onChange,
  readOnly,
  disabled,
  style,
  className
}
) => (

  
  <div className="div-inputs">
    <label className={className}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      disabled={disabled}
      style={style}
      
    />
  </div>
);

export default FormDonorInput;
