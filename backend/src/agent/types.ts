// what a conversation turn looks like, in the shape Groq expects.

export type ChatRole = 'system' | 'user' | 'assistant' | 'tool';

export interface ChatMessage {
    role: ChatRole;
    content: string | null;
    // set on assistant turns that call tools.
    tool_calls?: {
        id: string;
        type: 'function';
        function: { name: string; arguments: string};
    }[];
    // set on tool-result turns (role='tool').
    tool_call_id?: string;
    name?: string;
}

export interface AgentContext {
    clinicId: string;
    practitionerId: string;
    patientId: string;
    // Human-friendly data for system prompt.
    clinicName: string;
    clinicTimezone: string;
    practitionerName: string;
    services: { id: string; name: string; durationMinutes: number; priceCents: number }[];
}

export interface AgentReply {
    reply: string;
    toolCalls: {
        name: string;
        args: unknown;
        result: unknown;
        succeeded: boolean;
    }[];
}