import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Govtjobs.css';

const Govtjobs = () => {
    // State for current active tab
    const [activeTab, setActiveTab] = useState('TN Govt Jobs');
    
    // State for each job category data
    const [tnGovtJobs, setTnGovtJobs] = useState(null);
    const [centralGovtJobs, setCentralGovtJobs] = useState(null);
    const [pass12Jobs, setPass12Jobs] = useState(null);
    const [pass10Jobs, setPass10Jobs] = useState(null);
    const [degreeJobs, setDegreeJobs] = useState(null);
    const [diplomaJobs, setDiplomaJobs] = useState(null);
    const [itiJobs, setItiJobs] = useState(null);
    
    // Common states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedQualification, setSelectedQualification] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const jobsPerPage = 10;

    // Tab configuration - memoized to prevent unnecessary re-renders
    const tabs = useMemo(() => [
        { id: 'TN Govt Jobs', label: '🎯 TN Govt Jobs', jsonFile: 'alljson.json' },
        { id: '12TH PASS Govt Jobs', label: '📚 12th Pass Jobs', jsonFile: '12th_pass_jobs.json' },
        { id: '10TH PASS Govt Jobs', label: '📖 10th Pass Jobs', jsonFile: '10th_pass_jobs.json' },
        { id: 'CENTRAL GOVT JOBS', label: '🏛️ Central Govt Jobs', jsonFile: 'central_govt_jobs.json' },
        { id: 'ANY DEGREE GOVT JOBS', label: '🎓 Any Degree Jobs', jsonFile: 'degree_jobs.json' },
        { id: 'DIPLOMA GOVT JOBS', label: '🔧 Diploma Jobs', jsonFile: 'diploma_jobs.json' },
        { id: 'ITI GOV JOBS', label: '🛠️ ITI Jobs', jsonFile: 'iti_jobs.json' }
    ], []);

    // Memoized function to get current job data based on active tab
    const getCurrentJobData = useCallback(() => {
        switch(activeTab) {
            case 'TN Govt Jobs':
                return tnGovtJobs;
            case '12TH PASS Govt Jobs':
                return pass12Jobs;
            case '10TH PASS Govt Jobs':
                return pass10Jobs;
            case 'CENTRAL GOVT JOBS':
                return centralGovtJobs;
            case 'ANY DEGREE GOVT JOBS':
                return degreeJobs;
            case 'DIPLOMA GOVT JOBS':
                return diplomaJobs;
            case 'ITI GOV JOBS':
                return itiJobs;
            default:
                return tnGovtJobs;
        }
    }, [activeTab, tnGovtJobs, pass12Jobs, pass10Jobs, centralGovtJobs, degreeJobs, diplomaJobs, itiJobs]);

    // Function to set job data for specific tab - memoized with useCallback
    const setJobDataForTab = useCallback((tabId, data) => {
        switch(tabId) {
            case 'TN Govt Jobs':
                setTnGovtJobs(data);
                break;
            case '12TH PASS Govt Jobs':
                setPass12Jobs(data);
                break;
            case '10TH PASS Govt Jobs':
                setPass10Jobs(data);
                break;
            case 'CENTRAL GOVT JOBS':
                setCentralGovtJobs(data);
                break;
            case 'ANY DEGREE GOVT JOBS':
                setDegreeJobs(data);
                break;
            case 'DIPLOMA GOVT JOBS':
                setDiplomaJobs(data);
                break;
            case 'ITI GOV JOBS':
                setItiJobs(data);
                break;
            default:
                break;
        }
    }, []);

    // Load JSON data for all tabs
    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                setLoading(true);
                setError(null);

                // Load all JSON files in parallel
                const jobPromises = tabs.map(tab => 
                    import(`../data/${tab.jsonFile}`)
                        .then(module => ({ tabId: tab.id, data: module.default }))
                        .catch(err => {
                            console.error(`Error loading ${tab.jsonFile}:`, err);
                            return { tabId: tab.id, data: { jobs: [], metadata: {} } };
                        })
                );

                const results = await Promise.all(jobPromises);
                
                // Set data for each tab
                results.forEach(result => {
                    setJobDataForTab(result.tabId, result.data);
                });

                setLoading(false);
            } catch (err) {
                console.error("Error loading jobs:", err);
                setError("Failed to load job data.");
                setLoading(false);
            }
        };

        fetchAllJobs();
    }, [tabs, setJobDataForTab]); // Added tabs and setJobDataForTab as dependencies

    // Update filtered jobs when active tab changes or any job data updates
    useEffect(() => {
        const currentData = getCurrentJobData();
        if (currentData?.jobs) {
            setFilteredJobs(currentData.jobs);
        } else {
            setFilteredJobs([]);
        }
        setCurrentPage(1);
        setSearchTerm('');
        setSelectedCategory('All');
        setSelectedQualification('All');
    }, [activeTab, getCurrentJobData]); // Added getCurrentJobData as dependency

    // Filter jobs based on search, category, and qualification
    useEffect(() => {
        const currentData = getCurrentJobData();
        if (!currentData?.jobs) return;

        let filtered = [...currentData.jobs];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(job =>
                job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.categories?.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase())) ||
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
    }, [
        searchTerm, 
        selectedCategory, 
        selectedQualification, 
        getCurrentJobData
    ]); // Added getCurrentJobData as dependency

    // Get current page jobs
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
    const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

    // Extract unique categories and qualifications for current tab - memoized
    const uniqueCategories = useMemo(() => {
        const currentData = getCurrentJobData();
        if (!currentData?.jobs) return ['All'];
        const categories = new Set();
        currentData.jobs.forEach(job => {
            if (job.categories) {
                job.categories.forEach(cat => categories.add(cat));
            }
        });
        return ['All', ...Array.from(categories).sort()];
    }, [getCurrentJobData]);

    const uniqueQualifications = useMemo(() => {
        const currentData = getCurrentJobData();
        if (!currentData?.jobs) return ['All'];
        const qualifications = new Set();
        currentData.jobs.forEach(job => {
            if (job.details?.qualification && job.details.qualification !== 'Not specified') {
                qualifications.add(job.details.qualification);
            }
        });
        return ['All', ...Array.from(qualifications).sort()];
    }, [getCurrentJobData]);


    // Format date display - memoized
    const formatDate = useCallback((dateString) => {
        if (!dateString) return 'Date not available';
        return dateString.replace(/\n/g, '').trim();
    }, []);

    // Get current tab metadata - memoized
    const currentMetadata = useMemo(() => {
        const currentData = getCurrentJobData();
        return currentData?.metadata || {};
    }, [getCurrentJobData]);

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

    const currentData = getCurrentJobData();

    return (
        <div className="govt-jobs-containergov">
            {/* Tabs Navigation */}
            <div className="tabs-containergov">
                <div className="tabs-headergov">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-btngov ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Header Section */}
            <div className="jobs-headergov">
                <div className="header-titlegov">
                    <h1>{tabs.find(tab => tab.id === activeTab)?.label}</h1>
                    <p className="job-statsgov">
                        <span className="total-jobsgov">
                            {filteredJobs.length} Jobs Available
                        </span>
                        <span className="update-dategov">
                            Last Updated: {currentMetadata?.exportDate ? 
                                new Date(currentMetadata.exportDate).toLocaleDateString('en-IN') : 
                                'Today'}
                        </span>
                    </p>
                </div>

                {/* Search and Filter Section - Only show if jobs exist */}
                {currentData?.jobs?.length > 0 && (
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
                )}
            </div>

            {/* Jobs Grid */}
            {currentData?.jobs?.length > 0 ? (
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
                                        <Link to={`/job/${job.id}?type=${activeTab}`}>
                                            {job.title?.replace(/\n/g, ' ')}
                                        </Link>
                                    </h2>

                                    <div className="job-metagov">
                                        <span className="meta-itemgov">
                                            <span className="meta-icongov">📅</span>
                                            {formatDate(job.metadata?.publishedDate)}
                                        </span>
                                        {/* <span className="meta-itemgov">
                                            <span className="meta-icongov">👤</span>
                                            {job.metadata?.author}
                                        </span>
                                        {job.details?.qualification && (
                                            <span className="meta-itemgov">
                                                <span className="meta-icongov">🎓</span>
                                                {job.details.qualification}
                                            </span>
                                        )} */}
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
                                        <Link 
                                            to={`/job/${job.id}?type=${activeTab}`} 
                                            className="apply-btngov"
                                        >
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
            ) : (
                <div className="jobs-empty">
                    <h2>No Jobs Available in {activeTab}</h2>
                    <p>Check back later for new government job opportunities in this category.</p>
                </div>
            )}

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