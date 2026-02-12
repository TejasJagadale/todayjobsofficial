import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../styles/GovtJobDetails.css';

const GovtJobDetails = () => {
    const { postId } = useParams();
    const [jobDetails, setJobDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    // Fetch job details from main JSON file
    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                setLoading(true);

                // Load the main jobs file
                const data = await import(`../data/job-details/${postId}.json`);
                const json = data.default;
                console.log(json);
                if (json) {
                    setJobDetails(json);
                } else {
                    setError("Job not found");
                }

                setLoading(false);
            } catch (err) {
                console.error('Error loading job details:', err);
                setError('Failed to load job details. Please try again later.');
                setLoading(false);
            }
        };

        fetchJobDetails();
    }, [postId]);

    // Format date display
    const formatDate = (dateString) => {
        if (!dateString) return 'Not specified';
        return dateString.replace(/\n/g, '').trim();
    };

    // Extract value from job_details_table
    const getDetailValue = (fieldKey) => {
        if (!jobDetails?.job_details_table || !jobDetails.job_details_table[fieldKey]) {
            return null;
        }
        const field = jobDetails.job_details_table[fieldKey];
        return {
            label: field.label,
            value: field.value,
            link: field.link,
            link_text: field.link_text
        };
    };

    // Get positions (skip header row)
    const getPositions = () => {
        if (!jobDetails?.positions_table || jobDetails.positions_table.length <= 1) {
            return [];
        }
        // Skip first row which is header
        return jobDetails.positions_table.slice(1);
    };

    // Get qualifications (skip header row)
    const getQualifications = () => {
        if (!jobDetails?.qualifications_table || jobDetails.qualifications_table.length <= 1) {
            return [];
        }
        // Skip first row which is header
        return jobDetails.qualifications_table.slice(1);
    };

    // Get salary details
    const getSalaryDetails = () => {
        return jobDetails?.salary_table || [];
    };

    if (loading) {
        return (
            <div className="job-details-loadinggovd">
                <div className="loader"></div>
                <p>Loading job details...</p>
            </div>
        );
    }

    if (error || !jobDetails) {
        return (
            <div className="job-details-errorgovd">
                <h2>Job Not Found</h2>
                <p>{error || 'The requested job could not be found.'}</p>
                <Link to="/govtjobs" className="back-btngovd">
                    ← Back to Government Jobs
                </Link>
            </div>
        );
    }

    return (
        <div className="job-details-containergovd">
            {/* Back Button */}
            <div className="details-headergovd">
                <Link to="/govtjobs" className="back-btngovd">
                    ← Back to Jobs
                </Link>
            </div>

            {/* Main Content */}
            <div className="details-contentgovd">
                {/* Title Section */}
                <div className="title-sectiongovd">
                    <h1 className="job-titlegovd">{jobDetails.title}</h1>
                    <div className="job-metagovd">
                        {jobDetails.metadata?.published_date && (
                            <span className="meta-itemgovd">
                                <span className="meta-icongovd">📅</span>
                                Published: {formatDate(jobDetails.metadata.published_date)}
                            </span>
                        )}
                        {jobDetails.metadata?.author && (
                            <span className="meta-itemgovd">
                                <span className="meta-icongovd">👤</span>
                                Author: {jobDetails.metadata.author}
                            </span>
                        )}
                        {jobDetails.metadata?.post_id && (
                            <span className="meta-itemgovd">
                                <span className="meta-icongovd">🆔</span>
                                Job ID: {jobDetails.metadata.post_id}
                            </span>
                        )}
                    </div>
                </div>

                {/* Description */}
                {jobDetails.description && (
                    <div className="description-sectiongovd card">
                        <h2>📋 Job Description</h2>
                        <p className="description-text">{jobDetails.description}</p>
                    </div>
                )}

                {/* Quick Info Cards */}
                <div className="quick-info-gridgovd">
                    {/* Apply Mode */}
                    {getDetailValue('field_mn7um') && (
                        <div className="info-cardgovd">
                            <div className="info-icongovd">📝</div>
                            <div className="info-contentgovd">
                                <span className="info-labelgovd">{getDetailValue('field_mn7um').label}</span>
                                <span className="info-valuegovd">{getDetailValue('field_mn7um').value}</span>
                            </div>
                        </div>
                    )}

                    {/* Last Date */}
                    {getDetailValue('field_oxvd4') && (
                        <div className="info-cardgovd highlight">
                            <div className="info-icongovd">⏰</div>
                            <div className="info-contentgovd">
                                <span className="info-labelgovd">{getDetailValue('field_oxvd4').label}</span>
                                <span className="info-valuegovd">{getDetailValue('field_oxvd4').value}</span>
                            </div>
                        </div>
                    )}

                    {/* Location */}
                    {getDetailValue('field_7v8cf') && (
                        <div className="info-cardgovd">
                            <div className="info-icongovd">📍</div>
                            <div className="info-contentgovd">
                                <span className="info-labelgovd">{getDetailValue('field_7v8cf').label}</span>
                                <span className="info-valuegovd">{getDetailValue('field_7v8cf').value}</span>
                            </div>
                        </div>
                    )}

                    {/* Vacancies */}
                    {getDetailValue('field_srml0') && (
                        <div className="info-cardgovd">
                            <div className="info-icongovd">👥</div>
                            <div className="info-contentgovd">
                                <span className="info-labelgovd">{getDetailValue('field_srml0').label}</span>
                                <span className="info-valuegovd">{getDetailValue('field_srml0').value}</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Age Limit Section */}
                {jobDetails.age_limit && (
                    <div className="age-limit-sectiongovd card">
                        <h3>🎯 Age Limit</h3>
                        <div className="age-detailsgovd">
                            {jobDetails.age_limit.min_age && (
                                <div className="age-rangegovd">
                                    <span className="age-labelgovd">Minimum Age:</span>
                                    <span className="age-valuegovd">{jobDetails.age_limit.min_age} years</span>
                                </div>
                            )}
                            {jobDetails.age_limit.max_age && (
                                <div className="age-rangegovd">
                                    <span className="age-labelgovd">Maximum Age:</span>
                                    <span className="age-valuegovd">{jobDetails.age_limit.max_age} years</span>
                                </div>
                            )}
                            {jobDetails.age_limit.full_text && (
                                <p className="age-descriptiongovd">{jobDetails.age_limit.full_text}</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Tabs Navigation */}
                <div className="tabs-containergovd">
                    <div className="tabs-navgovd">
                        <button
                            className={`tab-btngovd ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            Overview
                        </button>
                        <button
                            className={`tab-btngovd ${activeTab === 'positions' ? 'active' : ''}`}
                            onClick={() => setActiveTab('positions')}
                            disabled={getPositions().length === 0}
                        >
                            Positions & Vacancies
                        </button>
                        <button
                            className={`tab-btngovd ${activeTab === 'qualifications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('qualifications')}
                            disabled={getQualifications().length === 0}
                        >
                            Qualifications
                        </button>
                        <button
                            className={`tab-btngovd ${activeTab === 'selection' ? 'active' : ''}`}
                            onClick={() => setActiveTab('selection')}
                            disabled={!jobDetails.selection_process}
                        >
                            Selection Process
                        </button>
                        <button
                            className={`tab-btngovd ${activeTab === 'apply' ? 'active' : ''}`}
                            onClick={() => setActiveTab('apply')}
                        >
                            How to Apply
                        </button>
                    </div>

                    <div className="tab-contentgovd">
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="overview-tabgovd">
                                <div className="job-details-tablegovd card">
                                    <h3>📊 Complete Job Details</h3>
                                    <table className="details-tablegovd">
                                        <tbody>
                                            {Object.entries(jobDetails.job_details_table || {}).map(([key, value]) => {
                                                // Skip description field or empty values
                                                if (key === 'description' || !value || !value.label || value.label === 'Description') {
                                                    return null;
                                                }
                                                return (
                                                    <tr key={key}>
                                                        <td className="labelgovd">{value.label}</td>
                                                        <td className="valuegovd">
                                                            {value.link ? (
                                                                <a
                                                                    href={value.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="external-linkgovd"
                                                                >
                                                                    {value.link_text || value.value || 'Click here'}
                                                                    <span className="link-icongovd">↗</span>
                                                                </a>
                                                            ) : (
                                                                value.value
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Categories/Tags */}
                                {jobDetails.metadata?.categories && jobDetails.metadata.categories.length > 0 && (
                                    <div className="categories-sectiongovd card">
                                        <h3>🏷️ Categories</h3>
                                        <div className="tags-container">
                                            {jobDetails.metadata.categories.map((category, index) => (
                                                <span key={index} className="category-taggovd">
                                                    {category.replace(/-/g, ' ')}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Positions Tab */}
                        {activeTab === 'positions' && (
                            <div className="positions-tabgovd card">
                                <h3>📋 Available Positions & Vacancies</h3>
                                {getPositions().length > 0 ? (
                                    <div className="table-responsivegovd">
                                        <table className="data-tablegovd">
                                            <thead>
                                                <tr>
                                                    <th>Position</th>
                                                    <th>Vacancies</th>
                                                    <th>Type</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getPositions().map((position, index) => (
                                                    <tr key={index}>
                                                        <td><strong>{position.position}</strong></td>
                                                        <td className="vacancy-countgovd">{position.vacancies}</td>
                                                        <td>{position.position_type || 'General'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p>No position details available</p>
                                )}
                            </div>
                        )}

                        {/* Qualifications Tab */}
                        {activeTab === 'qualifications' && (
                            <div className="qualifications-tabgovd card">
                                <h3>📚 Educational Qualifications</h3>
                                {getQualifications().length > 0 ? (
                                    <div className="table-responsivegovd">
                                        <table className="data-tablegovd">
                                            <thead>
                                                <tr>
                                                    <th>Position</th>
                                                    <th>Qualification Required</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {getQualifications().map((item, index) => (
                                                    <tr key={index}>
                                                        <td><strong>{item.position}</strong></td>
                                                        <td>{item.qualification}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p>No qualification details available</p>
                                )}
                            </div>
                        )}

                        {/* Selection Process Tab */}
                        {activeTab === 'selection' && jobDetails.selection_process && (
                            <div className="selection-tabgovd card">
                                <h3>✅ Selection Process</h3>
                                <p className="selection-descriptiongovd">{jobDetails.selection_process.description}</p>
                                {jobDetails.selection_process.based_on && (
                                    <div className="selection-badgegovd">
                                        Selection Based On: <span className="badgegovd">{jobDetails.selection_process.based_on}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* How to Apply Tab */}
                        {activeTab === 'apply' && (
                            <div className="apply-tabgovd">
                                {/* Application Fee */}
                                {jobDetails.application_fee && (
                                    <div className="cardgovd">
                                        <h3>💰 Application Fee</h3>
                                        {jobDetails.application_fee.is_free ? (
                                            <div className="free-applicationgovd">
                                                <span className="free-badgegovd">✓ FREE APPLICATION</span>
                                                <p>No application fee required. {jobDetails.application_fee.description || ''}</p>
                                            </div>
                                        ) : (
                                            <p>{jobDetails.application_fee.description}</p>
                                        )}
                                    </div>
                                )}

                                {/* How to Apply Instructions */}
                                <div className="cardgovd">
                                    <h3>📨 How to Apply</h3>
                                    {getDetailValue('field_mn7um') && (
                                        <div className="apply-instructionsgovd">
                                            <p><strong>Application Mode:</strong> {getDetailValue('field_mn7um').value}</p>
                                        </div>
                                    )}
                                    {!getDetailValue('field_mn7um') && (
                                        <p>Please check the official notification for application instructions.</p>
                                    )}
                                </div>

                                {/* Important Links */}
                                {jobDetails.application_links_table && (
                                    <div className="application-linksgovd card">
                                        <h3>🔗 Important Links</h3>
                                        <div className="links-gridgovd">
                                            {jobDetails.application_links_table.official_website && (
                                                <a
                                                    href={jobDetails.application_links_table.official_website.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="link-btngovd website"
                                                >
                                                    🌐 Official Website
                                                </a>
                                            )}
                                            {getDetailValue('field_il36t')?.link && (
                                                <a
                                                    href={getDetailValue('field_il36t').link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="link-btngovd notification"
                                                >
                                                    📄 Official Notification
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Social Media Links */}
                {jobDetails.social_media_links && jobDetails.social_media_links.length > 0 && (
                    <div className="social-links-sectiongovd card">
                        <h3>📱 Join Our Channels</h3>
                        <div className="social-links-gridgovd">
                            {jobDetails.social_media_links
                                .filter((link, index, self) =>
                                    // Remove duplicates based on platform and url
                                    index === self.findIndex(l =>
                                        l.platform === link.platform && l.url === link.url
                                    )
                                )
                                .map((link, index) => (
                                    link.platform !== 'unknown' && (
                                        <a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`social-linkgovd ${link.platform.toLowerCase()}`}
                                        >
                                            <span className="social-icongovd">
                                                {link.platform === 'WhatsApp' && '📱'}
                                                {link.platform === 'Telegram' && '📨'}
                                                {link.platform === 'Instagram' && '📸'}
                                                {link.platform === 'Facebook' && '📘'}
                                                {link.platform === 'Twitter' && '🐦'}
                                                {link.platform === 'YouTube' && '▶️'}
                                            </span>
                                            <span className="social-titlegovd">
                                                {link.title.replace(/\n/g, ' ').trim()}
                                            </span>
                                        </a>
                                    )
                                ))}
                        </div>
                    </div>
                )}

                {/* Related Jobs */}
                {jobDetails.related_jobs && jobDetails.related_jobs.length > 0 && (
                    <div className="related-jobs-sectiongovd card">
                        <h3>🔍 Related Jobs</h3>
                        <div className="related-jobs-grid">
                            {jobDetails.related_jobs.slice(0, 4).map((job, index) => (
                                <a
                                    key={index}
                                    href={job.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="related-job-cardgovd"
                                >
                                    <div className="related-job-titlegovd">{job.title}</div>
                                    <span className="view-linkgovd">View Details →</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GovtJobDetails;