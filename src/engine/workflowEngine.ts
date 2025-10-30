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
  dependents: string[];
}

export class WorkflowEngine {
  private steps: Map<string, WorkflowStep>;

  constructor(steps: Step[]) {
    const stepsMap: Map<string, WorkflowStep> = new Map<string, WorkflowStep>();
    for (const step of steps) {
      stepsMap.set(step.id, {
        ...step,
        status: StepStatus.Pending,
        dependents: [],
      });
    }

    for (const step of stepsMap.values()) {
      for (const depId of step.dependencies) {
        const depStep = stepsMap.get(depId);
        if (depStep) depStep.dependents.push(step.id);
      }
    }

    this.steps = stepsMap;
  }

  async run() {
    for (const step of this.steps.values()) {
      if (
        step.status === StepStatus.Pending &&
        step.dependencies.length === 0
      ) {
        this.runStep(step);
      }
    }
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

    this.triggerDependents(step);
  }

  private triggerDependents(step: WorkflowStep) {
    for (const depId of step.dependents) {
      const dependentStep = this.steps.get(depId);
      if (!dependentStep || dependentStep.status !== StepStatus.Pending)
        continue;
      const hasFailedDependency = dependentStep.dependencies.some((id) => {
        const depStatus = this.steps.get(id)?.status;
        return (
          depStatus === StepStatus.Failed || depStatus === StepStatus.Skipped
        );
      });

      if (hasFailedDependency) {
        dependentStep.status = StepStatus.Skipped;
        console.log(
          `Step "${dependentStep.name}" skipped due to failed dependencies.`
        );
        this.triggerDependents(dependentStep);
        continue;
      }

      const allDepsSuccess = dependentStep.dependencies.every(
        (id) => this.steps.get(id)?.status === StepStatus.Success
      );

      if (allDepsSuccess) {
        console.log(
          `All dependencies for ${dependentStep.name} succeeded! running step..`
        );
        this.runStep(dependentStep);
      }
    }
  }
}
