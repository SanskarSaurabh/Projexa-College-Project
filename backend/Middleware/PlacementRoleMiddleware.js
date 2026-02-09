 const isPlacementOfficer = (req, res, next) => {
    if (req.user.role !== "placement") {
      return res.status(403).send({ message: "Placement officer access only" });
    }
    next();
  };
  export default isPlacementOfficer