export interface filters{
    tags:string[];
    members: {
        name: string,
        userId: string,
        email: string,
        type: string
    }[];
    priority: string;

}