import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/JobDetails.css";

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const res = await fetch("https://jobs.mpdatahub.com/api/job/list");
        const json = await res.json();

        if (json.status) {
          const foundJob = json.data.find(
            (item) => item.id === Number(id)
          );

          if (!foundJob) {
            setError("Job not found");
          } else {
            setJob(foundJob);
          }
        } else {
          setError("Failed to fetch job details");
        }
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [id]);

  if (loading) return <h2 style={{ padding: "40px" }}>Loading...</h2>;
  if (error) return <h2 style={{ padding: "40px" }}>{error}</h2>;

  return (
    <div className="job-details">
      {/* HEADER */}
      <div className="job-header">
        <div className="jh1">
          <div>
            <h2>{job.role}</h2>
            <p className="company">{job.company_name}</p>

            <div className="meta">
              <span>{job.salary}</span>
              <span>{job.location}</span>
              <span>{job.work_mode}</span>
            </div>
          </div>

          <div>
            <img className="jh1img" src="/assets/logomp.png" alt="" />
          </div>
        </div>

        <div className="actions">
          <div className="job-extra">
            <p>
              Openings : <b>{job.number_of_vacancy}</b>
            </p>
            <p>
              Posted :{" "}
              <b>{new Date(job.created_at).toLocaleDateString()}</b>
            </p>
          </div>

          <div className="je1">
            {/* <button className="save-btn">
              {job.is_saved ? "Saved" : "Save"}
            </button> */}
            <a href={job.apply_now_url} className="apply-btn">Apply Now</a>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="job-content">
        <h4>Description</h4>

        <h5>About Company</h5>
        <p>{job.company_description}</p>

        <h5>Job Description</h5>
        <p>{job.job_description}</p>

        <h5>More Info</h5>
        <p>
          <b>Role :</b> {job.role}
        </p>
        <p>
          <b>Industry :</b> {job.industry_mode}
        </p>
        <p>
          <b>Employee Type :</b> {job.work_mode}
        </p>

        <h5>Education</h5>
        <p>UG : {job.education}</p>

        <h5>Required Skill Set</h5>
        <div className="skills">
          {job.required_skill_set
            .split(",")
            .map((skill, i) => (
              <span key={i}>{skill.trim()}</span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
