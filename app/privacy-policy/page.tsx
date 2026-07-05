type Section = {
  id: string;
  title: string;
  points: string[];
};

const sections: Section[] = [
  {
    id: "general",
    title: "General Website Policy",
    points: [
      "By accessing and using Vaastman Solution Pvt Ltd, you agree to comply with the policies, terms, and conditions outlined on this page.",
      "Vaastman Solution Pvt Ltd is an educational and career development platform offering internships, industrial training, skill development programs, certifications, career guidance, and placement support.",
      "All information provided during registration or communication must be accurate, complete, and up to date, and the platform must be used only for lawful purposes.",
      "You are solely responsible for maintaining the confidentiality of your login credentials and account activity, and must report any unauthorized use immediately.",
      "Internship opportunities, training details, and schedules may change without prior notice depending on institutional or organizational updates.",
      "All website content — text, graphics, logos, documents, and training materials — is the intellectual property of Vaastman Solution Pvt Ltd unless otherwise specified; unauthorized copying or commercial use is prohibited.",
      "Selection, participation, certification, and placement outcomes depend on eligibility criteria, performance, and decisions made by associated organizations.",
      "Payments for paid programs must be completed through authorized channels only, and are governed by the Refund & Cancellation Policy below.",
      "User information is used solely for service delivery, communication, and platform improvement, and is not disclosed to unauthorized third parties except where required by law.",
      "By registering, you consent to receive official communication (notifications, internship alerts, updates, announcements) via email, SMS, or other digital channels.",
      "Prohibited activities include providing false information, uploading fraudulent documents, unauthorized system access, misusing services, and posting offensive or unlawful content.",
      "Vaastman Solution Pvt Ltd is not responsible for the content, services, or privacy practices of any third-party organizations or platforms linked from the website.",
      "Vaastman Solution Pvt Ltd is not liable for loss, delay, technical interruption, or external events affecting internships, training, or platform services.",
      "These policies may be modified or revised at any time without prior notice; updates take effect immediately upon publication on the website.",
    ],
  },
  {
    id: "refund",
    title: "Refund & Cancellation Policy",
    points: [
      "Payments are considered valid only after successful confirmation from the payment gateway or an official receipt issued by the platform.",
      "Cancellation of a registered program, internship, or paid service may be requested before its official commencement, through official communication channels.",
      "Once a program, internship, or workshop has commenced, cancellation requests may not be accepted unless specifically approved by management.",
      "Refunds may be considered for duplicate payments, payment deducted without confirmed registration, program cancellation by Vaastman Solution Pvt Ltd, verified technical errors, or approved exceptional cases.",
      "Refunds are not applicable if you withdraw after commencement, fail to attend after registering, change your mind post-payment, participate incompletely, or a certificate has already been issued.",
      "Approved refunds are processed via the original payment method and may take 7 to 15 working days depending on banking and gateway procedures.",
      "Vaastman Solution Pvt Ltd may deduct applicable administrative, gateway, or processing charges before issuing a refund.",
      "If a program is rescheduled or modified, you may continue in the revised schedule; refund requests in such cases are reviewed individually.",
      "Any payment found to be fraudulent, unauthorized, or suspicious may be held, cancelled, or investigated without refund until verification is complete.",
      "All refund and cancellation decisions made by Vaastman Solution Pvt Ltd management are final.",
      "Refund requests should include your full name, registered email/mobile number, payment reference number, program name, and reason for the request.",
    ],
  },
  {
    id: "internship",
    title: "Internship Policy",
    points: [
      "Internships are designed to bridge academic learning with practical industry experience through real-world tasks, mentorship, and professional development.",
      "Students and eligible learners may apply based on the eligibility requirements defined for each internship category, and must provide accurate personal and academic details.",
      "Participation becomes valid only after successful registration, document verification (if required), and confirmation from Vaastman Solution Pvt Ltd; some internships may require payment.",
      "Internship duration varies by program type and may be short-term, medium-term, or long-term as specified in the internship description.",
      "Interns are expected to actively participate in tasks, training, meetings, and submissions; lack of regular participation may affect certification eligibility.",
      "Prohibited conduct includes submitting false information, plagiarism, misuse of resources, unprofessional communication, and missed deadlines without valid reason.",
      "All assigned tasks, reports, and assessments must be completed within the deadlines set by mentors or program coordinators.",
      "Certificates are issued only to interns who meet the required task, attendance, and performance standards; Vaastman Solution Pvt Ltd may withhold certification for non-compliance.",
      "Performance is evaluated based on task completion, project quality, communication, professional conduct, and timely submissions.",
      "Final placement, selection, or hiring decisions depend entirely on associated organizations or recruiters, not on Vaastman Solution Pvt Ltd.",
      "Vaastman Solution Pvt Ltd reserves the right to modify, reschedule, suspend, or terminate any internship program for operational, academic, or organizational reasons.",
      "Interns involved in misconduct or policy violations may be removed from the internship without certification or refund where applicable.",
      "Work created during an internship may remain subject to the intellectual property guidelines of Vaastman Solution Pvt Ltd or associated organizations.",
      "This Internship Policy may be updated at any time for program improvement and compliance.",
    ],
  },
  {
    id: "about",
    title: "About Us",
    points: [
      "Vaastman Solution Pvt Ltd is a career-focused educational platform empowering students, fresh graduates, and learners by connecting academic knowledge with practical industry experience.",
      "We offer internship opportunities, skill development programs, industrial training, certification courses, and career guidance under one integrated platform.",
      "We partner with educational institutions, industry experts, startups, and organizations to create real project exposure and workplace-ready preparation.",
      "Our offerings include internships across multiple domains, industry-oriented training, certification programs, career mentoring, project-based exposure, and placement-oriented support.",
    ],
  },
  {
    id: "mission-vision",
    title: "Mission & Vision",
    points: [
      "Mission: to empower students and learners with accessible internships, industry-oriented training, and skill development that bridges academic learning and professional requirements.",
      "Mission: to build a practical learning ecosystem with real-world exposure, guided mentorship, and project-based learning that enhances employability.",
      "Vision: to become a leading career development and internship platform that transforms how students prepare for the professional world.",
      "Vision: to build strong connections between students, institutions, and industries that foster innovation, employability, and professional excellence.",
    ],
  },
  {
    id: "why-choose-us",
    title: "Why Choose Us",
    points: [
      "Industry-oriented internship opportunities across multiple domains.",
      "Practical learning with real project exposure.",
      "Skill development programs aligned with current market needs.",
      "Professional mentorship and career guidance.",
      "Certification opportunities to strengthen career profiles.",
      "Accessible learning environment for students and fresh graduates.",
      "Focus on employability, confidence building, and career readiness.",
      "Strong connection between academic learning and professional practice.",
    ],
  },
  {
    id: "core-values",
    title: "Our Core Values",
    points: [
      "Practical Learning — knowledge applied through real-world exposure.",
      "Integrity — transparency, honesty, and professionalism in all programs and partnerships.",
      "Growth — continuous improvement of skills, confidence, and career potential.",
      "Innovation — modern learning approaches and creative problem solving.",
      "Accessibility — making opportunities available to a wide range of learners.",
      "Excellence — maintaining quality across every internship and training initiative.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8">
        <header className="mb-10 border-b pb-6">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Vaastman Solution Pvt Ltd
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground">
            Privacy Policy &amp; Platform Terms
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Please read the following policies carefully before using our
            platform and services.
          </p>
        </header>

        <nav className="mb-10 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {section.title}
            </a>
          ))}
        </nav>

        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-6">
              <h2 className="mb-3 text-lg font-semibold text-foreground">
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.points.map((point, idx) => (
                  <li
                    key={idx}
                    className="flex gap-3 text-sm leading-6 text-muted-foreground"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-1 w-1 flex-none rounded-full bg-muted-foreground"
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="mt-12 border-t pt-8">
          <h2 className="mb-3 text-lg font-semibold text-foreground">
            Contact
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            For any policy-related concerns, refund requests, or questions,
            please contact Vaastman Solution Pvt Ltd through the official
            contact details listed on the website.
          </p>
        </section>
      </div>
    </main>
  );
}
