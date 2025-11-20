import { Dropdown, DropdownProps } from "@justfixnyc/component-library";
import { stateOptions } from "./stateOptions";

type StateSelectProps = Omit<DropdownProps, "options"> & { id?: string };

export const StateSelect: React.FC<StateSelectProps> = (props) => {
  return <Dropdown options={stateOptions} {...props} />;
};
