import { Step } from "../steps/step.interface";

export enum StepStatus {
  Pending = "pending",
  Running = "running",
  Success = "success",
  Failed = "failed",
  Blocked = "blocked",
}

export class WorkflowEngine {
  private steps: Map<string, Step>;

  constructor(steps: Step[]) {
    this.steps = new Map(steps.map((step) => [step.id, step]));
  }

  async run() {
    while (this.hasPendingSteps()) {
      const stepsReadyToRun: Step[] = this.getReadySteps();
      const blockedSteps: Step[] = this.getBlockedSteps();

      this.blockSteps(blockedSteps);

      if (stepsReadyToRun.length === 0) {
        console.log("no more steps to run, ending workflow.");
        break;
      }

      await Promise.all(stepsReadyToRun.map((step) => this.runStep(step)));
    }

    this.printResults();
  }

  private async runStep(step: Step) {
    step.status = StepStatus.Running;
    console.log(`step ${step.name} is running...`);

    try {
      await step.run();
      step.status = StepStatus.Success;
      console.log(`step ${step.name} succeeded!`);
    } catch (e) {
      step.status = StepStatus.Failed;
      console.log(`step ${step.name} has failed: ${(e as Error).message}`);
    }
  }

  private getReadySteps(): Step[] {
    return [...this.steps.values()].filter(
      (step) =>
        step.status === StepStatus.Pending &&
        step.dependencies.every(
          (depId) => this.steps.get(depId)?.status === StepStatus.Success
        )
    );
  }

  private getBlockedSteps(): Step[] {
    return [...this.steps.values()].filter(
      (step) =>
        step.status === StepStatus.Pending &&
        step.dependencies.some(
          (depId) => this.steps.get(depId)?.status === StepStatus.Failed
        )
    );
  }

  private blockSteps(blockedSteps: Step[]) {
    blockedSteps.forEach((step) => {
      step.status = StepStatus.Blocked;
      console.log(`step ${step.name} blocked due to failed dependencies`);
    });
  }

  private hasPendingSteps(): boolean {
    return [...this.steps.values()].some(
      (step) => step.status === StepStatus.Pending
    );
  }

  private printResults() {
    console.log("workflow results:");
    for (let step of this.steps.values()) {
      console.log(`${step.name}: ${step.status}`);
    }
  }
}
