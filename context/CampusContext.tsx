"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Campus, Post, SOSAnswer, CategoryTag, UserRoleTag, NewCampusPayload } from "@/lib/types";
import { INITIAL_CAMPUSES, INITIAL_POSTS } from "@/lib/mock-data";
import { CampusReview, VerifiedStudentSession } from "@/lib/review-types";
import { INITIAL_CAMPUS_REVIEWS } from "@/lib/placement-mock-data";

interface CampusContextType {
  campuses: Campus[];
  activeCampus: Campus;
  homeCampus: Campus;
  isPeeking: boolean;
  activeTab: "pulse" | "sos" | "placements" | "explore";
  setActiveTab: (tab: "pulse" | "sos" | "placements" | "explore") => void;
  selectedCategory: CategoryTag;
  setSelectedCategory: (cat: CategoryTag) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredCampuses: Campus[];
  activePosts: Post[];
  activeSOSPosts: Post[];
  setActiveCampusById: (id: string) => void;
  setHomeCampusById: (id: string) => void;
  returnToHomeCampus: () => void;
  addPost: (post: {
    title: string;
    content: string;
    category_tag: Exclude<CategoryTag, "All">;
    user_name: string;
    user_role_tag: UserRoleTag;
    is_sos?: boolean;
    is_anonymous?: boolean;
  }) => void;
  upvotePost: (postId: string) => void;
  addSOSAnswer: (postId: string, content: string, userName: string, isAnonymous: boolean) => void;
  upvoteAnswer: (postId: string, answerId: string) => void;
  registerCampus: (payload: NewCampusPayload) => Campus;
  isDevModalOpen: boolean;
  setIsDevModalOpen: (open: boolean) => void;
  isCreatePostModalOpen: boolean;
  setIsCreatePostModalOpen: (open: boolean) => void;
  isCampusSwitcherOpen: boolean;
  setIsCampusSwitcherOpen: (open: boolean) => void;

  // Student ID Verification & Reviews State
  verifiedStudent: VerifiedStudentSession | null;
  verifyStudentSession: (session: VerifiedStudentSession) => void;
  logoutStudent: () => void;
  isStudentVerifyModalOpen: boolean;
  setIsStudentVerifyModalOpen: (open: boolean) => void;
  isCreateReviewModalOpen: boolean;
  setIsCreateReviewModalOpen: (open: boolean) => void;
  reviews: CampusReview[];
  addReview: (reviewData: {
    title: string;
    content: string;
    overall_rating: number;
    academics_rating: number;
    infrastructure_rating: number;
    placement_rating: number;
    pros: string;
    cons: string;
    visiting_companies_experienced: string[];
    backlog_advice: string;
  }) => Promise<void>;
  upvoteReview: (reviewId: string) => void;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

const CAMPUSES_STORAGE_KEY = "nexus_campuses_v1";
const POSTS_STORAGE_KEY = "nexus_posts_v1";
const REVIEWS_STORAGE_KEY = "nexus_reviews_v1";
const HOME_CAMPUS_KEY = "nexus_home_campus_v1";
const ACTIVE_CAMPUS_KEY = "nexus_active_campus_v1";
const STUDENT_SESSION_KEY = "nexus_student_session_v1";

export function CampusProvider({ children }: { children: React.ReactNode }) {
  const [campuses, setCampuses] = useState<Campus[]>(INITIAL_CAMPUSES);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [reviews, setReviews] = useState<CampusReview[]>(INITIAL_CAMPUS_REVIEWS);
  const [homeCampus, setHomeCampus] = useState<Campus>(INITIAL_CAMPUSES[0]); // Bhopal default
  const [activeCampus, setActiveCampus] = useState<Campus>(INITIAL_CAMPUSES[0]);
  const [activeTab, setActiveTab] = useState<"pulse" | "sos" | "placements" | "explore">("pulse");
  const [selectedCategory, setSelectedCategory] = useState<CategoryTag>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [isCampusSwitcherOpen, setIsCampusSwitcherOpen] = useState(false);

  // Student verification states
  const [verifiedStudent, setVerifiedStudent] = useState<VerifiedStudentSession | null>(null);
  const [isStudentVerifyModalOpen, setIsStudentVerifyModalOpen] = useState(false);
  const [isCreateReviewModalOpen, setIsCreateReviewModalOpen] = useState(false);

  // Load from localStorage on mount (hydration safe)
  useEffect(() => {
    try {
      const storedCampuses = localStorage.getItem(CAMPUSES_STORAGE_KEY);
      const storedPosts = localStorage.getItem(POSTS_STORAGE_KEY);
      const storedReviews = localStorage.getItem(REVIEWS_STORAGE_KEY);
      const storedHomeId = localStorage.getItem(HOME_CAMPUS_KEY);
      const storedActiveId = localStorage.getItem(ACTIVE_CAMPUS_KEY);
      const storedStudent = localStorage.getItem(STUDENT_SESSION_KEY);

      let currentCampuses = INITIAL_CAMPUSES;
      if (storedCampuses) {
        currentCampuses = JSON.parse(storedCampuses);
        setCampuses(currentCampuses);
      }

      if (storedPosts) {
        setPosts(JSON.parse(storedPosts));
      }

      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      }

      if (storedStudent) {
        setVerifiedStudent(JSON.parse(storedStudent));
      }

      if (storedHomeId) {
        const found = currentCampuses.find((c) => c.id === storedHomeId);
        if (found) setHomeCampus(found);
      }

      if (storedActiveId) {
        const found = currentCampuses.find((c) => c.id === storedActiveId);
        if (found) setActiveCampus(found);
      }
    } catch (e) {
      console.warn("Nexus: Could not load local storage", e);
    }
  }, []);

  // Save changes to localStorage
  const saveCampuses = (newCampuses: Campus[]) => {
    setCampuses(newCampuses);
    try {
      localStorage.setItem(CAMPUSES_STORAGE_KEY, JSON.stringify(newCampuses));
    } catch (e) {
      console.warn("Nexus: Storage failed", e);
    }
  };

  const savePosts = (newPosts: Post[]) => {
    setPosts(newPosts);
    try {
      localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(newPosts));
    } catch (e) {
      console.warn("Nexus: Storage failed", e);
    }
  };

  const saveReviews = (newReviews: CampusReview[]) => {
    setReviews(newReviews);
    try {
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(newReviews));
    } catch (e) {
      console.warn("Nexus: Storage failed", e);
    }
  };

  const verifyStudentSession = (session: VerifiedStudentSession) => {
    setVerifiedStudent(session);
    try {
      localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(session));
    } catch (e) {
      console.warn(e);
    }
  };

  const logoutStudent = () => {
    setVerifiedStudent(null);
    try {
      localStorage.removeItem(STUDENT_SESSION_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  const setActiveCampusById = (id: string) => {
    const found = campuses.find((c) => c.id === id);
    if (found) {
      setActiveCampus(found);
      try {
        localStorage.setItem(ACTIVE_CAMPUS_KEY, id);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const setHomeCampusById = (id: string) => {
    const found = campuses.find((c) => c.id === id);
    if (found) {
      setHomeCampus(found);
      setActiveCampus(found);
      try {
        localStorage.setItem(HOME_CAMPUS_KEY, id);
        localStorage.setItem(ACTIVE_CAMPUS_KEY, id);
      } catch (e) {
        console.warn(e);
      }
    }
  };

  const returnToHomeCampus = () => {
    setActiveCampus(homeCampus);
    try {
      localStorage.setItem(ACTIVE_CAMPUS_KEY, homeCampus.id);
    } catch (e) {
      console.warn(e);
    }
  };

  // Search filter across worldwide campuses
  const filteredCampuses = campuses.filter((campus) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      campus.name.toLowerCase().includes(q) ||
      campus.city.toLowerCase().includes(q) ||
      campus.country.toLowerCase().includes(q)
    );
  });

  // Filter posts strictly by active campus ID (Backend/Client Rule)
  const activeCampusPosts = posts.filter((p) => p.campus_id === activeCampus.id);

  // Normal feed posts
  const activePosts = activeCampusPosts.filter((p) => {
    if (p.is_sos) return false;
    if (selectedCategory === "All") return true;
    return p.category_tag === selectedCategory;
  });

  // SOS Hub posts (sorted by upvotes count descending)
  const activeSOSPosts = activeCampusPosts
    .filter((p) => p.is_sos || p.category_tag === "SOS Query")
    .sort((a, b) => b.upvotes_count - a.upvotes_count);

  const addPost = ({
    title,
    content,
    category_tag,
    user_name,
    user_role_tag,
    is_sos = false,
    is_anonymous = false,
  }: {
    title: string;
    content: string;
    category_tag: Exclude<CategoryTag, "All">;
    user_name: string;
    user_role_tag: UserRoleTag;
    is_sos?: boolean;
    is_anonymous?: boolean;
  }) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      campus_id: activeCampus.id,
      title,
      content,
      category_tag,
      user_name: is_anonymous ? "Anonymous Student" : user_name,
      user_role_tag,
      upvotes_count: 1,
      timestamp: new Date().toISOString(),
      is_sos,
      is_anonymous,
      answers: [],
    };

    const updated = [newPost, ...posts];
    savePosts(updated);
  };

  const upvotePost = (postId: string) => {
    const updated = posts.map((p) => {
      if (p.id === postId) {
        return { ...p, upvotes_count: p.upvotes_count + 1 };
      }
      return p;
    });
    savePosts(updated);
  };

  const addSOSAnswer = (postId: string, content: string, userName: string, isAnonymous: boolean) => {
    const newAnswer: SOSAnswer = {
      id: `ans-${Date.now()}`,
      post_id: postId,
      user_name: isAnonymous ? "Anonymous Student" : userName,
      user_role_tag: "student",
      content,
      upvotes_count: 1,
      timestamp: new Date().toISOString(),
    };

    const updated = posts.map((p) => {
      if (p.id === postId) {
        const answers = p.answers ? [...p.answers, newAnswer] : [newAnswer];
        answers.sort((a, b) => b.upvotes_count - a.upvotes_count);
        return { ...p, answers };
      }
      return p;
    });
    savePosts(updated);
  };

  const upvoteAnswer = (postId: string, answerId: string) => {
    const updated = posts.map((p) => {
      if (p.id === postId && p.answers) {
        const answers = p.answers.map((ans) => {
          if (ans.id === answerId) {
            return { ...ans, upvotes_count: ans.upvotes_count + 1 };
          }
          return ans;
        });
        answers.sort((a, b) => b.upvotes_count - a.upvotes_count);
        return { ...p, answers };
      }
      return p;
    });
    savePosts(updated);
  };

  const addReview = async (reviewData: {
    title: string;
    content: string;
    overall_rating: number;
    academics_rating: number;
    infrastructure_rating: number;
    placement_rating: number;
    pros: string;
    cons: string;
    visiting_companies_experienced: string[];
    backlog_advice: string;
  }) => {
    const newReview: CampusReview = {
      id: `rev-${Date.now()}`,
      campus_id: activeCampus.id,
      student_id: verifiedStudent?.student_id || `std-${Date.now()}`,
      student_name: verifiedStudent?.name || "Verified Student",
      student_roll_prefix: verifiedStudent?.roll_number ? `${verifiedStudent.roll_number.slice(0, 6)}XX` : "Verified Roll",
      branch: verifiedStudent?.branch || "Computer Science",
      grad_year: verifiedStudent?.grad_year || 2026,
      is_verified: true,
      overall_rating: reviewData.overall_rating,
      academics_rating: reviewData.academics_rating,
      infrastructure_rating: reviewData.infrastructure_rating,
      placement_rating: reviewData.placement_rating,
      review_title: reviewData.title,
      review_text: reviewData.content,
      pros: reviewData.pros,
      cons: reviewData.cons,
      visiting_companies_experienced: reviewData.visiting_companies_experienced,
      backlog_advice: reviewData.backlog_advice,
      upvotes_count: 1,
      timestamp: new Date().toISOString(),
    };

    const updated = [newReview, ...reviews];
    saveReviews(updated);

    // Call API route in background for server state sync
    try {
      await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${verifiedStudent?.session_token || "nexus_std_token"}`,
        },
        body: JSON.stringify({
          ...reviewData,
          campus_id: activeCampus.id,
          session_token: verifiedStudent?.session_token,
          student_name: verifiedStudent?.name,
          branch: verifiedStudent?.branch,
          grad_year: verifiedStudent?.grad_year,
          review_title: reviewData.title,
          review_text: reviewData.content,
        }),
      });
    } catch (e) {
      console.warn("Server review sync fallback:", e);
    }
  };

  const upvoteReview = (reviewId: string) => {
    const updated = reviews.map((r) => {
      if (r.id === reviewId) {
        return { ...r, upvotes_count: r.upvotes_count + 1 };
      }
      return r;
    });
    saveReviews(updated);
  };

  const registerCampus = (payload: NewCampusPayload): Campus => {
    const slug = payload.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 20);

    const newCampus: Campus = {
      id: `${slug}-${Date.now().toString().slice(-4)}`,
      name: payload.name,
      city: payload.city,
      country: payload.country,
      developer_github_handle: payload.developer_github_handle.replace(/^@/, ""),
      is_verified: false,
      created_at: new Date().toISOString(),
      accent_color: "from-emerald-600 to-teal-700",
    };

    const updated = [newCampus, ...campuses];
    saveCampuses(updated);
    setActiveCampus(newCampus);
    return newCampus;
  };

  const isPeeking = activeCampus.id !== homeCampus.id;

  return (
    <CampusContext.Provider
      value={{
        campuses,
        activeCampus,
        homeCampus,
        isPeeking,
        activeTab,
        setActiveTab,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        filteredCampuses,
        activePosts,
        activeSOSPosts,
        setActiveCampusById,
        setHomeCampusById,
        returnToHomeCampus,
        addPost,
        upvotePost,
        addSOSAnswer,
        upvoteAnswer,
        registerCampus,
        isDevModalOpen,
        setIsDevModalOpen,
        isCreatePostModalOpen,
        setIsCreatePostModalOpen,
        isCampusSwitcherOpen,
        setIsCampusSwitcherOpen,

        // Student Verification & Reviews
        verifiedStudent,
        verifyStudentSession,
        logoutStudent,
        isStudentVerifyModalOpen,
        setIsStudentVerifyModalOpen,
        isCreateReviewModalOpen,
        setIsCreateReviewModalOpen,
        reviews,
        addReview,
        upvoteReview,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
}

export function useCampus() {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error("useCampus must be used within a CampusProvider");
  }
  return context;
}
