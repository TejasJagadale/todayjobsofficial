import React from "react";
import "../styles/Legal.css";

const PrivacyPolicy = () => {
  return (
    <div className="legal-container">
      <h1 className="legal-title">Privacy Policy</h1>

      <p className="legal-updated">Last updated: January 2026</p>

      <section className="legal-section">
        <h2>1. Introduction</h2>
        <p>
          Welcome to our Job Portal. Your privacy is important to us. This
          Privacy Policy explains how we collect, use, and protect your
          information when you use our website to explore job opportunities
          across IT, Finance, Marketing, and other industries.
        </p>
      </section>

      <section className="legal-section">
        <h2>2. Information We Collect</h2>
        <ul>
          <li>Basic information such as name and email (if provided)</li>
          <li>Job preferences and browsing activity</li>
          <li>Technical data like browser type and device information</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>3. How We Use Your Information</h2>
        <ul>
          <li>To display relevant job opportunities</li>
          <li>To improve website performance and user experience</li>
          <li>To communicate important updates (if opted in)</li>
        </ul>
      </section>

      <section className="legal-section">
        <h2>4. Job Applications</h2>
        <p>
          Our website does not directly collect or store job applications.
          When you apply for a job, you are redirected to the official company
          career page. We are not responsible for data handling on third-party
          websites.
        </p>
      </section>

      <section className="legal-section">
        <h2>5. Data Security</h2>
        <p>
          We take reasonable measures to protect your information, but no
          internet transmission is 100% secure.
        </p>
      </section>

      <section className="legal-section">
        <h2>6. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Continued use of
          the website implies acceptance of the updated policy.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
