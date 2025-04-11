const FormInput = ({ classinput, label, icon, type, name, value, autoComplete, onChange, style, readOnly }) => (
  <div className="collector-form-input">
    <label className="label">
      {icon} {label}
    </label>
    <input
      type={type}
      name={name}
      style={style}
      value={value}
      autoComplete={autoComplete}
      onChange={onChange}
      readOnly={readOnly}
      className={classinput}
    />
  </div>
);

export default FormInput;
