// src/pages/ContributePerson/PersonDetailPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE } from '../config/api';
import HeaderSection from './ContributePerson/HeaderSection';
import PersonalInfoSection from './ContributePerson/PersonalInfoSection';
import LatestWorksSection from './ContributePerson/LatestWorksSection';
import CreditSection from './ContributePerson/CreditSection';
import AwardsSection from './ContributePerson/AwardsSection';
import TriviaSection from './ContributePerson/TriviaSection';
import LinksSection from './ContributePerson/LinksSection';

const PersonDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const personalDetailsRef = useRef(null);
  const portfolioLinksRef = useRef(null);

  const [gamer, setGamer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [userContributions, setUserContributions] = useState([]);
  const [contributionsLoading, setContributionsLoading] = useState(false);
  const [credits, setCredits] = useState({});
  const [expandedSections, setExpandedSections] = useState({});

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // 🆕 Enhanced formatCredits function - supports roles array from backend
  const formatCredits = (contributions) => {
    const result = {};

    contributions.forEach((item) => {
      // 🆕 Check if we have the new roles array structure
      if (item.roles && Array.isArray(item.roles) && item.roles.length > 0) {
        // NEW FORMAT: Use roles array from backend
        item.roles.forEach((roleData) => {
          const department = roleData.department;

          // 🚫 Skip if no valid department
          if (!department || department.trim() === "") return;

          const group = determineProjectGroup(item);

          if (!result[department]) {
            result[department] = { upcoming: [], previous: [] };
          }

          result[department][group].push({
            title: item.title,
            role: roleData.name,
            department: department,
            poster: item.coverImage || item.poster || "",
            year: item.year || (item.releaseDate ? new Date(item.releaseDate).getFullYear() : ""),
            rating: item.rating || item.ggdbRating || null,
            status: item.status || null,
            gameId: item._id
          });
        });
      } else {
        // 🔧 BACKWARD COMPATIBILITY: Use old userRole/role + department format
        if (!item.userRole && !item.role) return;

        const roleString = item.userRole || item.role || "";
        const roles = roleString.split(" & ").map(r => r.trim());
        const department = item.department;

        // 🚫 Skip if no valid department
        if (!department || department.trim() === "") return;

        const group = determineProjectGroup(item);

        if (!result[department]) {
          result[department] = { upcoming: [], previous: [] };
        }

        roles.forEach((role) => {
          result[department][group].push({
            title: item.title,
            role: role,
            department: department,
            poster: item.coverImage || item.poster || "",
            year: item.year || (item.releaseDate ? new Date(item.releaseDate).getFullYear() : ""),
            rating: item.rating || item.ggdbRating || null,
            status: item.status || null,
            gameId: item._id
          });
        });
      }
    });

    return result;
  };

  // 🆕 Enhanced project grouping logic
  const determineProjectGroup = (item) => {
    // Check explicit status first
    if (item.status) {
      const status = item.status.toLowerCase();
      if (status.includes("develop") || status.includes("upcoming") || status.includes("pre")) {
        return "upcoming";
      }
      if (status.includes("released") || status.includes("completed")) {
        return "previous";
      }
    }

    // Check release date
    if (item.releaseDate) {
      const releaseDate = new Date(item.releaseDate);
      const now = new Date();
      if (releaseDate > now) {
        return "upcoming";
      }
    }

    // Default to previous work
    return "previous";
  };

  const fetchUserContributions = async (userId) => {
    try {
      setContributionsLoading(true);
      const response = await axios.get(`${API_BASE}/api/users/${userId}/contributions`);
      const contributions = response.data.contributions || [];

      // Sort by most recent contributions
      const sorted = contributions.sort((a, b) =>
          new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      );

      // Set latest works for display section
      setUserContributions(sorted.slice(0, 4));

      // Format all contributions for credits section
      setCredits(formatCredits(contributions));

      console.log("✅ Formatted credits:", formatCredits(contributions));
    } catch (err) {
      console.error("❌ Contribution fetch error:", err);
      setUserContributions([]);
      setCredits({});
    } finally {
      setContributionsLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_BASE}/api/users/by-slug/${slug}`);
      const userData = res.data;

      setGamer(userData);
      if (userData.coverImage) setCoverImage(userData.coverImage);

      fetchUserContributions(userData._id);
    } catch (err) {
      console.error("❌ User data error:", err);
      setError(err.response?.data?.message || err.message || "User not found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [slug]);



  if (loading) return <div className="text-white text-center py-10">Loading...</div>;
  if (error) return <div className="text-red-400 text-center py-10">{error}</div>;
  if (!gamer) return <div className="text-white/50 text-center py-10">User not found</div>;

  return (
      <div className="bg-black text-white min-h-screen">
        <HeaderSection gamer={gamer} coverImage={coverImage} setCoverImage={setCoverImage} />
        <div className="max-w-6xl mx-auto px-6 pb-24 space-y-10">
          <PersonalInfoSection gamer={gamer} personalDetailsRef={personalDetailsRef} />
          <LatestWorksSection contributions={userContributions} loading={contributionsLoading} />

          {/* 🆕 Enhanced Credits Section - tasarım aynı ama dinamik data */}
          <CreditSection
              credits={credits}
              expandedSections={expandedSections}
              toggleSection={toggleSection}
          />

          <AwardsSection awards={["Best Developer Award", "VFX of the Year"]} />
          <TriviaSection trivia={["Loves retro games", "Worked on AAA titles"]} />
          <LinksSection
              portfolioLinksRef={portfolioLinksRef}
              externalLinks={[
                { label: "IMDb", url: "https://www.imdb.com/" },
                { label: "Wikipedia", url: "https://en.wikipedia.org/" }
              ]}
          />
        </div>
      </div>
  );
};

export default PersonDetailPage;