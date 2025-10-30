export interface StepType {
  name: string;
  execute(params?: any): Promise<void>;
}
