import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Govtjobs.css';
// import thedata from "../data/alljson.json";

const Govtjobs = () => {
    const [jobData, setJobData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedQualification, setSelectedQualification] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 10;

    // Load JSON data
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);

                const data = await import("../data/alljson.json"); // MUST be a string path
                const json = data.default;

                setJobData(json);
                setFilteredJobs(json.jobs || []);

            } catch (err) {
                console.error("Error loading jobs:", err);
                setError("Failed to load job data.");
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    // Filter jobs based on search, category, and qualification
    useEffect(() => {
        if (!jobData?.jobs) return;

        let filtered = [...jobData.jobs];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(job =>
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.categories.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (job.tags && job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
            );
        }

        // Apply category filter
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(job =>
                job.categories && job.categories.includes(selectedCategory)
            );
        }

        // Apply qualification filter
        if (selectedQualification !== 'All') {
            filtered = filtered.filter(job =>
                job.details?.qualification && job.details.qualification.includes(selectedQualification)
            );
        }

        setFilteredJobs(filtered);
        setCurrentPage(1);
    }, [searchTerm, selectedCategory, selectedQualification, jobData]);

    // Get current page jobs
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    // Extract unique categories and qualifications for filters
    const getUniqueCategories = () => {
        if (!jobData?.jobs) return ['All'];
        const categories = new Set();
        jobData.jobs.forEach(job => {
            if (job.categories) {
                job.categories.forEach(cat => categories.add(cat));
            }
        });
        return ['All', ...Array.from(categories).sort()];
    };

    const getUniqueQualifications = () => {
        if (!jobData?.jobs) return ['All'];
        const qualifications = new Set();
        jobData.jobs.forEach(job => {
            if (job.details?.qualification && job.details.qualification !== 'Not specified') {
                qualifications.add(job.details.qualification);
            }
        });
        return ['All', ...Array.from(qualifications).sort()];
    };

    // Format salary display
    const formatSalary = (salary) => {
        if (!salary || salary === 'Not specified') return 'Not disclosed';
        return salary.replace(/\./g, '₹').trim();
    };

    // Format date display
    const formatDate = (dateString) => {
        if (!dateString) return 'Date not available';
        return dateString.replace(/\n/g, '').trim();
    };

    if (loading) {
        return (
            <div className="jobs-loading">
                <div className="loader"></div>
                <p>Loading job opportunities...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="jobs-error">
                <h2>Oops! Something went wrong</h2>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className="retry-btn">
                    Retry
                </button>
            </div>
        );
    }

    if (!jobData || !jobData.jobs || jobData.jobs.length === 0) {
        return (
            <div className="jobs-empty">
                <h2>No Jobs Available</h2>
                <p>Check back later for new government job opportunities.</p>
            </div>
        );
    }

    const uniqueCategories = getUniqueCategories();
    const uniqueQualifications = getUniqueQualifications();

    return (
        <div className="govt-jobs-containergov">
            {/* Header Section */}
            <div className="jobs-headergov">
                <div className="header-titlegov">
                    <h1>🎯 Tamil Nadu Government Jobs</h1>
                    <p className="job-statsgov">
                        <span className="total-jobsgov">{filteredJobs.length} Jobs Available</span>
                        <span className="update-dategov">
                            Last Updated: {jobData.metadata?.exportDate ? new Date(jobData.metadata.exportDate).toLocaleDateString('en-IN') : 'Today'}
                        </span>
                    </p>
                </div>

                {/* Search and Filter Section */}
                <div className="filter-sectiongov">
                    <div className="search-boxgov">
                        <input
                            type="text"
                            placeholder="🔍 Search jobs, categories, or tags..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-inputgov"
                        />
                    </div>

                    <div className="filter-controlsgov">
                        <div className="filter-groupgov">
                            <label>Category:</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="filter-selectgov"
                            >
                                {uniqueCategories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-groupgov">
                            <label>Qualification:</label>
                            <select
                                value={selectedQualification}
                                onChange={(e) => setSelectedQualification(e.target.value)}
                                className="filter-selectgov"
                            >
                                {uniqueQualifications.map(qual => (
                                    <option key={qual} value={qual}>{qual}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            className="reset-btngov"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('All');
                                setSelectedQualification('All');
                            }}
                        >
                            Reset Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Summary */}
            {/* {jobData.metadata?.summary && (
                <div className="stats-summarygov">
                    <div className="stat-cardgov">
                        <span className="stat-valuegov">{jobData.metadata.summary.totalJobs || jobData.jobs.length}</span>
                        <span className="stat-labelgov">Total Jobs</span>
                    </div>
                    <div className="stat-cardgov">
                        <span className="stat-valuegov">{Object.keys(jobData.metadata.summary.categories || {}).length}</span>
                        <span className="stat-labelgov">Categories</span>
                    </div>
                    <div className="stat-cardgov">
                        <span className="stat-valuegov">{Object.keys(jobData.metadata.summary.qualifications || {}).length}</span>
                        <span className="stat-labelgov">Qualifications</span>
                    </div>
                    <div className="stat-cardgov">
                        <span className="stat-valuegov">💼</span>
                        <span className="stat-labelgov">Govt Jobs</span>
                    </div>
                </div>
            )} */}

            {/* Jobs Grid */}
            <div className="jobs-gridgov">
                {currentJobs.length > 0 ? (
                    currentJobs.map((job) => (
                        <div key={job.id} className="job-cardgov">
                            {job.image?.url && (
                                <div className="job-imagegov">
                                    <img
                                        src={job.image.url}
                                        alt={job.image.alt || job.title}
                                        loading="lazy"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
                                        }}
                                    />
                                    {job.details?.noExamRequired && (
                                        <span className="badgegov no-examgov">📝 No Exam</span>
                                    )}
                                </div>
                            )}

                            <div className="job-contentgov">
                                <h2 className="job-titlegov">
                                    <Link to={`/job/${job.id}`}>
                                        {job.title.replace(/\n/g, ' ')}
                                    </Link>
                                </h2>

                                <div className="job-metagov">
                                    <span className="meta-itemgov">
                                        <span className="meta-icongov">📅</span>
                                        {formatDate(job.metadata?.publishedDate)}
                                    </span>
                                    <span className="meta-itemgov">
                                        <span className="meta-icongov">👤</span>
                                        {job.metadata?.author}
                                    </span>
                                </div>

                                <div className="job-detailsgov">
                                    <div className="detail-itemgov">
                                        <span className="detail-labelgov">💰 Salary:</span>
                                        <span className="detail-value salarygov">
                                            {formatSalary(job.details?.salary)}
                                        </span>
                                    </div>

                                    <div className="detail-itemgov">
                                        <span className="detail-labelgov">📚 Qualification:</span>
                                        <span className="detail-value qualificationgov">
                                            {job.details?.qualification}
                                        </span>
                                    </div>
                                </div>

                                <div className="job-categoriesgov">
                                    {job.categories && job.categories.map((category, index) => (
                                        <span
                                            key={index}
                                            className="category-taggov"
                                            onClick={() => setSelectedCategory(category)}
                                        >
                                            {category}
                                        </span>
                                    ))}
                                </div>

                                <div className="job-footergov">
                                    <Link to={`/job/${job.id}`} className="apply-btngov">
                                        View Details →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-resultsgov">
                        <h3>No matching jobs found</h3>
                        <p>Try adjusting your search or filter criteria</p>
                        <button
                            className="reset-btngov"
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedCategory('All');
                                setSelectedQualification('All');
                            }}
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {filteredJobs.length > jobsPerPage && (
                <div className="paginationgov">
                    <button
                        className="pagination-btngov"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        ← Previous
                    </button>

                    <div className="page-numbersgov">
                        {[...Array(totalPages).keys()].map(number => (
                            <button
                                key={number + 1}
                                className={`page-btngov ${currentPage === number + 1 ? 'active' : ''}`}
                                onClick={() => setCurrentPage(number + 1)}
                            >
                                {number + 1}
                            </button>
                        ))}
                    </div>

                    <button
                        className="pagination-btngov"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
};

export default Govtjobs;