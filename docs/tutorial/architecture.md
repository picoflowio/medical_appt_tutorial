# 2. Architecture Overview

The `medical-appointment-bot` is built with a modern full-stack architecture that blends backend reasoning with a seamless frontend chat experience.

## The Tech Stack
1. **Frontend:** React (Vite + React Router)
2. **Backend:** NestJS
3. **Reasoning Framework:** PicoFlow (for orchestrating language models and tools)
4. **LLM:** Google Gemini-2.5-Pro (via PicoFlow integration)

## Core Components

The architecture separates the conversational UI from the reasoning engine. The frontend is a simple conversational interface that speaks via an API to the NestJS backend. The NestJS backend then initializes and manages the PicoFlow instance.

### The PicoFlow Setup in NestJS
Instead of managing complex conversational memory arrays and nested tool-calling loops yourself, PicoFlow handles this natively through a defined `Flow`.

Here is the entry point for the **MedicalFlow**:

```typescript
import { EndStep, Flow, Step } from '@picoflow/core';
import { SymptomsStep } from './symptoms-step';
import { BookingStep } from './booking-step';

export class MedicalFlow extends Flow {
  public constructor() {
    super(MedicalFlow);
  }

  protected defineSteps(): Step[] {
    const model = 'gemini-2.5-pro';
    return [
      new SymptomsStep(this, true).setTemperature(0.5).useModel(model),
      new BookingStep(this, false).useModel(model),
      new EndStep(this).useMemory('end').useModel(model),
    ];
  }
}
```

### The Flow Lifecycle
1. The **MedicalFlow** begins at `SymptomsStep` (marked with `true` to indicate it is the active starting step).
2. The user chats with the bot, and the model gathers information.
3. Once the bot captures the symptoms via a specific tool, it transitions to the `BookingStep`.
4. The `BookingStep` pulls the stored state (the user's symptoms and available doctors) and asks the user to pick a time slot.
5. Once booked, it hits the `EndStep`.

This rigid structure is what makes the bot predictable and business-ready. In the next section, we'll dive deeper into how `SymptomsStep` captures data and passes state!
