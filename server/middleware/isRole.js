/**
 * isRole middleware checks the role of the user to allow RBAC (Role Based Access Control)
 */

export const isRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.log("Please Login First");
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(" or ")}`,
      });
    }
    next();
  };
};
