export declare const tools: ({
    type: "function";
    function: {
        name: string;
        description: string;
        parameters: {
            type: string;
            properties: {
                serviceId: {
                    type: string;
                    description: string;
                };
                fromUtc: {
                    type: string;
                    description: string;
                };
                toUtc: {
                    type: string;
                    description: string;
                };
                startsAtUtc?: undefined;
                appointmentId?: undefined;
                newStartsAtUtc?: undefined;
            };
            required: string[];
        };
    };
} | {
    type: "function";
    function: {
        name: string;
        description: string;
        parameters: {
            type: string;
            properties: {
                serviceId: {
                    type: string;
                    description?: undefined;
                };
                startsAtUtc: {
                    type: string;
                    description: string;
                };
                fromUtc?: undefined;
                toUtc?: undefined;
                appointmentId?: undefined;
                newStartsAtUtc?: undefined;
            };
            required: string[];
        };
    };
} | {
    type: "function";
    function: {
        name: string;
        description: string;
        parameters: {
            type: string;
            properties: {
                appointmentId: {
                    type: string;
                };
                newStartsAtUtc: {
                    type: string;
                };
                serviceId?: undefined;
                fromUtc?: undefined;
                toUtc?: undefined;
                startsAtUtc?: undefined;
            };
            required: string[];
        };
    };
} | {
    type: "function";
    function: {
        name: string;
        description: string;
        parameters: {
            type: string;
            properties: {
                appointmentId: {
                    type: string;
                };
                serviceId?: undefined;
                fromUtc?: undefined;
                toUtc?: undefined;
                startsAtUtc?: undefined;
                newStartsAtUtc?: undefined;
            };
            required: string[];
        };
    };
})[];
export type ToolName = 'check_availability' | 'book_appointment' | 'reschedule_appointment' | 'cancel_appointment';
