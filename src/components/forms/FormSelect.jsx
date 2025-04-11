const FormSelect = ({
  label,
  icon,
  value,
  options,
  onChange,
  disable,
  disableOption,
  selectInput
}) => (
  
  <div className="collector-form-inputs">
    <label className="label">
      {icon} {label}
    </label>
    <select className={selectInput} value={value} name="collector" onChange={onChange} disabled={disable}>
      <option value="" disabled>
        {disableOption}
      </option>
      {options?.map((item) => (
        <option key={item.collector_code_id} value={item.collector_code_id}>
          {item.collector_name}
        </option>
      ))}
    </select>
  </div>
);

export default FormSelect;
