function SelectInput({ label, value, onChange, options, disabled = false, getLabel, placeholder, disabledPlaceholder }) {
  return (
    <div className="select-input">
      <label className="select-label">{label}</label>
      <select
        className="select-control"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      >
        {disabled ? (
          <option value="" disabled>{disabledPlaceholder ?? 'Select...'}</option>
        ) : (
          <option value="">{placeholder ?? '-- Select --'}</option>
        )}
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {getLabel ? getLabel(opt) : opt}
          </option>
        ))}
      </select>
    </div>
  );
}

export default SelectInput;
