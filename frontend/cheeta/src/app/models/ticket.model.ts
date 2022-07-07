export interface Ticket {
    title: string;
    description: string;
    projectName: string;
    priority: string;   //P0, P1, P2, P3

    type: string;   //Big or Small
    // files: any [];
    members: {
        name: string,
        userId: string,
        email: string,
        type: string
    }[];
    expectedTime: string,
    UT: boolean;
    documentation: boolean;
    // tags: string[];
    comments: [
        {
            user: string;
            msg: string;
        }
    ]
}
