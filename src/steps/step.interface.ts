export interface Step {
  id: string;
  name: string;
  dependencies: string[];
  status: string;
  run: () => Promise<void>;
}
