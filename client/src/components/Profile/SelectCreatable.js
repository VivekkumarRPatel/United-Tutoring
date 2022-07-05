import CreatableSelect from 'react-select/creatable';

export const SelectCreatable = ({
  className,
  placeholder,
  field,
  form,
  options,
  isMulti = true
}) => {
  const onChange = (option) => {
    form.setFieldValue(
      field.name,
      (option).map((item) => item.value)
    );
  };

  const getValue = () => {
    if (options) {
      return options.filter(option => field.value.indexOf(option.value) >= 0);
    } else {
      return [];
    }
  };

  return (
    <CreatableSelect
      className={className}
      name={field.name}
      value={getValue()}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      isMulti={isMulti}
    />
  );
};

export default SelectCreatable;