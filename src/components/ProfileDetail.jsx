import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProfileDetail.css";

const ProfileDetail = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("personal");
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showResumeModal, setShowResumeModal] = useState(false); //Opens/closes modal
  const [resumeFile, setResumeFile] = useState(null); //Stores selected file
  const [uploading, setUploading] = useState(false); //Shows "Saving..." while uploading
  const [isEditingResume, setIsEditingResume] = useState(false); //Controls edit mode
  const [isViewResume, setIsViewResume] = useState(true); //Controls view mode
  const [resume, setResume] = useState(null); //Stores resume file URL
  console.log(setIsViewResume);


  /* GET LOGGED-IN USER */
  // const user = JSON.parse(localStorage.getItem("user"));

  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user"));
  });

  // useEffect(() => {
  //   setResume(user.profile_document);
  // }, []);

  useEffect(() => {
    if (user?.profile_document) {
      setResume(user.profile_document);
    }
  }, [user?.profile_document]);


  /* LOGOUT */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* CHANGE PASSWORD */
  const handleChangePassword = () => {
    navigate("/reset-password");
  };

  /* FETCH SAVED JOBS */
  useEffect(() => {
    const fetchSavedJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch("https://jobs.mpdatahub.com/api/job/list");
        const json = await res.json();

        if (json.status) {
          const saved = json.data.filter((job) => job.is_saved === 1);
          setSavedJobs(saved);
        }
      } catch (err) {
        console.error("Failed to load saved jobs");
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === "saved") {
      fetchSavedJobs();
    }
  }, [activeTab]); 

  /* SAFETY */
  if (!user) {
    return <p style={{ padding: 40 }}>Please login again.</p>;
  }

  const handleResumeUploadOrUpdate = async () => {
    if (!resumeFile) return;

    const token = localStorage.getItem("token");
    setUploading(true);

    const formData = new FormData();
    formData.append("profile_document", resumeFile);

    try {
      const res = await fetch(
        "https://jobs.mpdatahub.com/api/update-profile",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const json = await res.json();
      console.log("Upload response:", json);

      if (!json.success) {
        alert("Upload failed");
        return;
      }


      const storedUser = JSON.parse(localStorage.getItem("user")) || {};
      const profileDocument = json.user?.profile_document || json.data?.profile_document;
      const updatedUser = { ...storedUser, ...json.user, profile_document: profileDocument, };

      setUser(updatedUser);
      setResume(profileDocument);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Resume uploaded successfully");
      setShowResumeModal(false);
      setResumeFile(null);

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setUploading(false);
      setIsEditingResume(false);
    }
  };



  return (
    <div className="profile-pagepd">
      {/* Header */}
      <div className="profile-headerpd">
        <img src={user.profile_image} alt="profile" />

        <div className="profile-head-content">
          <h3>{user.name}</h3>
          <p>{user.role}</p>

          <div className="infopd">
            <span>{user.email}</span>
            <span>{user.mobile}</span>
            <span>{user.location}</span>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="profile-actions">

          <button className="resume" onClick={() => setShowResumeModal(true)}> Resume </button>


          <button className="btn-outline" onClick={handleChangePassword}>
            Change Password
          </button>

          <button className="btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="profile-contentpd">
        {/* Sidebar */}
        <div className="profile-sidebarpd">
          <button
            className={activeTab === "personal" ? "active" : ""}
            onClick={() => setActiveTab("personal")}
          >
            Personal Details
          </button>

          <button
            className={activeTab === "saved" ? "active" : ""}
            onClick={() => setActiveTab("saved")}
          >
            Saved Jobs
          </button>
        </div>

        {/* Main */}
        <div className="profile-mainpd">
          {activeTab === "personal" && (
            <div className="details-cardpd">
              <div className="headerpd">
                <h3>Personal Details</h3>
              </div>

              <div className="gridpd">
                <div>
                  <label>Full Name</label>
                  <input value={user.name} readOnly />
                </div>
                <div>
                  <label>Role</label>
                  <input value={user.role} readOnly />
                </div>
                <div>
                  <label>Email</label>
                  <input value={user.email} readOnly />
                </div>
                <div>
                  <label>Phone Number</label>
                  <input value={user.mobile} readOnly />
                </div>
                <div className="fullpd">
                  <label>Location</label>
                  <input value={user.location} readOnly />
                </div>
              </div>
            </div>
          )}

          {activeTab === "saved" && (
            <div className="saved-jobspd">
              {loading ? (
                <p>Loading saved jobs...</p>
              ) : savedJobs.length === 0 ? (
                <p>No saved jobs yet.</p>
              ) : (
                savedJobs.map((job) => (
                  <div key={job.id} className="saved-job-cardpd">
                    <h4>{job.role}</h4>
                    <p>{job.company_name}</p>
                    <span>{job.location}</span>
                    <span>{job.work_mode}</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>


      {showResumeModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Resume</h3>

            {/* VIEW RESUME */}
            {user.profile_document && (
              <a href={resume} target="_blank" rel="noreferrer" className="btn-outline" style={{ textDecoration: "none" }}>
                View Resume
              </a>
            )}

            {isViewResume && !isEditingResume && (
              <button className="btn-outline" onClick={() => setIsEditingResume(true)}>Edit Resume</button>
            )}

            {/* FILE INPUT */}
            {isEditingResume && (
              <>
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} />

                <button className="btn-outline" disabled={!resumeFile || uploading} onClick={handleResumeUploadOrUpdate}>
                  {uploading ? "Saving..." : "Update Resume"}
                </button>
              </>
            )}

            <button className="btn-danger"
              onClick={() => {
                setShowResumeModal(false);
                setResumeFile(null);
                setIsEditingResume(false);
              }}
            >
              Close
            </button>

          </div>
        </div>
      )}


    </div>
  );
};

export default ProfileDetail;
