const { Response, BadRequestResponse } = require('../../lib/response');
const CheetaTicket = require('../../models/cheetaTicket');
const updatableProps = require('../../validators/updatableTaskProps');
const { saveTags } = require('../../lib/tags');
const { scoreChange } = require('../../lib/users');

let isValidMove = (req, ticket, role = 'any') => {
    // const {prev:from, new: to } = req.body.states;
    const from = req.body.states.prev;
    const to = req.body.states.new;
    if (to === 'backlog') return true;
    // if (
    //     from === 'backlog' ||
    // (ticket.logs.length &&
    //     ticket.logs[ticket.logs.length -1].user.userId == req.body.user.userId) ||
    //     (from === 'devdone' && to === 'testing') ||
    //     (from === 'done' && to === 'deployed') ||
    //     (from === 'deployed' && to === 'delivered')
    // ) {
    // states anyone can move
    const anyone = ['backlog', 'development', 'devdone'];
    if (
        anyone.indexOf(from) >= 0 &&
        anyone.indexOf(to) === anyone.indexOf(from) + 1
    ) {
        return true;
    }
    // only testers can move
    const testers = ['devdone', 'testing', 'done'];
    if (
        testers.indexOf(from) >= 0 &&
        (role === 'quality-analyst' || role === 'any') &&
        testers.indexOf(to) === testers.indexOf(from) + 1
    ) {
        return true;
    }
    // moving from done to deployed (only jyoti should be able to)
    if (from === 'done' && to === 'deployed') {
        return true;
    }
    if (
        (role === 'client-qa' || role === 'any') &&
        from === 'deployed' &&
        to === 'delivered'
    ) {
        return true;
    }
    // }
    return false;
};
const scoreLogic = async (req, ticket) => {
    const from = req.body.states.prev;
    const to = req.body.states.new;
    let data = {
        users: [],
    };
    // -ve score
    if (to === 'backlog') {
        const score = ticket.type == 'big' ? -6 : -2;
        if (from === 'testing') {
            const user = {
                id: ticket.logs[ticket.logs.length - 2].user.userId,
                score,
            };
            data.users.push(user);
            await scoreChange(data);
        }
        if (from === 'done') {
            const user = {
                id: ticket.logs[ticket.logs.length - 1].user.userId,
                score,
            };
            data.users.push(user);
            await scoreChange(data);
        }
        if (from === 'deployed') {
            const user = {
                id: ticket.logs[ticket.logs.length - 2].user.userId,
                score,
            };
            data.users.push(user);
            await scoreChange(data);
        }
        if (from === 'delivered') {
            const qa = {
                id: ticket.logs[ticket.logs.length - 2].user.userId,
                score,
            };
            const clientQa = {
                id: ticket.logs[ticket.logs.length - 1].user.userId,
                score,
            };
            data.users.push(qa);
            data.users.push(clientQa);
            await scoreChange(data);
        }
        return;
    }
    // +ve score
    const score = ticket.type == 'big' ? 4 : 1;
    if (from === 'development' && to === 'devdone') {
        const user = {
            // id: ticket.logs[ticket.logs.length - 1].user.userId,
            id: req.body.user.userId,
            score,
        };
        data.users.push(user);
        await scoreChange(data);
    }
    if (from === 'testing' && to === 'done') {
        console.log(
            'testing to done -> debug ::',
            ticket.logs[ticket.logs.length - 2].user.userId,
            req.body.user.userId,
            `equal? ${
                ticket.logs[ticket.logs.length - 2].user.userId !==
                req.body.user.userId
            }`
        );
        if (
            ticket.logs[ticket.logs.length - 2].user.userId !==
            req.body.user.userId
        ) {
            const user = {
                // id: ticket.logs[ticket.logs.length - 1].user.userId,
                id: req.body.user.userId,
                score,
            };
            data.users.push(user);
            await scoreChange(data);
        }
    }
    if (from === 'deployed' && to === 'delivered') {
        const user = {
            id: req.body.user.userId,
            score,
        };
        data.users.push(user);
        await scoreChange(data);
    }
    return;
};

module.exports = {
    updateTicket: async (req, res, next) => {
        try {
            if (!req.params.id)
                return res.status(400).json({
                    status: {
                        code: 400,
                        message: 'Insufficient info!',
                    },
                });

            console.log('Updating Ticket :: ', req.userData, req.params.id);

            let obj = req.body;
            let keys = Object.keys(obj);
            let $set = {};

            if (obj.tags) {
                try {
                    let tagId = await saveTags(req, {
                        tags: [...req.body.tags],
                        ticketId: req.params.id,
                    });
                    console.log('here', tagId);

                    if (tagId) {
                        delete obj['tags'];

                        obj['tags'] = [...tagId];
                    }
                } catch (err) {
                    console.log(err);

                    // Send mail to admin
                }
            }

            keys.forEach((key) => {
                if (updatableProps.includes(key)) $set[key] = obj[key];
            });
            // update last update time
            $set.lastUpdate = Date.now();
            console.log('Update obj ::', { $set });

            let result = await CheetaTicket.findByIdAndUpdate(
                req.params.id,
                { $set },
                { new: true, useFindAndModify: false }
            );

            res.json(new Response(200, 'Updated Succesfully!', result));
        } catch (e) {
            console.error(e);

            return res
                .status(400)
                .json(new BadRequestResponse('Something went wrong!'));
        }
    },

    newChangeTicketState: async (req, res, next) => {
        try {
            if (!(req.params.id && req.body.states && req.body.user))
                return res.status(400).json({
                    status: {
                        code: 400,
                        message: 'Insufficient info!',
                    },
                });
            console.log(
                'Updating Ticket :: ',
                req.userData,
                req.params.id,
                req.body
            );
            let ticket = await CheetaTicket.findById(req.params.id);
            console.log(ticket);
            console.log('isValidMove?', isValidMove(req, ticket));
            if (isValidMove(req, ticket)) {
                let $push = { logs: req.body };
                let $set = {
                    state: req.body.states.new,
                    lastUpdate: Date.now(),
                };
                const result = await CheetaTicket.findByIdAndUpdate(
                    req.params.id,
                    { $set, $push },
                    { new: true, useFindAndModify: false }
                );
                res.status(200).json({
                    status: {
                        code: 200,
                        message: 'Updated Succesfully!',
                    },
                    data: result,
                });
                await scoreLogic(req, ticket);
                console.log('ticket still there to work with ::', result);
                return;
            }
            return res.status(400).json({
                status: {
                    code: 400,
                    message: 'User not allowed to change state!',
                },
                data: false,
            });
        } catch (err) {
            console.error(err);
            return res.status(400).json({
                status: {
                    code: 400,
                    message: 'Something went wrong!',
                },
            });
        }
    },

    changeTicketState: async (req, res, next) => {
        try {
            console.log(req.body);
            if (!(req.params.id && req.body.states && req.body.user))
                return res.status(400).json({
                    status: {
                        code: 400,
                        message: 'Insufficient info!',
                    },
                });

            console.log(
                'Updating Ticket :: ',
                req.userData,
                req.params.id,
                req.body
            );

            let ticket = await CheetaTicket.findById(req.params.id);

            console.log(ticket);

            if (
                !(
                    req.body.states.new == 'backlog' ||
                    req.body.states.new == 'development' ||
                    req.body.states.new == 'devdone' ||
                    req.body.states.new == 'testing'
                )
            ) {
                if (
                    ticket.logs.length &&
                    ticket.logs[ticket.logs.length - 1].user.userId ==
                        req.body.user.userId
                )
                    return res.json({
                        status: {
                            code: 400,
                            message: 'User not allowed to change state!',
                        },
                        data: false,
                    });
            }

            let $push = { logs: req.body };
            let $set = { state: req.body.states.new };
            console.log('Update obj ::', $set, $push);

            let result = await CheetaTicket.findByIdAndUpdate(
                req.params.id,
                { $set, $push },
                { new: true, useFindAndModify: false }
            );

            res.json(new Response(200, 'Updated Succesfully!', result));

            console.log('ticket still there to work with ::', result);

            // cHECK WHAT STATUS CHANGE IS HAPPENING
            // DEDUCT OR ADD SCORES ACCORDINGLY
            // check for big small task
            // big = 4 & small = 1

            try {
                let data = {
                    users: [],
                };

                if (
                    (ticket.state === 'devlopment' ||
                        ticket.state === 'devdone') &&
                    req.body.states.new === 'backlog'
                )
                    return;
                if (req.body.states.new == 'backlog') {
                    const score = ticket.type == 'big' ? -6 : -2;

                    const u = {
                        id: ticket.logs[ticket.logs.length - 1].user.userId,
                        score,
                    };

                    data.users.push(u);

                    console.log(
                        'deduct from :',
                        ticket.logs[ticket.logs.length - 1].user
                    );
                    await scoreChange(data);
                    return;
                }

                if (
                    req.body.states.new == 'testing' ||
                    req.body.states.new == 'done'
                ) {
                    const score = ticket.type == 'big' ? 4 : 1;
                    const u = {
                        id: req.body.user.userId,
                        score,
                    };

                    data.users.push(u);
                    console.log('Give marks to', req.body.user);
                    await scoreChange(data);
                    return;
                }
            } catch (err) {
                console.log(err);
            }
        } catch (e) {
            console.error(e);

            return res
                .status(400)
                .json(new BadRequestResponse('Something went wrong!'));
        }
    },
};
