// JSON-schema tool catalogue the LLM sees.
// Keep names and descriptions short and precise — the LLM reads them to decide.
export const tools = [
  {
    type: 'function' as const,
    function: {
      name: 'check_availability',
      description:
        'Find free appointment slots for a given service within a date range. Use this before offering times to the patient. Returns a list of UTC start times.',
      parameters: {
        type: 'object',
        properties: {
          serviceId: {
            type: 'string',
            description:
              'The id of the service the patient wants (e.g. a Check-up). Must come from the list in the system prompt.',
          },
          fromUtc: {
            type: 'string',
            description:
              'Start of the search window, ISO 8601 in UTC. e.g. 2026-10-14T00:00:00Z',
          },
          toUtc: {
            type: 'string',
            description:
              'End of the search window, ISO 8601 in UTC (exclusive).',
          },
        },
        required: ['serviceId', 'fromUtc', 'toUtc'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'book_appointment',
      description:
        'Create a new appointment at the given start time. Only call this AFTER the patient has confirmed a specific slot you offered. The start time must be one of the slots returned by check_availability.',
      parameters: {
        type: 'object',
        properties: {
          serviceId: { type: 'string' },
          startsAtUtc: {
            type: 'string',
            description: 'Chosen slot start, ISO 8601 in UTC.',
          },
        },
        required: ['serviceId', 'startsAtUtc'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'reschedule_appointment',
      description:
        "Move an existing appointment to a new time. Only use after confirming the patient's choice.",
      parameters: {
        type: 'object',
        properties: {
          appointmentId: { type: 'string' },
          newStartsAtUtc: { type: 'string' },
        },
        required: ['appointmentId', 'newStartsAtUtc'],
      },
    },
  },
  {
    type: 'function' as const,
    function: {
      name: 'cancel_appointment',
      description:
        "Cancel an existing appointment. Confirm with the patient before calling this — cancellation can't be undone.",
      parameters: {
        type: 'object',
        properties: {
          appointmentId: { type: 'string' },
        },
        required: ['appointmentId'],
      },
    },
  },
];

export type ToolName =
  | 'check_availability'
  | 'book_appointment'
  | 'reschedule_appointment'
  | 'cancel_appointment';