import Select from "react-select";
import { useState } from "react";
import SortByIcon from "../images/svg/SortByIcon";

const options = [
  {
    value: "relavance",
    label: <>
      <b>Relavance</b></>,
  },
  {
    value: "newest",
    label: <>
      <b>Newest</b></>,
  },
  {
    value: "curated",
    label: <>
      <b>Curated</b></>,
  },
];

const customStyles = {
  option: (defaultStyles, state) => ({
    ...defaultStyles,
    color: state.isSelected ? "var(--text-color)" : "var(--text-color3)",
    backgroundColor: state.isSelected ? "white" : "white",
  }),
  control: (defaultStyles) => ({
    ...defaultStyles,
    width: "220px",
    borderRadius: "10px",
    padding: "0px",
    fontSize: "var(--font-size2)",
    backgroundColor: "transparent",
    border: "1px solid var(--primary-color)",
  }),
  singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#000" }),
};

export default function App() {
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const formatOptionLabel = ({ label, value }, { context }) => (
    <>
      {context === 'value' ? (
        <>
          <SortByIcon/>
          &nbsp; Sort by {label}
        </>
      ) : (
        <>
          {label}
        </>
      )}
    </>
  );

  return (
    <div>
      <Select
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={options}
        styles={customStyles}
        formatOptionLabel={formatOptionLabel}
      />
    </div>
  );
}
