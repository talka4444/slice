import { StepType } from "./step-type.interface";

export interface Step {
  id: string;
  name: string;
  type: StepType;
  dependencies: string[];
  params?: any;
}
