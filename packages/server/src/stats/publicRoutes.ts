import express from "express";
import Project from '../projects/model';
import User, {Role} from '../users/model';

const router = express.Router();

router.get("/", async (request, response) => {
    const projectCount = await Project.count();
    const userCount = await User.count({
      role: Role.USER,
    });
    response.json({
      projectCount,
      userCount,
    });
  });
  
  export default router;