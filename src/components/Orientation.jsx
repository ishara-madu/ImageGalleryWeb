import Select from "react-select";
import { useState } from "react";
import OrientationAll from "../images/svg/OrientationAllIcon";
import Portrait from "../images/svg/PortraitIcon";
import Landscape from "../images/svg/LandscapeIcon";

const options = [
  {
    value: "all",
    label: (
      <>
        <OrientationAll/>
        &nbsp; Orientation <b>All</b>
      </>
    ),
  },
  { value: "portrait", label: (
    <>
     <Portrait/>
      &nbsp; <b>Portrait</b>
    </>
  ) },
  { value: "landscape", label: (
    <>
      <Landscape/>
      &nbsp; <b>Landscape</b>
    </>
  ), },
];

const customStyles = {
  option: (defaultStyles, state) => ({
    // You can log the defaultStyles and state for inspection
    // You don't need to spread the defaultStyles
    ...defaultStyles,
    color: state.isSelected ? "var(--text-color)" : "var(--text-color3)",
    backgroundColor: state.isSelected ? "white" : "white",
  }),

  control: (defaultStyles) => ({
    ...defaultStyles,
    // Notice how these are all CSS properties
    width: "200px",
    borderRadius:"10px",
    padding:"0px",
    fontSize:"var(--font-size2)",
    backgroundColor: "transparent",
    border: "1px solid var(--primary-color)",

  }),
  singleValue: (defaultStyles) => ({ ...defaultStyles, color: "#000" }),
};

export default function App() {
  const [selectedOption, setSelectedOption] = useState(options);

  return (
    <div>
      <Select
        defaultValue={selectedOption}
        onChange={setSelectedOption}
        options={options}
        styles={customStyles}
      />
    </div>
  );
}