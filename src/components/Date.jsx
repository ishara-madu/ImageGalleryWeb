import Select from "react-select";
import { useState } from "react";
import Calander from "../images/svg/CalanderIcon";

const options = [
  {
    value: "any",
    label: <>
      <b>Any time</b></>,
  },
  {
    value: "7d",
    label: <>
      <b>Last 7 days</b></>,
  },
  {
    value: "30d",
    label: <>
      <b>Last 30 days</b></>,
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
    width: "280px",
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
          <Calander/>
          &nbsp; Upload date {label}
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