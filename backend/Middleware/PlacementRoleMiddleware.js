const isPlacementOfficer = (req, res, next) => {
  // 1. Check if req.user exists (populated by your 'protect' middleware)
  if (!req.user) {
    return res.status(401).send({ 
      success: false, 
      message: "Unauthorized: No user found" 
    });
  }

  // 2. Check the role
  if (req.user.role !== "placement") {
    return res.status(403).send({ 
      success: false, 
      message: "Access Denied: Placement officer access only" 
    });
  }

  next();
};

export default isPlacementOfficer;