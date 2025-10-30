import { Step } from "../models/step.interface";

enum StepStatus {
  Pending = "pending",
  Running = "running",
  Success = "success",
  Failed = "failed",
  Skipped = "skipped",
}

interface WorkflowStep extends Step {
  status: StepStatus;
}

export class WorkflowEngine {
  private steps: Map<string, WorkflowStep>;

  constructor(steps: Step[]) {
    this.steps = new Map(
      steps.map((step) => [step.id, { ...step, status: StepStatus.Pending }])
    );
  }

  async run() {
    let pendingSteps: WorkflowStep[] = Array.from(this.steps.values());

    while (pendingSteps.length > 0) {
      this.markSkippedSteps(pendingSteps);

      const stepsToRun: WorkflowStep[] = this.getStepsToRun(pendingSteps);

      if (stepsToRun.length === 0) {
        console.log("no more steps to run, ending workflow.");
        break;
      }

      for (const step of stepsToRun) {
        await this.runStep(step);
      }

      pendingSteps = pendingSteps.filter(
        (step) => step.status === StepStatus.Pending
      );
    }

    this.printWorkflowResults();
  }

  private async runStep(step: WorkflowStep) {
    step.status = StepStatus.Running;
    console.log(`step ${step.name} is running...`);

    try {
      await step.type.execute(step.params);
      step.status = StepStatus.Success;
      console.log(`step ${step.name} succeeded!`);
    } catch (e) {
      step.status = StepStatus.Failed;
      console.log(`step ${step.name} has failed: ${(e as Error).message}`);
    }
  }

  private getStepsToRun(pendingSteps: WorkflowStep[]): WorkflowStep[] {
    return pendingSteps.filter(
      (step) =>
        step.status === StepStatus.Pending &&
        step.dependencies.every(
          (depId) => this.steps.get(depId)?.status === StepStatus.Success
        )
    );
  }

  private markSkippedSteps(pendingSteps: WorkflowStep[]) {
    for (const step of pendingSteps) {
      if (step.status !== StepStatus.Pending) continue;

      const hasFailedDependency = step.dependencies.some((depId) => {
        const stepStatus = this.steps.get(depId)?.status;
        return (
          stepStatus === StepStatus.Failed || stepStatus === StepStatus.Skipped
        );
      });

      if (hasFailedDependency) {
        step.status = StepStatus.Skipped;
        console.log(`Step "${step.name}" skipped due to failed dependencies.`);
      }
    }
  }

  private getWorkflowStatus(): string {
    const stepStatuses = new Set(
      Array.from(this.steps.values()).map((step) => step.status)
    );
    if (stepStatuses.has(StepStatus.Failed)) return "Failed";
    if (
      stepStatuses.has(StepStatus.Pending) ||
      stepStatuses.has(StepStatus.Running)
    )
      return "Running";
    return "Success";
  }

  private printWorkflowResults() {
    console.log("Workflow steps results:");
    for (let step of this.steps.values()) {
      console.log(`step ${step.name} finished with status: ${step.status}`);
    }

    console.log(`Total workflow result: ${this.getWorkflowStatus()}`);
  }
}
