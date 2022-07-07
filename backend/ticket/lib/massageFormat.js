class formatMessage {
    ticket;
    message;

    constructor(ticket) {
        this.ticket = ticket
    }

    async createTicket() {
        const { name, email } = this.ticket.user
        this.message = `New Ticket has been created: \n` +
                        `- created by: ${name} ( ${email} )\n` +
                        `- assigned members:\n • ${this.ticket.members.map((key) => key.email).join('\n• ')}\n` +
                        `- title: ${this.ticket.title}\n` +
                        `- type: ${this.ticket.type}\n` +
                        `- priority: ${this.ticket.priority}\n`
        console.log(this.message)
        return this.message
    }
    

}   

module.exports = formatMessage