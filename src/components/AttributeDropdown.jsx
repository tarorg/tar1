import React from 'react';
import Select from 'react-select';
import '../styles/CustomSelect.css';

const AttributeDropdown = ({ options, value, onChange, placeholder }) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: 'unset',
      height: 'auto',
      background: 'transparent',
      border: 'none',
      boxShadow: 'none',
      cursor: 'pointer',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0',
    }),
    singleValue: (provided) => ({
      ...provided,
      margin: '0',
      color: 'inherit',
      fontSize: 'inherit',
    }),
    input: (provided) => ({
      ...provided,
      margin: '0',
      padding: '0',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: '0 4px',
    }),
    menu: (provided) => ({
      ...provided,
      margin: '4px 0',
    }),
  };

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="custom-select"
      classNamePrefix="custom-select"
      styles={customStyles}
    />
  );
};

export default AttributeDropdown;
