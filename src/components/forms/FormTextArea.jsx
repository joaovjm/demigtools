const FormTextArea = ({
  label,
  value,
  onChange,
  readOnly,
  className,
  style
}) => (
  <div className="div-inputs" >
    <label className={className}>
      {label}
    </label>
    <textarea
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      style={style}
    />
  </div>
);

export default FormTextArea;
