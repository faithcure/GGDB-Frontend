// src/components/modals/EditContributorsModal.jsx - Updated with roles array support
import React, { useState, useEffect, useCallback } from "react";
import { FaTimes, FaSearch, FaUser, FaPlus, FaExclamationTriangle, FaCheckCircle, FaEdit, FaFlag, FaInfo } from "react-icons/fa";
import { DEPARTMENTS } from "../../data/departments.js";
import axios from "axios";
import { API_BASE } from "../../config/api";


// Helper function for safe image URLs
const isValidImageUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    if (url.length < 4) return false;
    const urlPattern = /^(https?:\/\/|data:image\/|\/|\.\/)/i;
    return urlPattern.test(url.trim());
};

// Helper function for fallback images
const generateFallbackImage = (name) => {
    const safeName = name && typeof name === 'string' ? name : 'User';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(safeName)}&background=random&color=fff&size=48`;
};

// 🆕 Helper function to format roles for display (backward compatibility)
const formatRolesForDisplay = (contributor) => {
    // 🆕 NEW FORMAT: Use roles array
    if (contributor.roles && Array.isArray(contributor.roles) && contributor.roles.length > 0) {
        return contributor.roles.map(role => role.name).join(' & ');
    }

    // 🔧 BACKWARD COMPATIBILITY: Use legacy role field
    return contributor.role || '';
};

// 🆕 Helper function to parse roles from contributor data
const parseRolesFromContributor = (contributor) => {
    // 🆕 NEW FORMAT: Already has roles array
    if (contributor.roles && Array.isArray(contributor.roles) && contributor.roles.length > 0) {
        return contributor.roles.map(role => ({
            department: role.department || "",
            role: role.name || ""
        }));
    }

    // 🔧 BACKWARD COMPATIBILITY: Parse from legacy role + department
    if (contributor.role && contributor.department && contributor.department.trim() !== "") {
        const roleNames = contributor.role.split(' & ').map(r => r.trim());
        return roleNames.map(roleName => ({
            department: contributor.department,
            role: roleName
        }));
    }

    return [{ department: "", role: "" }];
};

// Helper function to check for duplicates
const checkForDuplicates = (contributors, newContributor, excludeIndex = -1) => {
    const duplicates = [];

    contributors.forEach((existing, index) => {
        if (index === excludeIndex) return; // Skip the current item being edited

        // Check for userId match (registered users)
        if (existing.userId && newContributor.userId &&
            existing.userId === newContributor.userId) {
            duplicates.push({
                type: 'userId',
                index,
                contributor: existing,
                reason: 'This user is already added as a contributor'
            });
        }

        // Check for name match (case insensitive, for guest contributors)
        if (!existing.userId && !newContributor.userId &&
            existing.name && newContributor.name &&
            existing.name.toLowerCase().trim() === newContributor.name.toLowerCase().trim()) {
            duplicates.push({
                type: 'name',
                index,
                contributor: existing,
                reason: 'A contributor with this name already exists'
            });
        }
    });

    return duplicates;
};

// 🆕 Report Modal Component
const ReportModal = ({ isOpen, onClose, contributor, onSubmitReport }) => {
    const [reportReason, setReportReason] = useState("");
    const [reportDetails, setReportDetails] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const reportReasons = [
        "Incorrect person added",
        "Wrong role/credit information",
        "Duplicate entry",
        "Person never worked on this game",
        "Inappropriate content",
        "Spam or fake entry",
        "Other"
    ];

    const handleSubmit = async () => {
        if (!reportReason || !reportDetails.trim()) {
            alert("Please select a reason and provide details for the report.");
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmitReport({
                contributor,
                reason: reportReason,
                details: reportDetails.trim()
            });

            setReportReason("");
            setReportDetails("");
            onClose();
            alert("Report submitted successfully! Our team will review it shortly.");
        } catch (error) {
            console.error("Error submitting report:", error);
            alert("Failed to submit report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl w-full max-w-lg border border-red-500/30">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <FaFlag className="text-red-400" size={20} />
                        <h3 className="text-lg font-bold text-white">Report Contributor Issue</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <FaTimes size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                        <div className="flex items-center gap-3">
                            <img
                                src={isValidImageUrl(contributor?.image) ? contributor.image : generateFallbackImage(contributor?.name)}
                                alt={contributor?.name}
                                className="w-12 h-12 rounded-full object-cover border border-white/20"
                            />
                            <div>
                                <p className="text-white font-medium">{contributor?.name}</p>
                                <p className="text-white/60 text-sm">{formatRolesForDisplay(contributor)}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-3">What's the issue?</label>
                        <div className="space-y-2">
                            {reportReasons.map((reason) => (
                                <label key={reason} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        name="reportReason"
                                        value={reason}
                                        checked={reportReason === reason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                        className="w-4 h-4 text-red-500 bg-gray-700 border-gray-600 focus:ring-red-500"
                                    />
                                    <span className="text-white/90 text-sm">{reason}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Additional Details</label>
                        <textarea
                            value={reportDetails}
                            onChange={(e) => setReportDetails(e.target.value)}
                            placeholder="Please provide specific details about the issue..."
                            className="w-full h-24 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 resize-none focus:outline-none focus:border-red-400"
                            maxLength={500}
                        />
                        <p className="text-gray-400 text-xs mt-1">{reportDetails.length}/500 characters</p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={!reportReason || !reportDetails.trim() || isSubmitting}
                            className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            {isSubmitting ? "Submitting..." : "Submit Report"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 🆕 Edit Contributor Modal Component
const EditContributorModal = ({ isOpen, onClose, contributor, contributorIndex, onSave, existingContributors }) => {
    const [editingContributor, setEditingContributor] = useState(null);
    const [duplicateWarning, setDuplicateWarning] = useState(null);

    useEffect(() => {
        if (contributor) {
            setEditingContributor({
                ...contributor,
                // 🆕 Parse existing roles correctly with departments
                roles: parseRolesFromContributor(contributor),
                customRole: ""
            });
        }
    }, [contributor]);

    // 🔧 FIX: Memoize the duplicate check function
    const checkDuplicates = useCallback(() => {
        if (editingContributor?.name) {
            const mockContributor = {
                name: editingContributor.name.trim(),
                userId: editingContributor.userId,
                isRegisteredUser: editingContributor.isRegisteredUser
            };

            const duplicates = checkForDuplicates(existingContributors, mockContributor, contributorIndex);
            setDuplicateWarning(duplicates.length > 0 ? duplicates[0] : null);
        }
    }, [editingContributor?.name, editingContributor?.userId, editingContributor?.isRegisteredUser, existingContributors, contributorIndex]);

    // Check for duplicates when name changes
    useEffect(() => {
        checkDuplicates();
    }, [checkDuplicates]);

    const handleSave = () => {
        if (duplicateWarning) {
            alert(`⚠️ ${duplicateWarning.reason}\n\nExisting contributor: "${formatRolesForDisplay(duplicateWarning.contributor)}"`);
            return;
        }

        const validRoles = editingContributor.roles.filter(r => r.role);
        if (!editingContributor.name || validRoles.length === 0) return;

        let finalRoles = validRoles.map(r => ({
            name: r.role === "Custom Role" && editingContributor.customRole ? editingContributor.customRole : r.role,
            department: r.department
        }));

        // 🆕 NEW FORMAT: Save as roles array
        const updatedContributor = {
            ...editingContributor,
            roles: finalRoles,
            // 🔧 BACKWARD COMPATIBILITY: Also save legacy format
            role: finalRoles.map(r => r.name).join(" & "),
            department: finalRoles[0]?.department || "",
            image: isValidImageUrl(editingContributor.image) ?
                editingContributor.image :
                generateFallbackImage(editingContributor.name)
        };

        delete updatedContributor.customRole;

        onSave(updatedContributor);
        onClose();
    };

    if (!isOpen || !editingContributor) return null;

    const hasValidRole = editingContributor.roles?.some(r => r.role);
    const needsCustomRole = editingContributor.roles?.some(r => r.role === "Custom Role");

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-xl w-full max-w-2xl border border-blue-500/30">
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <FaEdit className="text-blue-400" size={20} />
                        <h3 className="text-lg font-bold text-white">Edit Contributor</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <FaTimes size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Duplicate Warning */}
                    {duplicateWarning && (
                        <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-start gap-3">
                            <FaExclamationTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <div>
                                <strong>Duplicate Detected:</strong> {duplicateWarning.reason}
                                <br />
                                <span className="text-red-300">Existing: "{formatRolesForDisplay(duplicateWarning.contributor)}"</span>
                            </div>
                        </div>
                    )}

                    {/* Name Input */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Name</label>
                        <input
                            type="text"
                            value={editingContributor.name || ""}
                            onChange={(e) => setEditingContributor({...editingContributor, name: e.target.value})}
                            className={`w-full px-4 py-3 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors ${
                                duplicateWarning
                                    ? 'bg-red-500/10 border-red-500/30 focus:border-red-400'
                                    : 'bg-white/5 border-white/20 focus:border-blue-400'
                            }`}
                            disabled={editingContributor.isRegisteredUser}
                        />
                        {editingContributor.isRegisteredUser && (
                            <p className="text-yellow-400 text-xs mt-1">Registered users' names cannot be changed</p>
                        )}
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Image URL</label>
                        <input
                            type="text"
                            value={editingContributor.image || ""}
                            onChange={(e) => setEditingContributor({...editingContributor, image: e.target.value})}
                            className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                        />
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Roles</label>
                        <div className="space-y-3">
                            {editingContributor.roles?.map((roleItem, index) => (
                                <div key={index} className="flex gap-3 items-center">
                                    <select
                                        value={roleItem.department}
                                        onChange={(e) => {
                                            const newRoles = [...editingContributor.roles];
                                            newRoles[index] = { department: e.target.value, role: "" };
                                            setEditingContributor({...editingContributor, roles: newRoles});
                                        }}
                                        className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400 min-w-[140px]"
                                    >
                                        <option value="">Department</option>
                                        {Object.keys(DEPARTMENTS).map(dept => (
                                            <option key={dept} value={dept} className="bg-gray-800">{dept}</option>
                                        ))}
                                    </select>

                                    {roleItem.department && (
                                        <select
                                            value={roleItem.role}
                                            onChange={(e) => {
                                                const newRoles = [...editingContributor.roles];
                                                newRoles[index] = { ...newRoles[index], role: e.target.value };
                                                setEditingContributor({...editingContributor, roles: newRoles});
                                            }}
                                            className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400 min-w-[160px]"
                                        >
                                            <option value="">Role</option>
                                            {DEPARTMENTS[roleItem.department].map(role => (
                                                <option key={role} value={role} className="bg-gray-800">{role}</option>
                                            ))}
                                        </select>
                                    )}

                                    {editingContributor.roles.length > 1 && (
                                        <button
                                            onClick={() => {
                                                const newRoles = editingContributor.roles.filter((_, i) => i !== index);
                                                setEditingContributor({...editingContributor, roles: newRoles});
                                            }}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>
                            ))}

                            {/* Add Role Button */}
                            {editingContributor.roles?.length < 3 && (
                                <button
                                    onClick={() => {
                                        const newRoles = [...editingContributor.roles, { department: "", role: "" }];
                                        setEditingContributor({...editingContributor, roles: newRoles});
                                    }}
                                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                                >
                                    + Add Another Role
                                </button>
                            )}

                            {/* Custom Role Input */}
                            {needsCustomRole && (
                                <input
                                    type="text"
                                    placeholder="Enter custom role"
                                    value={editingContributor.customRole || ""}
                                    onChange={(e) => setEditingContributor({...editingContributor, customRole: e.target.value})}
                                    className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                />
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!editingContributor.name || !hasValidRole || duplicateWarning}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 🆕 User Search Result Component - Updated for roles array
const UserSearchResult = ({ user, onAdd, existingContributors }) => {
    const [roles, setRoles] = useState([{ department: "", role: "" }]);
    const [customRole, setCustomRole] = useState("");
    const [duplicateWarning, setDuplicateWarning] = useState(null);

    useEffect(() => {
        const mockContributor = { userId: user._id, name: user.username, isRegisteredUser: true };
        const duplicates = checkForDuplicates(existingContributors, mockContributor);
        setDuplicateWarning(duplicates.length > 0 ? duplicates[0] : null);
    }, [user, existingContributors]);

    const handleAdd = () => {
        if (duplicateWarning) {
            alert(`⚠️ ${duplicateWarning.reason}\n\nCurrent role: "${formatRolesForDisplay(duplicateWarning.contributor)}"`);
            return;
        }

        const validRoles = roles.filter(r => r.role);
        if (validRoles.length === 0) return;

        let finalRoles = validRoles.map(r => ({
            name: r.role === "Custom Role" && customRole ? customRole : r.role,
            department: r.department
        }));

        // 🆕 NEW FORMAT: Pass roles array
        onAdd(user, finalRoles, customRole);
        setRoles([{ department: "", role: "" }]);
        setCustomRole("");
    };

    const hasValidRole = roles.some(r => r.role);
    const needsCustomRole = roles.some(r => r.role === "Custom Role");

    return (
        <div className={`p-6 rounded-xl border transition-all ${
            duplicateWarning ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 border-white/10 hover:border-white/20'
        }`}>
            <div className="flex items-center gap-4 mb-4">
                <img
                    src={isValidImageUrl(user.avatar) ? user.avatar : generateFallbackImage(user.username)}
                    alt={user.username}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                />
                <div className="flex-1">
                    <p className="text-white font-medium">{user.username}</p>
                    {user.title && <p className="text-blue-400 text-sm">{user.title}</p>}
                </div>
                {duplicateWarning && (
                    <div className="text-red-400 text-sm flex items-center gap-2">
                        <FaCheckCircle size={16} />
                        <span>Already Added</span>
                    </div>
                )}
            </div>

            {!duplicateWarning && (
                <div className="space-y-4">
                    {roles.map((roleItem, index) => (
                        <div key={index} className="flex gap-3 items-center">
                            <select
                                value={roleItem.department}
                                onChange={(e) => {
                                    const newRoles = [...roles];
                                    newRoles[index] = { department: e.target.value, role: "" };
                                    setRoles(newRoles);
                                }}
                                className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400 min-w-[140px]"
                            >
                                <option value="">Department</option>
                                {Object.keys(DEPARTMENTS).map(dept => (
                                    <option key={dept} value={dept} className="bg-gray-800">{dept}</option>
                                ))}
                            </select>

                            {roleItem.department && (
                                <select
                                    value={roleItem.role}
                                    onChange={(e) => {
                                        const newRoles = [...roles];
                                        newRoles[index] = { ...newRoles[index], role: e.target.value };
                                        setRoles(newRoles);
                                    }}
                                    className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400 min-w-[160px]"
                                >
                                    <option value="">Role</option>
                                    {DEPARTMENTS[roleItem.department].map(role => (
                                        <option key={role} value={role} className="bg-gray-800">{role}</option>
                                    ))}
                                </select>
                            )}

                            {roles.length > 1 && (
                                <button
                                    onClick={() => {
                                        const newRoles = roles.filter((_, i) => i !== index);
                                        setRoles(newRoles);
                                    }}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors"
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}

                    {roles.length < 3 && (
                        <button
                            onClick={() => {
                                const newRoles = [...roles, { department: "", role: "" }];
                                setRoles(newRoles);
                            }}
                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                        >
                            + Add Another Role
                        </button>
                    )}

                    {needsCustomRole && (
                        <input
                            type="text"
                            placeholder="Enter custom role"
                            value={customRole}
                            onChange={(e) => setCustomRole(e.target.value)}
                            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                        />
                    )}

                    <button
                        onClick={handleAdd}
                        disabled={!hasValidRole || (needsCustomRole && !customRole)}
                        className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg transition-colors font-medium"
                    >
                        Add to Contributors
                    </button>
                </div>
            )}
        </div>
    );
};

const EditContributorsModal = ({ isOpen, onClose, gameId, crewList, onSave }) => {
    const [contributors, setContributors] = useState(crewList || []);
    const [searchTerm, setSearchTerm] = useState("");
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [globalTermsAgreed, setGlobalTermsAgreed] = useState(false);

    // 🆕 New states for edit and report modals
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingContributor, setEditingContributor] = useState(null);
    const [editingIndex, setEditingIndex] = useState(-1);
    const [reportModalOpen, setReportModalOpen] = useState(false);
    const [reportingContributor, setReportingContributor] = useState(null);

    const [newContributor, setNewContributor] = useState({
        name: "",
        roles: [{ department: "", role: "" }],
        customRole: "",
        image: "",
        isRegisteredUser: false
    });

    const [newContributorDuplicateWarning, setNewContributorDuplicateWarning] = useState(null);

    const isAdmin = () => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            return user && user.role && user.role.toLowerCase() === "admin";
        } catch {
            return false;
        }
    };

    const userIsAdmin = isAdmin();

    // Fetch users from backend when search term changes
    useEffect(() => {
        const searchUsers = async () => {
            if (searchTerm.length < 2) {
                setUsers([]);
                return;
            }

            setSearchLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setUsers([]);
                    return;
                }

                const response = await axios.get(`${API_BASE}/api/auth/search-users`, {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { q: searchTerm, limit: 10 }
                });

                setUsers(response.data.users || []);
            } catch (error) {
                console.error("Error searching users:", error);
                setUsers([]);
            } finally {
                setSearchLoading(false);
            }
        };

        const timeoutId = setTimeout(searchUsers, 300);
        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    // Check for duplicates when new contributor name changes
    useEffect(() => {
        if (newContributor.name.trim()) {
            const mockContributor = { name: newContributor.name.trim(), isRegisteredUser: false };
            const duplicates = checkForDuplicates(contributors, mockContributor);
            setNewContributorDuplicateWarning(duplicates.length > 0 ? duplicates[0] : null);
        } else {
            setNewContributorDuplicateWarning(null);
        }
    }, [newContributor.name, contributors]);

    // 🆕 Updated addExistingUser function for roles array
    const addExistingUser = (user, rolesArray, customRole = "") => {
        const mockContributor = { userId: user._id, name: user.username, isRegisteredUser: true };
        const duplicates = checkForDuplicates(contributors, mockContributor);
        if (duplicates.length > 0) {
            alert(`⚠️ This user is already added as a contributor!\n\nCurrent role: "${formatRolesForDisplay(duplicates[0].contributor)}"`);
            return;
        }

        // 🆕 NEW FORMAT: Use roles array
        const newContrib = {
            id: user._id,
            name: user.username,
            roles: rolesArray, // Array of {name, department}
            // 🔧 BACKWARD COMPATIBILITY: Also save legacy format
            role: rolesArray.map(r => r.name).join(" & "),
            department: rolesArray[0]?.department || "",
            image: isValidImageUrl(user.avatar) ? user.avatar : generateFallbackImage(user.username),
            isRegisteredUser: true,
            userId: user._id
        };

        setContributors([...contributors, newContrib]);
        setSearchTerm("");
        setUsers([]);
    };

    const addNewContributor = () => {
        if (newContributorDuplicateWarning) {
            alert(`⚠️ ${newContributorDuplicateWarning.reason}\n\nExisting contributor: "${formatRolesForDisplay(newContributorDuplicateWarning.contributor)}"`);
            return;
        }

        const validRoles = newContributor.roles.filter(r => r.role);
        if (!newContributor.name || validRoles.length === 0) return;

        let finalRoles = validRoles.map(r => ({
            name: r.role === "Custom Role" && newContributor.customRole ? newContributor.customRole : r.role,
            department: r.department
        }));

        // 🆕 NEW FORMAT: Use roles array
        const newContrib = {
            id: Date.now(),
            name: newContributor.name,
            roles: finalRoles,
            // 🔧 BACKWARD COMPATIBILITY: Also save legacy format
            role: finalRoles.map(r => r.name).join(" & "),
            department: finalRoles[0]?.department || "",
            image: isValidImageUrl(newContributor.image) ? newContributor.image : generateFallbackImage(newContributor.name),
            isRegisteredUser: false
        };

        setContributors([...contributors, newContrib]);
        setNewContributor({
            name: "",
            roles: [{ department: "", role: "" }],
            customRole: "",
            image: "",
            isRegisteredUser: false
        });
        setIsAddingNew(false);
    };

    // 🆕 Remove contributor function
    const removeContributor = (index) => {
        setContributors(contributors.filter((_, i) => i !== index));
    };

    // 🆕 Edit contributor function
    const editContributor = (contributor, index) => {
        setEditingContributor(contributor);
        setEditingIndex(index);
        setEditModalOpen(true);
    };

    // 🆕 Save edited contributor
    const saveEditedContributor = (updatedContributor) => {
        const newContributors = [...contributors];
        newContributors[editingIndex] = updatedContributor;
        setContributors(newContributors);
    };

    // 🆕 Report contributor
    const reportContributor = (contributor) => {
        setReportingContributor(contributor);
        setReportModalOpen(true);
    };

    // 🆕 Submit report
    const submitReport = async (reportData) => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "{}");

            // Here you would normally send to your backend API
            console.log("Report submitted:", {
                gameId,
                reporter: user.username || "Anonymous",
                reportData,
                timestamp: new Date().toISOString()
            });

            // For now, we'll just log it - you can implement actual API call later
            // await axios.post(`${API_BASE}/api/reports/contributor`, reportData, {
            //     headers: { Authorization: `Bearer ${token}` }
            // });

        } catch (error) {
            console.error("Error submitting report:", error);
            throw error;
        }
    };

    const handleSave = async () => {
        if (!globalTermsAgreed) {
            alert(`⚠️ Please read and agree to the contributor information terms before saving.\n\nYou must confirm that all contributor information is accurate and authorized.`);
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                onSave(contributors);
                onClose();
                return;
            }

            await axios.put(`${API_BASE}/api/games/${gameId}/contributors`, {
                crewList: contributors
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("✅ Contributors saved to backend");
            onSave(contributors);
            onClose();
        } catch (error) {
            console.error("❌ Error saving contributors:", error);
            onSave(contributors);
            onClose();
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    const hasValidNewRole = newContributor.roles.some(r => r.role);
    const needsCustomNewRole = newContributor.roles.some(r => r.role === "Custom Role");

    return (
        <>
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-gray-900 rounded-xl w-full max-w-6xl min-h-[500px] max-h-[90vh] overflow-hidden border border-gray-700">
                    {/* Header */}
                    <div className="flex items-center justify-between p-8 border-b border-gray-700 bg-gray-800/50">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Edit Contributors</h2>
                            <p className="text-gray-400">Manage who worked on this game</p>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors p-2">
                            <FaTimes size={24} />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Left Column - Current Contributors */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-semibold text-white">
                                        Current Contributors ({contributors.length})
                                    </h3>
                                    {contributors.length > 10 && (
                                        <span className="text-blue-400 text-sm">Showing first 10</span>
                                    )}
                                </div>

                                {contributors.length > 0 ? (
                                    <div className="space-y-3 max-h-96 overflow-y-auto">
                                        {contributors.slice(0, 10).map((person, index) => (
                                            <div key={index} className="group bg-white/5 hover:bg-white/10 rounded-lg p-4 border border-white/10 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={isValidImageUrl(person.image) ? person.image : generateFallbackImage(person.name)}
                                                        alt={person.name}
                                                        className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                                                        onError={(e) => {
                                                            e.target.src = generateFallbackImage(person.name);
                                                            e.target.onerror = null;
                                                        }}
                                                    />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-white font-medium truncate">{person.name}</p>
                                                        <p className="text-white/60 text-sm truncate">{formatRolesForDisplay(person)}</p>
                                                        {person.isRegisteredUser && (
                                                            <span className="inline-flex items-center gap-1 text-green-400 text-xs">
                                                                <FaCheckCircle size={10} />
                                                                Verified User
                                                            </span>
                                                        )}
                                                    </div>

                                                    {/* Action Buttons */}
                                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => editContributor(person, index)}
                                                            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 hover:text-blue-300 p-2 rounded-lg transition-colors"
                                                            title="Edit contributor"
                                                        >
                                                            <FaEdit size={14} />
                                                        </button>

                                                        <button
                                                            onClick={() => reportContributor(person)}
                                                            className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 hover:text-yellow-300 p-2 rounded-lg transition-colors"
                                                            title="Report issue"
                                                        >
                                                            <FaFlag size={14} />
                                                        </button>

                                                        {userIsAdmin && (
                                                            <button
                                                                onClick={() => removeContributor(index)}
                                                                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 p-2 rounded-lg transition-colors"
                                                                title="Remove contributor"
                                                            >
                                                                <FaTimes size={14} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {contributors.length > 10 && (
                                            <div className="text-center p-4 bg-white/5 rounded-lg border border-white/10">
                                                <p className="text-white/60 text-sm">
                                                    +{contributors.length - 10} more contributors
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="bg-white/5 rounded-lg p-8 text-center border border-white/10">
                                        <div className="text-4xl mb-3">👥</div>
                                        <p className="text-white/60">No contributors added yet.</p>
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Add Contributors */}
                            <div className="space-y-8">
                                {/* Search Existing Users */}
                                <div>
                                    <h3 className="text-xl font-semibold text-white mb-4">Add Registered Users</h3>
                                    <div className="relative mb-6">
                                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            placeholder="Search users by name or email..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full bg-white/5 border border-white/20 rounded-xl px-12 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                                        />
                                        {searchLoading && (
                                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400"></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Search Results */}
                                    <div className="space-y-4 max-h-64 overflow-y-auto">
                                        {searchTerm.length >= 2 && users.length === 0 && !searchLoading && (
                                            <div className="text-center py-8 text-white/60">
                                                <FaUser className="mx-auto text-3xl mb-2 opacity-50" />
                                                <p>No users found</p>
                                            </div>
                                        )}
                                        {users.map(user => (
                                            <UserSearchResult
                                                key={user._id}
                                                user={user}
                                                onAdd={addExistingUser}
                                                existingContributors={contributors}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* OR Divider */}
                                <div className="flex items-center">
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                    <span className="px-6 text-white/60 font-medium">OR</span>
                                    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                                </div>

                                {/* Add New Contributor */}
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xl font-semibold text-white">Add New Contributor</h3>
                                        {!isAddingNew && (
                                            <button
                                                onClick={() => setIsAddingNew(true)}
                                                className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-2 rounded-lg transition-all"
                                            >
                                                <FaPlus size={14} />
                                                Add New
                                            </button>
                                        )}
                                    </div>

                                    {isAddingNew && (
                                        <div className={`p-6 rounded-xl border space-y-6 transition-all ${
                                            newContributorDuplicateWarning
                                                ? 'bg-red-500/10 border-red-500/30'
                                                : 'bg-white/5 border-white/10'
                                        }`}>
                                            {/* Duplicate Warning */}
                                            {newContributorDuplicateWarning && (
                                                <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm flex items-start gap-3">
                                                    <FaExclamationTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                    <div>
                                                        <strong>Duplicate Name:</strong> {newContributorDuplicateWarning.reason}
                                                        <br />
                                                        <span className="text-red-300">Existing: "{formatRolesForDisplay(newContributorDuplicateWarning.contributor)}"</span>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Name Input */}
                                            <div>
                                                <label className="block text-sm font-medium text-white mb-2">Contributor Name</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter contributor name"
                                                    value={newContributor.name}
                                                    onChange={(e) => setNewContributor({ ...newContributor, name: e.target.value })}
                                                    className={`w-full px-4 py-3 border rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all ${
                                                        newContributorDuplicateWarning
                                                            ? 'bg-red-500/10 border-red-500/30 focus:border-red-400'
                                                            : 'bg-white/5 border-white/20 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20'
                                                    }`}
                                                />
                                            </div>

                                            {/* Image URL */}
                                            <div>
                                                <label className="block text-sm font-medium text-white mb-2">Image URL (Optional)</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter image URL"
                                                    value={newContributor.image}
                                                    onChange={(e) => setNewContributor({ ...newContributor, image: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                                                    disabled={newContributorDuplicateWarning}
                                                />
                                            </div>

                                            {/* Role Selection */}
                                            <div className={newContributorDuplicateWarning ? 'opacity-50 pointer-events-none' : ''}>
                                                <label className="block text-sm font-medium text-white mb-2">Roles</label>
                                                <div className="space-y-3">
                                                    {newContributor.roles.map((roleItem, index) => (
                                                        <div key={index} className="flex gap-3 items-center">
                                                            <select
                                                                value={roleItem.department}
                                                                onChange={(e) => {
                                                                    const newRoles = [...newContributor.roles];
                                                                    newRoles[index] = { department: e.target.value, role: "" };
                                                                    setNewContributor({ ...newContributor, roles: newRoles });
                                                                }}
                                                                className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400 min-w-[140px]"
                                                            >
                                                                <option value="">Department</option>
                                                                {Object.keys(DEPARTMENTS).map(dept => (
                                                                    <option key={dept} value={dept} className="bg-gray-800">{dept}</option>
                                                                ))}
                                                            </select>

                                                            {roleItem.department && (
                                                                <select
                                                                    value={roleItem.role}
                                                                    onChange={(e) => {
                                                                        const newRoles = [...newContributor.roles];
                                                                        newRoles[index] = { ...newRoles[index], role: e.target.value };
                                                                        setNewContributor({ ...newContributor, roles: newRoles });
                                                                    }}
                                                                    className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-400 min-w-[160px]"
                                                                >
                                                                    <option value="">Role</option>
                                                                    {DEPARTMENTS[roleItem.department].map(role => (
                                                                        <option key={role} value={role} className="bg-gray-800">{role}</option>
                                                                    ))}
                                                                </select>
                                                            )}

                                                            {newContributor.roles.length > 1 && (
                                                                <button
                                                                    onClick={() => {
                                                                        const newRoles = newContributor.roles.filter((_, i) => i !== index);
                                                                        setNewContributor({ ...newContributor, roles: newRoles });
                                                                    }}
                                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors"
                                                                >
                                                                    Remove
                                                                </button>
                                                            )}
                                                        </div>
                                                    ))}

                                                    {newContributor.roles.length < 3 && (
                                                        <button
                                                            onClick={() => {
                                                                const newRoles = [...newContributor.roles, { department: "", role: "" }];
                                                                setNewContributor({ ...newContributor, roles: newRoles });
                                                            }}
                                                            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                                                        >
                                                            + Add Another Role
                                                        </button>
                                                    )}

                                                    {/* Custom Role Input */}
                                                    {needsCustomNewRole && (
                                                        <input
                                                            type="text"
                                                            placeholder="Enter custom role"
                                                            value={newContributor.customRole}
                                                            onChange={(e) => setNewContributor({ ...newContributor, customRole: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-400"
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-3 pt-2">
                                                <button
                                                    onClick={addNewContributor}
                                                    disabled={!newContributor.name || !hasValidNewRole || (needsCustomNewRole && !newContributor.customRole) || newContributorDuplicateWarning}
                                                    className={`flex-1 px-6 py-3 rounded-xl font-medium transition-all ${
                                                        newContributorDuplicateWarning
                                                            ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                                            : (!newContributor.name || !hasValidNewRole || (needsCustomNewRole && !newContributor.customRole))
                                                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                                                    }`}
                                                >
                                                    {newContributorDuplicateWarning ? 'Duplicate Name' : 'Add Contributor'}
                                                </button>
                                                <button
                                                    onClick={() => setIsAddingNew(false)}
                                                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-colors font-medium"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Global Terms Agreement */}
                    <div className="px-8 py-6 bg-yellow-500/5 border-t border-yellow-500/20">
                        <div className="flex items-start gap-4">
                            <div className="text-yellow-400 mt-1">
                                <FaInfo size={18} />
                            </div>
                            <div className="flex-1">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={globalTermsAgreed}
                                        onChange={(e) => setGlobalTermsAgreed(e.target.checked)}
                                        className="mt-1 w-5 h-5 text-yellow-400 bg-gray-800 border-gray-600 rounded focus:ring-yellow-400 focus:ring-2 cursor-pointer"
                                    />
                                    <div>
                                        <span className="text-white font-medium group-hover:text-yellow-100 transition-colors block mb-2">
                                            I confirm that all contributor information is accurate and authorized
                                        </span>
                                        <p className="text-yellow-200/80 text-sm leading-relaxed">
                                            By checking this box, I acknowledge that all contributor information added is truthful,
                                            I have proper authorization to add these contributors, and I understand that providing
                                            false information may result in account restrictions. GGDB reserves the right to verify
                                            and moderate all contributor data.
                                        </p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center p-8 border-t border-gray-700 bg-gray-800/30">
                        <div className="text-sm text-gray-400">
                            {contributors.length} contributor{contributors.length !== 1 ? 's' : ''} •
                            Report issues to help improve accuracy
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={onClose}
                                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-xl transition-colors font-medium"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={loading || !globalTermsAgreed}
                                className={`px-8 py-3 rounded-xl transition-all flex items-center gap-3 font-medium ${
                                    loading || !globalTermsAgreed
                                        ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                                }`}
                                title={!globalTermsAgreed ? "Please agree to terms before saving" : ""}
                            >
                                {loading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Contributor Modal */}
            <EditContributorModal
                isOpen={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                contributor={editingContributor}
                contributorIndex={editingIndex}
                onSave={saveEditedContributor}
                existingContributors={contributors}
            />

            {/* Report Modal */}
            <ReportModal
                isOpen={reportModalOpen}
                onClose={() => setReportModalOpen(false)}
                contributor={reportingContributor}
                onSubmitReport={submitReport}
            />
        </>
    );
};

export default EditContributorsModal;