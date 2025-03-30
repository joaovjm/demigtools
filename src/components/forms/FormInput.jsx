const FormInput = ({ label, icon, type, name, value, onChange, style, readOnly }) => (
  <div className="collector-form-input">
    <label className="label">
      {icon} {label}
    </label>
    <input
      type={type}
      name={name}
      style={style}
      value={value}
      onChange={onChange}
      readOnly={readOnly}
    />
  </div>
);

export default FormInput;
