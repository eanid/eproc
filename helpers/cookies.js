export const auth = {
    check: async (req, res, next) => {
		console.log(req.session);
        if (req.session.profile) {
            return next()
        } else {
            return res.redirect("/login");
        }
    },
};
