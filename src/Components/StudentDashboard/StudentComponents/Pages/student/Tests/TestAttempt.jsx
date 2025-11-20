import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import "./TestAttempt.css";
import { FaChevronLeft, FaChevronRight, FaClock } from "react-icons/fa";
import { IoMdSchool } from "react-icons/io";
import { PiStudentBold } from "react-icons/pi";
import LatexRenderer from "../../../../../ReusableComponents/LatexRenderer/LatexRenderer";
import { Helmet } from "react-helmet";

const TestAttempt = () => {
  const { testId } = useParams();

const data = [
  {
    id: 1,
    question: `A particle moves along a path defined by the parametric equations: x(t) = R cos(ω t), y(t) = R sin(ω t), z(t) = k t^2. Compute the arc length S of the curve traced from t=0 to t=T.`,
    answer: `Use the formula for arc length: S = ∫ sqrt((dx/dt)^2 + (dy/dt)^2 + (dz/dt)^2) dt and integrate from 0 to T.`,
    type: "MCQ",
    marks: 5,
    owner: "Admin",
    section: "Mathematics",
    created: "19/11/2025",
    modified: "Today",
    options: [
      `S = T/2 sqrt(R^2 ω^2 + 4k^2 T^2) + (R^2 ω^2)/(4k) sinh⁻¹(2kT/Rω)`,
      `S = T/2 sqrt(R^2 ω^2 + 4k^2 T^2) + (R^2 ω^2)/(4k) ln|2kT + sqrt(R^2 ω^2 + 4k^2 T^2)|`,
      `S = T/2 sqrt(R^2 ω^2 + 4k^2 T^2) + (R^2 ω^2)/(4k) tan⁻¹(2kT/Rω)`,
      `S = (1/4k)[2kT sqrt(R^2 ω^2 + 4k^2 T^2) + R^2 ω^2 ln((2kT + sqrt(R^2 ω^2 + 4k^2 T^2))/(Rω))]`
    ],
    correctAnswer: 0,
    isLaTeXEnabled: true
  },
  {
    id: 2,
    question: `Let A ∈ ℝ^(10×10) be a matrix and x an unknown vector such that Ax = b. Which statement is TRUE regarding the solution?`,
    answer: `Check invertibility of A: if det(A) ≠ 0 then unique solution x = A⁻¹ b; if det(A) = 0, solution may be none or infinite.`,
    type: "MCQ",
    marks: 5,
    owner: "Admin",
    section: "Linear Algebra",
    created: "19/11/2025",
    modified: "Today",
    options: [
      `A is invertible, unique solution x = A⁻¹ b`,
      `A is singular, det(A) = 0, system has no or infinite solutions`,
      `A has 10 linearly dependent rows, rank(A) < 10`,
      `If λ = 0 is eigenvalue, x = x_p + x_h with x_h ∈ ker(A)`
    ],
    correctAnswer: 1,
    isLaTeXEnabled: true
  },
  {
    id: 3,
    question: `Consider a time-harmonic electromagnetic wave E(r,t) = E0 ẑ cos(kz - ωt). Which statement about the magnetic field B is correct?`,
    answer: `B is related to E by B = (1/c) k̂ × E; also, E satisfies wave equation ∇²E - (1/c²) ∂²E/∂t² = 0.`,
    type: "MCQ",
    marks: 5,
    owner: "Admin",
    section: "Electromagnetism",
    created: "19/11/2025",
    modified: "Today",
    options: [
      `B = (E0/c) ŷ cos(kz - ωt)`,
      `Wave equation for E: ∇²E - (1/c²) ∂²E/∂t² = 0`,
      `Both options a and b are correct`,
      `None of the above`
    ],
    correctAnswer: 2,
    isLaTeXEnabled: true
  },
  {
    id: 4,
    question: `Consider the 1D heat equation ∂u/∂t = α ∂²u/∂x² with u(0,t) = u(L,t) = 0. Solve using separation of variables.`,
    answer: `Use separation of variables u(x,t) = X(x)T(t); solution: u(x,t) = Σ A_n sin(n π x / L) e^(-α (n π / L)^2 t).`,
    type: "MCQ",
    marks: 5,
    owner: "Admin",
    section: "Partial Differential Equations",
    created: "19/11/2025",
    modified: "Today",
    options: [
      `u(x,t) = Σ A_n sin(n π x / L) e^(-α (n π / L)^2 t)`,
      `Eigenvalues λ_n = (n π / L)^2`,
      `Both options a and b are correct`,
      `Cannot express solution in terms of eigenvalues`
    ],
    correctAnswer: 2,
    isLaTeXEnabled: true
  },
  {
    id: 5,
    question: `For a first-order reaction A → B with rate = k[A], find integrated rate law and half-life.`,
    answer: `Integrated rate law: [A] = [A]_0 e^{-kt}, half-life: t_1/2 = ln2 / k.`,
    type: "MCQ",
    marks: 5,
    owner: "Admin",
    section: "Chemistry",
    created: "19/11/2025",
    modified: "Today",
    options: [
      `Half-life t_1/2 = ln2 / k`,
      `Integrated rate law: [A] = [A]_0 e^{-kt}`,
      `Both options a and b are correct`,
      `Half-life is independent of initial concentration [A]_0`
    ],
    correctAnswer: 2,
    isLaTeXEnabled: true
  },
  {
    id: 6,
    question: `A numerical problem: A car travels 100 m in 5 s. Compute its average speed.`,
    answer: `Average speed = total distance / total time = 100 / 5 = 20 m/s.`,
    type: "Numerical",
    marks: 5,
    owner: "Admin",
    section: "Physics",
    created: "19/11/2025",
    modified: "Today",
    correctAnswer: "20 m/s",
    tolerance: "±5%",
    units: "m/s",
    isLaTeXEnabled: true
  },
  {
    id: 7,
    question: `Evaluate the integral ∫ (x^2 + 1) / (x^3 + 3x) dx.`,
    answer: `Use partial fraction decomposition: ∫ (x^2 + 1)/(x(x^2 + 3)) dx = ln|x| + (1/2) ln|x^2 + 3| + C.`,
    type: "MCQ",
    marks: 5,
    owner: "Admin",
    section: "Mathematics",
    created: "19/11/2025",
    modified: "Today",
    options: [
      `ln|x| + (1/2) ln|x^2 + 3| + C`,
      `(x^2 + 3)/(2x) + C`,
      `1/(x^2 + 3) + ln|x| + C`,
      `x + ln|x^2 + 3| + C`
    ],
    correctAnswer: 0,
    isLaTeXEnabled: true
  },
  {
    id: 8,
    question: `A block slides down a frictionless incline of height h. Find its speed at the bottom.`,
    answer: `Use energy conservation: mgh = 1/2 m v^2 → v = sqrt(2gh).`,
    type: "Numerical",
    marks: 5,
    owner: "Admin",
    section: "Physics",
    created: "19/11/2025",
    modified: "Today",
    correctAnswer: "sqrt(2gh)",
    tolerance: "±5%",
    units: "m/s",
    isLaTeXEnabled: true
  },
  {
    id: 9,
    question: `Balance the chemical reaction: C2H6 + O2 → CO2 + H2O.`,
    answer: `Balanced equation: 2 C2H6 + 7 O2 → 4 CO2 + 6 H2O.`,
    type: "MCQ",
    marks: 5,
    owner: "Admin",
    section: "Chemistry",
    created: "19/11/2025",
    modified: "Today",
    options: [
      `C2H6 + 3 O2 → 2 CO2 + 3 H2O`,
      `2 C2H6 + 7 O2 → 4 CO2 + 6 H2O`,
      `C2H6 + O2 → 2 CO + 3 H2O`,
      `C2H6 + 2 O2 → 2 CO2 + 3 H2O`
    ],
    correctAnswer: 1,
    isLaTeXEnabled: true
  },
  {
    id: 10,
    question: `Compute the determinant of the matrix A = [[1,2,3],[0,1,4],[5,6,0]].`,
    answer: `det(A) = 1*(1*0 - 4*6) - 2*(0*0 - 4*5) + 3*(0*6 - 1*5) = -24 + 40 - 15 = 1.`,
    type: "Numerical",
    marks: 5,
    owner: "Admin",
    section: "Linear Algebra",
    created: "19/11/2025",
    modified: "Today",
    correctAnswer: 1,
    tolerance: "±0%",
    units: "",
    isLaTeXEnabled: true
  },
  {
    id: 11,
    question: `Solve the PDE ∂u/∂t + c ∂u/∂x = 0 with initial condition u(x,0) = f(x).`,
    answer: `Solution using method of characteristics: u(x,t) = f(x - ct).`,
    type: "MCQ",
    marks: 5,
    owner: "Admin",
    section: "Partial Differential Equations",
    created: "19/11/2025",
    modified: "Today",
    options: [
      `u(x,t) = f(x + ct)`,
      `u(x,t) = f(x - ct)`,
      `u(x,t) = f(ct - x)`,
      `u(x,t) = f(x) e^{-ct}`
    ],
    correctAnswer: 1,
    isLaTeXEnabled: true
  },
  {
    id: 12,
    question: `A boat travels 30 km downstream in 2 hours and returns upstream in 3 hours. Find the speed of the boat in still water and the speed of the current.`,
    answer: `Let boat speed = b, current = c. Downstream: b+c = 15 km/h, Upstream: b-c = 10 km/h → b = 12.5 km/h, c = 2.5 km/h.`,
    type: "Numerical",
    marks: 5,
    owner: "Admin",
    section: "Physics",
    created: "19/11/2025",
    modified: "Today",
    correctAnswer: { boat: "12.5", current: "2.5" },
    tolerance: "±5%",
    units: "km/h",
    isLaTeXEnabled: true
  },
  {
    id: 13,
    question: `Find the derivative of f(x) = x^x.`,
    answer: `Use logarithmic differentiation: d(x^x)/dx = x^x (1 + ln x).`,
    type: "MCQ",
    marks: 5,
    owner: "Admin",
    section: "Mathematics",
    created: "19/11/2025",
    modified: "Today",
    options: [
      `x^(x-1)`,
      `x^x ln x`,
      `x^x (1 + ln x)`,
      `(1 + x)^x`
    ],
    correctAnswer: 2,
    isLaTeXEnabled: true
  },
  {
    id: 14,
    question: `A sphere of radius R is charged with total charge Q. Find the electric field at distance r > R from the center.`,
    answer: `Use Gauss's law: E = Q / (4πε₀ r^2) in radial direction.`,
    type: "Numerical",
    marks: 5,
    owner: "Admin",
    section: "Electromagnetism",
    created: "19/11/2025",
    modified: "Today",
    correctAnswer: "Q / (4 * pi * epsilon0 * r^2)",
    tolerance: "±5%",
    units: "N/C",
    isLaTeXEnabled: true
  },
  {
    id: 15,
    question: `Determine the half-life of a second-order reaction 2A → B with rate = k[A]^2, initial concentration [A]_0.`,
    answer: `t_1/2 = 1 / (k [A]_0).`,
    type: "MCQ",
    marks: 5,
    owner: "Admin",
    section: "Chemistry",
    created: "19/11/2025",
    modified: "Today",
    options: [
      `t_1/2 = ln2 / k`,
      `t_1/2 = 1 / (k [A]_0)`,
      `t_1/2 = [A]_0 / k`,
      `t_1/2 = sqrt(2/[A]_0 k)`
    ],
    correctAnswer: 1,
    isLaTeXEnabled: true
  },
  {
    id: 16,
    question: `Compute the eigenvalues of the matrix [[2,1],[1,2]].`,
    answer: `Characteristic equation: |A - λI| = (2-λ)^2 -1 = 0 → λ = 1, 3.`,
    type: "Numerical",
    marks: 5,
    owner: "Admin",
    section: "Linear Algebra",
    created: "19/11/2025",
    modified: "Today",
    correctAnswer: [1,3],
    tolerance: "±0%",
    units: "",
    isLaTeXEnabled: true
  },
  {
    id: 17,
    question: `Solve the PDE ∂^2u/∂x^2 = ∂u/∂t, with initial condition u(x,0) = sin(π x).`,
    answer: `Solution using separation of variables: u(x,t) = sin(π x) e^(-π^2 t).`,
    type: "MCQ",
    marks: 5,
    owner: "Admin",
    section: "Partial Differential Equations",
    created: "19/11/2025",
    modified: "Today",
    options: [
      `u(x,t) = sin(π x) e^(π^2 t)`,
      `u(x,t) = sin(π x) e^(-π^2 t)`,
      `u(x,t) = cos(π x) e^(-π^2 t)`,
      `u(x,t) = sin(x) e^(-t)`
    ],
    correctAnswer: 1,
    isLaTeXEnabled: true
  },
  {
    id: 18,
    question: `A train accelerates from rest at 1.2 m/s² for 10 s. Find its velocity and distance traveled.`,
    answer: `v = at = 1.2*10 = 12 m/s, s = 1/2 a t^2 = 0.5*1.2*100 = 60 m.`,
    type: "Numerical",
    marks: 5,
    owner: "Admin",
    section: "Physics",
    created: "19/11/2025",
    modified: "Today",
    correctAnswer: { velocity: 12, distance: 60 },
    tolerance: "±5%",
    units: "m/s, m",
    isLaTeXEnabled: true
  },
  {
    id: 19,
    question: `Find the general solution of the ODE dy/dx = y/x.`,
    answer: `Separable: dy/y = dx/x → ln|y| = ln|x| + C → y = C x.`,
    type: "MCQ",
    marks: 5,
    owner: "Admin",
    section: "Mathematics",
    created: "19/11/2025",
    modified: "Today",
    options: [
      `y = x + C`,
      `y = C e^x`,
      `y = C x`,
      `y = ln(Cx)`
    ],
    correctAnswer: 2,
    isLaTeXEnabled: true
  },
  {
    id: 20,
    question: `A resistor of 10 Ω and capacitor of 5 μF are in series. Find the time constant of the RC circuit.`,
    answer: `τ = R*C = 10 * 5e-6 = 5e-5 s.`,
    type: "Numerical",
    marks: 5,
    owner: "Admin",
    section: "Physics",
    created: "19/11/2025",
    modified: "Today",
    correctAnswer: "5e-5",
    tolerance: "±5%",
    units: "s",
    isLaTeXEnabled: true
  },
  {
    id: 21,
    question: `Determine the limit: lim_{x→0} (sin x)/x.`,
    answer: `Standard limit: lim_{x→0} (sin x)/x = 1.`,
    type: "MCQ",
    marks: 5,
    owner: "Admin",
    section: "Mathematics",
    created: "19/11/2025",
    modified: "Today",
    options: [
      `0`,
      `1`,
      `Infinity`,
      `Does not exist`
    ],
    correctAnswer: 1,
    isLaTeXEnabled: true
  },
  {
    id: 22,
    question: `Calculate the work done by a force F = 5 i + 3 j (N) along displacement r = 2 i + 4 j (m).`,
    answer: `W = F·r = (5*2) + (3*4) = 10 + 12 = 22 J.`,
    type: "Numerical",
    marks: 5,
    owner: "Admin",
    section: "Physics",
    created: "19/11/2025",
    modified: "Today",
    correctAnswer: 22,
    tolerance: "±5%",
    units: "J",
    isLaTeXEnabled: true
  },
  {
    id: 23,
    question: `Write the molecular formula for glucose and identify its functional groups.`,
    answer: `C6H12O6; functional groups: aldehyde (-CHO) and hydroxyl (-OH).`,
    type: "MCQ",
    marks: 5,
    owner: "Admin",
    section: "Chemistry",
    created: "19/11/2025",
    modified: "Today",
    options: [
      `C6H12O6, aldehyde & hydroxyl`,
      `C6H12O6, ketone & hydroxyl`,
      `C5H10O5, aldehyde & hydroxyl`,
      `C6H12O6, carboxylic & hydroxyl`
    ],
    correctAnswer: 0,
    isLaTeXEnabled: true
  },
  {
    id: 24,
    question: `If the characteristic polynomial of a 3x3 matrix is λ^3 - 6λ^2 + 11λ - 6, find its eigenvalues.`,
    answer: `Factorize: (λ-1)(λ-2)(λ-3) → eigenvalues: λ = 1, 2, 3.`,
    type: "Numerical",
    marks: 5,
    owner: "Admin",
    section: "Linear Algebra",
    created: "19/11/2025",
    modified: "Today",
    correctAnswer: [1,2,3],
    tolerance: "±0%",
    units: "",
    isLaTeXEnabled: true
  }
];




  const testData = {
    id: testId,
    title: "JEE Main 2025 (Online) 24th January Evening Slot",
    sections: data.reduce((acc, item) => {
      const sectionName = item.section?.trim();
      if (sectionName && !acc.find((s) => s.name === sectionName)) {
        acc.push({ name: sectionName, questions: [] });
      }
      const section = acc.find((s) => s.name === sectionName);
      if (section) {
        section.questions.push({
          id: item.id,
          text: item.question,
          options:
            item.options ||
            (item.type === "True/False" ? ["True", "False"] : []),
          type: item.type.toLowerCase(),
          image: item.hasImages
            ? item.question.match(/<img[^>]+src=["'](.*?)["']/)?.[1] || null
            : null,
          code: item.hasCode ? item.code : null,
          isLaTeXEnabled: item.isLaTeXEnabled,
          hasTables: item.hasTables,
        });
      }
      return acc;
    }, []).filter((section) => section.name && section.questions.length > 0),
  };

  const allQuestions = testData.sections.flatMap((section, sectionIndex) =>
    section.questions.map((question, questionIndex) => ({
      ...question,
      sectionName: section.name,
      sectionIndex,
      localIndex: questionIndex,
      globalIndex:
        testData.sections
          .slice(0, sectionIndex)
          .reduce((sum, sec) => sum + sec.questions.length, 0) + questionIndex,
    }))
  );

  const [activeSection, setActiveSection] = useState(
    testData.sections[0]?.name || ""
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [questionStatus, setQuestionStatus] = useState({});
  const [timeLeft, setTimeLeft] = useState(3600);
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const sectionsRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [visitedQuestions, setVisitedQuestions] = useState(new Set());
  const [counts, setCounts] = useState({
    "not-visited": allQuestions.length,
    "not-answered": 0,
    "marked-review": 0,
    answered: 0,
    "answered-marked": 0,
  });
  const [sectionCounts, setSectionCounts] = useState({});

  const getCurrentQuestion = () => {
    const section = testData.sections.find(
      (s) => s.name === activeSection
    );
    return section?.questions[currentQuestion] || null;
  };

  const getCurrentQuestionWithSection = () => {
    return allQuestions.find(
      (q) => q.sectionName === activeSection && q.localIndex === currentQuestion
    );
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const scrollSections = (direction) => {
    if (!sectionsRef.current) return;
    const scrollAmount = 200;
    const newScrollLeft =
      direction === "left"
        ? sectionsRef.current.scrollLeft - scrollAmount
        : sectionsRef.current.scrollLeft + scrollAmount;

    sectionsRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });
  };

  const updateStatusAndCounts = (questionId, newStatus) => {
    const currentStatus = questionStatus[questionId];
    if (currentStatus === newStatus) return;

    setQuestionStatus((prev) => ({ ...prev, [questionId]: newStatus }));

    setCounts((prev) => {
      const newCounts = { ...prev };
      if (currentStatus) newCounts[currentStatus] = Math.max(0, newCounts[currentStatus] - 1);
      newCounts[newStatus] = (newCounts[newStatus] || 0) + 1;
      return newCounts;
    });

    const question = allQuestions.find((q) => q.id === questionId);
    if (!question) return;
    const sectionName = question.sectionName;
    setSectionCounts((prev) => {
      const newSectionCounts = { ...prev };
      if (!newSectionCounts[sectionName]) {
        newSectionCounts[sectionName] = {
          "not-visited": 0,
          "not-answered": 0,
          "marked-review": 0,
          answered: 0,
          "answered-marked": 0,
        };
      }
      if (currentStatus)
        newSectionCounts[sectionName][currentStatus] = Math.max(
          0,
          newSectionCounts[sectionName][currentStatus] - 1
        );
      newSectionCounts[sectionName][newStatus] =
        (newSectionCounts[sectionName][newStatus] || 0) + 1;
      return newSectionCounts;
    });
  };

  const handleMarkForReview = () => {
    const currentQ = getCurrentQuestion();
    if (!currentQ) return;
    updateStatusAndCounts(currentQ.id, "marked-review");
  };

  const handleClearResponse = () => {
    const currentQ = getCurrentQuestion();
    if (!currentQ) return;

    setAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[currentQ.id];
      return newAnswers;
    });

    setSelectedAnswers((prev) => {
      const newSelectedAnswers = { ...prev };
      delete newSelectedAnswers[currentQ.id];
      return newSelectedAnswers;
    });

    updateStatusAndCounts(currentQ.id, "not-answered");
  };

  const handleNextQuestion = () => {
    const current = getCurrentQuestionWithSection();
    if (!current) return;
    if (current.globalIndex < allQuestions.length - 1) {
      const nextQuestion = allQuestions[current.globalIndex + 1];
      setActiveSection(nextQuestion.sectionName);
      setCurrentQuestion(nextQuestion.localIndex);
    }
  };

  const handlePrevQuestion = () => {
    const current = getCurrentQuestionWithSection();
    if (!current) return;
    if (current.globalIndex > 0) {
      const prevQuestion = allQuestions[current.globalIndex - 1];
      setActiveSection(prevQuestion.sectionName);
      setCurrentQuestion(prevQuestion.localIndex);
    }
  };

  useEffect(() => {
    const status = {};
    const sectionCountsInit = {};
    testData.sections.forEach((section) => {
      sectionCountsInit[section.name] = {
        "not-visited": section.questions.length,
        "not-answered": 0,
        "marked-review": 0,
        answered: 0,
        "answered-marked": 0,
      };
    });
    allQuestions.forEach((question) => {
      status[question.id] = "not-visited";
    });
    setQuestionStatus(status);
    setSectionCounts(sectionCountsInit);
    if (allQuestions.length > 0) setCurrentQuestionId(allQuestions[0].id);
  }, []);

  useEffect(() => {
    const currentQ = getCurrentQuestion();
    if (!currentQ) return;
    setCurrentQuestionId(currentQ.id);
    if (questionStatus[currentQ.id] === "not-visited" && !visitedQuestions.has(currentQ.id)) {
      setVisitedQuestions((prev) => new Set(prev.add(currentQ.id)));
      updateStatusAndCounts(currentQ.id, "not-answered");
    }
  }, [currentQuestion, activeSection]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (questionId, answer) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSaveAndNext = () => {
    const currentQ = getCurrentQuestion();
    if (!currentQ) return;
    const answer = selectedAnswers[currentQ.id];
    if (!answer && !["paragraph", "table"].includes(currentQ.type)) {
      alert("Please choose an answer before proceeding.");
      return;
    }
    setAnswers((prev) => ({ ...prev, [currentQ.id]: answer }));
    updateStatusAndCounts(currentQ.id, "answered");
    handleNextQuestion();
  };

  const handleSaveAndMarkForReview = () => {
    const currentQ = getCurrentQuestion();
    if (!currentQ) return;
    const answer = selectedAnswers[currentQ.id];
    if (!answer && !["paragraph", "table"].includes(currentQ.type)) {
      alert("Please choose an answer before marking for review.");
      return;
    }
    setAnswers((prev) => ({ ...prev, [currentQ.id]: answer }));
    updateStatusAndCounts(currentQ.id, "answered-marked");
    handleNextQuestion();
  };

  const navigateToQuestion = (globalIndex) => {
    const question = allQuestions[globalIndex];
    if (!question) return;
    setActiveSection(question.sectionName);
    setCurrentQuestion(question.localIndex);
    setCurrentQuestionId(question.id);
    if (questionStatus[question.id] === "not-visited" && !visitedQuestions.has(question.id)) {
      setVisitedQuestions((prev) => new Set(prev.add(question.id)));
      updateStatusAndCounts(question.id, "not-answered");
    }
  };

  useEffect(() => {
    const sectionsElement = sectionsRef.current;
    const handleScroll = () => {
      if (!sectionsElement) return;
      const { scrollLeft, scrollWidth, clientWidth } = sectionsElement;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
    };
    sectionsElement?.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => sectionsElement?.removeEventListener("scroll", handleScroll);
  }, []);

  const renderQuestionContent = (question) => {
    if (!question) return null;

    const renderOptions = () => {
      if (["mcq", "true/false", "table"].includes(question.type)) {
        return question.options.map((option, i) => (
          <label key={i} className="option">
            <input
              type="radio"
              name={`q${question.id}`}
              value={option}
              checked={selectedAnswers[question.id] === option}
              onChange={() => handleAnswerChange(question.id, option)}
            />
            <span className="option-text">
              {String.fromCharCode(65 + i)}.{" "}
              <LatexRenderer content={option} isInline={question.isLaTeXEnabled} />
            </span>
          </label>
        ));
      } else if (question.type === "numerical") {
        return (
          <input
            type="number"
            value={selectedAnswers[question.id] || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter numerical answer"
            className="numerical-input"
          />
        );
      } else if (question.type === "paragraph") {
        return (
          <textarea
            value={selectedAnswers[question.id] || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your answer here"
            className="paragraph-input"
          />
        );
      }
      return null;
    };

    const tableMatch = question.text.match(/<table[^>]*>.*?<\/table>/s);
    const hasTable = question.hasTables && tableMatch;

    return (
      <div className="question-container">
        <div className="question-text">
          {getCurrentQuestionWithSection()?.localIndex + 1}.{" "}
          {hasTable ? (
            <div dangerouslySetInnerHTML={{ __html: question.text }} />
          ) : (
            <LatexRenderer content={question.text} isInline={question.isLaTeXEnabled} />
          )}
        </div>

        {question.image && (
          <div className="question-image">
            <img
              src={question.image}
              alt="Question diagram"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        )}

        {question.code && (
          <div className="programming-question">
            <pre className="code-block">
              <code>{question.code}</code>
            </pre>
            {question.options?.length > 0 && (
              <div className="options" id="options-section">
                {question.options.map((option, i) => (
                  <label key={i} className="option">
                    <input
                      type="radio"
                      name={`q${question.id}`}
                      value={option}
                      checked={selectedAnswers[question.id] === option}
                      onChange={() => handleAnswerChange(question.id, option)}
                    />
                    <span className="option-text">
                      {String.fromCharCode(65 + i)}. {option}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        )}

        {(hasTable || !question.code) && <div className="options">{renderOptions()}</div>}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Student Tests</title>
        <meta name="description" content="Scheduled Test - Completed Tests Details" />
      </Helmet>
      <div className="test-attempt-container">
        {/* === Header & Timer === */}
        <div className="exam-header">
          <div className="student-header-container">
            <div className="header-left">
              <div className="app-brand">
                <IoMdSchool className="app-icon" />
                <h1>
                  Exam<span>Pro</span>
                </h1>
              </div>
              <div className="exam-info">
                <p className="user-name">
                  <span>Test Name :</span> {testData.title}
                </p>
              </div>
            </div>
            <div className="header-right">
              <div className="user-info">
                <PiStudentBold className="user-icon" />
                <div>
                  <p className="user-label">CANDIDATE</p>
                  <p className="user-name">Dineshbabu JWS</p>
                </div>
              </div>
              <div className="timer-display">
                <FaClock className="timer-icon" />
                <div>
                  <p className="timer-label">REMAINING TIME</p>
                  <p className="time-value">{formatTime(timeLeft)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* === Main Content === */}
        <div className="main-content-wrapper">
          <div className="main-content">
            {/* Sections Tabs */}
            <div className="horizontal-sections-container horizontal-sections-card">
              {showLeftArrow && (
                <button className="scroll-button left" onClick={() => scrollSections("left")}>
                  <FaChevronLeft />
                </button>
              )}
              <div className="horizontal-sections" ref={sectionsRef}>
                {testData.sections.map((section) => (
                  <div
                    key={section.name}
                    className={`section-tab ${activeSection === section.name ? "active" : ""}`}
                    onClick={() => {
                      setActiveSection(section.name);
                      setCurrentQuestion(0);
                    }}
                  >
                    <span className="section-name">{section.name}</span>
                  </div>
                ))}
              </div>
              {showRightArrow && (
                <button className="scroll-button right" onClick={() => scrollSections("right")}>
                  <FaChevronRight />
                </button>
              )}
            </div>

            {/* Question Area */}
            <div className="test-body question-palette-card2">
              <div className="question-area">
                {activeSection && renderQuestionContent(getCurrentQuestion())}
                <div className="student-actions-footer">
                  <button
                    className={`btn save-next ${selectedAnswers[getCurrentQuestion()?.id] ? "answered-btn" : ""}`}
                    onClick={handleSaveAndNext}
                  >
                    <span className="btn-text">Save & Next</span>
                  </button>
                  <button className="btn save-mark" onClick={handleSaveAndMarkForReview}>
                    <span className="btn-text">Save & Mark For Review</span>
                  </button>
                  <button className="btn clear" onClick={handleClearResponse}>
                    <span className="btn-text">Clear</span>
                  </button>
                  <button className="btn mark-next" onClick={() => { handleMarkForReview(); handleNextQuestion(); }}>
                    <span className="btn-text">Mark For Review & Next</span>
                  </button>
                </div>

                {/* Navigation Buttons */}
                <div className="navigation-buttons">
                  <div className="nav-left">
                    <button
                      className="nav-btn nav-prev"
                      onClick={handlePrevQuestion}
                      disabled={getCurrentQuestionWithSection()?.globalIndex === 0}
                    >
                      Prev
                    </button>
                    <button
                      className="nav-btn nav-next"
                      onClick={handleNextQuestion}
                      disabled={getCurrentQuestionWithSection()?.globalIndex === allQuestions.length - 1}
                    >
                      Next
                    </button>
                  </div>
                  <div className="nav-right">
                    <button className="nav-btn nav-submit">Submit</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="status-sidebar">
            <div className="status-summary status-summary-card">
              <h4>Overall Status</h4>
              <div className="row status-counts justify-content-center">
                <div className="col-6 col-md-6 status-item">
                  <span className="count-box not-visited">{counts["not-visited"]}</span>
                  <span>Not Visited</span>
                </div>
                <div className="col-6 col-md-6 status-item">
                  <span className="count-box not-answered">{counts["not-answered"]}</span>
                  <span>Not Answered</span>
                </div>
              </div>
              <div className="row status-counts justify-content-center">
                <div className="col-6 col-md-6 status-item">
                  <span className="count-box answered">{counts["answered"]}</span>
                  <span>Answered</span>
                </div>
                <div className="col-6 col-md-6 status-item">
                  <span className="count-box marked-review">{counts["marked-review"]}</span>
                  <span>Marked for Review</span>
                </div>
              </div>
              <div className="row status-counts justify-content-center">
                <div className="col-12 col-md-12 status-item">
                  <span className="count-box answered-marked">{counts["answered-marked"]}</span>
                  <span>Answered & Marked for Review</span>
                </div>
              </div>
            </div>

            {/* Question Palette */}
            <div className="question-palette-card">
              <div className="ps-3">
                <h4>Questions</h4>
              </div>
              {testData.sections.map((section, sectionIndex) => (
                <div key={section.name} className="section-questions">
                  <h5 className="section-name-palette">
                    {section.name} <span className="section-number">{section.questions.length}</span>
                  </h5>
                  <div className="question-buttons">
                    {section.questions.map((question, questionIndex) => {
                      const globalIndex =
                        testData.sections
                          .slice(0, sectionIndex)
                          .reduce((sum, sec) => sum + sec.questions.length, 0) +
                        questionIndex;
                      const isCurrent = question.id === currentQuestionId;
                      const status = questionStatus[question.id] || "not-visited";
                      return (
                        <button
                          key={question.id}
                          className={`question-btn ${isCurrent ? "current-question" : ""} ${status}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigateToQuestion(globalIndex);
                          }}
                        >
                          {questionIndex + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TestAttempt;
