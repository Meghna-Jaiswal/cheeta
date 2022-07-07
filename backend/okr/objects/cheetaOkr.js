

module.exports = (req) => {

    if(
        req.body.userId &&
        req.body.objective &&
        req.body.actions &&
        req.body.results
    ) {

        return {
            created: true,
            obj: {
                userId: req.body.userId,
                objective: req.body.objective,
                actions: [...req.body.actions],
                results: [...req.body.results],
               
                status: 1,
                others: {}
            }
        }
    }
    else
        return {
            created: false,
            obj: {}
        }
}
