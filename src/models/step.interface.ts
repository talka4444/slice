export interface Step {
  id: string;
  name: string;
  dependencies: string[];
  run: () => Promise<void>;
}
