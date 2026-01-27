import { useEffect, useState } from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";

const stats = [
  { value: "100+", label: "Active Jobs", img: "/assets/Group 94.png" },
  { value: "3000+", label: "Companies", img: "/assets/Group 95.png" },
  { value: "3000+", label: "Candidates", img: "/assets/Group 96.png" },
  { value: "2k+", label: "New Jobs", img: "/assets/Group 94.png" },
];

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /* FETCH JOBS */
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("https://jobs.mpdatahub.com/api/job/list");
        const json = await res.json();

        if (json.status) {
          setJobs(json.data);
        } else {
          setError("Failed to load jobs");
        }
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  /* SAVE / UNSAVE USING API */
  const toggleSave = async (job) => {
    try {
      const res = await fetch(
        "https://jobs.mpdatahub.com/api/job-save-status",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: job.id,
            is_saved: job.is_saved ? 0 : 1,
          }),
        }
      );

      if (res.ok) {
        setJobs((prev) =>
          prev.map((j) =>
            j.id === job.id
              ? { ...j, is_saved: j.is_saved ? 0 : 1 }
              : j
          )
        );
      }
    } catch (err) {
      console.error("Save job failed");
    }
  };

  return (
    <div className="job-home">
      <section className="hero">
        <h1>
          Find Your Dream Job <br />
          <span>Today</span>
        </h1>
        <p>
          Connect with top Companies and discover opportunities that match your
          skills and aspirations. Your next career move start here.
        </p>

        <div className="search-box">
          <div className="input-group">
            <img className="icon" src="/assets/ri_search-line.png" alt="" />
            <input type="text" placeholder="Job Title, Keywords, or Company" />
          </div>

          <div className="input-group">
            <img className="icon" src="/assets/Frame (6).png" alt="" />
            <input type="text" placeholder="Location" />
          </div>

          <div className="input-group">
            <img className="icon" src="/assets/Frame (7).png" alt="" />
            <select>
              <option>Job Type</option>
              <option>Full-time</option>
              <option>Part-time</option>
            </select>
          </div>

          <button className="search-btn">Search Jobs</button>
        </div>

        <div className="stats">
          {stats.map((item, index) => (
            <div className="stat-card" key={index}>
              <img src={item.img} alt="" />
              <h3>{item.value}</h3>
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED JOBS */}
      <section className="featured">
        <div className="featured-header">
          <h2>Featured Jobs</h2>
          <span
            onClick={() => navigate("/jobs")}
            className="view-all"
          >
            View All{" "}
            <img className="moreimg" src="/assets/Frame (3).png" alt="" />
          </span>
        </div>

        <p className="subtitle">
          Hand-picked jobs for you based on your profile
        </p>

        {loading && <p>Loading jobs...</p>}
        {error && <p>{error}</p>}

        <div className="jobs-grid">
          {jobs.map((job) => (
            <div className="job-card" key={job.id} onClick={() => navigate(`/jobsdetails/${job.id}`)}>
              <div className="job-cardimgsec">
                <img className="cardimgsec" src="/assets/logomp.png" alt="" />
                <h4>{job.role}</h4>

                {/* SAVE ICON */}
                <div
                  className={`savejd ${job.is_saved ? "saved" : ""}`}
                  onClick={() => toggleSave(job)}
                >
                  <img src="/assets/sawed.png" className="saveit" alt="" />
                </div>
              </div>

              <p className="company">{job.company_name}</p>

              <div className="job-info">
                <span>
                  <img src="/assets/Frame.png" alt="" /> {job.salary}
                </span>
                <span>
                  <img src="/assets/Frame (1).png" alt="" /> {job.location}
                </span>
                <span>
                  <img src="/assets/Frame (2).png" alt="" /> {job.work_mode}
                </span>
              </div>

              <div className="skills">
                {job.required_skill_set
                  .split(",")
                  .map((skill, i) => (
                    <span key={i}>{skill.trim()}</span>
                  ))}
              </div>

              <a
                className="apply-btn"
                href={job.apply_now_url}
              >
                Apply Now
              </a>
            </div>
          ))}
        </div>

        <div className="more-jobs">
          <button onClick={() => navigate("/jobs")}>
            Explore More Jobs{" "}
            <img className="moreimg" src="/assets/Frame (3).png" alt="" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
