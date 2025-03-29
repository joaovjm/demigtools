const FormInput = ({ label, icon, type, name, value, onChange, style }) => (
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
    />
  </div>
);

export default FormInput;
