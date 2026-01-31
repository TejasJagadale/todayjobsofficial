import React from "react";
import "../styles/Legal.css";

const TermsConditions = () => {
  return (
    <div className="legal-container">
      <h1 className="legal-title">Terms & Conditions</h1>

      <p className="legal-updated">Last updated: January 2026</p>

      <section className="legal-section">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing and using this Job Portal, you agree to comply with these
          Terms & Conditions.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Nature of Service</h2>
        <p>
          This website acts as a job discovery platform. We list job openings
          from multiple companies and redirect users to official company career
          pages for applications.
        </p>
      </section>

      <section className="legal-section">
        <h2>3. No Employment Guarantee</h2>
        <p>
          We do not guarantee job placement or interview calls. Hiring decisions
          are solely made by the respective companies.
        </p>
      </section>

      <section className="legal-section">
        <h2>4. Third-Party Links</h2>
        <p>
          Job application links redirect to third-party websites. We are not
          responsible for the content, privacy practices, or terms of those
          websites.
        </p>
      </section>

      <section className="legal-section">
        <h2>5. User Responsibilities</h2>
        <ul>
          <li>Do not misuse or scrape website content</li>
          <li>Do not provide false or misleading information</li>
          <li>Use the platform for lawful purposes only</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>6. Limitation of Liability</h2>
        <p>
          We are not liable for any loss or damage resulting from the use of this
          website or third-party job application platforms.
        </p>
      </section>

      <section className="legal-section">
        <h2>7. Modifications</h2>
        <p>
          We reserve the right to modify these Terms & Conditions at any time.
        </p>
      </section>
    </div>
  );
};

export default TermsConditions;
