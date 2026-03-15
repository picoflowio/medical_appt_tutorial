# 4. BookingStep

After the `SymptomsStep` captures the patient's symptoms and finds appropriate doctors, PicoFlow transitions the conversation to the `BookingStep`.

This step retrieves the state passed from the previous step and exposes a new set of tools specifically for booking appointments.

## Code Example

```typescript
import { ToolCall } from '@langchain/core/messages/tool';
import { Flow, Step, EndStep, ToolResponseType, ToolType } from '@picoflow/core';
import { z } from 'zod';

export class BookingStep extends Step {
  constructor(flow: Flow, isActive?: boolean) {
    super(BookingStep, flow, isActive);
  }

  public getPrompt(): string {
    const doctors = this.getState('doctors');
    const symptoms = this.getState('symptoms');
    return `You have the user's symptoms: ${symptoms}. Here are the available doctors: ${JSON.stringify(doctors)}. Help the user pick a doctor and an available time slot. Once they decide, use the 'book_appointment' tool.`;
  }

  public defineTool(): ToolType[] {
    return [
      {
        name: 'book_appointment',
        description: 'Book an appointment with the selected doctor at the chosen time.',
        schema: z.object({
          doctorName: z.string().describe('Name of the selected doctor'),
          timeSlot: z.string().describe('The chosen time slot'),
        }),
      },
    ];
  }
  
  public getTool(): string[] {
    return ['book_appointment', 'end_chat'];
  }

  protected async book_appointment(tool: ToolCall): Promise<ToolResponseType> {
    const { doctorName, timeSlot } = tool.args;
    
    // In a real scenario, we'd save this to a DB.
    this.saveState({ doctorName, timeSlot, booked: true });

    return {
      step: EndStep,
      tool: `Successfully booked with ${doctorName} at ${timeSlot}. Thank you!`,
    };
  }

  protected async end_chat(_tool: ToolCall): Promise<ToolResponseType> {
    return EndStep;
  }
}
```

## How It Works

1. **Retrieving State:** In `getPrompt()`, the step uses `this.getState('doctors')` and `this.getState('symptoms')`. These values were placed into the flow's shared memory by the previous step.
2. **Dynamic Prompting:** The prompt injects the user's actual symptoms and the mock array of doctors directly into the LLM's context, making it hyper-aware of what it needs to accomplish next.
3. **Scoped Tools:** The tools switch from capturing symptoms to booking appointments. The `book_appointment` tool now expects a `doctorName` and `timeSlot`.
4. **Final Transition:** Once the appointment is successfully "booked," the tool returns an explicit transition to `EndStep` along with a final message.

This seamless passing of state and dynamic scoping of tools ensures that your bot follows a strict, predictable business process without getting confused. Next, let's explore how the React Chat UI stitches this session together!
