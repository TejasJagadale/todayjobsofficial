import { useEffect, useState } from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import jobsData from "../data/jobsData";

const stats = [
  { value: "100+", label: "Active Jobs", img: "/assets/Group 94.png" },
  { value: "3000+", label: "Companies", img: "/assets/Group 95.png" },
  { value: "3000+", label: "Candidates", img: "/assets/Group 96.png" },
  { value: "2k+", label: "New Jobs", img: "/assets/Group 94.png" },
];

const Home = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const navigate = useNavigate();

  /* LOAD SAVED JOBS */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedJobs")) || [];
    setSavedJobs(stored);
  }, []);

  /* SAVE / UNSAVE */
  const toggleSave = (job) => {
    let updated;

    if (savedJobs.find((j) => j.id === job.id)) {
      updated = savedJobs.filter((j) => j.id !== job.id);
    } else {
      updated = [...savedJobs, job];
    }

    setSavedJobs(updated);
    localStorage.setItem("savedJobs", JSON.stringify(updated));
  };

  const isSaved = (id) => savedJobs.some((job) => job.id === id);
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
            <input
              type="text"
              placeholder="Job Title, Keywords, or Company"
            />
          </div>

          <div className="input-group">
            <img className="icon" src="/assets/Frame (6).png" alt="" />
            <input
              type="text"
              placeholder="Location"
            />
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
          <span onClick={() => { navigate("/jobs") }} className="view-all">View All <img className="moreimg" src="/assets/Frame (3).png" alt="" /></span>
        </div>

        <p className="subtitle">
          Hand-picked jobs for you based on your profile
        </p>

        <div className="jobs-grid">
          {jobsData.map((job) => (
            <div className="job-card" key={job.id}>
              {/* <div className="job-cardimgsec">
                <img className="cardimgsec" src={job.img} alt="" />
                <h4>{job.title}</h4>
                <img src="/assets/Group 101.png" className="saveit" alt="" />
              </div> */}
              <div className="job-cardimgsec">
                <img className="cardimgsec" src="/assets/logomp.png" alt="" />
                <h4>{job.title}</h4>
                {/* SAVE ICON */}
                <div
                  className={`savejd ${isSaved(job.id) ? "saved" : ""}`}
                  onClick={() => toggleSave(job)}
                >
                  <img src="/assets/sawed.png" className="saveit" alt="" />
                </div>
              </div>
              <p className="company">{job.company}</p>

              <div className="job-info">
                <span> <img src="/assets/Frame.png" alt="" /> {job.salary}</span>
                <span> <img src="/assets/Frame (1).png" alt="" /> {job.location}</span>
                <span> <img src="/assets/Frame (2).png" alt="" /> {job.type}</span>
              </div>

              <div className="skills">
                {job.skills.map((skill, i) => (
                  <span key={i}>{skill}</span>
                ))}
              </div>

              <button
                className="apply-btn"
                onClick={() => navigate(`/jobsdetails/${job.id}`)}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>

        <div className="more-jobs">
          <button onClick={() => navigate("/jobs")}>
            Explore More Jobs <img className="moreimg" src="/assets/Frame (3).png" alt="" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
