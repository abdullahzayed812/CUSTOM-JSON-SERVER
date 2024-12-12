import jsonServer from "json-server";

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Use default middlewares (CORS, static, etc.)
server.use(middlewares);

// Enable JSON parsing for POST and PUT requests
server.use(jsonServer.bodyParser);

server.patch("/projects/:projectId", (req, res) => {
  const { projectId } = req.params;
  const project = router.db.get("projects").find({ id: projectId }).value();

  if (project) {
    project.logo = req.body.logo;
    router.db.write();
  } else {
    res.status(404).json({ error: "Project logo not found" });
  }
});

// Custom route to get branding colors
server.get("/projects/:projectId/branding/colors", (req, res) => {
  const { projectId } = req.params;
  const project = router.db.get("projects").find({ id: projectId }).value();

  if (project) {
    res.status(200).json(project.branding.colors);
  } else {
    res.status(404).json({ error: "Project not found " });
  }
});

// Custom route to patch branding colors
server.patch("/projects/:projectId/branding/colors", (req, res) => {
  const { projectId } = req.params;
  const updatedColors = req.body.brandingColors;

  const project = router.db.get("projects").find({ id: projectId }).value();
  if (project) {
    const colors = project.branding.colors;
    if (colors) {
      Object.assign(colors, updatedColors);
      router.db.write();
      res.status(200).json(colors);
    } else {
      res.status(404).json({ error: "Branding colors not found" });
    }
  } else {
    res.status(404).json({ error: "Project not found " });
  }
});

// Custom router to get branding fonts
server.get("/projects/:projectId/branding/fonts", (req, res) => {
  const { projectId } = req.params;
  const project = router.db.get("projects").find({ id: projectId }).value();

  if (project) {
    res.status(200).json(project.branding.fonts);
  } else {
    res.status(404).json({ error: "Project not found " });
  }
});

// Custom route to patch branding fonts
server.patch("/projects/:projectId/branding/fonts", (req, res) => {
  const { projectId } = req.params;
  const project = router.db.get("projects").find({ id: projectId }).value();

  if (project) {
    project.branding.fonts = req.body;
    router.db.write();
  } else {
    res.status(404).json({ error: "Project not found " });
  }
});

// Custom route to get all images of a specific project
server.get("/projects/:projectId/images", (req, res) => {
  const { projectId } = req.params;
  const project = router.db.get("projects").find({ id: projectId }).value();

  if (project) {
    // Return the project's images
    res.status(200).json(project.images || []);
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// Custom route for adding an image to a project
server.post("/projects/:projectId/images", (req, res) => {
  const { projectId } = req.params;
  const newImage = { id: Date.now().toString(), ...req.body };

  // Find the project by ID and add the new image
  const project = router.db.get("projects").find({ id: projectId }).value();
  if (project) {
    project.images.push(newImage);
    router.db.write();
    res.status(201).json(newImage);
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// Custom route for updating an image
server.patch("/projects/:projectId/images/:imageId", (req, res) => {
  const { projectId, imageId } = req.params;
  const updatedImage = req.body;

  // Find the project by ID and update the image
  const project = router.db.get("projects").find({ id: projectId }).value();
  if (project) {
    const image = project.images.find((img) => img.id === imageId);
    if (image) {
      Object.assign(image, updatedImage);
      router.db.write();
      res.status(200).json(image);
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// Custom route for deleting an image
server.delete("/projects/:projectId/images/:imageId", (req, res) => {
  const { projectId, imageId } = req.params;

  // Find the project and remove the image
  const project = router.db.get("projects").find({ id: projectId }).value();
  if (project) {
    const imageIndex = project.images.findIndex((img) => img.id === imageId);
    if (imageIndex !== -1) {
      project.images.splice(imageIndex, 1);
      router.db.write();
      res.status(204).end();
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// Custom route to get all templates of a specific project
server.get("/projects/:projectId/templates", (req, res) => {
  const { projectId } = req.params;
  const project = router.db.get("projects").find({ id: projectId }).value();

  if (project) {
    // Return the project's templates
    res.status(200).json(project.templates || []);
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// Custom routes for templates and customized templates would follow the same structure
// Add template
server.post("/projects/:projectId/templates", (req, res) => {
  const { projectId } = req.params;
  const newTemplate = { id: Date.now().toString(), ...req.body };

  // Find the project and add the template
  const project = router.db.get("projects").find({ id: projectId }).value();
  if (project) {
    project.templates.push(newTemplate);
    router.db.write();
    res.status(201).json(newTemplate);
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// Custom route for updating a template in a project
server.patch("/projects/:projectId/templates/:templateId", (req, res) => {
  const { projectId, templateId } = req.params;
  const updatedTemplate = req.body;

  // Find the project by ID
  const project = router.db.get("projects").find({ id: projectId }).value();
  if (project) {
    const template = project.templates.find((tmpl) => tmpl.id === templateId);
    if (template) {
      // Update the template with the new data
      Object.assign(template, updatedTemplate);
      router.db.write();
      res.status(200).json(template);
    } else {
      res.status(404).json({ error: "Template not found" });
    }
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// Custom route for deleting a template in a project
server.delete("/projects/:projectId/templates/:templateId", (req, res) => {
  const { projectId, templateId } = req.params;

  // Find the project and remove the template
  const project = router.db.get("projects").find({ id: projectId }).value();
  if (project) {
    const templateIndex = project.templates.findIndex((tmpl) => tmpl.id === templateId);
    if (templateIndex !== -1) {
      project.templates.splice(templateIndex, 1); // Remove the template
      router.db.write();
      res.status(204).end();
    } else {
      res.status(404).json({ error: "Template not found" });
    }
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// Custom route to get all customized templates of a specific project
server.get("/projects/:projectId/customized-templates", (req, res) => {
  const { projectId } = req.params;
  const project = router.db.get("projects").find({ id: projectId }).value();

  if (project) {
    // Return the project's customized templates
    res.status(200).json(project["customized-templates"] || []);
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// Add customized template
server.post("/projects/:projectId/customized-templates", (req, res) => {
  const { projectId } = req.params;
  const newCustomizedTemplate = { id: Date.now().toString(), ...req.body };

  // Find the project and add the customized template
  const project = router.db.get("projects").find({ id: projectId }).value();
  if (project) {
    project["customized-templates"].push(newCustomizedTemplate);
    router.db.write();
    res.status(201).json(newCustomizedTemplate);
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// Custom route for updating a customized template in a project
server.patch("/projects/:projectId/customized-templates/:templateId", (req, res) => {
  const { projectId, templateId } = req.params;
  const updatedTemplate = req.body;

  // Find the project by ID
  const project = router.db.get("projects").find({ id: projectId }).value();
  if (project) {
    const template = project["customized-templates"].find((tmpl) => tmpl.id === templateId);
    if (template) {
      // Update the customized template with the new data
      Object.assign(template, updatedTemplate);
      router.db.write();
      res.status(200).json(template);
    } else {
      res.status(404).json({ error: "Customized Template not found" });
    }
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// Custom route for deleting a customized template in a project
server.delete("/projects/:projectId/customized-templates/:templateId", (req, res) => {
  const { projectId, templateId } = req.params;

  // Find the project and remove the customized template
  const project = router.db.get("projects").find({ id: projectId }).value();
  if (project) {
    const templateIndex = project["customized-templates"].findIndex((tmpl) => tmpl.id === templateId);
    if (templateIndex !== -1) {
      project["customized-templates"].splice(templateIndex, 1); // Remove the customized template
      router.db.write();
      res.status(204).end();
    } else {
      res.status(404).json({ error: "Customized Template not found" });
    }
  } else {
    res.status(404).json({ error: "Project not found" });
  }
});

// Use default router to handle other CRUD operations
server.use(router);

// Start the server on port 3500
const PORT = 3500;

server.listen(PORT, () => {
  console.log(`JSON Server is running at http://localhost:${PORT}`);
});
