/*
  EDIT THIS FILE TO UPDATE YOUR WEBSITE.

  Change text inside quotation marks. To add another project, copy one complete
  project block (from { through },) and change its contents. GitHub will
  republish the site automatically after you commit your edits.
*/

const portfolio = {
  name: "Jocelyn Zhao",
  roles: "Student · Engineer · Researcher",
  introduction:
    "I'm a high school student interested in robotics, computational research, and building thoughtful solutions to real-world problems.",

  projects: [
    {
      title: "Strategic Forgetting in Changing Markets",
      label: "Research · Computational Modeling",
      description:
        "A simulation-based study of how much historical information an investor should retain when market conditions change. The project combines random walks, parameter sweeps, analytical modeling, and data visualization.",
      tags: ["Python", "Simulation", "Statistical Analysis"],
    },
    {
      title: "Robotics Design & Engineering",
      label: "FRC Robotics · Mechanical Design",
      description:
        "Designing mechanisms for a competition robot through iterative CAD, prototyping, testing, and cross-functional collaboration. Currently serving as a design lead for the upcoming season.",
      tags: ["CAD", "Prototyping", "Team Leadership"],
    },
    {
      title: "Computers in Biophysics & Robotics",
      label: "UC Davis COSMOS · Summer 2026",
      description:
        "Explored how computation can model physical and biological systems, connecting programming, probability, and robotics through collaborative projects and experiments.",
      tags: ["Computational Science", "Robotics", "Research"],
    },
  ],

  aboutLead:
    "I enjoy working where engineering, computation, and human curiosity meet.",
  aboutParagraphs: [
    "My work ranges from mechanical design for FRC robotics to computational research on decision-making in changing systems. I care about understanding why something works—not only making it work—and communicating that reasoning clearly.",
    "Outside the classroom and workshop, I am a U.S. Figure Skating Gold Medalist. A decade on the ice has shaped how I approach difficult work: with patience, precision, and consistency.",
  ],

  contactIntro:
    "I'm always interested in learning from other students, researchers, and engineers.",
  email: "jocelyn.zhao.316@gmail.com",
  github: "https://github.com/jocelynzhao316",
};

document.querySelector("#name").textContent = portfolio.name;
document.querySelector("#roles").textContent = portfolio.roles;
document.querySelector("#introduction").textContent = portfolio.introduction;
document.querySelector("#about-lead").textContent = portfolio.aboutLead;
document.querySelector("#contact-intro").textContent = portfolio.contactIntro;
document.querySelector("#copyright").textContent = `© ${new Date().getFullYear()} ${portfolio.name}`;

const emailLink = document.querySelector("#email-link");
emailLink.href = `mailto:${portfolio.email}`;
const githubLink = document.querySelector("#github-link");
githubLink.href = portfolio.github;

const projectList = document.querySelector("#project-list");
portfolio.projects.forEach((project, index) => {
  const article = document.createElement("article");
  article.className = "project";
  const number = String(index + 1).padStart(2, "0");
  article.innerHTML = `
    <div class="project-meta"><span>${number}</span><p>${project.label}</p></div>
    <div class="project-body">
      <h3>${project.title}</h3><p>${project.description}</p>
      <ul class="tag-list" aria-label="${project.title} skills">
        ${project.tags.map((tag) => `<li>${tag}</li>`).join("")}
      </ul>
    </div>`;
  projectList.appendChild(article);
});

const aboutCopy = document.querySelector("#about-copy");
portfolio.aboutParagraphs.forEach((paragraph) => {
  const p = document.createElement("p");
  p.textContent = paragraph;
  aboutCopy.appendChild(p);
});
