import { SectionLayout } from "../../layout/section.layout";

export const About: React.FC = () => {
  const paragraphs = [
    "I believe the most rewarding work happens when a team comes together around a shared purpose. I’ve found that teams who encourage each other, share knowledge, and enjoy working side by side create an energy that makes the whole experience more meaningful. I try to foster that kind of environment by supporting open communication, making sure everyone’s voice is heard, and helping the team focus on what we can accomplish together. My goal is to build trust, create space for growth, and celebrate the progress we make as a group.",
    "Working as a fullstack developer and team leader, I find a lot of satisfaction in connecting different parts of a system—whether that’s bridging the frontend and backend, improving architecture, or just helping teammates share their ideas. I see my role as enabling others, building trust, and encouraging pride in the solutions we deliver.",
    "Curiosity keeps me moving forward, always exploring ways to improve how we work and what we build. Whether it’s learning new technologies, refining our processes, or diving into other creative fields, I’m happiest when I’m making things just a little bit better. I enjoy building and fixing things, both inside and outside of code, and see every challenge as an opportunity to learn.",
    // "For me, people do their best work when they feel valued and appreciated. I try to create an environment where everyone is heard, where support and growth are priorities, and where celebrating progress is as important as reaching the finish line.",
    "I care deeply about quality and reliability, so I focus on making sure our solutions are well-tested and ready for real-world use before they go live. My experience with microservices and product-focused development has shown me the importance of staying adaptable and keeping the user in mind at every stage.",
  ];

  return (
    <SectionLayout>
      <div style={{ color: "#333332" }}>
        <div className="mb-4 flex flex-col gap-5 text-sm md:text-base lg:text-lg text-justify">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
          <hr className="border-zinc-400" />
          <p className="mb-12">
            <b>TL;DR:</b> I’m a collaborative fullstack developer and team
            leader who’s passionate about building trust, supporting teams, and
            delivering high-quality solutions.
          </p>
        </div>
      </div>
    </SectionLayout>
  );
};
