import React, { useEffect, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import {
  Users,
  Wallet,
  CalendarDays,
  Search,
  Plus,
  Trash2,
  BadgeInfo,
  MapPin,
  LogOut,
  Sparkles,
  Briefcase,
  Clock3,
  Phone,
  UserPlus,
  UserCheck,
  Settings,
  Moon,
  Sun,
  Languages,
  ShieldCheck,
  ArrowLeftRight,
  KeyRound,
  Pencil,
  Menu,
  X,
  MessageCircle,
  Send,
  Paperclip,
  CheckCheck,
  PhoneCall,
  Video,
  Mic,
  UsersRound,
  Pin,
  BellOff,
  Image,
  MoreHorizontal,
  Reply,
  Forward,
  Copy,
  Star,
  Download,
  Info,
  Archive,
  Lock,
  Camera,
  FileText,
  Play,
  Pause,
  Fingerprint,
  Eye,
  EyeOff,
  Upload,
} from "lucide-react";

// === Artifact-preview compatibility shim ===
// Browser storage APIs are not available inside the Claude artifact sandbox,
// so we provide an in-memory replacement. Data persists only for the current
// session and resets on reload. (No effect outside the sandbox if real
// localStorage exists.)
(function installMemoryStorageShim() {
  if (typeof window === "undefined") return;
  let needsShim = false;
  try {
    const probe = "__hr_probe__";
    window.localStorage.setItem(probe, "1");
    window.localStorage.removeItem(probe);
  } catch (e) {
    needsShim = true;
  }
  if (!window.localStorage) needsShim = true;
  if (!needsShim) return;
  const store = new Map();
  const memoryStorage = {
    getItem: (k) => (store.has(String(k)) ? store.get(String(k)) : null),
    setItem: (k, v) => { store.set(String(k), String(v)); },
    removeItem: (k) => { store.delete(String(k)); },
    clear: () => { store.clear(); },
    key: (i) => Array.from(store.keys())[i] ?? null,
    get length() { return store.size; },
  };
  try {
    Object.defineProperty(window, "localStorage", { value: memoryStorage, configurable: true });
  } catch (e) {
    window.localStorage = memoryStorage;
  }
})();

const STORAGE_KEYS = {
  employees: "hr_employees_v13",
  requests: "hr_requests_v13",
  users: "hr_users_v13",
  pending: "hr_pending_accounts_v13",
  upgrades: "hr_upgrade_requests_v13",
  complaints: "hr_complaints_v13",
  chats: "hr_chats_v13",
  chatCalls: "hr_chat_calls_v13",
  settings: "hr_ui_settings_v13",
  attendanceReports: "hr_attendance_reports_v13",
  feedback: "hr_feedback_v13",
};

const BRANCH_OPTIONS = ["المركزية", "الجبل الاخضر", "الغربية", "الوسطى", "بنغازي", "طرابلس", "فزان"];

const initialEmployees = [
  {
    id: 1,
    name: "أحمد سالم",
    department: "الموارد البشرية",
    managerDepartment: "شؤون الموظفين",
    location: "طرابلس",
    phone: "0912345678",
    email: "ahmed.salem@company.ly",
    description: "مسؤول شؤون الموظفين ومتابعة الملفات الإدارية",
    basicSalary: 3500,
    salary: 3500,
    advance: 500,
    leaveBalance: 18,
    workHours: 8,
    shift: "morning",
    fromHour: "08:00",
    toHour: "16:00",
  },
  {
    id: 2,
    name: "سارة علي",
    department: "المالية",
    managerDepartment: "الحسابات",
    location: "بنغازي",
    phone: "0923456789",
    email: "sara.ali@company.ly",
    description: "متابعة المصروفات والتقارير المالية",
    basicSalary: 4200,
    salary: 4200,
    advance: 300,
    leaveBalance: 12,
    workHours: 8,
    shift: "morning",
    fromHour: "08:30",
    toHour: "16:30",
  },
  {
    id: 3,
    name: "محمد مفتاح",
    department: "تقنية المعلومات",
    managerDepartment: "الدعم الفني",
    location: "مصراتة",
    phone: "0934567890",
    email: "mohamed.meftah@company.ly",
    description: "دعم الأنظمة وإدارة الأجهزة والشبكات",
    basicSalary: 5000,
    salary: 5000,
    advance: 0,
    leaveBalance: 20,
    workHours: 8,
    shift: "morning",
    fromHour: "09:00",
    toHour: "17:00",
  },
  {
    id: 4,
    name: "خالد فرج",
    department: "المبيعات",
    managerDepartment: "المبيعات",
    location: "طرابلس",
    phone: "0941111111",
    email: "khaled.faraj@company.ly",
    description: "مدير فرع طرابلس ومتابعة فرق العمل",
    basicSalary: 6500,
    salary: 6500,
    advance: 0,
    leaveBalance: 22,
    workHours: 8,
    shift: "morning",
    fromHour: "08:00",
    toHour: "16:00",
  },
  {
    id: 5,
    name: "منى عبدالسلام",
    department: "المالية",
    managerDepartment: "الحسابات",
    location: "بنغازي",
    phone: "0942222222",
    email: "mona.abdulsalam@company.ly",
    description: "مدير إدارة الحسابات ومتابعة موظفي الإدارة",
    basicSalary: 6200,
    salary: 6200,
    advance: 0,
    leaveBalance: 21,
    workHours: 8,
    shift: "morning",
    fromHour: "08:00",
    toHour: "16:00",
  },
];

const initialRequests = [
  {
    id: 1,
    employeePhone: "0912345678",
    employeeName: "أحمد سالم",
    department: "الموارد البشرية",
    managerDepartment: "شؤون الموظفين",
    type: "إجازة",
    leaveFrom: "2026-04-10",
    leaveTo: "2026-04-12",
    reason: "ظرف عائلي",
    status: "بانتظار الاعتماد",
    approver: "HR",
    decidedBy: "",
    canDecide: true,
  },
  {
    id: 2,
    employeePhone: "0923456789",
    employeeName: "سارة علي",
    department: "المالية",
    managerDepartment: "الحسابات",
    type: "تأخير",
    lateFrom: "09:30",
    lateTo: "10:30",
    compensateAt: "17:30",
    reason: "مراجعة طبية صباحية",
    status: "معتمد",
    approver: "مدير الإدارة",
    decidedBy: "مدير الإدارة",
    canDecide: false,
  },
];

const initialComplaints = [];

const initialChats = [
  {
    id: "direct-0910000000-0950000000",
    type: "direct",
    participants: ["0950000000", "0910000000"],
    pinnedBy: ["0950000000"],
    mutedBy: [],
    messages: [
      {
        id: 11,
        senderPhone: "0950000000",
        type: "text",
        text: "مرحبًا، نبي متابعة سريعة على الطلبات اليوم.",
        sentAt: "2026-04-07T09:15:00",
      },
      {
        id: 12,
        senderPhone: "0910000000",
        type: "text",
        text: "تم، بنرسل لك ملخص قبل نهاية الدوام.",
        sentAt: "2026-04-07T09:18:00",
      },
    ],
  },
  {
    id: "direct-0910000000-0912345678",
    type: "direct",
    participants: ["0910000000", "0912345678"],
    pinnedBy: [],
    mutedBy: [],
    messages: [
      {
        id: 21,
        senderPhone: "0910000000",
        type: "text",
        text: "أحمد، لو احتجت أي دعم في الإجازات ابعت هنا مباشرة.",
        sentAt: "2026-04-07T10:00:00",
      },
    ],
  },
  {
    id: "group-tripoli-ops",
    type: "group",
    name: "فريق طرابلس",
    participants: ["0950000000", "0910000000", "0912345678", "0941111111"],
    admins: ["0950000000", "0910000000"],
    pinnedBy: ["0912345678"],
    mutedBy: [],
    messages: [
      {
        id: 31,
        senderPhone: "0910000000",
        type: "text",
        text: "صباح الخير، هذا جروب المتابعة اليومية لفرع طرابلس.",
        sentAt: "2026-04-07T08:40:00",
      },
      {
        id: 32,
        senderPhone: "0941111111",
        type: "text",
        text: "تم فتح الفرع والوضع ممتاز.",
        sentAt: "2026-04-07T08:44:00",
      },
    ],
  },
];

const initialChatCalls = [];
const initialFeedbackEntries = [];
const PROGRAMMER_ACCOUNT_PHONE = "مبرمجR1";

const initialSystemUsers = [
  { phone: "0950000000", password: "12345678", role: "owner", name: "المالك", managedDepartment: "all", managedBranch: "all", mustChangePassword: false, passwordChangedOnce: true },
  { phone: "0910000000", password: "999999", role: "hr", name: "موظف HR", managedDepartment: "all", managedBranch: "all", mustChangePassword: false, passwordChangedOnce: true },
  { phone: "0941111111", password: "444444", role: "branch_manager", name: "خالد فرج", managedDepartment: "all", managedBranch: "طرابلس", mustChangePassword: false, passwordChangedOnce: true },
  { phone: "0942222222", password: "555555", role: "department_manager", name: "منى عبدالسلام", managedDepartment: "الحسابات", managedBranch: "بنغازي", mustChangePassword: false, passwordChangedOnce: true },
  { phone: "0912345678", password: "111111", role: "employee", name: "أحمد سالم", managedDepartment: "شؤون الموظفين", managedBranch: "طرابلس", mustChangePassword: false, passwordChangedOnce: true },
  { phone: "0923456789", password: "222222", role: "employee", name: "سارة علي", managedDepartment: "الحسابات", managedBranch: "بنغازي", mustChangePassword: false, passwordChangedOnce: true },
  { phone: "0934567890", password: "333333", role: "employee", name: "محمد مفتاح", managedDepartment: "الدعم الفني", managedBranch: "مصراتة", mustChangePassword: false, passwordChangedOnce: true },
  { phone: PROGRAMMER_ACCOUNT_PHONE, password: "Rw20060531", role: "owner", name: "مبرمجR1", managedDepartment: "all", managedBranch: "all", mustChangePassword: false, passwordChangedOnce: true, isHiddenAccount: true },
];

function mergeSystemUsersWithHiddenAccounts(list) {
  const incoming = Array.isArray(list) ? list.map((user) => ({ ...user })) : [];
  const defaultOwner = initialSystemUsers.find((u) => u.role === "owner" && !isHiddenAccount(u));
  const ownerPhone = String(defaultOwner?.phone || "").trim();
  // Drop any stale primary-owner account whose phone differs from the current
  // default owner phone (e.g. an old number kept from a previous session).
  const filtered = incoming.filter((user) => {
    if (user?.role === "owner" && !isHiddenAccount(user)) {
      return String(user?.phone || "").trim() === ownerPhone;
    }
    return true;
  });
  const byPhone = new Map(filtered.map((user) => [String(user?.phone || '').trim(), user]));
  // Always ensure the default owner account exists, but preserve any saved
  // changes (especially a changed password) from the stored account.
  if (defaultOwner && ownerPhone) {
    const savedOwner = byPhone.get(ownerPhone) || {};
    byPhone.set(ownerPhone, {
      ...defaultOwner,
      ...savedOwner,
      phone: ownerPhone,
      role: "owner",
      // Keep the saved password if the owner changed it; otherwise default.
      password: savedOwner.password || defaultOwner.password,
    });
  }
  initialSystemUsers.forEach((defaultUser) => {
    const key = String(defaultUser?.phone || '').trim();
    if (!key) return;
    if (isHiddenAccount(defaultUser)) {
      byPhone.set(key, { ...defaultUser, ...(byPhone.get(key) || {}) });
    }
  });
  return Array.from(byPhone.values());
}

const emptyForm = {
  name: "",
  fingerprintId: "",
  department: "",
  password: "",
  managerDepartment: "",
  location: "",
  phone: "",
  email: "",
  description: "",
  basicSalary: "",
  salary: "",
  advance: "",
  leaveBalance: "",
  workHours: "",
  shift: "morning",
  requiredHours: "",
  requiredMinutes: "",
  fromHour: "",
  toHour: "",
  attendanceLateDeductionMode: "automatic",
  attendanceLateValueType: "amount",
  attendanceLateValue: "",
  attendanceAbsenceDeductionMode: "automatic",
  attendanceAbsenceValueType: "amount",
  attendanceAbsenceValue: "",
};

const emptyRegisterForm = {
  name: "",
  phone: "",
  password: "",
  department: "",
  email: "",
  managerDepartment: "",
  location: "",
};

const emptyLeaveRequestForm = {
  type: "إجازة",
  leaveFrom: "",
  leaveTo: "",
  lateFrom: "",
  lateTo: "",
  compensateAt: "",
  reason: "",
};

const emptyAdvanceRequestForm = { amount: "", reason: "" };
const emptyRewardRequestForm = { amount: "", reason: "", actionType: "مكافأة", deductionMode: "manual", valueType: "amount" };
const emptyUpgradeRequestForm = { employeeName: "", employeePhone: "", requestedRole: "branch_manager", reason: "", branch: "المركزية", managerDepartment: "", createNewDepartment: false, newDepartmentName: "" };
const emptySalaryDepositForm = { month: "", salaryAmount: "", deductionAmount: "", deductionReason: "" };
const emptyAdvanceSettlementForm = { deductionMode: "automatic", valueType: "amount", value: "" };
const emptyComplaintForm = { type: "شكوى", targetCategory: "owner", targetValue: "", subject: "", body: "", images: [] };


function getViteEnv(key) {
  // Vite replaces import.meta.env.* at build time. Read it directly so the
  // values are inlined in the Vercel build. Wrapped in try/catch so other
  // bundlers that don't support import.meta simply fall through to "".
  try {
    if (typeof import.meta !== "undefined" && import.meta.env) {
      return import.meta.env[key] || "";
    }
  } catch (e) {
    /* import.meta unavailable in this environment */
  }
  return "";
}

function getSupabaseUrl() {
  return (
    (typeof window !== "undefined" && (
      window.__HR_SUPABASE_URL__ ||
      window.localStorage?.getItem("HR_SUPABASE_URL") ||
      window.localStorage?.getItem("VITE_SUPABASE_URL")
    )) ||
    getViteEnv("VITE_SUPABASE_URL") ||
    ""
  );
}

function getSupabaseAnonKey() {
  return (
    (typeof window !== "undefined" && (
      window.__HR_SUPABASE_ANON_KEY__ ||
      window.localStorage?.getItem("HR_SUPABASE_ANON_KEY") ||
      window.localStorage?.getItem("VITE_SUPABASE_ANON_KEY")
    )) ||
    getViteEnv("VITE_SUPABASE_ANON_KEY") ||
    ""
  );
}

function isRemoteSyncEnabled() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

const REMOTE_STATE_TABLE = "hr_app_state";
const REMOTE_STATE_ROW_ID = "main";

async function requestBrpZEAWYtiB6bJ16NuLbGCc6CZ6jJdKfb63() {
  if (typeof window === "undefined" || !("Notification" in window)) return "denied";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

function showBrowserNotification(title, body) {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, dir: "rtl", lang: "ar" });
  } catch {}
}

function buildSupabaseRestUrl(query = "") {
  const baseUrl = String(getSupabaseUrl() || "").replace(/\/+$/, "");
  return `${baseUrl}/rest/v1/${REMOTE_STATE_TABLE}${query}`;
}

function buildSupabaseHeaders(extra = {}) {
  return {
    apikey: getSupabaseAnonKey(),
    Authorization: `Bearer ${getSupabaseAnonKey()}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

async function fetchRemoteStateRow() {
  if (!isRemoteSyncEnabled()) return { data: null, error: null };
  try {
    const response = await fetch(
      buildSupabaseRestUrl(`?id=eq.${encodeURIComponent(REMOTE_STATE_ROW_ID)}&select=id,payload,updated_at`),
      {
        method: "GET",
        headers: buildSupabaseHeaders(),
      }
    );
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `HTTP ${response.status}`);
    }
    const rows = await response.json();
    return { data: Array.isArray(rows) ? rows[0] || null : rows || null, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function upsertRemoteStateRow(payload) {
  if (!isRemoteSyncEnabled()) return { data: null, error: null };
  const row = {
    id: REMOTE_STATE_ROW_ID,
    payload,
    updated_at: new Date().toISOString(),
  };
  try {
    const response = await fetch(buildSupabaseRestUrl(), {
      method: "POST",
      headers: buildSupabaseHeaders({
        Prefer: "resolution=merge-duplicates,return=representation",
      }),
      body: JSON.stringify([row]),
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `HTTP ${response.status}`);
    }
    const rows = await response.json();
    return { data: Array.isArray(rows) ? rows[0] || row : row, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

function buildDefaultRemoteState() {
  return {
    employees: initialEmployees.map((emp) => ({ ...emp })),
    requests: initialRequests.map((req) => ({ ...req })),
    users: mergeSystemUsersWithHiddenAccounts(initialSystemUsers).map((user) => ({ ...user })),
    pending: [],
    upgrades: [],
    complaints: initialComplaints.map((item) => ({ ...item })),
    chats: initialChats.map((chat) => ({ ...chat })),
    chatCalls: initialChatCalls.map((call) => ({ ...call })),
    feedback: initialFeedbackEntries.map((item) => ({ ...item })),
    attendanceReports: readStorage(STORAGE_KEYS.attendanceReports, [], isArray),
  };
}

function normalizeEmployeesCollection(list) {
  return Array.isArray(list)
    ? list.map((emp) => ({
        ...emp,
        fingerprintId: String(emp?.fingerprintId ?? "").trim(),
        requiredHours: Number(emp?.requiredHours ?? 0),
        requiredMinutes: Number(emp?.requiredMinutes ?? 0),
        basicSalary: Number(emp?.basicSalary ?? emp?.salary ?? 0),
        salary: Number(emp?.salary ?? 0),
        advance: Number(emp?.advance ?? 0),
        leaveBalance: Number(emp?.leaveBalance ?? 0),
        workHours: Number(emp?.workHours ?? 0),
      }))
    : buildDefaultRemoteState().employees;
}

function sanitizeRemoteState(payload) {
  const defaults = buildDefaultRemoteState();
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return defaults;

  return {
    employees: normalizeEmployeesCollection(payload.employees),
    requests: Array.isArray(payload.requests) ? payload.requests : defaults.requests,
    users: mergeSystemUsersWithHiddenAccounts(Array.isArray(payload.users) ? payload.users : defaults.users),
    pending: Array.isArray(payload.pending) ? payload.pending : defaults.pending,
    upgrades: Array.isArray(payload.upgrades) ? payload.upgrades : defaults.upgrades,
    complaints: Array.isArray(payload.complaints) ? payload.complaints : defaults.complaints,
    chats: Array.isArray(payload.chats) ? payload.chats : defaults.chats,
    chatCalls: Array.isArray(payload.chatCalls) ? payload.chatCalls : defaults.chatCalls,
    feedback: Array.isArray(payload.feedback) ? payload.feedback : defaults.feedback,
    attendanceReports: Array.isArray(payload.attendanceReports) ? payload.attendanceReports : defaults.attendanceReports,
  };
}

function getRequestResolvedAmountFor(req, base) {
  const amt = Number(req.amount || 0);
  if (req.valueType === "percentage") return (Number(base || 0) * amt) / 100;
  return amt;
}

// Standalone net calculation so it can be used inside useMemo (which runs
// before component-scoped arrow functions are defined). Net is 0 until a
// salary deposit is made.
function computeEmployeeNet(employee, requests) {
  if (!employee) return 0;
  const empRequests = (Array.isArray(requests) ? requests : [])
    .filter((req) => req.employeePhone === employee.phone && ["مكافأة", "خصم", "إنزال مرتب"].includes(req.type))
    .sort((a, b) => Number(b.id || 0) - Number(a.id || 0));
  const latestSalaryDeposit = empRequests.find((req) => req.type === "إنزال مرتب" && req.status === "معتمد") || null;
  const basicSalary = Number(employee.basicSalary || employee.salary || 0);
  const grossSalary = Number(latestSalaryDeposit?.salaryAmount || basicSalary || 0);
  const approvedRewards = empRequests
    .filter((req) => req.type === "مكافأة" && req.status === "معتمد" && !req.appliedToSalaryDepositId)
    .reduce((sum, req) => sum + getRequestResolvedAmountFor(req, grossSalary), 0);
  const approvedDeductions = empRequests
    .filter((req) => req.type === "خصم" && req.status === "معتمد" && !req.appliedToSalaryDepositId)
    .reduce((sum, req) => sum + getRequestResolvedAmountFor(req, grossSalary), 0);
  const baseNet = latestSalaryDeposit ? Math.max(0, Number(latestSalaryDeposit.amount || 0)) : 0;
  // Rewards/deductions only count once a salary has been deposited.
  if (!latestSalaryDeposit) return 0;
  return Math.max(0, baseNet + approvedRewards - approvedDeductions);
}

const translations = {
  ar: {
    loginTitle: "تسجيل الدخول",
    loginSubtitle: "أدخل رقم الهاتف وكلمة المرور .",
    phone: "رقم الهاتف",
    password: "كلمة المرور",
    login: "دخول",
    createAccount: "إنشاء حساب",
    sampleLogin: "بيانات تجريبية للدخول",
    back: "رجوع",
    registerTitle: "إنشاء حساب",
    registerRequest: "إرسال طلب إنشاء الحساب",
    name: "الاسم",
    department: "الإدارة",
    managerDepartment: "اسم الإدارة",
    location: "الفرع",
    settings: "الإعدادات",
    language: "تغيير اللغة",
    accountType: "نوع الحساب",
    mode: "الوضع",
    light: "المضيء",
    dark: "المظلم",
    changePassword: "تغيير كلمة المرور",
    openPassword: "فتح تغيير كلمة المرور",
    english: "English",
    arabic: "العربية",
    appTitle: "anis.hr",
    heroBadge: "منظومة anis الذكية",
    ownerDesc: "واجهة كاملة للمالك و HR مع جميع الصلاحيات.",
    branchDesc: "هذه لوحة مدير الفرع.",
    deptDesc: "هذه لوحة الإدارة.",
    empDesc: "هذه اللوحة تعرض بياناتك الشخصية فقط.",
    addEmployee: "إضافة موظف",    logout: "تسجيل خروج",
    search: "ابحث بالاسم أو الإدارة أو المنطقة أو الهاتف",
    approvals: "اعتماد إنشاء الحسابات",
    approvalsDesc: "الحساب لا يفتح إلا بعد الاعتماد ثم استكمال البيانات.",
    requestsHub: "الطلبات والاعتمادات",
    requestsHubDesc: "متابعة طلبات الإجازة والتأخير والسلف والمكافآت والخصومات حسب الصلاحية.",
    complaintsTab: "الشكاوي والطلبات",
    complaintsTitle: "الشكاوي والطلبات",
    complaintsDesc: "إرسال شكوى أو طلب وتحديد الجهة التي يصل إليها.",
    complaintType: "نوع الرسالة",
    complaintTarget: "تذهب إلى",
    complaintSubject: "عنوان الشكوى أو الطلب",
    complaintBody: "الشكوى أو الطلب",
    submitComplaint: "إرسال",
    incomingComplaints: "الرسائل الواردة",
    myComplaints: "رسائلي",
    employeesTab: "القسم الأول: بيانات الموظفين",
    salaryTab: "القسم الثاني: الراتب والسلف",
    leaveTab: "القسم الثالث: الإجازات",
    employeeData: "بيانات الموظفين",
    employeeDataDesc: "اسم الموظف، الإدارة، المنطقة، الهاتف، البريد، المرتب الأساسي، والوصف الوظيفي.",
    salaryData: "الراتب والسلف والصافي",
    salaryDataDesc: "عرض الراتب والسلفة وصافي الراتب للموظفين حسب الصلاحية.",
    salaryAdvancesView: "السلف",
    salaryDetailsView: "تفصيل المرتب",
    advanceRequestsTitle: "السلف",
    advanceRequestsDesc: "عرض السلف الحالية وطلبات السلف حسب الصلاحية.",
    salaryDetailsTitle: "تفصيل المرتب",
    salaryDetailsDesc: "عرض تفاصيل المرتب والصافي، ومن هنا يتم طلب المكافأة أو الخصم.",
    leaveData: "إدارة الإجازات",
    leaveDataDesc: "متابعة رصيد الإجازات وساعات العمل.",
    leaveRequests: "طلبات الإجازة والتأخير",
    leaveRequestsDesc: "يمكن للمدير أو HR اعتماد أو رفض الطلبات حسب الصلاحيات.",
    email: "البريد الإلكتروني",
    salary: "الراتب",
    basicSalary: "المرتب الأساسي",
    advance: "السلفة",
    leaveBalance: "رصيد الإجازات",
    workHours: "عدد ساعات العمل اليومية",
    fromHour: "من ساعة",
    toHour: "إلى ساعة",
    employeeDescription: "وصف الموظف",
    shift: "الفترة",
    morning: "صباحي",
    evening: "مسائي",
    leaveFrom: "من تاريخ",
    leaveTo: "إلى تاريخ",
    lateFrom: "من ساعة",
    lateTo: "إلى ساعة",
    compensateAt: "وقت التعويض",
    requestAdvance: "طلب سلفة",
    requestReward: "طلب مكافأة",
    rewardOrDeduction: "مكافأة / خصم",
    deduction: "خصم",
    requestLeave: "طلب إجازة / تأخير",
    amount: "القيمة",
    requester: "مقدم الطلب",
    noRequests: "لا توجد طلبات حالياً",
    decisionBy: "تم بواسطة",
    saveEmployee: "حفظ الموظف",
    newEmployee: "إضافة موظف جديد",
    completeEmployee: "استكمال بيانات الموظف",
    completeSave: "حفظ واستكمال البيانات",
    approve: "اعتماد",
    reject: "رفض",
    editData: "تعديل البيانات",
    editEmployee: "تعديل الموظف",
    saveEdit: "حفظ التعديل",
    completeData: "استكمال البيانات",
    noPending: "لا توجد طلبات إنشاء حسابات حالياً",
    employeeCount: "عدد الموظفين",
    branchCount: "عدد الفروع",
    payrollTotal: "إجمالي الرواتب",
    advancesTotal: "إجمالي السلف",
    leaveTotal: "رصيد الإجازات",
    status: "الحالة",
    approvedBy: "اعتمد بواسطة",
    action: "إجراء",
    type: "النوع",
    dateTime: "التاريخ / الوقت",
    reason: "سبب الطلب",
    net: "الصافي",
    employee: "الموظف",
    delete: "حذف",
    currentPassword: "كلمة المرور الحالية",
    newPassword: "كلمة المرور الجديدة",
    confirmPassword: "تأكيد كلمة المرور",
    accountStatement: "كشف حساب",
    statementSummary: "الملخص",
    statementTransactions: "الحركات والتفاصيل",
    currentAdvanceBalance: "الرصيد الحالي للسلف",
    approvedRewards: "إجمالي المكافآت المعتمدة",
    approvedDeductions: "إجمالي الخصومات المعتمدة",
    estimatedNet: "الصافي بعد المكافآت والخصومات",
    noTransactions: "لا توجد حركات مالية لهذا الموظف حالياً",
    statementType: "التفصيل",
    submittedAt: "تاريخ الطلب",
    salaryDeposit: "انزال المرتب",
    salaryAmount: "قيمة المرتب",
    deductionAmount: "قيمة الخصم",
    deductionReason: "سبب الخصم",
    month: "الشهر",
    selectMonth: "اختر الشهر",
    selectBranch: "اختر الفرع",
    notification: "إشعار",
    notificationDetails: "تفاصيل الإشعار",
    chatTab: "الدردشة",
    chatTitle: "الدردشة",
    chatDesc: "واجهة دردشة داخلية مستوحاة من واتساب وتيليجرام لسهولة التواصل بين الموظفين والإدارات.",
    chatSearch: "ابحث عن موظف أو إدارة",
    chatWrite: "اكتب رسالتك هنا...",
    chatEmpty: "اختر محادثة من القائمة لبدء الدردشة.",
    chatNoContacts: "لا توجد جهات متاحة للدردشة حالياً.",
    chatOnline: "متصل الآن",
    chatLastSeen: "آخر ظهور قريباً",
    chatAttach: "إرفاق",
    sendMessage: "إرسال الرسالة",
    noReasonAvailable: "لا يوجد سبب مسجل",
    chatCreateGroup: "إنشاء قروب",
    chatGroupName: "اسم القروب",
    chatGroupPhones: "أرقام الأعضاء",
    chatGroupPhonesHint: "اكتب الأرقام مفصولة بفاصلة أو مسافة",
    chatStartCall: "اتصال صوتي",
    chatStartVideo: "اتصال فيديو",
    chatVoiceNote: "رسالة صوتية",
    chatPhoto: "صورة",
    chatFile: "ملف",
    chatPinned: "مثبت",
    chatMuted: "صامت",
    chatMembers: "الأعضاء",
    chatCreate: "إنشاء",
    chatCancel: "إلغاء",
    chatCallActive: "مكالمة جارية",
    chatEndCall: "إنهاء المكالمة",
    chatGroupCreated: "تم إنشاء القروب",
    chatAll: "الكل",
    chatGroups: "القروبات",
    chatDirect: "خاص",
    close: "إغلاق",
  },
  en: {
    loginTitle: "Sign In",
    loginSubtitle: "Enter phone number and password based on account type and permissions.",
    phone: "Phone Number",
    password: "Password",
    login: "Login",
    createAccount: "Create Account",
    sampleLogin: "Demo Credentials",
    back: "Back",
    registerTitle: "Create Account",
    registerRequest: "Submit Account Request",
    name: "Name",
    department: "Department",
    managerDepartment: "Department Name",
    location: "Branch",
    settings: "Settings",
    language: "Change Language",
    accountType: "Account Type",
    mode: "Theme",
    light: "Light",
    dark: "Dark",
    changePassword: "Change Password",
    openPassword: "Open Password Change",
    english: "English",
    arabic: "العربية",
    appTitle: "anis.hr",
    heroBadge: "anis AI Control",
    ownerDesc: "Full dashboard for owner and HR with all permissions.",
    branchDesc: "This is the branch manager dashboard.",
    deptDesc: "This is the department dashboard.",
    empDesc: "This dashboard shows only your personal data.",
    addEmployee: "Add Employee",
    logout: "Log Out",
    search: "Search by name, department, location or phone",
    approvals: "Account Creation Approvals",
    approvalsDesc: "Accounts remain inactive until approval and data completion.",
    requestsHub: "Requests & Approvals",
    requestsHubDesc: "Track leave, late, advance, reward, and deduction requests based on permissions.",
    employeesTab: "Section 1: Employees",
    salaryTab: "Section 2: Salary & Advances",
    leaveTab: "Section 3: Leave",
    employeeData: "Employees Data",
    employeeDataDesc: "Name, department, location, phone, email, basic salary and job description.",
    salaryData: "Salary, Advances & Net",
    salaryDataDesc: "View salary, advances and net salary based on permissions.",
    salaryAdvancesView: "Advances",
    salaryDetailsView: "Salary Details",
    advanceRequestsTitle: "Advances",
    advanceRequestsDesc: "View current advances and advance requests based on permissions.",
    salaryDetailsTitle: "Salary Details",
    salaryDetailsDesc: "View salary details and net pay. Reward or deduction is requested from here.",
    leaveData: "Leave Management",
    leaveDataDesc: "Track leave balance and work hours.",
    leaveRequests: "Leave and Late Requests",
    leaveRequestsDesc: "Managers or HR can approve or reject requests based on permissions.",
    email: "Email",
    salary: "Salary",
    basicSalary: "Basic Salary",
    advance: "Advance",
    leaveBalance: "Leave Balance",
    workHours: "Daily Work Hours",
    fromHour: "From",
    toHour: "To",
    employeeDescription: "Employee Description",
    shift: "Shift",
    morning: "Morning",
    evening: "Evening",
    leaveFrom: "From Date",
    leaveTo: "To Date",
    lateFrom: "From Time",
    lateTo: "To Time",
    compensateAt: "Compensation Time",
    requestAdvance: "Request Advance",
    requestReward: "Request Reward",
    rewardOrDeduction: "Reward / Deduction",
    deduction: "Deduction",
    requestLeave: "Leave / Late Request",
    amount: "Amount",
    requester: "Requester",
    noRequests: "No requests available.",
    decisionBy: "Processed By",
    saveEmployee: "Save Employee",
    newEmployee: "Add New Employee",
    completeEmployee: "Complete Employee Data",
    completeSave: "Save Completed Data",
    approve: "Approve",
    reject: "Reject",
    editData: "Edit Data",
    editEmployee: "Edit Employee",
    saveEdit: "Save Edit",
    completeData: "Complete Data",
    noPending: "There are no pending account requests.",
    employeeCount: "Employees",
    branchCount: "Branches",
    payrollTotal: "Total Payroll",
    advancesTotal: "Total Advances",
    leaveTotal: "Leave Balance",
    status: "Status",
    approvedBy: "Approved By",
    action: "Action",
    type: "Type",
    dateTime: "Date / Time",
    reason: "Reason",
    net: "Net",
    employee: "Employee",
    delete: "Delete",
    currentPassword: "Current Password",
    newPassword: "New Password",
    confirmPassword: "Confirm Password",
    accountStatement: "Account Statement",
    statementSummary: "Summary",
    statementTransactions: "Transactions & Details",
    currentAdvanceBalance: "Current Advance Balance",
    approvedRewards: "Approved Rewards",
    approvedDeductions: "Approved Deductions",
    estimatedNet: "Net After Rewards & Deductions",
    noTransactions: "No financial transactions for this employee yet.",
    statementType: "Detail",
    submittedAt: "Request Date",
    chatTab: "Chat",
    chatTitle: "Chat",
    chatDesc: "An internal chat inspired by WhatsApp and Telegram for quick communication between staff and management.",
    chatSearch: "Search employee or department",
    chatWrite: "Write your message here...",
    chatEmpty: "Select a conversation to start chatting.",
    chatNoContacts: "No contacts available right now.",
    chatOnline: "Online now",
    chatLastSeen: "Recently active",
    chatAttach: "Attach",
    sendMessage: "Send message",
    chatCreateGroup: "Create group",
    chatGroupName: "Group name",
    chatGroupPhones: "Member phone numbers",
    chatGroupPhonesHint: "Enter numbers separated by comma or space",
    chatStartCall: "Voice call",
    chatStartVideo: "Video call",
    chatVoiceNote: "Voice note",
    chatPhoto: "Photo",
    chatFile: "File",
    chatPinned: "Pinned",
    chatMuted: "Muted",
    chatMembers: "Members",
    chatCreate: "Create",
    chatCancel: "Cancel",
    chatCallActive: "Live call",
    chatEndCall: "End call",
    chatGroupCreated: "Group created",
    chatAll: "All",
    chatGroups: "Groups",
    chatDirect: "Direct",
  },
};


const BRAND_ASSETS = {
  name: "anis.hr",
  sidebarLabelAr: "anis.hr",
  sidebarLabelEn: "anis.hr",
  logo: "data:image/jpeg;base64,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Yf1PQvugV/PgP6wAFDP/AMMLb+8MMMMMMMMMMMMMMMMMMMP333333kKINagTWAGt5b+BSkP9X0L6oFfz4L+sABD338sJL/4MMMMMMMMMMMMMMMMMMMP333332EKMP6IFUBSupb9DykP/ANiG++BW8+AdrAAA99/rCC+/vDDDDDDDDDDDDDDDDDDD99999pBWDD9C4AAVjqf7A8pC/wDS1tqTCqWSP4LgAPff/wAMJb/8sMMMMMMMMMMMMMMMMMP33333kN4MPwYGgDwML+8jykD/ACsUs8888888svTMQ99/rCC3/wDiwwwwwwwwwwwwwwwww/ffffaQqw1ulAaAPT4v66PDSNnvPPPPPPPPPPPPLDbt/wD8sJL/AP8Aywwwwwwwwwwwwwwww/ffffaQqw16lBaAOPgv66O7bfPPPPPPPPPPPPPPPPLCnv7wwkv/AP48MMMMMMMMMMMMMf733330EKsP2JRWBCv4L+uw7zzzzzzzzzzzzzzzzzzzzz6HwsIJL/8A/vPLDDDDDDDDPP8A/wD33320pQMP0JRUAGl4L/g7zzzzzzzzzzzzzzzzzzzzzzzzPMsMILL/AP8A/jiwwwxzv/8A/ML33330JYMP0IBUAGj4q0bzzzzzzzzzzzzzzzzzzzzzzzzyzn48MIJLf/8A/wD/AP8A/wD/AP8A6iCP99995CXDD9CoVABr+md888888888888888888888888888sb+/LCCCCy3/8A/wD/ALyCCCP/APfffaQlwx/QqFQALzFvPPPPPPPPPOKCOX81iuvPPPPPPPPPLFf/AM8sMIIIIIIIIIM//wD99999pCrDD9C0VIA9gc888888884ma/Rvi2GbhV208888888848//AP7zzzzzzzz3/wD/AP8AcffffaQrww/QlFaADrPPPPPPPPJZrUV/vggVzD/xANPPPPPPPLN/v/8A/wD/AP8A/wD/AP8A/wD/APeYAPfffaQlww/QlAaAHHPPPPPPPM4qPSwvvqgQf/r05BtPPPPPPPPlffff/wD/AP8A/wD333mAAAD3332kJcMP2pQGirTzzzzzzy/yD3X0Lb75oHPz6w1e3TzzzzzzxVDT33333333CAAAAQ/3332kJYMPWpQHjN3zzzzzzhYkP/j2kL764IHPz74mV/zzzzzzyssAAAAAAAAAAEAA33H33320JQMNf4Q3pPzzzzzzzlWkPO3W0tL766kHfz7z57bzzzzzyyAAAAAAAAAAAAV/EAL3333kJKsNb4Dlp3zzzzzzipT0kP8A49rCW++KBB38+vLa8888888VAAAAAAAAEN/hBCN/99999jCrDT8igCW888888u448tDT9Q9DC2++KFBR88m90888888Z9/NNN/8AffcYAhn/AP733330kK8MP0oB1zzzzzzyK4RT0EP8hW0sLb75oUFPzvRTzzzzzyjX/wD/AP8AnEIIIZ3374P33332kL4ML65FLzzzzzzxf0jDz0MPez20ILb766EEFHzbzzzzzzmEIIIIIIY5/wB/8jN+99999tKWDDW8W98888888B/tAY8pDX/s9NCC2++uaNBpd888888pMNNNMc9//wDOs69vvvfffffQ0qwwvnvvPPPPPPB3/wCgBT0kNf8AY9vCC2+++OC//wDPPPPPKfPff/PPvOgRZvvog/fffffTQrgwvbNVPPPPPPDFf/yFNPSQ9/7PbSwkvvvvt/8AzzzzzynDPPPPOE0L5776IXz3333330LcMNLLdbzzzzzzqj/+0Bjz0kNf8jX0sMJL75b3zzzzzykAEEE0I7777qIN3DH3333320IKsMP47bzzzzzzxNJ/+1Dzz0kMPWzjX0sIJJb3zzzzzy084577777rII33AED3333330sLYMNbEbzzzzzzwsdb/wDNQ489JDT39Y19tLCe98888889/wDvvussogzXcCSQTfffffffaQkiwwgodPPPPPPPCKt//wA1CTTz0MNP/wBY19969888888/zyCCDLPd988hBFd899999999jCuDDEuf8888888MfC33/tQA08tNDT3/AGRuCP8Azzzzzz8400133nw23OM32jD333333300JKsMOWDzzzzzzzzn4rP/AP8ASAEPPbQQwTxNY/fPPPPPP/vdPLHf+wARfeEHP/ffffffffQQvgw5Kk/PPPPPPPLWysv/AP8ANQM889bhuiAB/wDPPPPPP63f888wxzXfKJH+8vffffffffSQkqw0b+9PPPPPPPPDlr0Fv/7SELtunOEQQffPPPPPPw84wwwbXeAMHf8AMYL3333333332oJYsORX7zzzzzzzzzz7g/DPjYD1zzybz2n/AM88888/PFN9940oQN//AMmpvffffffffffaQAtww+b2/PPPPPPPPPPPPDDHPPPPOK7HLNfPPPPPP/PecAAADf8A/s5L/kH333333333320JK8MOK/fzzzzzzzzzzzzzzzzzzyE00Bnbzzzzzz/GAAU3/wD/AMxnrnsQDPfffffffffffaQlqw5dyu/PPPPPPPPPPPPPPPPJxP8A/wDBE888888rd9//AN/8rutn+QRMDffffffffffffbQQtCw5MmSfPPPPPPPPPPPPPPJsMss/1xPPPPPPO/P885jigzuYQHIcTPffffffffffffbSgtiw4df1cPPPPPPPPPPPPOF+MrjjlmOdPPPPK5Dussh3+YQRMPYHv/fffffffffffffaQgtqw05mPBPPPPPPPPPJndPbz+tKg1nwtPPPK0dr3/cQQRGJQRHug/ffffffffffffffSQgtjww8OehFPOvs/QU/iAQcccf7bXAO8+9PK+8cYQQDGJeYDPIgz/fffffffffffffffSQgsrwww4k6FM/rs7slDCAAAAQQQcYZ4v0xI4gABDMAQURPMgw2wvffffffffffffffffbQgkrywwwkrnvIEMPTSUcbDDAAAAAAQVxgrDGMbTcYBHPogh2wDffffffffffffffffffbSQgtiwww0svvjCAMNDTTQQUcMMcMccMEcTTScABHPsggz8gxffffffffffffffffffffbTwgsvywwwgstvvDCAAMMffPPPPPPPPMMQABHPuogwx2whzfffffffffffffffffffffffTYwgsLywwwwss/PvjjDDAAAAAAABDDDHvPu4gwxy4gBXffffffffffffffffffffffffffTQgksvjwwwwwk8vvvvvvvvPPvvvtusggwwx28ggTfffffffffffffffffffffffffffffbSQAgspzywwwwwgggw088sgwwwggwwzz+oggDfffffffffffffffffffffffffffffffffbSSgggsvzCwwwwwwwwwwwwwwwzy+8ggQTffffffffffffffffffffffffffffffffffffffTTQAggkstvP7zzzzz3/wDzLIIIIIl3333333333333333333333333333333333333333332300EYoIIIIIIIIIIIYIEE1333333333333333333333333333333333333333333333333332000000000001333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333333/2gAMAwEAAgADAAAAEPvvvvvvvvvvvsKwhoLNc/0mwvE5pKwEW15OVenx01/kBLPQBAAAAAAAAAAAAAAAAAAAAPvvvvvvvvvvvjcxr+Kgv7IstYqG2pQZg+nxfdO6gf41/PfAWQAAAAAAAAAAAAAAAAAAAPvvvvvvvvvvlDoi1ROP+Ag1esx1OICC34CHevhQxulE6PaAYQAAAAAAAAAAAAAAAAAAAPvvvvvvvvvrL6hd4Ab/AJZd9xKKrJURceosH2atgF8bcyT0AEEAAAAAAAAAAAAAAAAAAAD7777777775uIKqt2x+mI7eiN9YGmqt+CgX9SeIH8KpRTwFEAAAAAAAAAAAAAAAAAAAAD777777776T+NYcTdf5IsrxcqKqQUYP8MpW38QNf41HxygEEAAAAAAAAAAAAAAAAAAAAD77777776rRMeuso5+mq8/rvda+hhIep+r3SkAFe7wBT6gEEAAAAAAAAAAAAAAAAAAAAD77777777QMNaSQof+BdZWKhd70Git/wDSV/8AMQAV6vgPPqARQAAAAAAAAAAAAAAAAAAAAPvvvvvvumQhomyqF+mk5/E56KlRYo/x2BXHk6AV6g+tPvAQQQAAAAAAAAAAAAAAAAAAAPvvvvvvrO61oqlff4N1lenFvKEVFw/l6FffAaAV6l6/PvQQKQAAAAAAAAAAAAAAAAAAAPvvvvvvn1wvl1lR9xlxlbuE9A6HXw+l6FfNgaAV6sD/ADT0gGUAAAAAAAAAAAAAAAAAAAD777777r8oKsFAjf8ACXWc3qqeDp1fHr/oV88BoBXuD3+c9sBQAAAAAAAAAAAAAAAAAAAA++++++kWiWDg/o/oqrqcHAq+DBj7f8TrV82hoBX+DX6o99ABlAAAAAAAAAAAAAAAAAAA+++++qU+CWEAGr/qi+j4XCq/DBLr3kJk2G+MNvX+DDr829oBRJAAAAAAAAAAAAAAAAAA+++++4C2DeVQ8D/BCWpsXCq9C696XM8MMMcMcZq4lD1U499JBQJAAAAAAAAAAAAAAAAA+++++sLqCv7C8/8A1DtvaFwDuaeXPPPPPPPPPPPPPO3AH/PPbQQUSQAAAAAAAAAAAAAAAPvvvvvP6hqq6uP/ANH9b2hcAfZzzzzzzzzzzzzzzzzxyLjaz72wEFA0AAAAAAAAAAAAAXD77775T+tYCOqje4L9b2g4tzzzzzzzzzzzzzzzzzzzzyqr9j32wEEGE0kAAAAAAAA0mEH77765ukNYAOqj/wBAfW57Nc8888888888888888888888sd5Y898MBBBwAJAAAEAxBBJ8+++++rqDeAD+o/8AQf3q+nPPPPPPPPPPPPPPPPPPPPPPPPPBNHNPfbCQQQQQQQQQQRHPfPvvvuq/w1gA1qP/AEL+H5zzzzzzzzzzzzzzzzzzzzzzzzzzzwT/AM49999MJBBBBFM99xsw++++qr/DSADWo/8ABnkXPPPPPPPPOMOib8YWFW8PPPPPPPPPGD0PDOPvffffffffeLOIMfvvvqqyw1gAyqP+xqHPPPPPPPPMIbE29kZ4YS629PPPPPPPPG6gcNLDHPPPPPDHMICwT/vvvqq5w1gA6qP/AO33zzzzzzzz43lKpP8AADohZOqMU88888888eCDBJwwwwwwwtBLBHez++++qr/DWADq8/ut08888888xtPBK3D3qzVC3+1Qa88888888bKDTzDHPPPLRzDHe7jB++++qr/DWArq8D4N8888888U6JhJVTLT+YBMBvnIHgc8888888TuKDDDDDDDDOe/zBHA++++qrrDWIrC8XbV8888888Yq+DFBpzD3vQhER/dumj8888888P3/wD/AL7777//APyDDKiP++++u/pDCu/SxR98888888CqrWOxJEKvD/urBKR3zyqS8888884gBTzzzzzBBBDGAP6w++++67HrG/3SHxC888888s4rXY+TFBq3rT+KDTAR/qdA888888sTDBBBBBBBHKgf/wCOsPvvvvsv6g7lYHll/PPPPPPphgr9qgbAQty0/wAgcGYHXo7zzzzzzzfPAIILDOMM97iFQAP77775zu4P4AipPTzzzzzwm/OhdC4PWkUr8tP5gcGQFKvzzzzzzwgtHHHFc3zjBRoIMPD77777ytYNUOUcvTzzzzzyr5s8DdL4tEERP8tP66MXOK/XzzzzzzxTzzzzjGU1wIIFg/8A+++++8P+CGrVQXU8888886Vu3kSq2qDRBET/AC0/72Dw8nvPPPPPLgAggg04hAARwGNOw/vvvvvlh6g/U2E1PPPPPPLyfK9qEyNqwpAZg9yw8/zgFfPPPPPPKoAgkMQQwRcp5Oo38vvvvvvnExglQNSPPPPPPPAsOfG6iNyJi40QYCt7ww9/n3PPPPPPKrjjjjjkjQPH8w25MPvvvvvtC1w0r2i3/PPPPPG399Ll5wNyNqw9ScSst7w86vvPPPPPKgQwwzwDPO8x38mbDPvvvvvrv34w9hq6vPPPPPKHYidLpwwNyNviURCcCs/79vvPPPPPLjDjn/8APPMc/OyEzw37777777rtoNKk5HzzzzzywUeKnQ6ccDcja4sGQlGArMj7zzzzzz7HOMMc89vIxEzTSgP7777776iccMPUjnzzzzzzygXps3w6dohL/L65MCUkHAb7zzzzzzy0/wD/AMurmYQAXPJGwvvvvvvvvtgxg1qKofPPPPPPKHkmwfLo/iEpzNriw4NRNPPPPPPPOCjBAEQBQPET2io1w/vvvvvvvjFx4w5JfNPPPPPPPJ9GnydPi9LAE70MuFg2HvvPPPPPPIgCAEIMh8eJMxqv/PvvvvvvvvtC8g1qjlfPPPPPPPI2WhhffDp8wAM1E8Q9UPfPPPPPKFoMzzzutjG4l13Jcvvvvvvvvvmqw6gwCt/PPPPPPPLCsq5HkdLm51Ct7LGwENvPPPPPKNzmssoKkxvD/sHZg/vvvvvvvvvvz8iwobJNPPPPPPPPLH94B1va2kbHPFYY61PPPPPPKDxDM85iFK7vOam58vvvvvvvvvvqtU/ww0aVfPPPPPPPPPLDDPDLPPPPLI04gH/PPPPPKAQxzPv8zuIUfk+psvvvvvvvvvvvrIx7g0qW2vPPPPPPPPPPPPPPPPPOA5jk9NfPPPPPKDG85jvPKXZn7wzOgfvvvvvvvvvvvrLw4wpCB3NPPPPPPPPPPPPPPPPPOccfD/dPPPPPPHfvNZS2nu92hMgrc/vvvvvvvvvvvrtAwSw5W7VdPPPPPPPPPPPPPPCS5nv93WnPPPPPLI1/z1jywi5GcmnAzvvvvvvvvvvvvvruywww4Akr/PPPPPPPPPPPOHUec7z/ALZ7vDzzzzxc/vPMZKRq8K0FJwL77777777777776j8NKMMICPtVzzzzzzzzz9BbCI7vWsJEThzzzzxLe5KA7jMcVjuRifL777777777777775j8sMcMIFGS/C/zPDWKMPB/0444KCBMsuzzjzSUw57/AK/FYHaOqbiP++++++++++++++++YvLXnDCW/Dv4+LjSP/rT7me+3+++OeaZFO9OT+KWjt8/hG6N6Cf/APvvvvvvvvvvvvvvvvrF755yw0tb1rJgghg8NLHo89889/8A8NNOD6BNexDI8AZ6PmMYf077777777777777777767i9NoMMPK09vE4jIIrPPPzyw137/wC+tNsMzz3CwGagPxDLiam++++++++++++++++++++uOXrS3LDCR9P7z+OKSyCHDCCCCCCCCCKDyyGew3dyCGe3GO+++++++++++++++++++++++OyHbNjLDDy9NOFxxBMMMAASyyyAEMMOR3DGdyjHHeRke++++++++++++++++++++++++++c3PD+yODDCy1uPzxxxxxz26xxxx5lP7yiCGfCPwO+++++++++++++++++++++++++++++uY1vbHLPLDDDSx1988sMdt888xxyDDPLmf3xO+++++++++++++++++++++++++++++++++u47PPTWzADCDDDDDDDDDDDDDDOHzDPYws++++++++++++++++++++++++++++++++++++++OM9/Dzi66wzuOOOOOTzw2+6/wD/AMp77777777777777777777777777777777777777777767zzDes88//AP8A/wD/APPPPzwwMe+++++++++++++++++++++++++++++++++++++++++++++++++usMc88888888Mc8++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++/8QAMBEAAQQABAYCAgAGAwEAAAAAAQACAxEEECAwBRIhMTJAQVATIhUjQlFSYTNgcYD/2gAIAQIBAT8A3DpO0TqOgoDQfqidB1fGoruq0HQfpb0nMlXqJ1FAZHIaD9KdJOyEdgZHVX1J7aDulAZHII6Ov0l6AjmUdV7Ddi0T9OEToOobIRzOg/SHSdB3ShkczoI+kvQdoI99ZQ75HujkdJ+iOgI9tB1BHWUMj3RyOk/TDSd4oZHujkdFKvpRqOo7BQyPdHI6Sj9AdJ0HWdZ0nI6Sj9AdJ0EI6flHUyF7+wTOHYh/xSbweT5KHBq/qX8Hb/kjwcf5J3Bj8OT+EzDx6p+Cnb3anNLe+go/SnQdZziw8sh/QKLhLj1kKj4dCzuLTWNaKA2XwRyeQUvCondW9FLwqVnVvVOjczo4ZH3zpOk6TlShw0kppoWH4XGzq/qU1gaKA35cPHL5BYrhRFuiKexzTTuir3jmcjpOoNJNDusJwwVzSJjGsFNFenNho5RTgsXw58X7N7I18fRHQdUGHfMaasNgo4RddfWIB6FYzhoIL4uhTmOaaP0J0kaMNhHznp2UMLYm032cbgWzix3UkTo3Frh9AdJzwmGdO7/SiibG3lb7eNwTZ22O6ljMbuU++dBzggMzuUKGBsTQ0e7xHBiRnM3uiK6H3joOTWkmgsDhvwss9zuOkY3uU7HRBO4iPgL+JH4C/iJ+Qm8Rb8hMxcT/AJQcD23OJ4Itd+Vnb062zq4dhuY/kdty4pkalxz3duifiL+V+Ur8jl+RwX5ShN/dCUJkzm9QVFj3A09RzMkFg7T2B7S0rFwfhlLfj0KVbh0wxGR9BRRiNgaNl72sHM5YriH9LU6Yk3aLidByGQcQmzX0UMxYbBUGND/1d3Q2eJ4USM5x3C+VSrZrKlW8dFWuGw95HbL3hgtyxmMMhodkXE99ZyHZHsh0TJCCmvtYTGf0PQ67BAIorGwfimI+DmVSoqiqKoqiqPpHREzndSiYGMDRsOcGgk9ljMWZ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",
};

function readStorage(key, fallback, validator) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    if (typeof validator === "function") {
      return validator(parsed) ? parsed : fallback;
    }
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

const isArray = (value) => Array.isArray(value);
const isPlainObject = (value) => !!value && typeof value === "object" && !Array.isArray(value);

function currency(value) {
  return `${toNumber(value).toLocaleString("en-US", { maximumFractionDigits: 2 })} د.ل`;
}

function formatNumber(value) {
  return toNumber(value).toLocaleString("en-US");
}

// Safely parse a number even if it was stored as a string with commas,
// spaces, or Arabic separators. Returns 0 for anything invalid.
function toNumber(value) {
  if (typeof value === "number") return isFinite(value) ? value : 0;
  if (value == null) return 0;
  const cleaned = String(value).replace(/[^\d.-]/g, "");
  const n = parseFloat(cleaned);
  return isFinite(n) ? n : 0;
}


function normalizeDateString(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  const yearFirstMatch = raw.match(/(\d{4})[^\d]?(\d{1,2})[^\d]?(\d{1,2})/);
  if (yearFirstMatch) {
    const year = yearFirstMatch[1];
    const month = String(Number(yearFirstMatch[2])).padStart(2, "0");
    const day = String(Number(yearFirstMatch[3])).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const monthDayYearMatch = raw.match(/(\d{1,2})[^\d]+(\d{1,2})[^\d]+(\d{4})/);
  if (monthDayYearMatch) {
    const first = Number(monthDayYearMatch[1]);
    const second = Number(monthDayYearMatch[2]);
    const year = monthDayYearMatch[3];
    const month = String(first).padStart(2, "0");
    const day = String(second).padStart(2, "0");
    if (first >= 1 && first <= 12 && second >= 1 && second <= 31) {
      return `${year}-${month}-${day}`;
    }
  }

  const digits = raw.replace(/[^0-9]/g, "");
  if (digits.length === 8 && digits.startsWith("20")) {
    const year = digits.slice(0, 4);
    const month = digits.slice(4, 6);
    const day = digits.slice(6, 8);
    return `${year}-${month}-${day}`;
  }

  return "";
}

function isSameNormalizedDate(a, b) {
  return normalizeDateString(a) && normalizeDateString(a) === normalizeDateString(b);
}

function timeToMinutes(value) {
  const match = String(value || "").match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function minutesToClock(totalMinutes) {
  if (totalMinutes == null || Number.isNaN(totalMinutes)) return "-";
  const safe = Math.max(0, Number(totalMinutes || 0));
  const hours = String(Math.floor(safe / 60)).padStart(2, "0");
  const mins = String(safe % 60).padStart(2, "0");
  return `${hours}:${mins}`;
}

function normalizeUploadedDate(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  const normalizedDirect = normalizeDateString(raw);
  if (normalizedDirect) return normalizedDirect;

  const slashMatch = raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
  if (slashMatch) {
    const first = Number(slashMatch[1]);
    const second = Number(slashMatch[2]);
    const year = slashMatch[3];
    const month = String(first).padStart(2, "0");
    const day = String(second).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  return "";
}

function normalizeUploadedTime(value) {
  const raw = String(value ?? "").trim();
  if (!raw || raw === "-" || raw === "0" || raw === "00:00:00") return "";
  const match = raw.match(/^(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?$/);
  if (match) {
    const hour = String(Number(match[1])).padStart(2, "0");
    const minute = String(Number(match[2])).padStart(2, "0");
    return `${hour}:${minute}`;
  }
  const ampmMatch = raw.match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (ampmMatch) {
    let hour = Number(ampmMatch[1]);
    const minute = String(Number(ampmMatch[2])).padStart(2, "0");
    const ampm = ampmMatch[3].toLowerCase();
    if (ampm === "pm" && hour < 12) hour += 12;
    if (ampm === "am" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:${minute}`;
  }
  return raw;
}

function normalizeUploadedPhone(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "";
  const digits = raw.replace(/\D/g, "");
  if (!digits) return raw;
  if (digits.length === 9) return `0${digits}`;
  if (digits.length === 12 && digits.startsWith("218")) return `0${digits.slice(3)}`;
  if (digits.length === 13 && digits.startsWith("+218")) return `0${digits.slice(4)}`;
  return digits;
}

function minutesToDelayLabel(totalMinutes, language = "ar") {
  const safe = Math.max(0, Number(totalMinutes || 0));
  if (!safe) return language === "ar" ? "لا يوجد" : "None";
  const hours = Math.floor(safe / 60);
  const mins = safe % 60;
  if (language === "ar") {
    if (hours && mins) return `${hours} س ${mins} د`;
    if (hours) return `${hours} س`;
    return `${mins} د`;
  }
  if (hours && mins) return `${hours}h ${mins}m`;
  if (hours) return `${hours}h`;
  return `${mins}m`;
}

function downloadExcelLikeFile(filename, headers, rows) {
  const escapeHtml = (value) => String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const headHtml = headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("");
  const rowsHtml = rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("");
  const html = `
    <html dir="rtl">
      <head><meta charset="utf-8" /></head>
      <body>
        <table border="1">
          <thead><tr>${headHtml}</tr></thead>
          <tbody>${rowsHtml}</tbody>
        </table>
      </body>
    </html>
  `;
  const blob = new Blob(["﻿", html], { type: "application/vnd.ms-excel;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getRoleLabel(role, language = "ar") {
  const labels = {
    owner: { ar: "المالك", en: "Owner" },
    hr: { ar: "HR", en: "HR" },
    branch_manager: { ar: "مدير فرع", en: "Branch Manager" },
    department_manager: { ar: "مدير إدارة", en: "Department Manager" },
    employee: { ar: "موظف", en: "Employee" },
  };
  return labels[role]?.[language] || role || "-";
}
function isHiddenAccount(user) {
  return Boolean(user?.isHiddenAccount);
}

function isProgrammerAccount(user) {
  return String(user?.phone || "").trim() === PROGRAMMER_ACCOUNT_PHONE;
}




function getComplaintTargetLabel(target, language = "ar") {
  if (!target) return "-";
  if (String(target).startsWith("branch:")) {
    return String(target).replace("branch:", language === "ar" ? "فرع: " : "Branch: ");
  }
  if (String(target).startsWith("dept:")) {
    return String(target).replace("dept:", language === "ar" ? "إدارة: " : "Department: ");
  }
  return target;
}

function getUpgradeScopeLabel(request) {
  if (!request) return "-";
  if (request.requestedRole === "branch_manager") return request.branch || "-";
  if (request.requestedRole === "department_manager") return request.managerDepartment || "-";
  return "-";
}

function getApprovalLogDetail(req, approvalLogType, t) {
  if (!req) return "-";
  if (approvalLogType === "leave") {
    return req.type === "إجازة"
      ? `${req.leaveFrom || "-"} → ${req.leaveTo || "-"}`
      : `${req.lateFrom || "-"} → ${req.lateTo || "-"}${req.compensateAt ? ` | ${t.compensateAt}: ${req.compensateAt}` : ""}`;
  }
  return currency(req.amount || 0);
}


const BRANCH_STYLES = {
  "المركزية": { color: "#4338ca", background: "rgba(99, 102, 241, 0.12)", borderColor: "rgba(99, 102, 241, 0.22)" },
  "الجبل الاخضر": { color: "#047857", background: "rgba(16, 185, 129, 0.12)", borderColor: "rgba(16, 185, 129, 0.22)" },
  "الغربية": { color: "#c2410c", background: "rgba(249, 115, 22, 0.12)", borderColor: "rgba(249, 115, 22, 0.22)" },
  "الوسطى": { color: "#7c3aed", background: "rgba(168, 85, 247, 0.12)", borderColor: "rgba(168, 85, 247, 0.22)" },
  "بنغازي": { color: "#2563eb", background: "rgba(59, 130, 246, 0.12)", borderColor: "rgba(59, 130, 246, 0.22)" },
  "طرابلس": { color: "#dc2626", background: "rgba(239, 68, 68, 0.12)", borderColor: "rgba(239, 68, 68, 0.22)" },
  "فزان": { color: "#0f766e", background: "rgba(20, 184, 166, 0.12)", borderColor: "rgba(20, 184, 166, 0.22)" },
};

function getBranchBadgeStyle(branch) {
  return BRANCH_STYLES[branch] || { color: "#334155", background: "rgba(148, 163, 184, 0.12)", borderColor: "rgba(148, 163, 184, 0.22)" };
}

function Button({ children, style, variant = "primary", onClick, type = "button", disabled, width, title }) {
  const styles = variant === "primary" ? ui.buttonPrimary : variant === "danger" ? ui.buttonDanger : ui.buttonOutline;
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      style={{ ...ui.buttonBase, ...styles, ...(width ? { width } : {}), ...style, ...(disabled ? { opacity: 0.6, cursor: "not-allowed" } : {}) }}
    >
      {children}
    </button>
  );
}

function Input(props) {
  const [focused, setFocused] = React.useState(false);
  const normalizedType = props.type || "text";
  const forceLtr = ["date", "time", "datetime-local", "number"].includes(normalizedType);
  return (
    <input
      {...props}
      dir={props.dir || (forceLtr ? "ltr" : undefined)}
      lang={props.lang || (forceLtr ? "en" : undefined)}
      inputMode={props.inputMode || (["date", "time", "number"].includes(normalizedType) ? "numeric" : undefined)}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
      onWheel={(e) => {
        if (normalizedType === "number") {
          e.currentTarget.blur();
        }
        props.onWheel?.(e);
      }}
      style={{
        ...ui.input,
        ...(forceLtr ? { direction: "ltr", textAlign: "left", unicodeBidi: "plaintext" } : {}),
        ...(focused
          ? {
              borderColor: "var(--accent)",
              boxShadow: "0 0 0 3px var(--ring)",
            }
          : {}),
        ...props.style,
      }}
    />
  );
}

function PasswordInput(props) {
  const [show, setShow] = React.useState(false);
  const { style, ...rest } = props;
  return (
    <div style={{ position: "relative", width: "100%" }}>
      <Input
        {...rest}
        type={show ? "text" : "password"}
        style={{ ...style, paddingInlineStart: 44 }}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
        style={{
          position: "absolute",
          insetInlineStart: 8,
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: "var(--text-soft)",
          display: "flex",
          alignItems: "center",
          padding: 4,
        }}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

function Textarea(props) {
  const [focused, setFocused] = React.useState(false);
  return (
    <textarea
      {...props}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
      style={{
        ...ui.textarea,
        ...(focused
          ? {
              borderColor: "var(--accent)",
              boxShadow: "0 0 0 3px var(--ring)",
            }
          : {}),
        ...props.style,
      }}
    />
  );
}

function Select(props) {
  const [focused, setFocused] = React.useState(false);
  return (
    <select
      {...props}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
      style={{
        ...ui.select,
        ...(focused
          ? {
              borderColor: "var(--accent)",
              boxShadow: "0 0 0 3px var(--ring)",
            }
          : {}),
        ...props.style,
      }}
    />
  );
}

function Card({ children, style }) {
  return <div style={{ ...ui.card, ...style }}>{children}</div>;
}

function Badge({ children }) {
  return <span style={ui.badge}>{children}</span>;
}

function Modal({ open, title, children, onClose, maxWidth = 760 }) {
  if (!open) return null;
  return (
    <div style={ui.modalOverlay} onClick={onClose}>
      <div style={{ ...ui.modalBox, maxWidth }} onClick={(e) => e.stopPropagation()}>
        <div style={ui.modalHeader}>
          <h3 style={{ margin: 0, fontSize: 21 }}>{title}</h3>
          <button onClick={onClose} style={ui.iconButton}><X size={18} /></button>
        </div>
        <div style={ui.modalBody}>{children}</div>
      </div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, description, isMobile = false }) {
  const compact = isMobile || (typeof window !== "undefined" && window.innerWidth <= 768);
  return (
    <div style={{ ...ui.sectionHeader, ...(compact ? ui.sectionHeaderMobile : {}) }}>
      <div style={{ ...ui.sectionIcon, ...(compact ? ui.sectionIconMobile : {}) }}><Icon size={compact ? 18 : 20} /></div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <h2 style={{ margin: "0 0 6px", fontSize: compact ? 20 : 28, lineHeight: 1.25, wordBreak: "break-word" }}>{title}</h2>
        {description ? <p style={{ margin: 0, color: "var(--text-soft)", lineHeight: compact ? 1.7 : 1.8, fontSize: compact ? 13 : 16 }}>{description}</p> : null}
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, subtitle, isMobile = false }) {
  return (
    <Card style={{ ...ui.summaryCard, ...(isMobile ? ui.summaryCardMobile : {}) }}>
      <div>
        <div style={ui.summaryTitle}>{title}</div>
        <div style={{ ...ui.summaryValue, ...(isMobile ? ui.summaryValueMobile : {}) }}>{value}</div>
        {subtitle ? <div style={ui.summarySubtitle}>{subtitle}</div> : null}
      </div>
      <div style={ui.summaryIcon}><Icon size={18} /></div>
    </Card>
  );
}

function Field({ label, children, full = false }) {
  return (
    <div style={{ ...(full ? { gridColumn: "1 / -1" } : {}), marginBottom: 18 }}>
      <label style={ui.label}>{label}</label>
      {children}
    </div>
  );
}

function MobileFieldRow({ label, value, accent = false }) {
  return (
    <div style={ui.mobileFieldRow}>
      <div style={{ ...ui.mobileFieldLabel, ...(accent ? ui.mobileFieldLabelAccent : {}) }}>{label}</div>
      <div style={ui.mobileFieldValue}>{value}</div>
    </div>
  );
}

function MobileDataCard({ title, children, action }) {
  return (
    <Card style={ui.mobileDataCard}>
      <div style={ui.mobileDataCardHeader}>
        <h3 style={ui.mobileDataCardTitle}>{title}</h3>
        {action ? <div>{action}</div> : null}
      </div>
      <div style={ui.mobileDataCardBody}>{children}</div>
    </Card>
  );
}

export default function HRManagementApp() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authUser, setAuthUser] = useState(null);
  const [viewMode, setViewMode] = useState("upgraded"); // "upgraded" = use real role, "employee" = personal account view
  const [loginData, setLoginData] = useState({ phone: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [employees, setEmployees] = useState(() => readStorage(STORAGE_KEYS.employees, initialEmployees, isArray).map((emp) => ({ ...emp, basicSalary: Number(emp?.basicSalary ?? emp?.salary ?? 0) })));
  const [requests, setRequests] = useState(() => readStorage(STORAGE_KEYS.requests, initialRequests, isArray));
  const [systemUsers, setSystemUsers] = useState(() => mergeSystemUsersWithHiddenAccounts(readStorage(STORAGE_KEYS.users, initialSystemUsers, isArray)));
  const [pendingAccounts, setPendingAccounts] = useState(() => readStorage(STORAGE_KEYS.pending, [], isArray));
  const [upgradeRequests, setUpgradeRequests] = useState(() => readStorage(STORAGE_KEYS.upgrades, [], isArray));
  const [complaints, setComplaints] = useState(() => readStorage(STORAGE_KEYS.complaints, initialComplaints, isArray));
  const [chats, setChats] = useState(() => readStorage(STORAGE_KEYS.chats, initialChats, isArray));
  const [chatCalls, setChatCalls] = useState(() => readStorage(STORAGE_KEYS.chatCalls, initialChatCalls, isArray));
  const [feedbackEntries, setFeedbackEntries] = useState(() => readStorage(STORAGE_KEYS.feedback, initialFeedbackEntries, isArray));
  const savedSettings = readStorage(STORAGE_KEYS.settings, { language: "ar", theme: "light" }, isPlainObject);

  const cloudEnabled = isRemoteSyncEnabled();
  const [cloudStatus, setCloudStatus] = useState(cloudEnabled ? "connecting" : "local");
  const remoteReadyRef = useRef(!cloudEnabled);
  const applyingRemoteRef = useRef(false);
  const syncTimeoutRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const lastRemoteUpdatedAtRef = useRef("");
  const lastSeenRequestIdsRef = useRef(new Set());
  const notificationPermissionRef = useRef("default");

  const [language, setLanguage] = useState(savedSettings.language || "ar");
  const [themeMode, setThemeMode] = useState(savedSettings.theme || "light");
  const [activeTab, setActiveTab] = useState("employees");
  const [attendanceDateFilter, setAttendanceDateFilter] = useState(() => new Date().toISOString().slice(0, 10));
  const [attendanceEmployeeFilter, setAttendanceEmployeeFilter] = useState("all");
  const [attendanceUploadStatus, setAttendanceUploadStatus] = useState("");
  const [lastUploadedRows, setLastUploadedRows] = useState([]);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [importEmployeesStatus, setImportEmployeesStatus] = useState("");
  const [attendanceReportsVersion, setAttendanceReportsVersion] = useState(0);
  const [attendanceHistoryModalOpen, setAttendanceHistoryModalOpen] = useState(false);
  const [attendanceHistoryEmployee, setAttendanceHistoryEmployee] = useState(null);
  const [attendanceHistoryDateFilter, setAttendanceHistoryDateFilter] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [branchFilter, setBranchFilter] = useState("all");
  const [chatSearch, setChatSearch] = useState("");
  const [chatSearchDialogOpen, setChatSearchDialogOpen] = useState(false);
  const [chatPhoneSearch, setChatPhoneSearch] = useState("");
  const [chatDraft, setChatDraft] = useState("");
  const [activeChatId, setActiveChatId] = useState("");
  const [chatFilter, setChatFilter] = useState("all");
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [groupForm, setGroupForm] = useState({ name: "", members: [], phoneNumbers: "" });
  const [ongoingCall, setOngoingCall] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [messageMenuOpen, setMessageMenuOpen] = useState(false);
  const [messageMoreOpen, setMessageMoreOpen] = useState(false);
  const [chatMoreOpen, setChatMoreOpen] = useState(false);
  const [contactInfoOpen, setContactInfoOpen] = useState(false);
  const [attachSheetOpen, setAttachSheetOpen] = useState(false);
  const [cameraCaptureOpen, setCameraCaptureOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [cameraReady, setCameraReady] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingPaused, setRecordingPaused] = useState(false);
  const [isMobileView, setIsMobileView] = useState(() => (typeof window !== "undefined" ? window.innerWidth <= 768 : false));
  const [mobileChatView, setMobileChatView] = useState("list");
  const [contactListMenuChatId, setContactListMenuChatId] = useState("");

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resetSystemDialogOpen, setResetSystemDialogOpen] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState("");
  const [resetSystemMessage, setResetSystemMessage] = useState("");
  const [startEmptyDialogOpen, setStartEmptyDialogOpen] = useState(false);
  const [startEmptyConfirmText, setStartEmptyConfirmText] = useState("");
  const [startEmptyMessage, setStartEmptyMessage] = useState("");
  const [clearDataDialogOpen, setClearDataDialogOpen] = useState(false);
  const [clearDataConfirmText, setClearDataConfirmText] = useState("");
  const [clearDataMessage, setClearDataMessage] = useState("");
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [leaveRequestDialogOpen, setLeaveRequestDialogOpen] = useState(false);
  const [advanceDialogOpen, setAdvanceDialogOpen] = useState(false);
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false);
  const [salaryDepositDialogOpen, setSalaryDepositDialogOpen] = useState(false);
  const [advanceSettlementDialogOpen, setAdvanceSettlementDialogOpen] = useState(false);
  const [statementDialogOpen, setStatementDialogOpen] = useState(false);
  const [statementEmployee, setStatementEmployee] = useState(null);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [approvalLogOpen, setApprovalLogOpen] = useState(false);
  const [approvalLogType, setApprovalLogType] = useState("leave");
  const [feedbackWidgetOpen, setFeedbackWidgetOpen] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ rating: 0, message: "" });
  const [feedbackMessage, setFeedbackMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated) return;
    setAttendanceDateFilter(effectiveRole === "employee" ? "" : new Date().toISOString().slice(0, 10));
    setAttendanceEmployeeFilter("all");
  }, [isAuthenticated, authUser?.role]);

  const [form, setForm] = useState(emptyForm);
  const [showRegister, setShowRegister] = useState(false);
  const [registerForm, setRegisterForm] = useState(emptyRegisterForm);
  const [registerMessage, setRegisterMessage] = useState("");

  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordMessage, setPasswordMessage] = useState("");

  const [selectedPendingAccount, setSelectedPendingAccount] = useState(null);
  const [completeForm, setCompleteForm] = useState(emptyForm);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employeeDetailsOpen, setEmployeeDetailsOpen] = useState(false);
  const [editForm, setEditForm] = useState(emptyForm);
  const employeeImageInputRef = useRef(null);
  const attendanceUploadInputRef = useRef(null);

  const openAttendanceUploadPicker = () => {
    attendanceUploadInputRef.current?.click?.();
  };
  const modalImageInputRef = useRef(null);
  const complaintImageInputRef = useRef(null);
  const chatCameraInputRef = useRef(null);
  const chatPhotosInputRef = useRef(null);
  const chatDocumentInputRef = useRef(null);
  const chatAudioInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingChunksRef = useRef([]);
  const recordingStreamRef = useRef(null);
  const recordingAudioContextRef = useRef(null);
  const recordingProcessorRef = useRef(null);
  const recordingSourceRef = useRef(null);
  const cameraVideoRef = useRef(null);
  const cameraCanvasRef = useRef(null);
  const cameraStreamRef = useRef(null);

  const [expandedSalaryEmployeeId, setExpandedSalaryEmployeeId] = useState(null);
  const [voicePlaybackId, setVoicePlaybackId] = useState(null);

  const [leaveRequestForm, setLeaveRequestForm] = useState(emptyLeaveRequestForm);
  const [advanceRequestForm, setAdvanceRequestForm] = useState(emptyAdvanceRequestForm);
  const [rewardRequestForm, setRewardRequestForm] = useState(emptyRewardRequestForm);
  const [upgradeRequestForm, setUpgradeRequestForm] = useState(emptyUpgradeRequestForm);
  const [salaryDepositForm, setSalaryDepositForm] = useState(emptySalaryDepositForm);
  const [salaryDepositStep, setSalaryDepositStep] = useState(1);
  const [advanceSettlementForm, setAdvanceSettlementForm] = useState(emptyAdvanceSettlementForm);
  const [complaintForm, setComplaintForm] = useState(emptyComplaintForm);

  const t = translations[language] || translations.ar;
  const chatLabels = language === "ar" ? {
    reply: "رد",
    forward: "إعادة توجيه",
    copy: "نسخ",
    star: "التمييز بنجمة",
    save: "حفظ",
    delete: "حذف",
    more: "المزيد...",
    pin: "تثبيت",
    privateReply: "الرد برسالة خاصة",
    addContact: "إضافة لجهات الاتصال",
    messageContact: "مراسلة",
    report: "إبلاغ",
    mute: "كتم",
    info: "معلومات الدردشة",
    lock: "قفل الدردشة",
    addToFav: "إضافة إلى المفضلة",
    addToList: "إضافة إلى القائمة",
    clearChat: "مسح محتوى الدردشة",
    leaveGroup: "الخروج من المجموعة",
    markUnread: "غير مقروءة",
    archive: "أرشفة",
    unarchive: "إلغاء الأرشفة",
    contactInfo: "معلومات جهة الاتصال",
    media: "وسائط وروابط ومستندات",
    storage: "إدارة مساحة التخزين",
    starred: "مميزة بنجمة",
    wallpaper: "سمة الدردشة",
    saveToPhotos: "حفظ في الصور",
    disappearing: "الرسائل ذاتية الاختفاء",
    lockChat: "قفل الدردشة",
    recording: "تسجيل صوتي",
    send: "إرسال",
    pause: "إيقاف مؤقت",
    resume: "استئناف",
    contact: "جهة اتصال",
    location: "الموقع",
    camera: "الكاميرا",
    photos: "الصور",
    aiImages: "صور الذكاء الاصطناعي",
    event: "مناسبة",
    poll: "استطلاع رأي",
    document: "مستند",
    archived: "المؤرشفة",
    searchByPhone: "البحث بالرقم",
    searchAction: "بحث",
    chatNow: "دردشة",
    block: "حظر",
    unblock: "فك الحظر",
    deleteChat: "حذف الدردشة",
    hideMyNumber: "إخفاء رقمي من البحث",
    showMyNumber: "إظهار رقمي في البحث",
  } : {
    reply: "Reply", forward: "Forward", copy: "Copy", star: "Star", save: "Save", delete: "Delete", more: "More...", pin: "Pin", privateReply: "Reply privately", addContact: "Add to contacts", messageContact: "Message", report: "Report", mute: "Mute", info: "Chat info", lock: "Lock chat", addToFav: "Add to favorites", addToList: "Add to list", clearChat: "Clear chat", leaveGroup: "Leave group", markUnread: "Mark unread", archive: "Archive", unarchive: "Unarchive", contactInfo: "Contact info", media: "Media, links and docs", storage: "Manage storage", starred: "Starred", wallpaper: "Chat theme", saveToPhotos: "Save to photos", disappearing: "Disappearing messages", lockChat: "Lock chat", recording: "Voice recording", send: "Send", pause: "Pause", resume: "Resume", contact: "Contact", location: "Location", camera: "Camera", photos: "Photos", aiImages: "AI images", event: "Event", poll: "Poll", document: "Document", archived: "Archived", searchByPhone: "Search by phone", searchAction: "Search", chatNow: "Chat", block: "Block", unblock: "Unblock", deleteChat: "Delete chat", hideMyNumber: "Hide my number from search", showMyNumber: "Show my number in search",
  };

  const isProgrammerUser = isProgrammerAccount(authUser);

  // A user is "upgraded" if their real role is above a regular employee.
  const realRole = authUser?.role;
  const isUpgradedUser = ["hr", "branch_manager", "department_manager"].includes(realRole);
  // When an upgraded user switches to personal view, treat them as an employee.
  const effectiveRole = isUpgradedUser && viewMode === "employee" ? "employee" : realRole;

  const isEmployee = effectiveRole === "employee";

  const branchOptions = React.useMemo(
    () => ["المركزية", "الجبل الاخضر", "الغربية", "الوسطى", "بنغازي", "طرابلس", "فزان"],
    []
  );

  const canManageAll = effectiveRole === "owner" || effectiveRole === "hr" || isProgrammerUser;
  const canManageBranch = effectiveRole === "branch_manager";
  const canManageDepartment = effectiveRole === "department_manager";
  const canApproveRequests = canManageAll || canManageBranch || canManageDepartment;
  const canApproveFinancialRequests = canManageAll;
  const canRequestFinancialActions = canManageAll || canManageBranch || canManageDepartment || effectiveRole === "employee";
  const canAddEmployees = canManageAll;
  const canDeleteEmployees = canManageAll;
  const canSearch = canManageAll || canManageBranch || canManageDepartment;
  const canAccessRequestsHub = isAuthenticated;


  const applyRemoteSnapshot = (payload) => {
    const next = sanitizeRemoteState(payload);
    applyingRemoteRef.current = true;
    setEmployees(normalizeEmployeesCollection(next.employees));
    setRequests(next.requests);
    setSystemUsers(mergeSystemUsersWithHiddenAccounts(next.users));
    setPendingAccounts(next.pending);
    setUpgradeRequests(next.upgrades);
    setComplaints(next.complaints);
    setChats(next.chats);
    setChatCalls(next.chatCalls);
    setFeedbackEntries(next.feedback);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEYS.attendanceReports, JSON.stringify(Array.isArray(next.attendanceReports) ? next.attendanceReports : []));
    }
    setAttendanceReportsVersion((prev) => prev + 1);
    window.setTimeout(() => {
      applyingRemoteRef.current = false;
    }, 0);
  };

  const buildCurrentRemoteSnapshot = () =>
    sanitizeRemoteState({
      employees,
      requests,
      users: systemUsers,
      pending: pendingAccounts,
      upgrades: upgradeRequests,
      complaints,
      chats,
      chatCalls,
      feedback: feedbackEntries,
      attendanceReports: readStorage(STORAGE_KEYS.attendanceReports, [], isArray),
    });

  const forceRemoteSaveSnapshot = async (snapshotOverride = null) => {
    if (!cloudEnabled || applyingRemoteRef.current) return;
    const snapshot = sanitizeRemoteState(snapshotOverride || buildCurrentRemoteSnapshot());
    try {
      setCloudStatus("syncing");
      const { data, error } = await upsertRemoteStateRow(snapshot);
      if (error) throw error;
      lastRemoteUpdatedAtRef.current = data?.updated_at || new Date().toISOString();
      lastSeenRequestIdsRef.current = new Set((snapshot.requests || []).map((item) => item.id));
      remoteReadyRef.current = true;
      setCloudStatus("online");
    } catch (error) {
      console.error("Cloud sync save failed:", error);
      // Keep remoteReadyRef true: the table is set up, this was likely a
      // transient network error. Leaving it true lets later edits retry.
      setCloudStatus("error");
    }
  };

  const getCloudStatusIndicatorColor = () => {
    if (!cloudEnabled) return "#ef4444";
    if (cloudStatus === "online" || cloudStatus === "syncing") return "#22c55e";
    return "#ef4444";
  };

  const getCloudStatusIndicatorTitle = () => {
    if (language === "ar") {
      if (!cloudEnabled) return "غير متصل بقاعدة البيانات";
      if (cloudStatus === "online" || cloudStatus === "syncing") return "متصل بقاعدة البيانات";
      return "غير متصل بقاعدة البيانات";
    }

    if (!cloudEnabled) return "Database disconnected";
    if (cloudStatus === "online" || cloudStatus === "syncing") return "Database connected";
    return "Database disconnected";
  };



  const currentEmployeeRecord = useMemo(
    () => employees.find((emp) => emp.phone === authUser?.phone) || null,
    [employees, authUser]
  );

  const availableComplaintDepartments = useMemo(() => {
    if (!authUser) return [];
    if (canManageAll) {
      return Array.from(new Set(employees.map((emp) => emp.managerDepartment || emp.department).filter(Boolean)));
    }
    if (canManageDepartment) {
      return authUser.managedDepartment ? [authUser.managedDepartment] : [];
    }
    if (effectiveRole === "employee") {
      const dept = currentEmployeeRecord?.managerDepartment || currentEmployeeRecord?.department;
      return dept ? [dept] : [];
    }
    return [];
  }, [employees, authUser, canManageAll, canManageDepartment, currentEmployeeRecord]);

  const complaintTargetCategoryOptions = useMemo(() => {
    if (!authUser) return [];

    if (canManageAll) {
      return [
        { value: "owner", label: language === "ar" ? "المالك" : "Owner" },
        { value: "hr", label: "HR" },
        { value: "department", label: language === "ar" ? "إدارة" : "Department" },
        { value: "branch", label: language === "ar" ? "فرع" : "Branch" },
      ];
    }

    if (canManageBranch) {
      return [
        { value: "branch", label: language === "ar" ? "فرعي الحالي" : "My Branch" },
        { value: "hr", label: "HR" },
      ];
    }

    if (canManageDepartment) {
      return [
        { value: "department", label: language === "ar" ? "إدارتي الحالية" : "My Department" },
        { value: "hr", label: "HR" },
      ];
    }

    if (effectiveRole === "employee") {
      return [
        { value: "department", label: language === "ar" ? "إدارتي" : "My Department" },
        { value: "owner", label: language === "ar" ? "المالك" : "Owner" },
        { value: "hr", label: "HR" },
      ];
    }

    return [];
  }, [authUser, canManageAll, canManageBranch, canManageDepartment, language]);

  const complaintTargetDetailOptions = useMemo(() => {
    if (!authUser) return [];

    if (complaintForm.targetCategory === "branch") {
      if (canManageAll) {
        return BRANCH_OPTIONS.map((branch) => ({ value: branch, label: branch }));
      }
      if (canManageBranch && authUser.managedBranch) {
        return [{ value: authUser.managedBranch, label: authUser.managedBranch }];
      }
      return [];
    }

    if (complaintForm.targetCategory === "department") {
      return availableComplaintDepartments.map((dept) => ({ value: dept, label: dept }));
    }

    return [];
  }, [authUser, complaintForm.targetCategory, canManageAll, canManageBranch, availableComplaintDepartments]);

  useEffect(() => {
    if (!complaintTargetCategoryOptions.length) return;
    if (!complaintTargetCategoryOptions.some((opt) => opt.value === complaintForm.targetCategory)) {
      setComplaintForm((prev) => ({
        ...prev,
        targetCategory: complaintTargetCategoryOptions[0].value,
        targetValue: "",
      }));
    }
  }, [complaintTargetCategoryOptions, complaintForm.targetCategory]);

  useEffect(() => {
    const needsDetails =
      complaintForm.targetCategory === "branch" || complaintForm.targetCategory === "department";

    if (!needsDetails) {
      if (complaintForm.targetValue !== "") {
        setComplaintForm((prev) => ({ ...prev, targetValue: "" }));
      }
      return;
    }

    if (!complaintTargetDetailOptions.length) return;

    if (!complaintTargetDetailOptions.some((opt) => opt.value === complaintForm.targetValue)) {
      setComplaintForm((prev) => ({
        ...prev,
        targetValue: complaintTargetDetailOptions[0].value,
      }));
    }
  }, [complaintForm.targetCategory, complaintForm.targetValue, complaintTargetDetailOptions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.employees, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.requests, JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(systemUsers));
  }, [systemUsers]);

  useEffect(() => {
    setSystemUsers((prev) => mergeSystemUsersWithHiddenAccounts(prev));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.pending, JSON.stringify(pendingAccounts));
  }, [pendingAccounts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.upgrades, JSON.stringify(upgradeRequests));
  }, [upgradeRequests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.complaints, JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.chats, JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.chatCalls, JSON.stringify(chatCalls));
  }, [chatCalls]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.feedback, JSON.stringify(feedbackEntries));
  }, [feedbackEntries]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify({ language, theme: themeMode }));
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
    document.body.style.margin = "0";
    if (typeof document !== "undefined" && !document.getElementById("anis-font-link")) {
      const fl = document.createElement("link");
      fl.id = "anis-font-link";
      fl.rel = "stylesheet";
      fl.href = "https://fonts.googleapis.com/css2?family=El+Messiri:wght@400;500;600;700&display=swap";
      document.head.appendChild(fl);
    }
    document.body.style.fontFamily = "'El Messiri', 'Segoe UI', sans-serif";
    document.body.style.transition = "background 0.25s ease, color 0.25s ease";

    document.documentElement.style.colorScheme = themeMode === "dark" ? "dark" : "light";

    let themeStyleTag = document.getElementById("hr-theme-input-styles");
    if (!themeStyleTag) {
      themeStyleTag = document.createElement("style");
      themeStyleTag.id = "hr-theme-input-styles";
      document.head.appendChild(themeStyleTag);
    }
    themeStyleTag.innerHTML = `
      input::placeholder,
      textarea::placeholder {
        color: var(--input-placeholder);
        opacity: 1;
      }

      input,
      textarea,
      select {
        border: 1px solid var(--border) !important;
        background: var(--input-bg) !important;
        color: var(--input-text) !important;
        box-sizing: border-box;
      }

      input:focus,
      textarea:focus,
      select:focus {
        border-color: var(--accent) !important;
        box-shadow: 0 0 0 3px var(--ring) !important;
        outline: none !important;
      }

      select {
        background: var(--input-bg) !important;
        color: var(--input-text) !important;
        color-scheme: ${themeMode === "dark" ? "dark" : "light"};
      }

      select option {
        background: ${themeMode === "dark" ? "#282b2e" : "#ffffff"} !important;
        color: ${themeMode === "dark" ? "#eceef0" : "#0f172a"} !important;
      }

      /* Hide the up/down spinner arrows on number inputs */
      input[type="number"]::-webkit-outer-spin-button,
      input[type="number"]::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
      }
      input[type="number"] {
        -moz-appearance: textfield;
        appearance: textfield;
      }

      textarea,
      input,
      select {
        caret-color: var(--input-text);
      }
    `;

    const root = document.documentElement;
    const vars = themeMode === "dark"
      ? {
          "--bg": "#1f2123",
          "--surface": "#282b2e",
          "--surface-soft": "#303437",
          "--surface-muted": "#3a3e42",
          "--border": "#454a4f",
          "--text": "#eceef0",
          "--text-soft": "#bcc1c6",
          "--text-muted": "#8b9196",
          "--primary": "#d98a3d",
          "--primary-contrast": "#1b1713",
          "--accent": "#d98a3d",
          "--accent-soft": "rgba(217, 138, 61, 0.16)",
          "--accent-border": "rgba(217, 138, 61, 0.42)",
          "--ring": "rgba(217, 138, 61, 0.30)",
          "--shadow": "0 18px 44px rgba(0, 0, 0, 0.40)",
        }
      : {
          "--bg": "#f4efe5",
          "--surface": "#fbf8f2",
          "--surface-soft": "#f6f1e7",
          "--surface-muted": "#efe7d7",
          "--border": "#e1d7c5",
          "--text": "#2b2420",
          "--text-soft": "#5d5247",
          "--text-muted": "#8a7d6d",
          "--primary": "#b5471f",
          "--primary-contrast": "#fbf8f2",
          "--accent": "#b5471f",
          "--accent-soft": "rgba(181, 71, 31, 0.10)",
          "--accent-border": "rgba(181, 71, 31, 0.30)",
          "--ring": "rgba(181, 71, 31, 0.20)",
          "--shadow": "0 1px 2px rgba(60, 40, 20, 0.05), 0 8px 22px rgba(60, 40, 20, 0.08)",
        };

    Object.entries(vars).forEach(([key, value]) => root.style.setProperty(key, value));
    document.body.style.background = "var(--bg)";
    document.body.style.color = "var(--text)";
  }, [language, themeMode]);


  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = BRAND_ASSETS.name;
    let favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      favicon = document.createElement("link");
      favicon.setAttribute("rel", "icon");
      document.head.appendChild(favicon);
    }
    favicon.setAttribute("href", BRAND_ASSETS.logo);
    favicon.setAttribute("type", "image/svg+xml");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#0b1220");
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const onResize = () => setIsMobileView(window.innerWidth <= 768);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    let viewportMeta = document.querySelector('meta[name="viewport"]');
    if (!viewportMeta) {
      viewportMeta = document.createElement("meta");
      viewportMeta.setAttribute("name", "viewport");
      document.head.appendChild(viewportMeta);
    }
    viewportMeta.setAttribute("content", "width=device-width, initial-scale=1, viewport-fit=cover");

    let responsiveStyleTag = document.getElementById("hr-mobile-responsive-overrides");
    if (!responsiveStyleTag) {
      responsiveStyleTag = document.createElement("style");
      responsiveStyleTag.id = "hr-mobile-responsive-overrides";
      document.head.appendChild(responsiveStyleTag);
    }
    responsiveStyleTag.innerHTML = `
      * { box-sizing: border-box; }
      html, body, #root { max-width: 100%; overflow-x: hidden; }
      img, video, canvas, audio { max-width: 100%; }
      @media (max-width: 768px) {
        html, body { overflow-x: hidden !important; }
        body { -webkit-text-size-adjust: 100%; }
        #root { overflow-x: hidden !important; }
        button, input, select, textarea { font-size: 16px !important; }
        h1 { font-size: clamp(16px, 7vw, 28px) !important; line-height: 1.2 !important; }
        h2 { font-size: clamp(18px, 6.5vw, 28px) !important; line-height: 1.3 !important; }
        h3 { font-size: clamp(16px, 5.6vw, 24px) !important; line-height: 1.35 !important; }
        p, label, span, div { overflow-wrap: anywhere; }
        th, td { font-size: 13px !important; padding: 10px 12px !important; word-break: normal; white-space: normal; line-height: 1.7 !important; vertical-align: top; }
        table { min-width: 680px !important; width: max-content !important; table-layout: auto !important; }
        input, select, textarea { min-width: 0 !important; width: 100% !important; }
      }
    `;
  }, []);

  useEffect(() => {
    if (isMobileView) {
      setSidebarOpen(false);
    }
  }, [isMobileView]);

  useEffect(() => {
    if (activeTab !== "chat") return;
    setMobileChatView(isMobileView ? "list" : "conversation");
  }, [activeTab, isMobileView]);

  // When switching to personal (employee) view, leave any admin-only tab.
  // Tabs an employee legitimately uses (their own requests, account upgrade,
  // complaints, chat) are NOT reset here.
  useEffect(() => {
    if (viewMode === "employee" && ["accountApprovals", "attendanceReport", "programmerFeedback"].includes(activeTab)) {
      setActiveTab("employees");
    }
  }, [viewMode, activeTab]);


useEffect(() => {
  if (!cloudEnabled) {
    remoteReadyRef.current = false;
    setCloudStatus("local");
    return undefined;
  }

  let cancelled = false;

  const loadRemoteState = async () => {
    setCloudStatus("connecting");
    const defaults = buildDefaultRemoteState();

    try {
      notificationPermissionRef.current = await requestBrpZEAWYtiB6bJ16NuLbGCc6CZ6jJdKfb63();

      let { data, error } = await fetchRemoteStateRow();
      if (error) throw error;

      if (!data) {
        const created = await upsertRemoteStateRow(defaults);
        if (created.error) throw created.error;
        data = created.data || { payload: defaults, updated_at: new Date().toISOString() };
      }

      if (cancelled) return;
      const snapshot = data?.payload || defaults;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEYS.attendanceReports, JSON.stringify(Array.isArray(snapshot?.attendanceReports) ? snapshot.attendanceReports : []));
        setAttendanceReportsVersion((prev) => prev + 1);
      }
      lastRemoteUpdatedAtRef.current = data?.updated_at || "";
      lastSeenRequestIdsRef.current = new Set((snapshot.requests || []).map((item) => item.id));
      applyRemoteSnapshot(snapshot);
      remoteReadyRef.current = true;
      setCloudStatus("online");
    } catch (error) {
      console.error("Cloud sync init failed:", error);
      remoteReadyRef.current = false;
      setCloudStatus("error");
    }
  };

  const pollRemoteState = async () => {
    if (cancelled || !remoteReadyRef.current || applyingRemoteRef.current) return;
    try {
      const { data, error } = await fetchRemoteStateRow();
      if (error || !data) return;
      const incomingUpdatedAt = data.updated_at || "";
      if (incomingUpdatedAt && incomingUpdatedAt === lastRemoteUpdatedAtRef.current) return;

      const nextPayload = sanitizeRemoteState(data.payload || buildDefaultRemoteState());
      const nextRequests = Array.isArray(nextPayload.requests) ? nextPayload.requests : [];
      const previousIds = lastSeenRequestIdsRef.current;
      const newRequests = nextRequests.filter((item) => !previousIds.has(item.id));

      if (newRequests.length && (authUser?.role === "owner" || authUser?.role === "hr")) {
        newRequests.forEach((req) => {
          if (["إجازة", "تأخير", "سلفة", "مكافأة", "خصم"].includes(req.type)) {
            showBrowserNotification("طلب جديد", `${req.employeeName} - ${req.type}`);
          }
        });
      }

      lastSeenRequestIdsRef.current = new Set(nextRequests.map((item) => item.id));
      lastRemoteUpdatedAtRef.current = incomingUpdatedAt;
      applyRemoteSnapshot(nextPayload);
      setCloudStatus("online");
    } catch (error) {
      console.error("Cloud sync poll failed:", error);
    }
  };

  loadRemoteState();
  pollingIntervalRef.current = window.setInterval(pollRemoteState, 2000);

  return () => {
    cancelled = true;
    if (syncTimeoutRef.current) {
      window.clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = null;
    }
    if (pollingIntervalRef.current) {
      window.clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  };
}, [authUser?.role, cloudEnabled]);

useEffect(() => {
  // Note: we intentionally do NOT bail out when cloudStatus === "error".
  // If a previous save failed (e.g. network dropped), we still want to retry
  // on the next data change so offline edits get pushed once the connection
  // is back. Bailing on "error" would permanently stop syncing for the session.
  if (!cloudEnabled || !remoteReadyRef.current || applyingRemoteRef.current) return undefined;

  const snapshot = buildCurrentRemoteSnapshot();

  if (syncTimeoutRef.current) {
    window.clearTimeout(syncTimeoutRef.current);
  }

  syncTimeoutRef.current = window.setTimeout(async () => {
    try {
      setCloudStatus("syncing");
      const { data, error } = await upsertRemoteStateRow(snapshot);

      if (error) throw error;
      lastRemoteUpdatedAtRef.current = data?.updated_at || new Date().toISOString();
      lastSeenRequestIdsRef.current = new Set((snapshot.requests || []).map((item) => item.id));
      setCloudStatus("online");
    } catch (error) {
      console.error("Cloud sync save failed:", error);
      setCloudStatus("error");
    }
  }, 350);

  return () => {
    if (syncTimeoutRef.current) {
      window.clearTimeout(syncTimeoutRef.current);
    }
  };
}, [employees, requests, systemUsers, pendingAccounts, upgradeRequests, complaints, chats, chatCalls, feedbackEntries]);

useEffect(() => {
  if (!cloudEnabled) return undefined;
  const handleOnline = () => {
    // Connection returned: push the latest local state to the cloud so any
    // edits made while offline are saved.
    if (remoteReadyRef.current && !applyingRemoteRef.current) {
      forceRemoteSaveSnapshot();
    }
  };
  const handleOffline = () => setCloudStatus("error");
  window.addEventListener("online", handleOnline);
  window.addEventListener("offline", handleOffline);
  return () => {
    window.removeEventListener("online", handleOnline);
    window.removeEventListener("offline", handleOffline);
  };
}, [cloudEnabled]);

  const visibleEmployees = useMemo(() => {
    if (!authUser) return [];
    if (canManageAll) return employees;
    if (canManageBranch) return employees.filter((emp) => emp.location === authUser.managedBranch);
    if (canManageDepartment) return employees.filter((emp) => emp.managerDepartment === authUser.managedDepartment);
    return employees.filter((emp) => emp.phone === authUser.phone);
  }, [employees, authUser, canManageAll, canManageBranch, canManageDepartment]);

  const filteredEmployees = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = visibleEmployees;

    if (canManageAll && branchFilter !== "all") {
      list = list.filter((emp) => (emp.location || emp.branch) === branchFilter);
    }

    if (!term) return list;

    return list.filter((emp) =>
      [emp.name, emp.department, emp.managerDepartment, emp.location, emp.phone, emp.email]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term))
    );
  }, [visibleEmployees, search, branchFilter, canManageAll]);

  const totals = useMemo(() => ({
    employeeCount: visibleEmployees.length,
    branchCount: new Set(visibleEmployees.map((emp) => emp.location).filter(Boolean)).size,
    totalPayroll: visibleEmployees.reduce((sum, emp) => sum + computeEmployeeNet(emp, requests), 0),
    totalAdvances: visibleEmployees.reduce((sum, emp) => sum + Number(emp.advance || 0), 0),
    totalAdvanceDeducted: (() => {
      const visiblePhones = new Set(visibleEmployees.map((emp) => String(emp.phone)));
      return requests
        .filter((req) => req.type === "إنزال مرتب" && visiblePhones.has(String(req.employeePhone)))
        .reduce((sum, req) => sum + Number(req.advanceSettledAmount || 0), 0);
    })(),
    totalLeaveBalance: visibleEmployees.reduce((sum, emp) => sum + Number(emp.leaveBalance || 0), 0),
  }), [visibleEmployees, requests]);

  const generatedAttendanceRows = useMemo(() => {
    const filteredByEmployee = visibleEmployees.filter((emp) =>
      attendanceEmployeeFilter === "all" ? true : String(emp.phone) === String(attendanceEmployeeFilter)
    );

    return filteredByEmployee.map((emp) => {
      const scheduledIn = emp.fromHour || "-";
      const scheduledOut = emp.toHour || "-";
      const matchingRequests = requests.filter((req) =>
        req.employeePhone === emp.phone &&
        req.status === "معتمد" &&
        ["إجازة", "تأخير"].includes(req.type)
      );

      const approvedLeave = matchingRequests.find((req) => {
        const fromDate = normalizeDateString(req.leaveFrom);
        const toDate = normalizeDateString(req.leaveTo || req.leaveFrom);
        const targetDate = normalizeDateString(attendanceDateFilter);
        return req.type === "إجازة" && fromDate && toDate && targetDate && targetDate >= fromDate && targetDate <= toDate;
      });

      if (approvedLeave) {
        return {
          id: `${emp.id}-leave-${attendanceDateFilter}`,
          name: emp.name,
          phone: emp.phone,
          department: emp.department || "-",
          scheduledIn,
          scheduledOut,
          actualIn: language === "ar" ? "إجازة" : "On leave",
          actualOut: language === "ar" ? "إجازة" : "On leave",
          delayMinutes: 0,
          delayLabel: language === "ar" ? "إجازة" : "Leave",
          status: language === "ar" ? "إجازة معتمدة" : "Approved leave",
          reason: approvedLeave.reason || "-",
        };
      }

      const approvedLate = matchingRequests.find((req) =>
        req.type === "تأخير" && isSameNormalizedDate(req.createdAt || req.submittedAt || req.leaveFrom || req.decidedAt, attendanceDateFilter)
      );

      const plannedInMinutes = timeToMinutes(emp.fromHour);
      const actualInValue = approvedLate?.lateTo || emp.fromHour || "-";
      const actualOutValue = approvedLate?.compensateAt || emp.toHour || "-";
      const actualInMinutes = timeToMinutes(approvedLate?.lateTo || emp.fromHour);
      // Hourly (flexible) employees have no fixed arrival time, so no late minutes.
      const isHourly = emp.shift === "hourly";
      const delayMinutes = isHourly ? 0 : (plannedInMinutes != null && actualInMinutes != null ? Math.max(0, actualInMinutes - plannedInMinutes) : 0);

      return {
        id: `${emp.id}-${attendanceDateFilter}`,
        name: emp.name,
        phone: emp.phone,
        department: emp.department || "-",
        scheduledIn,
        scheduledOut,
        actualIn: actualInValue,
        actualOut: actualOutValue,
        delayMinutes,
        delayLabel: minutesToDelayLabel(delayMinutes, language),
        status: approvedLate ? (language === "ar" ? "تأخير معتمد" : "Approved late") : (language === "ar" ? "حضور طبيعي" : "Regular attendance"),
        reason: approvedLate?.reason || "-",
      };
    });
  }, [visibleEmployees, attendanceEmployeeFilter, requests, attendanceDateFilter, language]);

  const savedAttendanceReports = useMemo(
    () => readStorage(STORAGE_KEYS.attendanceReports, [], isArray),
    [attendanceReportsVersion]
  );

  const scopedSavedAttendanceReports = useMemo(() => {
    const allowedPhones = new Set(visibleEmployees.map((emp) => String(emp.phone)));
    return savedAttendanceReports
      .map((report) => ({
        ...report,
        rows: (Array.isArray(report?.rows) ? report.rows : []).filter((row) => allowedPhones.has(String(row?.phone || ""))),
      }))
      .filter((report) => report.rows.length);
  }, [savedAttendanceReports, visibleEmployees]);

  const selectedAttendanceReport = useMemo(() => {
    if (isEmployee) return null;
    const normalizedDate = normalizeDateString(attendanceDateFilter);
    if (!normalizedDate) return null;

    const exactMatch = scopedSavedAttendanceReports.find((report) =>
      isSameNormalizedDate(report?.date, normalizedDate) && String(report?.employeeFilter || "all") === String(attendanceEmployeeFilter || "all")
    );
    if (exactMatch) return exactMatch;

    const allEmployeesMatch = scopedSavedAttendanceReports.find((report) =>
      isSameNormalizedDate(report?.date, normalizedDate) && String(report?.employeeFilter || "all") === "all"
    );
    if (allEmployeesMatch) return allEmployeesMatch;

    return scopedSavedAttendanceReports.find((report) => isSameNormalizedDate(report?.date, normalizedDate)) || null;
  }, [scopedSavedAttendanceReports, attendanceDateFilter, attendanceEmployeeFilter, isEmployee]);

  const attendanceHistoryRows = useMemo(() => {
    return scopedSavedAttendanceReports
      .flatMap((report) => {
        const reportDate = normalizeDateString(report?.date) || "";
        return (Array.isArray(report?.rows) ? report.rows : []).map((row, index) => ({
          id: row.id || `history-${report.id || reportDate}-${row.phone || index}`,
          reportId: report.id || reportDate,
          date: reportDate,
          sourceFileName: report.fileName || "",
          name: row.name || "-",
          phone: row.phone || "-",
          department: row.department || "-",
          scheduledIn: row.scheduledIn || "-",
          scheduledOut: row.scheduledOut || "-",
          actualIn: row.actualIn || "-",
          actualOut: row.actualOut || "-",
          delayMinutes: timeToMinutes(row.delayLabel),
          delayLabel: row.delayLabel || (language === "ar" ? "لا يوجد" : "None"),
          status: row.status || "-",
          reason: row.reason || "-",
        }));
      })
      .filter((row) => {
        if (attendanceEmployeeFilter !== "all" && String(row.phone) !== String(attendanceEmployeeFilter)) return false;
        if (attendanceDateFilter && !isSameNormalizedDate(row.date, attendanceDateFilter)) return false;
        return true;
      })
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")) || String(a.name || "").localeCompare(String(b.name || ""), "ar"));
  }, [scopedSavedAttendanceReports, attendanceEmployeeFilter, attendanceDateFilter, language]);

  const attendanceRows = useMemo(() => {
    if (isEmployee) return attendanceHistoryRows;
    if (!selectedAttendanceReport) return [];

    const sourceRows = Array.isArray(selectedAttendanceReport.rows) ? selectedAttendanceReport.rows : [];
    return sourceRows
      .filter((row) => attendanceEmployeeFilter === "all" ? true : String(row.phone) === String(attendanceEmployeeFilter))
      .map((row, index) => ({
        id: row.id || `saved-${attendanceDateFilter}-${row.phone || index}`,
        date: normalizeDateString(selectedAttendanceReport?.date) || normalizeDateString(attendanceDateFilter) || "",
        sourceFileName: selectedAttendanceReport?.fileName || "",
        name: row.name || "-",
        phone: row.phone || "-",
        department: row.department || "-",
        scheduledIn: row.scheduledIn || "-",
        scheduledOut: row.scheduledOut || "-",
        actualIn: row.actualIn || "-",
        actualOut: row.actualOut || "-",
        delayMinutes: timeToMinutes(row.delayLabel),
        delayLabel: row.delayLabel || (language === "ar" ? "لا يوجد" : "None"),
        status: row.status || "-",
        reason: row.reason || "-",
      }));
  }, [isEmployee, attendanceHistoryRows, selectedAttendanceReport, attendanceEmployeeFilter, attendanceDateFilter, language]);

  const attendanceReportEmptyMessage = useMemo(() => {
    if (isEmployee) {
      if (attendanceDateFilter) {
        return language === "ar" ? "لا توجد حركات بصمة لهذا اليوم" : "No attendance movements for this day.";
      }
      return language === "ar" ? "لا توجد حركات بصمة محفوظة لهذا الموظف" : "No saved attendance movements for this employee.";
    }
    if (!selectedAttendanceReport) {
      return language === "ar" ? "لم يتم تنزيل تقرير لهذا اليوم" : "No attendance report was uploaded for this day.";
    }
    if (!attendanceRows.length) {
      return language === "ar" ? "لا توجد بيانات لهذا الموظف في التقرير" : "No data for this employee in the saved report.";
    }
    return "";
  }, [isEmployee, selectedAttendanceReport, attendanceRows.length, attendanceDateFilter, language]);

  const openAttendanceHistoryModal = (row) => {
    if (!row?.phone) return;
    const employeeMatch = visibleEmployees.find((emp) => String(emp.phone) === String(row.phone));
    setAttendanceHistoryEmployee({
      name: row.name || employeeMatch?.name || "-",
      phone: row.phone,
      department: row.department || employeeMatch?.department || "-",
    });
    setAttendanceHistoryDateFilter("");
    setAttendanceHistoryModalOpen(true);
  };

  const attendanceHistoryModalRows = useMemo(() => {
    if (!attendanceHistoryEmployee?.phone) return [];
    return scopedSavedAttendanceReports
      .flatMap((report) => {
        const reportDate = normalizeDateString(report?.date) || "";
        return (Array.isArray(report?.rows) ? report.rows : [])
          .filter((row) => String(row?.phone || "") === String(attendanceHistoryEmployee.phone))
          .map((row, index) => ({
            id: row.id || `modal-${report.id || reportDate}-${index}`,
            date: reportDate,
            sourceFileName: report.fileName || "",
            name: row.name || attendanceHistoryEmployee.name || "-",
            phone: row.phone || attendanceHistoryEmployee.phone,
            department: row.department || attendanceHistoryEmployee.department || "-",
            scheduledIn: row.scheduledIn || "-",
            scheduledOut: row.scheduledOut || "-",
            actualIn: row.actualIn || "-",
            actualOut: row.actualOut || "-",
            delayLabel: row.delayLabel || (language === "ar" ? "لا يوجد" : "None"),
            status: row.status || "-",
            reason: row.reason || "-",
          }));
      })
      .filter((row) => !attendanceHistoryDateFilter || isSameNormalizedDate(row.date, attendanceHistoryDateFilter))
      .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  }, [scopedSavedAttendanceReports, attendanceHistoryEmployee, attendanceHistoryDateFilter, language]);

  const detectAttendanceDateFromFileName = (fileName = "") => {
    const normalized = String(fileName || "").trim();
    if (!normalized) return "";
    const match = normalized.match(/(\d{4})[-_/](\d{2})[-_/](\d{2})/);
    if (match) return `${match[1]}-${match[2]}-${match[3]}`;
    return normalizeDateString(normalized);
  };

  const parseAttendanceUploadText = (rawText, fileName = "") => {
    const textValue = String(rawText || "").replace(/^﻿/, "").trim();
    if (!textValue) return [];

    const normalizeHeader = (value) => String(value || "")
      .replace(/^﻿/, "")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();
    const simpleKnownHeaders = [
      "الاسم", "name", "employee", "employee name", "full name",
      "رقم الهاتف", "الهاتف", "رقم الجوال", "الجوال", "phone", "mobile", "phone number", "mobile number",
      "التاريخ", "date", "attendance date",
      "وقت الحضور", "الحضور", "وقت الدخول", "check in", "check-in", "checkin", "in", "actual in", "time in",
      "وقت الانصراف", "الانصراف", "وقت الخروج", "check out", "check-out", "checkout", "out", "actual out", "time out",
    ].map(normalizeHeader);

    const looksLikeAttendanceHeaders = (headers = []) => {
      const headerSet = new Set(headers.map(normalizeHeader).filter(Boolean));
      const hasAny = (group) => group.map(normalizeHeader).some((header) => headerSet.has(header));
      const nameGroup = ["الاسم", "name", "employee", "employee name", "full name"];
      const phoneGroup = ["رقم الهاتف", "الهاتف", "رقم الجوال", "الجوال", "phone", "mobile", "phone number", "mobile number"];
      const dateGroup = ["التاريخ", "date", "attendance date"];
      const inGroup = ["وقت الحضور", "الحضور", "وقت الدخول", "check in", "check-in", "checkin", "in", "actual in", "time in"];
      const outGroup = ["وقت الانصراف", "الانصراف", "وقت الخروج", "check out", "check-out", "checkout", "out", "actual out", "time out"];
      // Identity: name OR phone is enough (fingerprint exports often omit phone).
      const hasIdentity = hasAny(nameGroup) || hasAny(phoneGroup);
      // Punch: at least a check-in OR check-out column.
      const hasPunch = hasAny(inGroup) || hasAny(outGroup);
      return hasIdentity && hasAny(dateGroup) && hasPunch;
    };

    const mapUploadedRow = (headerMap, row) => {
      const readValue = (...keys) => {
        for (const key of keys) {
          const index = headerMap.get(normalizeHeader(key));
          if (index != null && row[index] != null && String(row[index]).trim() !== "") {
            return String(row[index]).trim();
          }
        }
        return "";
      };

      return {
        name: readValue("الاسم", "name", "employee", "employee name", "full name"),
        fingerprintId: String(readValue("person id", "personid", "رقم البصمة", "id", "user id", "userid", "emp id", "employee id", "no", "no.")).replace(/^'+/, "").trim(),
        phone: normalizeUploadedPhone(readValue("رقم الهاتف", "الهاتف", "رقم الجوال", "الجوال", "phone", "mobile", "phone number", "mobile number")),
        date: normalizeUploadedDate(readValue("التاريخ", "date", "attendance date")),
        actualIn: normalizeUploadedTime(readValue("وقت الحضور", "الحضور", "وقت الدخول", "check in", "check-in", "checkin", "in", "actual in", "time in")),
        actualOut: normalizeUploadedTime(readValue("وقت الانصراف", "الانصراف", "وقت الخروج", "check out", "check-out", "checkout", "out", "actual out", "time out")),
      };
    };

    const parseDelimitedLine = (line, delimiter) => {
      const cells = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i += 1;
          } else {
            inQuotes = !inQuotes;
          }
          continue;
        }
        if (char === delimiter && !inQuotes) {
          cells.push(current.trim());
          current = "";
          continue;
        }
        current += char;
      }
      cells.push(current.trim());
      return cells.map((cell) => cell.replace(/^"|"$/g, "").trim());
    };

    const fromDelimitedText = (delimiter) => {
      const lines = textValue.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
      if (lines.length < 2) return [];
      const rows = lines.map((line) => parseDelimitedLine(line, delimiter));
      if (!looksLikeAttendanceHeaders(rows[0])) return [];
      const headerMap = new Map(rows[0].map((header, index) => [normalizeHeader(header), index]));
      const isSummaryRow = (mapped) => /^(check-?in time|check-?out time|attended duration|وقت الحضور:|وقت الانصراف:)/i.test(String(mapped.name || "").trim());
      return rows.slice(1).map((row) => mapUploadedRow(headerMap, row)).filter((row) => (row.name || row.phone) && !isSummaryRow(row));
    };

    if (/<table[\s>]/i.test(textValue)) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(textValue, "text/html");
      const tables = Array.from(doc.querySelectorAll("table"));
      for (const table of tables) {
        const trs = Array.from(table.querySelectorAll("tr"));
        if (trs.length < 2) continue;
        const headers = Array.from(trs[0].querySelectorAll("th,td")).map((cell) => cell.textContent?.trim() || "");
        if (!looksLikeAttendanceHeaders(headers)) continue;
        const headerMap = new Map(headers.map((header, index) => [normalizeHeader(header), index]));
        const rows = trs.slice(1).map((tr) => {
          const cells = Array.from(tr.querySelectorAll("td,th")).map((cell) => cell.textContent?.trim() || "");
          return mapUploadedRow(headerMap, cells);
        }).filter((row) => row.name || row.phone);
        if (rows.length) return rows;
      }

      if (/<frame|<frameset|sheet\d+\.htm|File-List/i.test(textValue)) {
        throw new Error(
          language === "ar"
            ? `ملف ${fileName || "Excel"} هو صفحة Excel مرتبطة بملفات مساعدة ناقصة، وليس فيه جدول البصمة داخل نفس الملف. استخدم CSV أو XLSX أو HTML يحتوي الجدول نفسه.`
            : `${fileName || "Excel file"} is an Excel frameset that depends on missing companion files. Use CSV, XLSX, or HTML that contains the table in the same file.`
        );
      }
    }

    if (/	/.test(textValue)) return fromDelimitedText("	");
    const semicolonRows = fromDelimitedText(";");
    if (semicolonRows.length) return semicolonRows;
    return fromDelimitedText(",");
  };

  const decodeAttendanceUploadFile = async (file) => {
    const fileName = String(file?.name || "").toLowerCase();
    const buffer = await file.arrayBuffer();

    if (fileName.endsWith(".xlsx") || fileName.endsWith(".xlsm") || fileName.endsWith(".xltx") || fileName.endsWith(".xltm")) {
      try {
        const workbook = XLSX.read(buffer, { type: "array", cellDates: false, raw: false });
        for (const sheetName of workbook.SheetNames || []) {
          const worksheet = workbook.Sheets?.[sheetName];
          if (!worksheet) continue;
          const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, defval: "" });
          if (!rows.length) continue;
          const headerMap = new Map(rows[0].map((header, index) => [String(header || "").replace(/^﻿/, "").trim().replace(/\s+/g, " ").toLowerCase(), index]));
          const pick = (...keys) => {
            for (const key of keys) {
              const idx = headerMap.get(String(key).toLowerCase());
              if (idx != null) return idx;
            }
            return undefined;
          };
          const nameIdx = pick("name", "الاسم", "employee", "employee name", "full name");
          const fpIdx = pick("person id", "personid", "رقم البصمة", "id", "user id", "userid", "emp id", "employee id", "no", "no.");
          const phoneIdx = pick("phone", "رقم الهاتف", "الهاتف", "رقم الجوال", "الجوال", "mobile", "phone number", "mobile number");
          const dateIdx = pick("date", "التاريخ", "attendance date");
          const inIdx = pick("check-in", "checkin", "check in", "وقت الحضور", "الحضور", "وقت الدخول", "in", "actual in", "time in");
          const outIdx = pick("check-out", "checkout", "check out", "وقت الانصراف", "الانصراف", "وقت الخروج", "out", "actual out", "time out");
          const cell = (row, idx) => (idx != null ? String(row[idx] ?? "").trim() : "");
          const parsedRows = rows.slice(1).map((row) => ({
            name: cell(row, nameIdx),
            fingerprintId: cell(row, fpIdx).replace(/^'+/, "").trim(),
            phone: normalizeUploadedPhone(cell(row, phoneIdx)),
            date: normalizeUploadedDate(cell(row, dateIdx)),
            actualIn: normalizeUploadedTime(cell(row, inIdx)),
            actualOut: normalizeUploadedTime(cell(row, outIdx)),
          })).filter((row) => (row.name || row.phone) && !/^(check-?in time|check-?out time|attended duration|وقت الحضور:|وقت الانصراف:)/i.test(String(row.name || "").trim()));
          if (parsedRows.length) {
            return { text: "", rows: parsedRows, encoding: "xlsx" };
          }
        }
      } catch (xlsxError) {
        console.error("XLSX parsing failed:", xlsxError);
      }
    }

    const decoders = ["utf-8", "windows-1256", "iso-8859-6", "windows-1252"];
    for (const encoding of decoders) {
      try {
        const decoded = new TextDecoder(encoding).decode(buffer);
        const rows = parseAttendanceUploadText(decoded, file?.name || "");
        if (rows.length) {
          return { text: decoded, rows, encoding };
        }
      } catch {}
    }
    const fallback = await file.text();
    return { text: fallback, rows: parseAttendanceUploadText(fallback, file?.name || ""), encoding: "browser-default" };
  };

  const getOverlappingLeaveRequests = (employeePhone, fromValue, toValue, options = {}) => {
    const normalizedFrom = normalizeLeaveDateValue(fromValue);
    const normalizedTo = normalizeLeaveDateValue(toValue || fromValue);
    const includePending = Boolean(options.includePending);
    const excludeId = options.excludeId;
    if (!employeePhone || !normalizedFrom || !normalizedTo) return [];

    return requests.filter((req) => {
      if (req?.type !== "إجازة") return false;
      if (req?.employeePhone !== employeePhone) return false;
      if (excludeId != null && req?.id === excludeId) return false;
      if (!(req?.status === "معتمد" || (includePending && req?.status === "بانتظار الاعتماد"))) return false;

      const existingFrom = normalizeLeaveDateValue(req?.leaveFrom);
      const existingTo = normalizeLeaveDateValue(req?.leaveTo || req?.leaveFrom);
      if (!existingFrom || !existingTo) return false;

      return normalizedFrom <= existingTo && normalizedTo >= existingFrom;
    });
  };

  const findApprovedLeaveForDate = (employeePhone, targetDate) => {
    const normalizedTargetDate = normalizeDateString(targetDate);
    if (!employeePhone || !normalizedTargetDate) return null;

    return requests
      .filter((req) => {
        const fromDate = normalizeLeaveDateValue(req?.leaveFrom);
        const toDate = normalizeLeaveDateValue(req?.leaveTo || req?.leaveFrom);
        return req?.employeePhone === employeePhone
          && req?.status === "معتمد"
          && req?.type === "إجازة"
          && fromDate
          && toDate
          && normalizedTargetDate >= fromDate
          && normalizedTargetDate <= toDate;
      })
      .sort((a, b) => {
        const aUpdated = new Date(a?.updatedAt || a?.decidedAt || a?.createdAt || 0).getTime();
        const bUpdated = new Date(b?.updatedAt || b?.decidedAt || b?.createdAt || 0).getTime();
        if (aUpdated !== bUpdated) return bUpdated - aUpdated;
        return Number(b?.id || 0) - Number(a?.id || 0);
      })[0] || null;
  };

  const findApprovedLateForDate = (employeePhone, targetDate) => {
    const normalizedTargetDate = normalizeDateString(targetDate);
    if (!employeePhone || !normalizedTargetDate) return null;
    return requests.find((req) => {
      const reqDate = normalizeDateString(req?.createdAt || req?.submittedAt || req?.leaveFrom || req?.decidedAt);
      return req?.employeePhone === employeePhone
        && req?.status === "معتمد"
        && req?.type === "تأخير"
        && reqDate
        && reqDate === normalizedTargetDate;
    }) || null;
  };

  const buildAdjustedAttendanceRows = (uploadedRows = [], targetDateOverride = "") => {
    const normalizedTargetDate = normalizeDateString(targetDateOverride || attendanceDateFilter);
    const uploadedByPhone = new Map();
    const uploadedByName = new Map();
    const uploadedByFingerprint = new Map();
    // Loose name key: lowercase, collapse spaces, strip tatweel — tolerant matching.
    const nameKey = (value) => String(value || "").trim().toLowerCase().replace(/\s+/g, " ").replace(/\u0640/g, "");

    uploadedRows.forEach((row) => {
      const rowDate = normalizeUploadedDate(row?.date || normalizedTargetDate);
      if (normalizedTargetDate && rowDate && rowDate !== normalizedTargetDate) return;
      const normalizedPhone = String(row?.phone || "").trim();
      const normalizedName = String(row?.name || "").trim();
      const normalizedFingerprint = String(row?.fingerprintId || "").replace(/^'+/, "").trim();
      const normalizedRow = {
        ...row,
        date: rowDate || normalizedTargetDate,
        actualIn: String(row?.actualIn || "").trim(),
        actualOut: String(row?.actualOut || "").trim(),
      };
      if (normalizedPhone) uploadedByPhone.set(normalizedPhone, normalizedRow);
      if (normalizedName) uploadedByName.set(nameKey(normalizedName), normalizedRow);
      if (normalizedFingerprint) uploadedByFingerprint.set(normalizedFingerprint, normalizedRow);
    });

    return visibleEmployees.map((emp, index) => {
      const empFingerprint = String(emp.fingerprintId || "").replace(/^'+/, "").trim();
      const uploadedRow =
        (empFingerprint && uploadedByFingerprint.get(empFingerprint)) ||
        uploadedByPhone.get(String(emp.phone || "").trim()) ||
        uploadedByName.get(nameKey(emp.name)) ||
        null;
      const scheduledIn = emp.fromHour || "-";
      const scheduledOut = emp.toHour || "-";
      const approvedLeave = findApprovedLeaveForDate(emp.phone, normalizedTargetDate);
      const approvedLate = findApprovedLateForDate(emp.phone, normalizedTargetDate);

      if (!uploadedRow) {
        if (approvedLeave) {
          return {
            id: `uploaded-${emp.phone || index}-leave-${normalizedTargetDate}`,
            name: emp.name || "-",
            phone: emp.phone || "-",
            department: emp.department || "-",
            scheduledIn,
            scheduledOut,
            actualIn: language === "ar" ? "إجازة" : "On leave",
            actualOut: language === "ar" ? "إجازة" : "On leave",
            delayMinutes: 0,
            delayLabel: language === "ar" ? "إجازة" : "Leave",
            status: language === "ar" ? "إجازة معتمدة" : "Approved leave",
            reason: approvedLeave.reason || "-",
            date: normalizedTargetDate,
          };
        }

        return {
          id: `uploaded-${emp.phone || index}-absent-${normalizedTargetDate}`,
          name: emp.name || "-",
          phone: emp.phone || "-",
          department: emp.department || "-",
          scheduledIn,
          scheduledOut,
          actualIn: "-",
          actualOut: "-",
          delayMinutes: 0,
          delayLabel: language === "ar" ? "لا يوجد" : "None",
          status: language === "ar" ? "غياب" : "Absent",
          reason: language === "ar" ? "لا توجد بصمة لهذا اليوم" : "No attendance punch for this day",
          date: normalizedTargetDate,
        };
      }

      const actualInBase = uploadedRow.actualIn || "-";
      const actualOutBase = uploadedRow.actualOut || "-";
      const actualInValue = approvedLate?.lateTo || actualInBase;
      const actualOutValue = approvedLate?.compensateAt || actualOutBase;
      const plannedInMinutes = timeToMinutes(emp.fromHour);
      const actualInMinutes = timeToMinutes(actualInValue);
      const delayMinutes = plannedInMinutes != null && actualInMinutes != null ? Math.max(0, actualInMinutes - plannedInMinutes) : 0;
      const hasActualPunch = actualInBase !== "-" || actualOutBase !== "-";

      let status = language === "ar" ? "حضور طبيعي" : "Regular attendance";
      let reason = "-";
      if (approvedLeave) {
        status = language === "ar" ? "إجازة معتمدة" : "Approved leave";
        reason = approvedLeave.reason || "-";
      } else if (!hasActualPunch) {
        status = language === "ar" ? "غياب" : "Absent";
        reason = language === "ar" ? "لا توجد بصمة لهذا اليوم" : "No attendance punch for this day";
      } else if (approvedLate) {
        status = language === "ar" ? "تأخير معتمد" : "Approved late";
        reason = approvedLate.reason || "-";
      } else if (delayMinutes > 0) {
        status = language === "ar" ? "متأخر" : "Late";
        reason = language === "ar" ? "تم احتساب التأخير تلقائيًا" : "Delay calculated automatically";
      }

      return {
        id: `uploaded-${emp.phone || index}-${normalizedTargetDate}`,
        name: emp.name || uploadedRow.name || "-",
        phone: emp.phone || uploadedRow.phone || "-",
        department: emp.department || "-",
        scheduledIn,
        scheduledOut,
        actualIn: approvedLeave ? (language === "ar" ? "إجازة" : "On leave") : actualInValue,
        actualOut: approvedLeave ? (language === "ar" ? "إجازة" : "On leave") : actualOutValue,
        delayMinutes,
        delayLabel: approvedLate
          ? (language === "ar" ? "تأخير معتمد" : "Approved late")
          : minutesToDelayLabel(delayMinutes, language),
        status,
        reason,
        date: normalizedTargetDate,
      };
    });
  };

  const calculateAttendanceDeductionAmount = (employee, kind = "absence", delayMinutes = 0) => {
    if (!employee) return 0;
    const salaryBase = Math.max(0, Number(employee.salary || employee.basicSalary || 0));
    const deductionMode = kind === "late"
      ? (employee.attendanceLateDeductionMode || "automatic")
      : (employee.attendanceAbsenceDeductionMode || "automatic");
    const valueType = kind === "late"
      ? (employee.attendanceLateValueType || "amount")
      : (employee.attendanceAbsenceValueType || "amount");
    const configuredValue = Math.max(0, Number(kind === "late" ? employee.attendanceLateValue || 0 : employee.attendanceAbsenceValue || 0));

    if (deductionMode === "none") return 0;
    if (deductionMode === "manual") return 0;
    if (valueType === "percentage") {
      return Math.max(0, (salaryBase * configuredValue) / 100);
    }
    return kind === "late" && configuredValue <= 0 && delayMinutes > 0 ? delayMinutes : configuredValue;
  };

  const buildAttendanceDeductionRequests = (rows = [], reportDate = "") => {
    const normalizedReportDate = normalizeDateString(reportDate);
    if (!normalizedReportDate) return [];

    return rows.flatMap((row) => {
      const employee = visibleEmployees.find((emp) => String(emp.phone || "") === String(row.phone || ""));
      if (!employee) return [];

      const normalizedRowDate = normalizeDateString(row.date || normalizedReportDate) || normalizedReportDate;
      const list = [];

      if (String(row.status || "") === "غياب") {
        const amount = calculateAttendanceDeductionAmount(employee, "absence", 0);
        list.push({
          id: Date.now() + Math.floor(Math.random() * 1000000),
          employeePhone: employee.phone,
          employeeName: employee.name,
          department: employee.department,
          managerDepartment: employee.managerDepartment,
          type: "خصم",
          amount,
          percentage: employee.attendanceAbsenceValueType === "percentage" ? Number(employee.attendanceAbsenceValue || 0) : 0,
          valueType: employee.attendanceAbsenceValueType || "amount",
          resolvedAmount: amount,
          deductionMode: employee.attendanceAbsenceDeductionMode || "automatic",
          reason: `خصم بصمة - غياب يوم ${normalizedRowDate}`,
          status: "بانتظار الاعتماد",
          approver: "HR / المالك",
          decidedBy: "",
          canDecide: true,
          createdByRole: "system",
          createdAt: new Date().toISOString(),
          deductionSource: "attendance",
          attendancePenaltyKind: "absence",
          attendanceDate: normalizedRowDate,
        });
      }

      if (String(row.status || "") === "متأخر" && Number(row.delayMinutes || 0) > 0) {
        const amount = calculateAttendanceDeductionAmount(employee, "late", Number(row.delayMinutes || 0));
        list.push({
          id: Date.now() + Math.floor(Math.random() * 1000000) + 1,
          employeePhone: employee.phone,
          employeeName: employee.name,
          department: employee.department,
          managerDepartment: employee.managerDepartment,
          type: "خصم",
          amount,
          percentage: employee.attendanceLateValueType === "percentage" ? Number(employee.attendanceLateValue || 0) : 0,
          valueType: employee.attendanceLateValueType || "amount",
          resolvedAmount: amount,
          deductionMode: employee.attendanceLateDeductionMode || "automatic",
          reason: `خصم بصمة - تأخير ${Number(row.delayMinutes || 0)} دقيقة يوم ${normalizedRowDate}`,
          status: "بانتظار الاعتماد",
          approver: "HR / المالك",
          decidedBy: "",
          canDecide: true,
          createdByRole: "system",
          createdAt: new Date().toISOString(),
          deductionSource: "attendance",
          attendancePenaltyKind: "late",
          attendanceDate: normalizedRowDate,
        });
      }

      return list;
    });
  };

  const handleAttendanceUploadToSystem = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setAttendanceUploadStatus(language === "ar" ? "جاري قراءة الملف..." : "Reading file...");
      const { rows: uploadedRows } = await decodeAttendanceUploadFile(file);

      if (!uploadedRows.length) {
        throw new Error(language === "ar" ? "الملف لا يحتوي على بيانات بصمة مفهومة أو أن تنسيق الأعمدة غير مدعوم" : "The file does not contain readable attendance rows or the column format is unsupported.");
      }

      const detectedFileDate = detectAttendanceDateFromFileName(file.name);
      setLastUploadedRows(uploadedRows);
      setImportEmployeesStatus("");
      const detectedRowDate = normalizeUploadedDate(uploadedRows.find((row) => row?.date)?.date || "");
      const effectiveReportDate = normalizeUploadedDate(detectedFileDate || detectedRowDate || attendanceDateFilter);
      const previousFilterDate = normalizeDateString(attendanceDateFilter);
      const adjustedRows = buildAdjustedAttendanceRows(uploadedRows, effectiveReportDate);

      if (!effectiveReportDate) {
        throw new Error(language === "ar" ? "تعذر تحديد تاريخ التقرير. أضف التاريخ في اسم الملف أو داخل عمود التاريخ." : "Could not determine the report date. Add the date in the filename or inside the date column.");
      }

      const reportEntry = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        createdBy: authUser?.name || "-",
        createdByRole: authUser?.role || "-",
        fileName: file.name || "attendance-report",
        date: effectiveReportDate,
        employeeFilter: "all",
        source: "uploaded_file",
        rows: adjustedRows.map((row) => ({
          name: row.name,
          phone: row.phone,
          department: row.department,
          scheduledIn: row.scheduledIn,
          scheduledOut: row.scheduledOut,
          actualIn: row.actualIn,
          actualOut: row.actualOut,
          delayLabel: row.delayLabel,
          status: row.status,
          reason: row.reason,
          date: row.date || effectiveReportDate,
        })),
      };

      const attendanceGeneratedRequests = buildAttendanceDeductionRequests(adjustedRows, effectiveReportDate);
      const existingReports = readStorage(STORAGE_KEYS.attendanceReports, [], isArray);
      const nextReports = [reportEntry, ...existingReports.filter((item) => String(normalizeDateString(item.date)) !== String(reportEntry.date))].slice(0, 200);
      const nextRequests = [
        ...attendanceGeneratedRequests,
        ...requests.filter((req) => !(req.deductionSource === "attendance" && normalizeDateString(req.attendanceDate) === normalizeDateString(effectiveReportDate) && req.status === "بانتظار الاعتماد")),
      ];
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEYS.attendanceReports, JSON.stringify(nextReports));
        setAttendanceDateFilter(effectiveReportDate);
        setAttendanceEmployeeFilter("all");
        setAttendanceReportsVersion((prev) => prev + 1);
        setRequests(nextRequests);
        if (effectiveReportDate && previousFilterDate && effectiveReportDate !== previousFilterDate) {
          window.alert(language === "ar"
            ? `تم رفع التقرير بنجاح. تم اعتماد تاريخ ${effectiveReportDate} تلقائيًا.`
            : `The report was uploaded successfully. The date ${effectiveReportDate} was applied automatically.`);
        } else {
          window.alert(language === "ar" ? "تم تنزيل تقرير البصمة إلى السستم بنجاح" : "Attendance report was uploaded to the system successfully.");
        }
      }
      await forceRemoteSaveSnapshot({
        employees,
        requests: nextRequests,
        users: systemUsers,
        pending: pendingAccounts,
        upgrades: upgradeRequests,
        complaints,
        chats,
        chatCalls,
        feedback: feedbackEntries,
        attendanceReports: nextReports,
      });
      setAttendanceUploadStatus(language === "ar"
        ? `تم رفع الملف: ${file.name} — تم احتساب التأخير والغياب والإجازات تلقائيًا وإنشاء طلبات خصم بانتظار الاعتماد.`
        : `Uploaded: ${file.name} — delays, absences, and leaves were calculated automatically and deduction requests were created pending approval.`);
    } catch (error) {
      console.error("Uploading attendance report failed:", error);
      const message = error?.message || (language === "ar" ? "تعذر تنزيل التقرير إلى السستم" : "Could not upload the report to the system.");
      setAttendanceUploadStatus(message);
      if (typeof window !== "undefined") {
        window.alert(message);
      }
    } finally {
      event.target.value = "";
    }
  };

  const importEmployeesFromFile = () => {
    if (!lastUploadedRows.length) {
      setImportEmployeesStatus(language === "ar" ? "ارفع ملف البصمة أولاً." : "Upload an attendance file first.");
      return;
    }

    // Collect unique people from the file by fingerprint id (fallback to name).
    const uniqueByFingerprint = new Map();
    lastUploadedRows.forEach((row) => {
      const fp = String(row?.fingerprintId || "").replace(/^'+/, "").trim();
      const name = String(row?.name || "").trim();
      if (!fp && !name) return;
      const key = fp || `name:${name}`;
      if (!uniqueByFingerprint.has(key)) {
        uniqueByFingerprint.set(key, { fingerprintId: fp, name, department: String(row?.department || "").trim() });
      }
    });

    const existingFingerprints = new Set(employees.map((e) => String(e.fingerprintId || "").replace(/^'+/, "").trim()).filter(Boolean));
    const usedPhones = new Set([...employees.map((e) => String(e.phone || "")), ...systemUsers.map((u) => String(u.phone || ""))]);

    // Generate a unique placeholder phone, since login requires a phone but the file has none.
    const makePlaceholderPhone = (fp) => {
      let base = `بصمة-${fp || Math.floor(Math.random() * 100000)}`;
      let candidate = base;
      let n = 1;
      while (usedPhones.has(candidate)) { candidate = `${base}-${n++}`; }
      usedPhones.add(candidate);
      return candidate;
    };

    const newEmployees = [];
    const newUsers = [];
    let skipped = 0;

    uniqueByFingerprint.forEach(({ fingerprintId, name, department }) => {
      if (fingerprintId && existingFingerprints.has(fingerprintId)) { skipped += 1; return; }
      const phone = makePlaceholderPhone(fingerprintId);
      const displayName = name || (language === "ar" ? `موظف ${fingerprintId}` : `Employee ${fingerprintId}`);
      newEmployees.push({
        id: Date.now() + Math.floor(Math.random() * 1000000),
        name: displayName,
        fingerprintId: fingerprintId,
        department: department || (language === "ar" ? "غير محدد" : "Unassigned"),
        managerDepartment: department || "",
        location: "",
        phone,
        email: "",
        description: "",
        basicSalary: 0,
        salary: 0,
        advance: 0,
        leaveBalance: 0,
        workHours: 8,
        shift: "morning",
        fromHour: "08:00",
        toHour: "16:00",
        attendanceLateDeductionMode: "automatic",
        attendanceLateValueType: "amount",
        attendanceLateValue: 0,
        attendanceAbsenceDeductionMode: "automatic",
        attendanceAbsenceValueType: "amount",
        attendanceAbsenceValue: 0,
      });
      newUsers.push({
        phone,
        password: "123456",
        role: "employee",
        name: displayName,
        managedDepartment: department || "",
        managedBranch: "",
        mustChangePassword: true,
        passwordChangedOnce: false,
      });
      if (fingerprintId) existingFingerprints.add(fingerprintId);
    });

    if (!newEmployees.length) {
      setImportEmployeesStatus(language === "ar" ? `لا يوجد موظفون جدد لإضافتهم (تم تخطي ${skipped} موجودين مسبقًا).` : `No new employees to add (${skipped} already exist).`);
      return;
    }

    setEmployees((prev) => [...newEmployees, ...prev]);
    setSystemUsers((prev) => [...prev, ...newUsers]);
    setImportEmployeesStatus(
      language === "ar"
        ? `تمت إضافة ${newEmployees.length} موظف. ${skipped ? `تم تخطي ${skipped} موجودين مسبقًا. ` : ""}كلمة السر المؤقتة لكل موظف: 123456`
        : `Added ${newEmployees.length} employees. ${skipped ? `Skipped ${skipped} existing. ` : ""}Temporary password for each: 123456`
    );
  };

  const exportAttendanceReport = () => {
    const headers = language === "ar"
      ? ["الاسم", "رقم الهاتف", "الإدارة", "التاريخ", "الدخول المجدول", "الخروج المجدول", "الدخول الفعلي", "الخروج الفعلي", "التأخير", "الحالة", "الملاحظة"]
      : ["Name", "Phone", "Department", "Date", "Scheduled In", "Scheduled Out", "Actual In", "Actual Out", "Delay", "Status", "Note"];

    const rows = attendanceRows.map((row) => [
      row.name,
      row.phone,
      row.department,
      attendanceDateFilter,
      row.scheduledIn,
      row.scheduledOut,
      row.actualIn,
      row.actualOut,
      row.delayLabel,
      row.status,
      row.reason,
    ]);

    downloadExcelLikeFile(`attendance-report-${attendanceDateFilter || "report"}.xls`, headers, rows);
  };


  const exportRowsToExcel = (filename, headers, rows) => {
    downloadExcelLikeFile(filename, headers, rows);
  };

  const exportEmployeeDataReport = () => {
    const headers = language === "ar"
      ? ["الاسم", "الفرع", "رقم الهاتف", "الإدارة"]
      : ["Name", "Branch", "Phone", "Department"];
    const rows = filteredEmployees.map((emp) => [
      emp.name || "-",
      emp.location || emp.branch || "-",
      emp.phone || "-",
      emp.department || "-",
    ]);
    exportRowsToExcel(`employees-data-${new Date().toISOString().slice(0, 10)}.xls`, headers, rows);
  };

  const exportSalaryDataReport = () => {
    const headers = language === "ar"
      ? ["الاسم", "الإدارة", "المرتب الأساسي", "رقم الهاتف", "الفرع", "الصافي"]
      : ["Name", "Department", "Basic Salary", "Phone", "Branch", "Net"];
    const rows = filteredEmployees.map((emp) => {
      const net = getEmployeeFinancialStatement(emp)?.estimatedNet ?? 0;
      return [
        emp.name || "-",
        emp.department || "-",
        currency(emp.basicSalary || emp.salary),
        emp.phone || "-",
        emp.location || "-",
        currency(net),
      ];
    });
    exportRowsToExcel(`salary-net-${new Date().toISOString().slice(0, 10)}.xls`, headers, rows);
  };

  const exportLeaveManagementReport = () => {
    const headers = language === "ar"
      ? ["الاسم", "الإدارة", "رصيد الإجازات", "عدد ساعات العمل", "من ساعة", "إلى ساعة", "الفترة"]
      : ["Name", "Department", "Leave Balance", "Daily Work Hours", "From", "To", "Shift"];
    const rows = filteredEmployees.map((emp) => [
      emp.name || "-",
      emp.department || "-",
      emp.leaveBalance ?? "-",
      emp.workHours ?? "-",
      emp.fromHour || "-",
      emp.toHour || "-",
      emp.shift === "evening" ? t.evening : t.morning,
    ]);
    exportRowsToExcel(`leave-management-${new Date().toISOString().slice(0, 10)}.xls`, headers, rows);
  };

  const exportLeaveApprovalsReport = () => {
    const headers = language === "ar"
      ? ["الموظف", "النوع", "التاريخ / الوقت", "سبب الطلب", "الحالة", "اعتمد بواسطة"]
      : ["Employee", "Type", "Date / Time", "Reason", "Status", "Approved By"];
    const rows = requestHubLeaveRequests.map((req) => [
      req.employeeName || "-",
      req.type || "-",
      req.type === "إجازة"
        ? `${req.leaveFrom || "-"} → ${req.leaveTo || "-"}`
        : `${req.lateFrom || "-"} → ${req.lateTo || "-"}${req.compensateAt ? ` | ${t.compensateAt}: ${req.compensateAt}` : ""}`,
      req.reason || "-",
      req.status || "-",
      req.decidedBy || "-",
    ]);
    exportRowsToExcel(`leave-late-approvals-${new Date().toISOString().slice(0, 10)}.xls`, headers, rows);
  };

  const exportFinancialApprovalsReport = () => {
    const headers = language === "ar"
      ? ["الموظف", "النوع", "القيمة", "سبب الطلب", "الحالة", "اعتمد بواسطة"]
      : ["Employee", "Type", "Amount", "Reason", "Status", "Approved By"];
    const rows = requestHubFinancialRequests.map((req) => [
      req.employeeName || "-",
      req.type || "-",
      currency(req.resolvedAmount || req.amount),
      req.reason || "-",
      req.status || "-",
      req.decidedBy || "-",
    ]);
    exportRowsToExcel(`financial-approvals-${new Date().toISOString().slice(0, 10)}.xls`, headers, rows);
  };

  const exportApprovalLogReport = (logType) => {
    const source = logType === "leave" ? approvalLogLeaveRequests : approvalLogFinancialRequests;
    const headers = logType === "leave"
      ? (language === "ar"
          ? ["الموظف", "النوع", "التاريخ / الوقت", "سبب الطلب", "الحالة", "اعتمد بواسطة"]
          : ["Employee", "Type", "Date / Time", "Reason", "Status", "Approved By"])
      : (language === "ar"
          ? ["الموظف", "النوع", "القيمة", "سبب الطلب", "الحالة", "اعتمد بواسطة"]
          : ["Employee", "Type", "Amount", "Reason", "Status", "Approved By"]);
    const rows = source.map((req) => [
      req.employeeName || "-",
      req.type || "-",
      logType === "leave" ? getApprovalLogDetail(req, logType, t) : currency(req.resolvedAmount || req.amount),
      req.reason || "-",
      req.status || "-",
      req.decidedBy || "-",
    ]);
    const filePrefix = logType === "leave" ? "attendance-approval-log" : "financial-approval-log";
    exportRowsToExcel(`${filePrefix}-${new Date().toISOString().slice(0, 10)}.xls`, headers, rows);
  };

  const exportAccountStatementReport = () => {
    if (!statementEmployee || !statementData) return;
    const headers = language === "ar"
      ? ["التفصيل", "القيمة", "الحالة", "اعتمد بواسطة", "تاريخ الطلب", "الإشعار"]
      : ["Detail", "Amount", "Status", "Approved By", "Request Date", "Notification"];
    const summaryRows = language === "ar"
      ? [
          ["الموظف", statementEmployee.name || "-", "", "", "", ""],
          ["المرتب الأساسي", currency(statementData.basicSalary || 0), "", "", "", ""],
          ["الرصيد الحالي للسلف", currency(statementData.currentAdvanceBalance || 0), "", "", "", ""],
          ["إجمالي المكافآت المعتمدة", currency(statementData.approvedRewards || 0), "", "", "", ""],
          ["إجمالي الخصومات المعتمدة", currency(statementData.approvedDeductions || 0), "", "", "", ""],
          ["الصافي بعد المكافآت والخصومات", currency(statementData.estimatedNet || 0), "", "", "", ""],
          ["", "", "", "", "", ""],
        ]
      : [
          ["Employee", statementEmployee.name || "-", "", "", "", ""],
          ["Basic Salary", currency(statementData.basicSalary || 0), "", "", "", ""],
          ["Current Advance Balance", currency(statementData.currentAdvanceBalance || 0), "", "", "", ""],
          ["Approved Rewards", currency(statementData.approvedRewards || 0), "", "", "", ""],
          ["Approved Deductions", currency(statementData.approvedDeductions || 0), "", "", "", ""],
          ["Net After Rewards & Deductions", currency(statementData.estimatedNet || 0), "", "", "", ""],
          ["", "", "", "", "", ""],
        ];
    const rows = [
      ...summaryRows,
      ...statementData.transactions.map((req) => [
        req.type || "-",
        currency(req.resolvedAmount || req.amount),
        getFinancialSettlementStatusLabel(req),
        req.decidedBy || "-",
        req.createdAt ? new Date(req.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US") : (language === "ar" ? "سجل سابق" : "Previous record"),
        getNotificationContent(req),
      ]),
    ];
    exportRowsToExcel(`account-statement-${statementEmployee.phone || Date.now()}.xls`, headers, rows);
  };

  const pushAttendanceReportToSystem = () => {
    const reportEntry = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      createdBy: authUser?.name || "-",
      createdByRole: authUser?.role || "-",
      date: attendanceDateFilter || "",
      employeeFilter: attendanceEmployeeFilter || "all",
      rows: generatedAttendanceRows.map((row) => ({
        name: row.name,
        phone: row.phone,
        department: row.department,
        scheduledIn: row.scheduledIn,
        scheduledOut: row.scheduledOut,
        actualIn: row.actualIn,
        actualOut: row.actualOut,
        delayLabel: row.delayLabel,
        status: row.status,
        reason: row.reason,
      })),
    };

    try {
      const existingReports = readStorage(STORAGE_KEYS.attendanceReports, [], isArray);
      const nextReports = [reportEntry, ...existingReports.filter((item) => !isSameNormalizedDate(item?.date, reportEntry.date))].slice(0, 200);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(STORAGE_KEYS.attendanceReports, JSON.stringify(nextReports));
        setAttendanceReportsVersion((prev) => prev + 1);
        window.alert(language === "ar" ? "تم تنزيل تقرير البصمة إلى السستم بنجاح" : "Attendance report was saved to the system successfully.");
      }
    } catch (error) {
      console.error("Saving attendance report to system failed:", error);
      if (typeof window !== "undefined") {
        window.alert(language === "ar" ? "تعذر تنزيل تقرير البصمة إلى السستم" : "Could not save the attendance report to the system.");
      }
    }
  };

  const visiblePendingAccounts = useMemo(() => {
    const pending = pendingAccounts.filter((acc) => !acc.addedToEmployees && acc.status !== "مرفوض");
    if (!authUser) return [];
    if (canManageAll || canManageBranch) return pending;
    if (canManageDepartment) {
      return pending.filter((acc) => (acc.managerDepartment || acc.department) === authUser.managedDepartment);
    }
    return [];
  }, [pendingAccounts, authUser, canManageAll, canManageBranch, canManageDepartment]);


  const visibleComplaints = useMemo(() => {
    if (!authUser) return [];
    return complaints.filter((item) => {
      if (item.senderPhone === authUser.phone) return true;

      if (canManageAll) {
        return (
          item.target === "المالك" ||
          item.target === "HR" ||
          String(item.target || "").startsWith("branch:") ||
          String(item.target || "").startsWith("dept:")
        );
      }

      if (canManageBranch) {
        return item.target === `branch:${authUser.managedBranch || ""}`;
      }

      if (canManageDepartment) {
        return item.target === `dept:${authUser.managedDepartment || ""}`;
      }

      return false;
    });
  }, [complaints, authUser, canManageAll, canManageBranch, canManageDepartment]);



  const handleComplaintImageSelection = (event) => {
    const files = Array.from(event.target.files || []).filter((file) => String(file.type || "").startsWith("image/"));
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = String(reader.result || "");
        if (!dataUrl) return;
        setComplaintForm((prev) => ({
          ...prev,
          images: [
            ...(Array.isArray(prev.images) ? prev.images : []),
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              name: file.name || `image-${Date.now()}.jpg`,
              url: dataUrl,
            },
          ],
        }));
      };
      reader.readAsDataURL(file);
    });

    event.target.value = "";
  };

  const removeComplaintImage = (imageId) => {
    setComplaintForm((prev) => ({
      ...prev,
      images: (Array.isArray(prev.images) ? prev.images : []).filter((item) => item.id !== imageId),
    }));
  };

  const submitComplaint = () => {
    if (!authUser || !complaintForm.subject || !complaintForm.body) return;

    let finalTarget = "المالك";
    if (complaintForm.targetCategory === "owner") finalTarget = "المالك";
    else if (complaintForm.targetCategory === "hr") finalTarget = "HR";
    else if (complaintForm.targetCategory === "branch") finalTarget = `branch:${complaintForm.targetValue || ""}`;
    else if (complaintForm.targetCategory === "department") finalTarget = `dept:${complaintForm.targetValue || ""}`;

    setComplaints((prev) => [
      {
        id: Date.now(),
        senderName: authUser.name,
        senderPhone: authUser.phone,
        senderRole: authUser.role,
        type: complaintForm.type,
        target: finalTarget,
        subject: complaintForm.subject,
        body: complaintForm.body,
        images: Array.isArray(complaintForm.images) ? complaintForm.images : [],
        createdAt: new Date().toLocaleDateString("en-CA"),
      },
      ...prev,
    ]);
    setComplaintForm((prev) => ({
      ...emptyComplaintForm,
      targetCategory: prev.targetCategory,
      targetValue: prev.targetValue,
    }));
    setActiveTab("complaints");
  };

  const visibleFeedbackEntries = useMemo(() => {
    if (!authUser) return [];
    if (isProgrammerUser) {
      return [...feedbackEntries].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
    }
    return feedbackEntries.filter((item) => item.senderPhone === authUser.phone).sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [feedbackEntries, authUser, isProgrammerUser]);

  const submitFeedback = async () => {
    if (!authUser) return;
    if (!Number(feedbackForm.rating)) {
      setFeedbackMessage(language === "ar" ? "اختر تقييمًا من 1 إلى 5 نجوم" : "Choose a rating from 1 to 5 stars.");
      return;
    }
    if (!String(feedbackForm.message || "").trim()) {
      setFeedbackMessage(language === "ar" ? "اكتب رأيك قبل الإرسال" : "Write your feedback before sending.");
      return;
    }

    const newEntry = {
      id: Date.now(),
      senderName: authUser.name || authUser.phone || "-",
      senderPhone: authUser.phone || "-",
      rating: Number(feedbackForm.rating || 0),
      message: String(feedbackForm.message || "").trim(),
      targetPhone: PROGRAMMER_ACCOUNT_PHONE,
      createdAt: new Date().toISOString(),
      status: "sent",
    };
    const nextFeedback = [newEntry, ...feedbackEntries];
    setFeedbackEntries(nextFeedback);
    setFeedbackForm({ rating: 0, message: "" });
    setFeedbackMessage(language === "ar" ? "تم إرسال التقييم إلى مبرمجR1" : "Your feedback was sent to Programmer R1.");
    await forceRemoteSaveSnapshot({
      employees,
      requests,
      users: systemUsers,
      pending: pendingAccounts,
      upgrades: upgradeRequests,
      complaints,
      chats,
      chatCalls,
      feedback: nextFeedback,
    });
    window.setTimeout(() => {
      setFeedbackWidgetOpen(false);
      setFeedbackMessage("");
    }, 900);
  };



  const REQUEST_LOG_HIDE_AFTER_HOURS = 29;

  const getRequestDecisionTime = (req) => {
    if (!["معتمد", "مرفوض"].includes(String(req?.status || ""))) return null;
    const raw = req?.decidedAt || req?.updatedAt || req?.createdAt || "";
    const parsed = raw ? new Date(raw).getTime() : NaN;
    return Number.isFinite(parsed) ? parsed : null;
  };

  const shouldKeepRequestVisible = (req) => {
    if (!req) return false;
    if (String(req.status || "") === "بانتظار الاعتماد" || req.canDecide) return true;
    if (!["معتمد", "مرفوض"].includes(String(req.status || ""))) return true;
    const decidedAt = getRequestDecisionTime(req);
    if (!decidedAt) return false;
    return Date.now() - decidedAt < REQUEST_LOG_HIDE_AFTER_HOURS * 60 * 60 * 1000;
  };

  const visibleLeaveRequests = useMemo(() => {
    const list = requests.filter((req) => req.type === "إجازة" || req.type === "تأخير");
    if (!authUser) return [];
    if (canManageAll || canManageBranch) return list;
    if (canManageDepartment) return list.filter((req) => req.managerDepartment === authUser.managedDepartment);
    return list.filter((req) => req.employeePhone === authUser.phone);
  }, [requests, authUser, canManageAll, canManageBranch, canManageDepartment]);

  const visibleFinancialRequests = useMemo(() => {
    const list = requests.filter((req) => req.type === "سلفة" || req.type === "مكافأة" || req.type === "خصم");
    if (!authUser) return [];
    if (canManageAll) return list;
    if (canManageBranch) return list.filter((req) => req.employeePhone === authUser.phone || req.createdByRole === "branch_manager");
    if (canManageDepartment) return list.filter((req) => req.employeePhone === authUser.phone || req.managerDepartment === authUser.managedDepartment);
    return list.filter((req) => req.employeePhone === authUser.phone);
  }, [requests, authUser, canManageAll, canManageBranch, canManageDepartment]);

  const activeLeaveRequests = useMemo(
    () => visibleLeaveRequests.filter((req) => shouldKeepRequestVisible(req)),
    [visibleLeaveRequests]
  );

  const activeFinancialRequests = useMemo(
    () => visibleFinancialRequests.filter((req) => shouldKeepRequestVisible(req)),
    [visibleFinancialRequests]
  );

  const approvalLeaveRequests = useMemo(() => {
    if (!(canManageAll || canManageBranch || canManageDepartment)) return [];
    return visibleLeaveRequests.filter((req) => ["إجازة", "تأخير"].includes(req.type) && req.canDecide);
  }, [visibleLeaveRequests, canManageAll, canManageBranch, canManageDepartment]);

  const approvalFinancialRequests = useMemo(() => {
    if (!(canManageAll || canManageBranch || canManageDepartment)) return [];
    return visibleFinancialRequests.filter((req) => ["سلفة", "مكافأة", "خصم"].includes(req.type) && req.canDecide);
  }, [visibleFinancialRequests, canManageAll, canManageBranch, canManageDepartment]);

  const requestHubHasApprovalActions = canManageAll || canManageBranch || canManageDepartment;
  const requestHubLeaveRequests = requestHubHasApprovalActions ? approvalLeaveRequests : activeLeaveRequests;
  const requestHubFinancialRequests = requestHubHasApprovalActions
    ? approvalFinancialRequests
    : activeFinancialRequests.filter((req) => ["سلفة", "مكافأة", "خصم"].includes(req.type));
  const approvalLogLeaveRequests = useMemo(
    () =>
      visibleLeaveRequests.filter((req) =>
        ["معتمد", "مرفوض"].includes(String(req.status || ""))
      ),
    [visibleLeaveRequests]
  );

  const approvalLogFinancialRequests = useMemo(
    () =>
      visibleFinancialRequests.filter((req) =>
        ["معتمد", "مرفوض"].includes(String(req.status || ""))
      ),
    [visibleFinancialRequests]
  );

  const visibleUpgradeRequests = useMemo(() => {
    if (!authUser) return [];
    const list = upgradeRequests.filter((req) => req.employeePhone !== PROGRAMMER_ACCOUNT_PHONE);
    if (canManageAll) return list;
    return list.filter((req) => req.employeePhone === authUser.phone);
  }, [upgradeRequests, authUser, canManageAll]);

  const pendingAccountCount = useMemo(
    () => visiblePendingAccounts.filter((item) => String(item.status || "") === "بانتظار الاعتماد").length,
    [visiblePendingAccounts]
  );

  const pendingRequestsCount = useMemo(() => {
    const base = requestHubHasApprovalActions
      ? [...requestHubLeaveRequests, ...requestHubFinancialRequests]
      : [...visibleLeaveRequests, ...visibleFinancialRequests];
    return base.filter((req) => String(req.status || "") === "بانتظار الاعتماد").length;
  }, [
    requestHubHasApprovalActions,
    requestHubLeaveRequests,
    requestHubFinancialRequests,
    visibleLeaveRequests,
    visibleFinancialRequests,
  ]);

  const pendingUpgradeCount = useMemo(() => {
    if (!canManageAll) return 0;
    return visibleUpgradeRequests.filter((item) => String(item.status || "") === "بانتظار الاعتماد").length;
  }, [visibleUpgradeRequests, canManageAll]);

  const pendingComplaintsCount = useMemo(() => {
    if (!(canManageAll || canManageBranch || canManageDepartment) || !authUser) return 0;
    return visibleComplaints.filter((item) => item.senderPhone !== authUser.phone).length;
  }, [visibleComplaints, authUser, canManageAll, canManageBranch, canManageDepartment]);

  const topMenuNotificationsCount = useMemo(() => {
    if (canManageAll || canManageBranch || canManageDepartment) {
      return pendingAccountCount + pendingRequestsCount + pendingUpgradeCount + pendingComplaintsCount;
    }
    return (
      [...visibleLeaveRequests, ...visibleFinancialRequests].filter(
        (req) => req.employeePhone === authUser?.phone && String(req.status || "") !== "بانتظار الاعتماد"
      ).length +
      visibleUpgradeRequests.filter((item) => String(item.status || "") !== "بانتظار الاعتماد").length
    );
  }, [
    canManageAll,
    canManageBranch,
    canManageDepartment,
    pendingAccountCount,
    pendingRequestsCount,
    pendingUpgradeCount,
    pendingComplaintsCount,
    visibleLeaveRequests,
    visibleFinancialRequests,
    visibleUpgradeRequests,
    authUser,
  ]);

  const availableManagerDepartments = useMemo(() => {
    const values = employees
      .map((emp) => emp.managerDepartment || emp.department || "")
      .filter(Boolean);
    return Array.from(new Set(values));
  }, [employees]);

  const chatContacts = useMemo(() => {
    if (!authUser) return [];

    const usersByPhone = new Map(systemUsers.map((user) => [user.phone, user]));
    const employeeByPhone = new Map(employees.map((emp) => [emp.phone, emp]));
    const allowedPhones = new Set();

    if (canManageAll) {
      systemUsers.forEach((user) => {
        if (user.phone !== authUser.phone && (!isHiddenAccount(user) || isProgrammerUser)) allowedPhones.add(user.phone);
      });
    } else if (canManageBranch) {
      systemUsers.forEach((user) => {
        if (user.phone !== authUser.phone && (!isHiddenAccount(user) || isProgrammerUser) && (user.managedBranch === authUser.managedBranch || ["owner", "hr"].includes(user.role))) {
          allowedPhones.add(user.phone);
        }
      });
    } else if (canManageDepartment) {
      systemUsers.forEach((user) => {
        if (user.phone !== authUser.phone && (!isHiddenAccount(user) || isProgrammerUser) && (user.managedDepartment === authUser.managedDepartment || ["owner", "hr"].includes(user.role))) {
          allowedPhones.add(user.phone);
        }
      });
    } else {
      systemUsers.forEach((user) => {
        if (
          user.phone !== authUser.phone &&
          (!isHiddenAccount(user) || isProgrammerUser) &&
          (
            ["owner", "hr"].includes(user.role) ||
            user.managedDepartment === authUser.managedDepartment ||
            user.managedBranch === authUser.managedBranch
          )
        ) {
          allowedPhones.add(user.phone);
        }
      });
    }

    const normalizedChats = (chats || []).map((chat) => ({
      type: chat.type || (chat.participants?.length > 2 ? "group" : "direct"),
      pinnedBy: chat.pinnedBy || [],
      mutedBy: chat.mutedBy || [],
      archivedBy: chat.archivedBy || [],
      unreadBy: chat.unreadBy || [],
      lockedBy: chat.lockedBy || [],
      favoriteBy: chat.favoriteBy || [],
      blockedBy: chat.blockedBy || [],
      messages: chat.messages || [],
      ...chat,
    }));

    const directThreads = Array.from(allowedPhones).map((phone) => {
      const user = usersByPhone.get(phone);
      if (!user) return null;
      const employee = employeeByPhone.get(phone);
      const existing = normalizedChats.find((chat) => {
        if ((chat.type || "direct") !== "direct") return false;
        const participants = [...(chat.participants || [])].sort();
        return participants.length === 2 && participants.includes(authUser.phone) && participants.includes(phone);
      });
      const threadId = existing?.id || `direct-${[authUser.phone, phone].sort().join("-")}`;
      const lastMessage = existing?.messages?.[existing.messages.length - 1] || null;
      return {
        id: threadId,
        type: "direct",
        participants: [authUser.phone, phone],
        name: user.name || employee?.name || phone,
        roleLabel: getRoleLabel(user.role, language),
        department: employee?.department || user.managedDepartment || "-",
        branch: employee?.location || user.managedBranch || "-",
        profileImage: employee?.profileImage || "",
        lastMessage,
        messages: existing?.messages || [],
        pinnedBy: existing?.pinnedBy || [],
        mutedBy: existing?.mutedBy || [],
        unreadCount: (existing?.unreadBy || []).includes(authUser.phone) ? 1 : 0,
      };
    }).filter(Boolean);

    const groupThreads = normalizedChats
      .filter((chat) => (chat.type || "group") === "group" && (chat.participants || []).includes(authUser.phone))
      .map((chat) => {
        const lastMessage = chat.messages?.[chat.messages.length - 1] || null;
        return {
          ...chat,
          type: "group",
          name: chat.name || (language === "ar" ? "قروب بدون اسم" : "Untitled group"),
          roleLabel: language === "ar" ? "قروب" : "Group",
          department: `${chat.participants?.length || 0} ${language === "ar" ? "عضو" : "members"}`,
          branch: language === "ar" ? "قروب عمل" : "Work group",
          profileImage: "",
          lastMessage,
          unreadCount: (chat.unreadBy || []).includes(authUser.phone) ? 1 : 0,
        };
      });

    const loweredSearch = chatSearch.trim().toLowerCase();

    return [...groupThreads, ...directThreads]
      .filter((thread) => {
        if ((thread.blockedBy || []).includes(authUser?.phone)) return false;
        const isArchived = (thread.archivedBy || []).includes(authUser?.phone);
        if (chatFilter === "archived") {
          if (!isArchived) return false;
        } else if (isArchived) {
          return false;
        }
        if (chatFilter === "groups" && thread.type !== "group") return false;
        if (chatFilter === "direct" && thread.type !== "direct") return false;
        if (!loweredSearch) return true;
        return [thread.name, thread.roleLabel, thread.department, thread.branch, ...(thread.participants || [])]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(loweredSearch));
      })
      .sort((a, b) => {
        const aPinned = (a.pinnedBy || []).includes(authUser.phone) ? 1 : 0;
        const bPinned = (b.pinnedBy || []).includes(authUser.phone) ? 1 : 0;
        if (aPinned !== bPinned) return bPinned - aPinned;
        const aTime = a.lastMessage?.sentAt ? new Date(a.lastMessage.sentAt).getTime() : 0;
        const bTime = b.lastMessage?.sentAt ? new Date(b.lastMessage.sentAt).getTime() : 0;
        return bTime - aTime;
      });
  }, [authUser, systemUsers, employees, chats, language, canManageAll, canManageBranch, canManageDepartment, chatSearch, chatFilter, isProgrammerUser]);

  useEffect(() => {
    if (!isMobileView || !activeChatId) return;
    if (mobileChatView === "conversation" && !chatContacts.some((contact) => contact.id === activeChatId)) {
      setMobileChatView("list");
    }
  }, [isMobileView, mobileChatView, activeChatId, chatContacts]);

  useEffect(() => {
    if (!activeChatId && chatContacts.length) {
      setActiveChatId(chatContacts[0].id);
      return;
    }
    if (activeChatId && !chatContacts.some((contact) => contact.id === activeChatId)) {
      setActiveChatId(chatContacts[0]?.id || "");
    }
  }, [chatContacts, activeChatId]);

  const activeConversation = useMemo(
    () => chatContacts.find((contact) => contact.id === activeChatId) || null,
    [chatContacts, activeChatId]
  );

  const showMobileChatList = !isMobileView || mobileChatView === "list";
  const showMobileChatConversation = !isMobileView || mobileChatView === "conversation";

  useEffect(() => {
    if (!activeChatId || !authUser?.phone) return;
    setChats((prev) => prev.map((chat) => {
      if (chat.id !== activeChatId) return chat;
      if (!Array.isArray(chat.unreadBy) || !chat.unreadBy.includes(authUser.phone)) return chat;
      return { ...chat, unreadBy: chat.unreadBy.filter((phone) => phone !== authUser.phone) };
    }));
  }, [activeChatId, authUser?.phone]);

  useEffect(() => {
    setContactListMenuChatId("");
  }, [activeChatId, mobileChatView]);

  useEffect(() => {
    if (!isRecordingVoice || recordingPaused) return undefined;
    const timer = window.setInterval(() => setRecordingSeconds((prev) => prev + 1), 1000);
    return () => window.clearInterval(timer);
  }, [isRecordingVoice, recordingPaused]);

  const formatDuration = (value) => {
    const total = Number(value || 0);
    const mins = String(Math.floor(total / 60)).padStart(2, "0");
    const secs = String(total % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const mergeFloat32Chunks = (chunks) => {
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const result = new Float32Array(totalLength);
    let offset = 0;
    chunks.forEach((chunk) => {
      result.set(chunk, offset);
      offset += chunk.length;
    });
    return result;
  };

  const encodeWavFromFloat32 = (samples, sampleRate) => {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);
    const writeString = (offset, text) => {
      for (let i = 0; i < text.length; i += 1) view.setUint8(offset + i, text.charCodeAt(i));
    };
    writeString(0, "RIFF");
    view.setUint32(4, 36 + samples.length * 2, true);
    writeString(8, "WAVE");
    writeString(12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, "data");
    view.setUint32(40, samples.length * 2, true);
    let offset = 44;
    for (let i = 0; i < samples.length; i += 1) {
      const sample = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }
    return new Blob([view], { type: "audio/wav" });
  };

  const createChatMessage = (payload) => ({
    id: Date.now() + Math.floor(Math.random() * 1000),
    senderPhone: payload.senderPhone || authUser?.phone || "",
    type: payload.type || "text",
    text: payload.text || "",
    fileName: payload.fileName || "",
    duration: payload.duration || "",
    mediaUrl: payload.mediaUrl || "",
    mimeType: payload.mimeType || "",
    fileSize: payload.fileSize || 0,
    sentAt: payload.sentAt || new Date().toISOString(),
    system: Boolean(payload.system),
  });

  const upsertConversationWithMessage = (thread, message) => {
    setChats((prev) => {
      const index = prev.findIndex((chat) => chat.id === thread.id);
      if (index === -1) {
        return [{
          id: thread.id,
          type: thread.type,
          name: thread.name,
          participants: thread.participants,
          admins: thread.admins || (thread.type === "group" ? [authUser.phone] : []),
          pinnedBy: thread.pinnedBy || [],
          mutedBy: thread.mutedBy || [],
          archivedBy: thread.archivedBy || [],
          unreadBy: thread.unreadBy || [],
          lockedBy: thread.lockedBy || [],
          favoriteBy: thread.favoriteBy || [],
          messages: [message],
        }, ...prev];
      }
      return prev.map((chat, idx) => idx === index ? { ...chat, messages: [...(chat.messages || []), message] } : chat);
    });
  };

  const mutateActiveChat = (mutator) => {
    if (!activeConversation || !authUser) return;
    setChats((prev) => prev.map((chat) => chat.id === activeConversation.id ? mutator(chat) : chat));
  };

  const stopRecordingStream = () => {
    try {
      if (recordingProcessorRef.current) {
        recordingProcessorRef.current.disconnect();
        recordingProcessorRef.current.onaudioprocess = null;
        recordingProcessorRef.current = null;
      }
      if (recordingSourceRef.current) {
        recordingSourceRef.current.disconnect();
        recordingSourceRef.current = null;
      }
      if (recordingAudioContextRef.current) {
        recordingAudioContextRef.current.close?.().catch?.(() => {});
        recordingAudioContextRef.current = null;
      }
    } catch {}
    if (recordingStreamRef.current) {
      recordingStreamRef.current.getTracks().forEach((track) => track.stop());
      recordingStreamRef.current = null;
    }
  };

  const stopCameraStream = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current.getTracks().forEach((track) => track.stop());
      cameraStreamRef.current = null;
    }
    if (cameraVideoRef.current) {
      cameraVideoRef.current.pause?.();
      cameraVideoRef.current.srcObject = null;
    }
    setCameraReady(false);
  };

  const openCameraCapture = async () => {
    setAttachSheetOpen(false);
    setCameraError("");
    setCameraReady(false);

    if (isMobileView) {
      chatCameraInputRef.current?.click?.();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      chatCameraInputRef.current?.click?.();
      return;
    }

    const videoAttempts = [
      { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: { ideal: "environment" } },
      { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: "environment" },
      { width: { ideal: 1280 }, height: { ideal: 720 } },
      true,
    ];

    setCameraCaptureOpen(true);
    stopCameraStream();

    let stream = null;
    for (const videoConstraints of videoAttempts) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: false });
        if (stream) break;
      } catch (error) {
        console.error(error);
      }
    }

    if (!stream) {
      setCameraCaptureOpen(false);
      chatCameraInputRef.current?.click?.();
      return;
    }

    cameraStreamRef.current = stream;
    const videoEl = cameraVideoRef.current;
    if (videoEl) {
      videoEl.srcObject = stream;
      videoEl.setAttribute("playsinline", "true");
      videoEl.muted = true;
      try {
        await videoEl.play();
        setCameraReady(true);
      } catch (error) {
        console.error(error);
        setCameraError(language === "ar" ? "تعذر تشغيل معاينة الكاميرا. يمكنك اختيار صورة من الجهاز." : "Could not start the camera preview. You can choose an image from the device instead.");
      }
    }
  };

  const closeCameraCapture = () => {
    stopCameraStream();
    setCameraCaptureOpen(false);
    setCameraError("");
  };

  const captureCameraPhoto = () => {
    if (!activeConversation || !cameraVideoRef.current || !cameraCanvasRef.current) return;
    const video = cameraVideoRef.current;
    const canvas = cameraCanvasRef.current;
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, width, height);
    const mediaUrl = canvas.toDataURL("image/jpeg", 0.92);
    upsertConversationWithMessage(activeConversation, createChatMessage({
      type: "image",
      text: language === "ar" ? "تم التقاط صورة بالكاميرا" : "Captured with camera",
      fileName: `camera-${Date.now()}.jpg`,
      mediaUrl,
      mimeType: "image/jpeg",
    }));
    closeCameraCapture();
  };


  const toggleActiveChatFlag = (field) => {
    mutateActiveChat((chat) => {
      const current = new Set(chat[field] || []);
      if (current.has(authUser.phone)) current.delete(authUser.phone); else current.add(authUser.phone);
      return { ...chat, [field]: Array.from(current) };
    });
  };

  const toggleChatFlagById = (chatId, field) => {
    if (!chatId || !authUser?.phone) return;
    setChats((prev) => prev.map((chat) => {
      if (chat.id !== chatId) return chat;
      const current = new Set(chat[field] || []);
      if (current.has(authUser.phone)) current.delete(authUser.phone); else current.add(authUser.phone);
      return { ...chat, [field]: Array.from(current) };
    }));
  };

  const reactToMessage = (emoji) => {
    if (!selectedMessage || !activeConversation || !authUser) return;
    setChats((prev) => prev.map((chat) => {
      if (chat.id !== activeConversation.id) return chat;
      return {
        ...chat,
        messages: (chat.messages || []).map((msg) => {
          if (msg.id !== selectedMessage.id) return msg;
          const reactions = Array.isArray(msg.reactions) ? [...msg.reactions] : [];
          const idx = reactions.findIndex((item) => item.senderPhone === authUser.phone);
          if (idx >= 0 && reactions[idx].emoji === emoji) reactions.splice(idx, 1);
          else if (idx >= 0) reactions[idx] = { senderPhone: authUser.phone, emoji };
          else reactions.push({ senderPhone: authUser.phone, emoji });
          return { ...msg, reactions };
        }),
      };
    }));
    setMessageMenuOpen(false);
    setSelectedMessage(null);
  };

  const openMessageMenu = (message) => {
    setSelectedMessage(message);
    setMessageMenuOpen(true);
  };

  const deleteSelectedMessage = () => {
    if (!selectedMessage || !activeConversation) return;
    setChats((prev) => prev.map((chat) => chat.id === activeConversation.id ? { ...chat, messages: (chat.messages || []).filter((msg) => msg.id !== selectedMessage.id) } : chat));
    setMessageMenuOpen(false);
    setMessageMoreOpen(false);
    setSelectedMessage(null);
  };

  const copySelectedMessage = async () => {
    if (!selectedMessage?.text) return;
    try {
      await navigator.clipboard.writeText(selectedMessage.text);
    } catch {}
    setMessageMenuOpen(false);
  };

  const toggleSelectedMessageMeta = (field) => {
    if (!selectedMessage || !activeConversation) return;
    setChats((prev) => prev.map((chat) => chat.id === activeConversation.id ? {
      ...chat,
      messages: (chat.messages || []).map((msg) => msg.id === selectedMessage.id ? { ...msg, [field]: !msg[field] } : msg),
    } : chat));
    setMessageMenuOpen(false);
  };

  const sendChatMessage = () => {
    if (!authUser || !activeConversation || !chatDraft.trim()) return;
    upsertConversationWithMessage(activeConversation, createChatMessage({ text: chatDraft.trim() }));
    setChatDraft("");
  };

  const sendQuickAttachment = (kind) => {
    if (!authUser || !activeConversation) return;
    if (kind === "image") {
      openChatPhotos();
      return;
    }
    if (kind === "file") {
      openChatDocuments();
      return;
    }
    if (kind === "voice") {
      startVoiceRecording();
      return;
    }
    const payloads = {
      file: { type: "file", text: language === "ar" ? "تمت مشاركة ملف" : "File shared", fileName: "document.pdf" },
      poll: {
        type: "text",
        text: language === "ar" ? "تم إنشاء استطلاع رأي جديد" : "New poll created",
      },
    };
    upsertConversationWithMessage(activeConversation, createChatMessage(payloads[kind] || payloads.file));
  };


  const handleChatFileSelection = (event, kind = "file") => {
    const file = event.target.files?.[0];
    if (!file || !activeConversation || !authUser) return;
    const messageType = kind === "image" ? "image" : "file";
    const reader = new FileReader();
    reader.onload = () => {
      upsertConversationWithMessage(activeConversation, createChatMessage({
        type: messageType,
        text: kind === "image"
          ? (language === "ar" ? "تمت مشاركة صورة" : "Photo shared")
          : (language === "ar" ? "تمت مشاركة ملف" : "File shared"),
        fileName: file.name,
        mediaUrl: String(reader.result || ""),
        mimeType: file.type || (kind === "image" ? "image/*" : "application/octet-stream"),
        fileSize: Number(file.size || 0),
      }));
      event.target.value = "";
      setAttachSheetOpen(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAudioFileSelection = (event) => {
    const file = event.target.files?.[0];
    if (!file || !activeConversation || !authUser) return;
    const reader = new FileReader();
    reader.onload = () => {
      upsertConversationWithMessage(activeConversation, createChatMessage({
        type: "voice",
        text: language === "ar" ? "رسالة صوتية" : "Voice note",
        fileName: file.name || `voice-${Date.now()}.m4a`,
        mediaUrl: String(reader.result || ""),
        mimeType: file.type || "audio/*",
        fileSize: Number(file.size || 0),
        duration: "00:00",
      }));
      event.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const openChatCamera = () => {
    openCameraCapture();
  };

  const openChatPhotos = () => {
    chatPhotosInputRef.current?.click();
  };

  const openChatDocuments = () => {
    chatDocumentInputRef.current?.click();
  };

  const createGroupChat = () => {
    if (!authUser || !groupForm.name.trim()) return;

    const typedPhones = String(groupForm.phoneNumbers || "")
      .split(/[\s,،;\n]+/)
      .map((item) => item.trim())
      .filter(Boolean);

    const validPhones = Array.from(new Set(
      [...groupForm.members, ...typedPhones].filter((phone) =>
        phone !== authUser.phone && systemUsers.some((user) => user.phone === phone)
      )
    ));

    if (validPhones.length < 1) return;

    const nextGroup = {
      id: `group-${Date.now()}`,
      type: "group",
      name: groupForm.name.trim(),
      participants: [authUser.phone, ...validPhones],
      admins: [authUser.phone],
      pinnedBy: [],
      mutedBy: [],
      archivedBy: [],
      unreadBy: [],
      messages: [createChatMessage({ type: "system", system: true, text: `${t.chatGroupCreated}: ${groupForm.name.trim()}` })],
    };
    setChats((prev) => [nextGroup, ...prev]);
    setGroupDialogOpen(false);
    setGroupForm({ name: "", members: [], phoneNumbers: "" });
    setActiveChatId(nextGroup.id);
    if (isMobileView) setMobileChatView("conversation");
  };

  const toggleActiveChatPin = () => toggleActiveChatFlag("pinnedBy");

  const toggleActiveChatMute = () => toggleActiveChatFlag("mutedBy");
  const toggleActiveChatArchive = () => toggleActiveChatFlag("archivedBy");
  const toggleActiveChatUnread = () => toggleActiveChatFlag("unreadBy");
  const toggleActiveChatLock = () => toggleActiveChatFlag("lockedBy");
  const toggleActiveChatFavorite = () => toggleActiveChatFlag("favoriteBy");

  const clearActiveChatMessages = () => {
    mutateActiveChat((chat) => ({ ...chat, messages: [] }));
    setChatMoreOpen(false);
  };

  const leaveCurrentGroup = () => {
    if (!activeConversation || activeConversation.type !== "group" || !authUser) return;
    setChats((prev) => prev.map((chat) => chat.id === activeConversation.id ? {
      ...chat,
      participants: (chat.participants || []).filter((item) => item !== authUser.phone),
      messages: [...(chat.messages || []), createChatMessage({ type: "system", system: true, text: language === "ar" ? "غادر المستخدم المجموعة" : "User left the group" })],
    } : chat));
    setChatMoreOpen(false);
  };

  const startVoiceRecording = async () => {
    setAttachSheetOpen(false);
    if (isMobileView && chatAudioInputRef.current) {
      chatAudioInputRef.current.click();
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      chatAudioInputRef.current?.click?.();
      return;
    }

    try {
      stopRecordingStream();
      recordingChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      recordingStreamRef.current = stream;

      const mimeCandidates = [
        "audio/webm;codecs=opus",
        "audio/webm",
        "audio/ogg;codecs=opus",
        "audio/mp4",
      ];

      let selectedMimeType = "";
      for (const mime of mimeCandidates) {
        try {
          if (window.MediaRecorder?.isTypeSupported?.(mime)) {
            selectedMimeType = mime;
            break;
          }
        } catch {}
      }

      const recorder = selectedMimeType ? new MediaRecorder(stream, { mimeType: selectedMimeType }) : new MediaRecorder(stream);

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current = recorder;
      recorder.start(250);
      setIsRecordingVoice(true);
      setRecordingPaused(false);
      setRecordingSeconds(0);
    } catch (error) {
      console.error(error);
      upsertConversationWithMessage(activeConversation, createChatMessage({
        type: "system",
        system: true,
        text: language === "ar" ? "تعذر الوصول إلى الميكروفون." : "Microphone access was denied.",
      }));
      stopRecordingStream();
    }
  };

  const cancelVoiceRecording = () => {
    const recorder = mediaRecorderRef.current;
    recordingChunksRef.current = [];

    if (recorder && recorder.state !== "inactive") {
      recorder.ondataavailable = null;
      recorder.onstop = null;
      try {
        recorder.stop();
      } catch {}
    }

    stopRecordingStream();
    mediaRecorderRef.current = null;
    setIsRecordingVoice(false);
    setRecordingPaused(false);
    setRecordingSeconds(0);
  };

  const sendRecordedVoice = () => {
    if (!activeConversation) return;
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    const recordedDuration = recordingSeconds || 1;
    const recorderMimeType = recorder.mimeType || "audio/webm";

    const finalizeVoiceMessage = () => {
      const blob = new Blob(recordingChunksRef.current, { type: recorderMimeType });
      if (!blob.size) {
        cancelVoiceRecording();
        upsertConversationWithMessage(activeConversation, createChatMessage({
          type: "system",
          system: true,
          text: language === "ar" ? "لم يتم التقاط صوت من الميكروفون." : "No audio was captured from the microphone.",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        upsertConversationWithMessage(activeConversation, createChatMessage({
          type: "voice",
          text: language === "ar" ? "رسالة صوتية" : "Voice note",
          duration: formatDuration(recordedDuration),
          mediaUrl: String(reader.result || ""),
          mimeType: blob.type || recorderMimeType,
          fileName: "",
          fileSize: Number(blob.size || 0),
        }));
        mediaRecorderRef.current = null;
        recordingChunksRef.current = [];
        stopRecordingStream();
        setIsRecordingVoice(false);
        setRecordingPaused(false);
        setRecordingSeconds(0);
      };
      reader.readAsDataURL(blob);
    };

    if (recorder.state === "inactive") {
      finalizeVoiceMessage();
      return;
    }

    recorder.onstop = finalizeVoiceMessage;
    try {
      recorder.stop();
    } catch {
      finalizeVoiceMessage();
    }
  };

  useEffect(() => () => {
    stopRecordingStream();
    stopCameraStream();
  }, []);

  useEffect(() => {
    const recorder = mediaRecorderRef.current;
    if (!isRecordingVoice || !recorder) return undefined;

    try {
      if (recordingPaused && recorder.state === "recording") {
        recorder.pause();
      } else if (!recordingPaused && recorder.state === "paused") {
        recorder.resume();
      }
    } catch {}

    return undefined;
  }, [recordingPaused, isRecordingVoice]);

  const formatChatTime = (value) => {
    if (!value) return "";
    try {
      return new Date(value).toLocaleTimeString(language === "ar" ? "ar-EG" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const formatChatSnippet = (message) => {
    if (!message) return t.chatLastSeen;
    if (message.type === "voice") return `${language === "ar" ? "🎤 رسالة صوتية" : "🎤 Voice note"}${message.duration ? ` • ${message.duration}` : ""}`;
    if (message.type === "image") return `🖼️ ${message.fileName || (language === "ar" ? "صورة" : "Photo")}`;
    if (message.type === "file") return `📎 ${message.fileName || (language === "ar" ? "ملف" : "File")}`;
    return message.text || t.chatLastSeen;
  };

  const availableGroupMembers = useMemo(
    () => chatContacts.filter((item) => item.type === "direct"),
    [chatContacts]
  );

  const searchableChatUsers = useMemo(() => {
    if (!authUser) return [];
    const value = chatPhoneSearch.trim();
    if (!value) return [];
    return systemUsers
      .filter((user) => user.phone !== authUser.phone)
      .filter((user) => String(user.phone || "").includes(value))
      .filter((user) => !(["owner", "hr"].includes(user.role) && user.searchHidden))
      .map((user) => {
        const employee = employees.find((emp) => emp.phone === user.phone);
        return {
          ...user,
          department: employee?.department || user.managedDepartment || "-",
          branch: employee?.location || user.managedBranch || "-",
          profileImage: employee?.profileImage || "",
        };
      });
  }, [authUser, chatPhoneSearch, systemUsers, employees]);

  const openChatFromSearch = (user) => {
    if (!authUser || !user) return;
    const chatId = `direct-${[authUser.phone, user.phone].sort().join("-")}`;
    setActiveChatId(chatId);
    setChatSearchDialogOpen(false);
    setChatPhoneSearch("");
    if (isMobileView) setMobileChatView("conversation");
  };

  const deleteChatById = (chatId) => {
    if (!chatId) return;
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    setContactListMenuChatId("");
    if (activeChatId === chatId) {
      setActiveChatId("");
      if (isMobileView) setMobileChatView("list");
    }
  };

  const toggleMySearchVisibility = () => {
    if (!authUser || !["owner", "hr"].includes(authUser.role)) return;
    const nextHidden = !authUser.searchHidden;
    setSystemUsers((prev) => prev.map((user) => user.phone === authUser.phone ? { ...user, searchHidden: nextHidden } : user));
    setAuthUser((prev) => prev ? { ...prev, searchHidden: nextHidden } : prev);
  };

  const openSidebarTab = (tab) => {
    setActiveTab(tab);
    setSidebarOpen(false);
  };

  const getCurrentEmployee = () => employees.find((emp) => emp.phone === authUser?.phone) || null;
  const getFinancialRowEmployee = () => filteredEmployees.find((emp) => emp.id === expandedSalaryEmployeeId) || null;

  const openStatementDialog = (employee) => {
    if (!employee) return;
    setExpandedSalaryEmployeeId(employee.id);
    setStatementEmployee(employee);
    setStatementDialogOpen(true);
  };

  const getRequestResolvedAmount = (req, baseSalary = 0) => {
    if (!req) return 0;
    if (req.type === "خصم" && req.valueType === "percentage") {
      const percent = Number(req.percentage || req.amount || 0);
      return Math.max(0, (Number(baseSalary || 0) * percent) / 100);
    }
    return Math.max(0, Number(req.amount || 0));
  };


  const getAdvanceDeductionDetails = (employee, salaryBase = 0) => {
    if (!employee) return { mode: "automatic", valueType: "amount", configuredValue: 0, cappedValue: 0, maxAllowedValue: 0, amount: 0 };
    const mode = employee.advanceDeductionMode || "automatic";
    const valueType = employee.advanceDeductionValueType || "amount";
    const configuredValue = Math.max(0, Number(employee.advanceDeductionValue || 0));
    const currentAdvance = Math.max(0, Number(employee.advance || 0));
    const salary = Math.max(0, Number(salaryBase || employee.salary || employee.basicSalary || 0));
    const maxAllowedValue = valueType === "percentage"
      ? (salary > 0 ? (currentAdvance / salary) * 100 : 0)
      : currentAdvance;
    const cappedValue = Math.max(0, Math.min(configuredValue, maxAllowedValue));
    const calculatedAmount = valueType === "percentage"
      ? (salary * cappedValue) / 100
      : cappedValue;

    return {
      mode,
      valueType,
      configuredValue,
      cappedValue,
      maxAllowedValue,
      amount: Math.max(0, Math.min(currentAdvance, calculatedAmount)),
    };
  };

  const getAdvanceDeductionLabel = (employee, salaryBase = 0) => {
    const details = getAdvanceDeductionDetails(employee, salaryBase);
    const modeLabel = details.mode === "manual" ? (language === "ar" ? "يدوي" : "Manual") : (language === "ar" ? "تلقائي" : "Automatic");
    if (!details.cappedValue) return `${modeLabel} • ${language === "ar" ? "غير مضبوط" : "Not set"}`;
    const valueLabel = details.valueType === "percentage"
      ? `${Number(details.cappedValue).toFixed(2).replace(/\.00$/, "")} % ${language === "ar" ? "من الراتب" : "of salary"}`
      : currency(details.cappedValue);
    return `${modeLabel} • ${valueLabel}`;
  };

  const openAdvanceSettlementDialog = (employee) => {
    if (!employee) return;
    const nextEmployee = employees.find((emp) => emp.phone === employee.phone) || employee;
    setStatementEmployee(nextEmployee);
    setAdvanceSettlementForm({
      deductionMode: nextEmployee.advanceDeductionMode || "automatic",
      valueType: nextEmployee.advanceDeductionValueType || "amount",
      value: String(nextEmployee.advanceDeductionValue || ""),
    });
    setAdvanceSettlementDialogOpen(true);
  };

  const saveAdvanceSettlementSettings = () => {
    if (!statementEmployee) return;
    const previewEmployee = {
      ...statementEmployee,
      advanceDeductionMode: advanceSettlementForm.deductionMode || "automatic",
      advanceDeductionValueType: advanceSettlementForm.valueType || "amount",
      advanceDeductionValue: Math.max(0, Number(advanceSettlementForm.value || 0)),
    };
    const details = getAdvanceDeductionDetails(previewEmployee, statementData?.grossSalary || statementEmployee.salary || statementEmployee.basicSalary || 0);
    const nextValue = details.cappedValue;
    setEmployees((current) => current.map((emp) =>
      emp.phone === statementEmployee.phone
        ? {
            ...emp,
            advanceDeductionMode: advanceSettlementForm.deductionMode || "automatic",
            advanceDeductionValueType: advanceSettlementForm.valueType || "amount",
            advanceDeductionValue: nextValue,
          }
        : emp
    ));
    setStatementEmployee((prev) => prev ? {
      ...prev,
      advanceDeductionMode: advanceSettlementForm.deductionMode || "automatic",
      advanceDeductionValueType: advanceSettlementForm.valueType || "amount",
      advanceDeductionValue: nextValue,
    } : prev);
    setAdvanceSettlementForm((prev) => ({ ...prev, value: String(nextValue) }));
    setAdvanceSettlementDialogOpen(false);
  };

  const getEmployeeFinancialStatement = (employee) => {
    if (!employee) return null;
    const employeeRequests = requests
      .filter((req) => req.employeePhone === employee.phone && ["سلفة", "مكافأة", "خصم", "إنزال مرتب"].includes(req.type))
      .sort((a, b) => Number(b.id || 0) - Number(a.id || 0));

    const basicSalary = Number(employee.basicSalary || employee.salary || 0);
    const latestSalaryDeposit = employeeRequests.find((req) => req.type === "إنزال مرتب" && req.status === "معتمد") || null;
    // Base on the salary deposit if present, otherwise the basic salary.
    // (Using basicSalary avoids a stale employee.salary inflating the net.)
    const grossSalary = Number(latestSalaryDeposit?.salaryAmount || basicSalary || 0);

    const approvedAdvances = employeeRequests
      .filter((req) => req.type === "سلفة" && req.status === "معتمد")
      .reduce((sum, req) => sum + Number(req.amount || 0), 0);

    const approvedRewards = employeeRequests
      .filter((req) => req.type === "مكافأة" && req.status === "معتمد" && !req.appliedToSalaryDepositId)
      .reduce((sum, req) => sum + getRequestResolvedAmount(req, grossSalary), 0);

    const approvedDeductions = employeeRequests
      .filter((req) => req.type === "خصم" && req.status === "معتمد" && !req.appliedToSalaryDepositId)
      .reduce((sum, req) => sum + getRequestResolvedAmount(req, grossSalary), 0);

    const currentAdvanceBalance = Number(employee.advance || 0);
    const advanceDeduction = getAdvanceDeductionDetails(employee, grossSalary);
    const latestNetAmount = latestSalaryDeposit ? Math.max(0, Number(latestSalaryDeposit.amount || 0)) : null;
    // If no salary deposit has been made yet, the actual net is 0 (nothing paid
    // out). Only once a salary is deposited does the net reflect the amount.
    const baseNet = latestNetAmount !== null ? latestNetAmount : 0;
    // Rewards/deductions only affect the net once a salary deposit exists.
    const estimatedNet = latestSalaryDeposit
      ? Math.max(0, baseNet + approvedRewards - approvedDeductions)
      : 0;

    return {
      basicSalary,
      grossSalary,
      currentAdvanceBalance,
      advanceDeduction,
      approvedAdvances,
      approvedRewards,
      approvedDeductions,
      baseNet,
      estimatedNet,
      latestSalaryDeposit,
      transactions: employeeRequests.map((req) => ({
        ...req,
        resolvedAmount: getRequestResolvedAmount(req, grossSalary),
      })),
    };
  };

  const statementData = statementEmployee ? getEmployeeFinancialStatement(statementEmployee) : null;

  const openNotificationDialog = (requestItem) => {
    if (!requestItem) return;
    setSelectedNotification(requestItem);
    setNotificationDialogOpen(true);
  };

  const deleteStatementTransaction = (requestItem) => {
    if (!requestItem) return;
    if (!canManageAll) return;
    setTransactionToDelete(requestItem);
  };

  const confirmDeleteTransaction = () => {
    const requestItem = transactionToDelete;
    if (!requestItem || !canManageAll) { setTransactionToDelete(null); return; }

    const targetPhone = String(requestItem.employeePhone || "");

    // Reverse the balance effect on emp.advance for the relevant types.
    if (requestItem.status === "معتمد") {
      if (requestItem.type === "سلفة") {
        const amt = Number(requestItem.amount || 0);
        setEmployees((prev) => prev.map((emp) => emp.phone === targetPhone
          ? { ...emp, advance: Math.max(0, Number(emp.advance || 0) - amt) }
          : emp));
      } else if (requestItem.type === "إنزال مرتب") {
        const settled = Number(requestItem.advanceSettledAmount || 0);
        setEmployees((prev) => prev.map((emp) => emp.phone === targetPhone
          ? {
              ...emp,
              // Return the deducted amount to the advance balance...
              advance: Number(emp.advance || 0) + (settled > 0 ? settled : 0),
              // ...and clear the monthly advance deduction so net returns to full salary.
              advanceDeductionValue: 0,
            }
          : emp));
      }
      // مكافأة / خصم are derived dynamically from requests, so removing the
      // request below is enough to reverse their effect.
    }

    setRequests((prev) => prev.filter((req) => req.id !== requestItem.id));

    // Keep the open statement in sync with the reversed balances.
    if (requestItem.status === "معتمد") {
      setStatementEmployee((prev) => {
        if (!prev || prev.phone !== targetPhone) return prev;
        if (requestItem.type === "سلفة") {
          return { ...prev, advance: Math.max(0, Number(prev.advance || 0) - Number(requestItem.amount || 0)) };
        }
        if (requestItem.type === "إنزال مرتب") {
          const settled = Number(requestItem.advanceSettledAmount || 0);
          return { ...prev, advance: Number(prev.advance || 0) + (settled > 0 ? settled : 0), advanceDeductionValue: 0 };
        }
        return prev;
      });
    }

    setTransactionToDelete(null);
  };

  const getNotificationContent = (requestItem) => {
    if (!requestItem) return t.noReasonAvailable;
    if (requestItem.type === "إنزال مرتب") {
      const parts = [];
      if (requestItem.month) {
        parts.push(`${t.month}: ${requestItem.month}`);
      }
      parts.push(`${t.salaryAmount}: ${currency(requestItem.salaryAmount || 0)}`);
      if (Number(requestItem.rewardAmount || 0)) {
        parts.push(`${language === "ar" ? "المكافآت المعتمدة" : "Approved rewards"}: ${currency(requestItem.rewardAmount || 0)}`);
      }
      if (Number(requestItem.deductionAmount || 0)) {
        parts.push(`${t.deductionAmount}: ${currency(requestItem.deductionAmount || 0)}`);
      }
      if (Number(requestItem.advanceSettledAmount || 0)) {
        parts.push(`${language === "ar" ? "المخصوم من السلفة" : "Advance settlement"}: ${currency(requestItem.advanceSettledAmount || 0)}`);
      }
      if (Number(requestItem.amount || 0) || Number(requestItem.amount || 0) === 0) {
        parts.push(`${t.net}: ${currency(requestItem.amount || 0)}`);
      }
      if (requestItem.reason && requestItem.reason !== "-") {
        parts.push(`${t.deductionReason}: ${requestItem.reason}`);
      }
      return parts.join(" | ");
    }
    if (requestItem.type === "خصم" || requestItem.type === "مكافأة") {
      const parts = [];
      const actionLabel = requestItem.type === "خصم"
        ? (language === "ar" ? "الخصم" : "Deduction")
        : (language === "ar" ? "المكافأة" : "Reward");
      parts.push(`${actionLabel}: ${currency(requestItem.resolvedAmount || requestItem.amount || 0)}`);
      parts.push(`${language === "ar" ? "حالة التنفيذ" : "Execution status"}: ${getFinancialSettlementStatusLabel(requestItem)}`);
      if (requestItem.type === "خصم") {
        parts.push(`${language === "ar" ? "نوع الخصم" : "Deduction mode"}: ${requestItem.deductionMode === "automatic" ? (language === "ar" ? "تلقائي" : "Automatic") : (language === "ar" ? "يدوي" : "Manual")}`);
        if (requestItem.valueType === "percentage") {
          parts.push(`${language === "ar" ? "النسبة" : "Percentage"}: ${Number(requestItem.percentage || requestItem.amount || 0)}%`);
        }
      }
      const linkedSalary = getLinkedSalaryDeposit(requestItem);
      if (linkedSalary) {
        const salaryLabel = linkedSalary.month
          ? `${language === "ar" ? "مرتب شهر" : "Salary for month"} ${linkedSalary.month}`
          : (language === "ar" ? "إنزال المرتب" : "Salary deposit");
        parts.push(`${language === "ar" ? "تمت التسوية مع" : "Settled with"}: ${salaryLabel}`);
        parts.push(`${language === "ar" ? "صافي ذلك المرتب" : "Net salary on that deposit"}: ${currency(linkedSalary.amount || 0)}`);
      }
      if (requestItem.reason && requestItem.reason !== "-") {
        parts.push(`${t.reason}: ${requestItem.reason}`);
      }
      return parts.join(" | ");
    }
    return requestItem.reason && requestItem.reason !== "-" ? requestItem.reason : t.noReasonAvailable;
  };

  const getLinkedSalaryDeposit = (requestItem) => {
    if (!requestItem?.appliedToSalaryDepositId) return null;
    return requests.find((req) => req.type === "إنزال مرتب" && req.id === requestItem.appliedToSalaryDepositId) || null;
  };

  const getFinancialSettlementStatusLabel = (requestItem) => {
    if (!requestItem) return "-";
    if (requestItem.type === "إنزال مرتب") return requestItem.status || "-";
    if (!["خصم", "مكافأة"].includes(requestItem.type)) return requestItem.status || "-";

    if (requestItem.status === "مرفوض") {
      return language === "ar" ? "مرفوض" : "Rejected";
    }
    if (requestItem.status !== "معتمد") {
      return requestItem.status || "-";
    }

    if (requestItem.appliedToSalaryDepositId) {
      return requestItem.type === "خصم"
        ? (language === "ar" ? "تم الخصم" : "Deducted")
        : (language === "ar" ? "تمت الإضافة" : "Added to salary");
    }

    return language === "ar" ? "معلق - لم يخصم بعد" : "Pending - not settled yet";
  };


  const applyFinancialRequestEffect = (req) => {
    if (!req) return;
    if (req.type === "سلفة") {
      setEmployees((current) =>
        current.map((emp) =>
          emp.phone === req.employeePhone
            ? { ...emp, advance: Number(emp.advance || 0) + Number(req.amount || 0) }
            : emp
        )
      );
      return;
    }
    if (req.type === "خصم") {
      setEmployees((current) =>
        current.map((emp) =>
          emp.phone === req.employeePhone
            ? { ...emp, advance: Math.max(0, Number(emp.advance || 0) - Number(req.amount || 0)) }
            : emp
        )
      );
    }
  };

  const canOpenSalaryActions = (employee) => {
    if (!authUser || !employee) return false;
    if (canManageAll) return true;
    // Branch/department managers can open statements for any employee within
    // their visible scope (visibleEmployees is already permission-filtered).
    if (canManageBranch || canManageDepartment) {
      return visibleEmployees.some((emp) => emp.phone === employee.phone);
    }
    return effectiveRole === "employee" && authUser.phone === employee.phone;
  };



  const cancelRoleUpgrade = (request) => {
    if (!request) return;
    if (!canManageAll) return; // Owner/HR only.

    // Revert the user back to a regular employee and clear managed scope.
    setSystemUsers((prev) => prev.map((user) =>
      user.phone === request.employeePhone
        ? { ...user, role: "employee", managedDepartment: "", managedBranch: "" }
        : user
    ));

    // If the affected user is currently logged in, downgrade their session too.
    if (authUser?.phone === request.employeePhone) {
      setAuthUser((prev) => prev ? { ...prev, role: "employee", managedDepartment: "", managedBranch: "" } : prev);
      setViewMode("upgraded");
    }

    // Mark the upgrade request as cancelled in the history.
    setUpgradeRequests((prev) => prev.map((req) =>
      req.id === request.id ? { ...req, status: "ملغاة" } : req
    ));
  };

  const applyUserRoleUpgrade = (request) => {
    const employee = employees.find((emp) => emp.phone === request.employeePhone);
    const targetBranch = request.branch || employee?.location || "";
    const targetManagedDepartment = request.requestedRole === "department_manager"
      ? (request.managerDepartment || employee?.managerDepartment || "")
      : "all";
    // HR and owner have system-wide scope; branch manager is scoped to a branch.
    const isWideScope = request.requestedRole === "hr" || request.requestedRole === "owner";
    const resolvedManagedBranch = request.requestedRole === "branch_manager"
      ? targetBranch
      : (isWideScope ? "all" : targetBranch);

    setSystemUsers((prev) => {
      const exists = prev.some((user) => user.phone === request.employeePhone);
      if (exists) {
        return prev.map((user) =>
          user.phone === request.employeePhone
            ? {
                ...user,
                name: request.employeeName || user.name,
                role: request.requestedRole,
                managedDepartment: targetManagedDepartment,
                managedBranch: resolvedManagedBranch,
              }
            : user
        );
      }
      return [
        ...prev,
        {
          phone: request.employeePhone,
          password: "123456",
          role: request.requestedRole,
          name: request.employeeName,
          managedDepartment: targetManagedDepartment,
          managedBranch: resolvedManagedBranch,
          mustChangePassword: true,
          passwordChangedOnce: false,
        },
      ];
    });

    if (authUser?.phone === request.employeePhone) {
      setAuthUser((prev) =>
        prev
          ? {
              ...prev,
              name: request.employeeName || prev.name,
              role: request.requestedRole,
              managedDepartment: targetManagedDepartment,
              managedBranch: resolvedManagedBranch,
            }
          : prev
      );
    }
  };

  const submitUpgradeRequest = () => {
    if (!authUser || !canManageAll) return;
    if (!upgradeRequestForm.employeeName.trim() || !upgradeRequestForm.employeePhone.trim() || !upgradeRequestForm.requestedRole) return;

    const employee = employees.find((emp) => emp.phone === upgradeRequestForm.employeePhone.trim());
    const currentUser = systemUsers.find((user) => user.phone === upgradeRequestForm.employeePhone.trim());
    if (isHiddenAccount(currentUser)) return;
    const requestedRole = upgradeRequestForm.requestedRole;
    const selectedDepartment = requestedRole === "department_manager"
      ? (
          upgradeRequestForm.createNewDepartment
            ? upgradeRequestForm.newDepartmentName.trim()
            : upgradeRequestForm.managerDepartment.trim()
        )
      : "";
    const selectedBranch = requestedRole === "branch_manager"
      ? upgradeRequestForm.branch
      : (employee?.location || currentUser?.managedBranch || "");

    if (requestedRole === "branch_manager" && !selectedBranch) return;
    if (requestedRole === "department_manager" && !selectedDepartment) return;

    const request = {
      id: Date.now(),
      employeePhone: upgradeRequestForm.employeePhone.trim(),
      employeeName: upgradeRequestForm.employeeName.trim(),
      currentRole: currentUser?.role || "employee",
      requestedRole,
      reason: upgradeRequestForm.reason.trim() || "ترقية مباشرة من لوحة التحكم",
      department: employee?.department || "",
      managerDepartment: requestedRole === "department_manager"
        ? selectedDepartment
        : (employee?.managerDepartment || currentUser?.managedDepartment || ""),
      branch: selectedBranch,
      status: "معتمد",
      decidedBy: authUser?.name || "-",
      createdAt: new Date().toISOString().slice(0, 10),
    };

    setUpgradeRequests((prev) => [request, ...prev]);
    applyUserRoleUpgrade(request);
    setUpgradeRequestForm(emptyUpgradeRequestForm);
  };

  const approveUpgradeRequest = (requestId) => {
    const request = upgradeRequests.find((item) => item.id === requestId);
    if (!request || !canManageAll) return;

    setUpgradeRequests((prev) =>
      prev.map((item) =>
        item.id === requestId ? { ...item, status: "معتمد", decidedBy: authUser?.name || "-" } : item
      )
    );

    applyUserRoleUpgrade({ ...request, status: "معتمد", decidedBy: authUser?.name || "-" });
  };

  const rejectUpgradeRequest = (requestId) => {
    if (!canManageAll) return;
    setUpgradeRequests((prev) =>
      prev.map((item) =>
        item.id === requestId ? { ...item, status: "مرفوض", decidedBy: authUser?.name || "-" } : item
      )
    );
  };

  const handleLogin = () => {
    const normalizedPhone = String(loginData.phone || "").trim();
    const normalizedPassword = String(loginData.password || "").trim();
    const matchedUser = mergeSystemUsersWithHiddenAccounts(systemUsers).find(
      (user) => String(user.phone || "").trim() === normalizedPhone && String(user.password || "") === normalizedPassword
    );
    if (!matchedUser) {
      setLoginError(language === "ar" ? "رقم الهاتف أو كلمة المرور غير صحيحة" : "Phone number or password is incorrect.");
      return;
    }
    setIsAuthenticated(true);
    setAuthUser(matchedUser);
    setSystemUsers((prev) => mergeSystemUsersWithHiddenAccounts(prev));
    setLoginError("");
    if (matchedUser.mustChangePassword && !matchedUser.passwordChangedOnce) {
      setTimeout(() => openPasswordDialog(), 150);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthUser(null);
    setLoginData({ phone: "", password: "" });
    setLoginError("");
    setSettingsOpen(false);
    setPasswordDialogOpen(false);
    setSidebarOpen(false);
    setViewMode("upgraded");
  };

  const openResetSystemDialog = () => {
    setResetConfirmText("");
    setResetSystemMessage("");
    setResetSystemDialogOpen(true);
  };

  const exportSystemBackup = () => {
    // Full backup of all system data. JSON keeps an exact, restorable copy;
    // we also build a multi-sheet Excel workbook for human-readable review.
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-");
    const snapshot = {
      exportedAt: new Date().toISOString(),
      exportedBy: authUser?.name || "-",
      employees,
      requests,
      systemUsers,
      pendingAccounts,
      upgradeRequests,
      complaints,
      chats,
      chatCalls,
      feedbackEntries,
    };

    // 1) JSON backup (exact, for restoring).
    try {
      const jsonBlob = new Blob([JSON.stringify(snapshot, null, 2)], { type: "application/json;charset=utf-8;" });
      const jsonUrl = URL.createObjectURL(jsonBlob);
      const jsonLink = document.createElement("a");
      jsonLink.href = jsonUrl;
      jsonLink.download = `anis-hr-backup-${stamp}.json`;
      document.body.appendChild(jsonLink);
      jsonLink.click();
      document.body.removeChild(jsonLink);
      URL.revokeObjectURL(jsonUrl);
    } catch (e) {
      console.error("JSON backup failed:", e);
    }

    // 2) Excel workbook (readable, one sheet per data type).
    try {
      const workbook = XLSX.utils.book_new();
      const addSheet = (name, rows) => {
        const data = Array.isArray(rows) && rows.length ? rows : [{}];
        const sheet = XLSX.utils.json_to_sheet(data.map((row) => {
          // Flatten nested objects/arrays to strings so Excel cells stay clean.
          const flat = {};
          Object.keys(row || {}).forEach((key) => {
            const val = row[key];
            flat[key] = val && typeof val === "object" ? JSON.stringify(val) : val;
          });
          return flat;
        }));
        XLSX.utils.book_append_sheet(workbook, sheet, name.slice(0, 31));
      };
      addSheet("Employees", employees);
      addSheet("Requests", requests);
      addSheet("Users", systemUsers);
      addSheet("PendingAccounts", pendingAccounts);
      addSheet("UpgradeRequests", upgradeRequests);
      addSheet("Complaints", complaints);
      addSheet("Feedback", feedbackEntries);
      XLSX.writeFile(workbook, `anis-hr-backup-${stamp}.xlsx`);
    } catch (e) {
      console.error("Excel backup failed:", e);
    }

    setResetSystemMessage(language === "ar" ? "تم تنزيل النسخة الاحتياطية (JSON و Excel)." : "Backup downloaded (JSON and Excel).");
  };

  const restoreSystemBackup = (file) => {
    if (!file) return;
    if (!["owner", "hr"].includes(authUser?.role)) {
      setResetSystemMessage(language === "ar" ? "استرجاع النسخة متاح للمالك أو HR فقط." : "Restore is available to owner or HR only.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(String(e.target?.result || "{}"));
        if (!data || typeof data !== "object") throw new Error("bad file");
        // Restore each collection if present in the backup.
        if (Array.isArray(data.employees)) setEmployees(normalizeEmployeesCollection(data.employees.map((x) => ({ ...x }))));
        if (Array.isArray(data.requests)) setRequests(data.requests);
        if (Array.isArray(data.systemUsers)) setSystemUsers(mergeSystemUsersWithHiddenAccounts(data.systemUsers));
        if (Array.isArray(data.pendingAccounts)) setPendingAccounts(data.pendingAccounts);
        if (Array.isArray(data.upgradeRequests)) setUpgradeRequests(data.upgradeRequests);
        if (Array.isArray(data.complaints)) setComplaints(data.complaints);
        if (Array.isArray(data.chats)) setChats(data.chats);
        if (Array.isArray(data.chatCalls)) setChatCalls(data.chatCalls);
        if (Array.isArray(data.feedbackEntries)) setFeedbackEntries(data.feedbackEntries);
        setResetSystemMessage(language === "ar" ? "تم استرجاع البيانات من النسخة الاحتياطية بنجاح." : "Data restored from backup successfully.");
      } catch (err) {
        setResetSystemMessage(language === "ar" ? "تعذّر قراءة الملف. تأكد أنه ملف نسخة احتياطية JSON صحيح." : "Could not read the file. Make sure it is a valid JSON backup.");
      }
    };
    reader.onerror = () => {
      setResetSystemMessage(language === "ar" ? "حدث خطأ أثناء قراءة الملف." : "Error reading the file.");
    };
    reader.readAsText(file);
  };

  const handleResetSystem = () => {
    // Owner-only, irreversible. Restores default seed data and clears all
    // operational data (requests, messages, reports, complaints, etc.).
    if (authUser?.role !== "owner") {
      setResetSystemMessage(language === "ar" ? "هذه العملية متاحة للمالك فقط." : "This action is available to the owner only.");
      return;
    }
    if (String(resetConfirmText || "").trim() !== "تصفير") {
      setResetSystemMessage(language === "ar" ? "اكتب كلمة \"تصفير\" بالضبط لتأكيد العملية." : "Type \"تصفير\" exactly to confirm.");
      return;
    }

    setEmployees(normalizeEmployeesCollection(initialEmployees.map((emp) => ({ ...emp }))));
    setRequests(initialRequests.map((req) => ({ ...req })));
    // Keep login accounts so the owner is not locked out; restore defaults + hidden accounts.
    setSystemUsers(mergeSystemUsersWithHiddenAccounts(initialSystemUsers.map((user) => ({ ...user }))));
    setPendingAccounts([]);
    setUpgradeRequests([]);
    setComplaints(initialComplaints.map((item) => ({ ...item })));
    setChats(initialChats.map((chat) => ({ ...chat })));
    setChatCalls(initialChatCalls.map((call) => ({ ...call })));
    setFeedbackEntries(initialFeedbackEntries.map((item) => ({ ...item })));

    // Clear saved attendance reports from storage.
    try {
      localStorage.setItem(STORAGE_KEYS.attendanceReports, JSON.stringify([]));
    } catch {}
    setAttendanceReportsVersion((prev) => prev + 1);

    setResetSystemDialogOpen(false);
    setResetConfirmText("");
    setResetSystemMessage("");
    setSettingsOpen(false);
    setActiveTab("employees");
  };

  const openStartEmptyDialog = () => {
    setStartEmptyConfirmText("");
    setStartEmptyMessage("");
    setStartEmptyDialogOpen(true);
  };

  const handleStartEmpty = () => {
    // Owner-only, irreversible. Wipes ALL data and starts from scratch,
    // keeping only the current owner's login account (plus the hidden
    // programmer account so the system stays operable).
    if (authUser?.role !== "owner") {
      setStartEmptyMessage(language === "ar" ? "هذه العملية متاحة للمالك فقط." : "This action is available to the owner only.");
      return;
    }
    if (String(startEmptyConfirmText || "").trim() !== "بدء فارغ") {
      setStartEmptyMessage(language === "ar" ? "اكتب \"بدء فارغ\" بالضبط لتأكيد العملية." : "Type \"بدء فارغ\" exactly to confirm.");
      return;
    }

    // Keep only the logged-in owner account (so they are not locked out).
    const ownerAccount = systemUsers.find((u) => u.phone === authUser?.phone && u.role === "owner");
    const keptUsers = ownerAccount ? [{ ...ownerAccount }] : [];

    setEmployees([]);
    setRequests([]);
    // mergeSystemUsersWithHiddenAccounts re-adds the hidden programmer account.
    setSystemUsers(mergeSystemUsersWithHiddenAccounts(keptUsers));
    setPendingAccounts([]);
    setUpgradeRequests([]);
    setComplaints([]);
    setChats([]);
    setChatCalls([]);
    setFeedbackEntries([]);

    try {
      localStorage.setItem(STORAGE_KEYS.attendanceReports, JSON.stringify([]));
    } catch {}
    setAttendanceReportsVersion((prev) => prev + 1);

    setStartEmptyDialogOpen(false);
    setStartEmptyConfirmText("");
    setStartEmptyMessage("");
    setSettingsOpen(false);
    setActiveTab("employees");
  };

  const clearEmployeesData = async () => {
    // Owner-only, irreversible. Clears all operational employee data
    // (attendance, financial movements, requests, complaints) and resets each
    // employee's advance balance to 0 — but KEEPS the employees themselves and
    // their login accounts.
    if (authUser?.role !== "owner") {
      setClearDataMessage(language === "ar" ? "هذه العملية متاحة للمالك فقط." : "This action is available to the owner only.");
      return;
    }
    if (String(clearDataConfirmText || "").trim() !== "مسح") {
      setClearDataMessage(language === "ar" ? "اكتب كلمة \"مسح\" بالضبط لتأكيد العملية." : "Type \"مسح\" exactly to confirm.");
      return;
    }

    // Build the cleared collections.
    const clearedRequests = [];
    const clearedComplaints = [];
    const clearedEmployees = employees.map((emp) => {
      const base = Number(emp.basicSalary || emp.salary || 0);
      return {
        ...emp,
        // Restore salary to the basic salary so the net returns to base
        // (any salary bumps from prior salary deposits are undone).
        salary: base,
        basicSalary: base,
        advance: 0,
        advanceDeductionValue: 0,
      };
    });

    // Apply locally.
    setRequests(clearedRequests);
    setComplaints(clearedComplaints);
    setEmployees(clearedEmployees);

    // Clear the fingerprint/attendance reports stored locally.
    try {
      localStorage.setItem(STORAGE_KEYS.attendanceReports, JSON.stringify([]));
    } catch {}
    setAttendanceReportsVersion((prev) => prev + 1);

    // Push the cleared state to the cloud immediately so it persists and does
    // NOT get re-synced back from the old cloud snapshot.
    try {
      await forceRemoteSaveSnapshot({
        employees: clearedEmployees,
        requests: clearedRequests,
        users: systemUsers,
        pending: pendingAccounts,
        upgrades: upgradeRequests,
        complaints: clearedComplaints,
        chats,
        chatCalls,
        feedback: feedbackEntries,
        attendanceReports: [],
      });
    } catch (e) {
      console.error("Clear data cloud save failed:", e);
    }

    setClearDataDialogOpen(false);
    setClearDataConfirmText("");
    setClearDataMessage("");
    setSettingsOpen(false);
  };

  const openClearDataDialog = () => {
    setClearDataConfirmText("");
    setClearDataMessage("");
    setClearDataDialogOpen(true);
  };

  const openPasswordDialog = () => {
    setPasswordMessage("");
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setPasswordDialogOpen(true);
  };

  const changePassword = () => {
    if (!authUser) return;
    if (!passwordForm.newPassword || !passwordForm.confirmPassword) {
      setPasswordMessage(language === "ar" ? "اكتب كلمة المرور الجديدة وأكدها" : "Enter and confirm the new password.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage(language === "ar" ? "تأكيد كلمة المرور غير مطابق" : "Password confirmation does not match.");
      return;
    }
    if (!authUser.mustChangePassword && passwordForm.currentPassword !== authUser.password) {
      setPasswordMessage(language === "ar" ? "كلمة المرور الحالية غير صحيحة" : "Current password is incorrect.");
      return;
    }
    const nextUsers = systemUsers.map((user) =>
      user.phone === authUser.phone
        ? { ...user, password: passwordForm.newPassword, mustChangePassword: false, passwordChangedOnce: true }
        : user
    );
    const nextAuth = { ...authUser, password: passwordForm.newPassword, mustChangePassword: false, passwordChangedOnce: true };
    setSystemUsers(nextUsers);
    setAuthUser(nextAuth);
    setPasswordMessage(language === "ar" ? "تم تغيير كلمة المرور بنجاح" : "Password changed successfully.");
    setTimeout(() => {
      setPasswordDialogOpen(false);
      setPasswordMessage("");
    }, 800);
  };

  const submitRegisterRequest = () => {
    const normalizedName = String(registerForm.name || "").trim().replace(/\s+/g, " ");
    const normalizedPhone = String(registerForm.phone || "").trim();
    const normalizedPassword = String(registerForm.password || "");
    const normalizedDepartment = String(registerForm.department || "").trim();
    const normalizedEmail = String(registerForm.email || "").trim();
    const normalizedLocation = String(registerForm.location || "").trim();

    if (!normalizedName || !normalizedPhone || !normalizedPassword || !normalizedLocation) {
      setRegisterMessage(language === "ar" ? "املأ الاسم ورقم الهاتف وكلمة المرور والفرع" : "Fill in name, phone, password and branch.");
      return;
    }

    const nameParts = normalizedName.split(" ").filter(Boolean);
    if (nameParts.length < 3) {
      setRegisterMessage(language === "ar" ? "الاسم يجب أن يكون ثلاثيًا على الأقل" : "Name must be at least three parts.");
      return;
    }

    if (!/^09[1-4]\d{7}$/.test(normalizedPhone)) {
      setRegisterMessage(
        language === "ar"
          ? "رقم الهاتف يجب أن يبدأ بـ 091 أو 092 أو 093 أو 094 ثم 7 أرقام فقط"
          : "Phone must start with 091, 092, 093 or 094 then 7 digits."
      );
      return;
    }

    if (normalizedPassword.length < 4) {
      setRegisterMessage(language === "ar" ? "كلمة المرور يجب ألا تقل عن 4 خانات أو أحرف أو رموز" : "Password must be at least 4 characters.");
      return;
    }

    if (normalizedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setRegisterMessage(language === "ar" ? "البريد الإلكتروني غير صحيح" : "Email address is invalid.");
      return;
    }

    const existsUser = systemUsers.some((user) => String(user.phone || "").trim() === normalizedPhone);
    const existsPending = pendingAccounts.some((acc) => String(acc.phone || "").trim() === normalizedPhone && acc.status === "بانتظار الاعتماد");
    if (existsUser || existsPending) {
      setRegisterMessage(language === "ar" ? "رقم الهاتف مستخدم بالفعل أو لديه طلب مفتوح" : "Phone number is already used or has an open request.");
      return;
    }

    setPendingAccounts((prev) => [
      {
        id: Date.now(),
        ...registerForm,
        name: normalizedName,
        phone: normalizedPhone,
        password: normalizedPassword,
        department: normalizedDepartment,
        email: normalizedEmail,
        location: normalizedLocation,
        status: "بانتظار الاعتماد",
        approvedBy: "",
        addedToEmployees: false,
      },
      ...prev,
    ]);
    setRegisterForm(emptyRegisterForm);
    setShowRegister(false);
    setRegisterMessage("");
  };

  const addEmployee = () => {
    if (!form.name || !form.department || !form.phone || !form.password) return;
    if (employees.some((emp) => emp.phone === form.phone) || systemUsers.some((u) => u.phone === form.phone)) return;

    const employee = {
      id: Date.now(),
      name: form.name,
      fingerprintId: String(form.fingerprintId || "").trim(),
      department: form.department,
      managerDepartment: form.managerDepartment,
      location: form.location,
      phone: form.phone,
      email: form.email,
      description: form.description,
      basicSalary: Number(form.basicSalary || form.salary || 0),
      salary: Number(form.salary || 0),
      advance: Number(form.advance || 0),
      leaveBalance: Number(form.leaveBalance || 0),
      workHours: Number(form.workHours || 0),
      shift: form.shift || "morning",
      requiredHours: Number(form.requiredHours || 0),
      requiredMinutes: Number(form.requiredMinutes || 0),
      fromHour: form.fromHour || "",
      toHour: form.toHour || "",
      attendanceLateDeductionMode: form.attendanceLateDeductionMode || "automatic",
      attendanceLateValueType: form.attendanceLateValueType || "amount",
      attendanceLateValue: Number(form.attendanceLateValue || 0),
      attendanceAbsenceDeductionMode: form.attendanceAbsenceDeductionMode || "automatic",
      attendanceAbsenceValueType: form.attendanceAbsenceValueType || "amount",
      attendanceAbsenceValue: Number(form.attendanceAbsenceValue || 0),
    };

    setEmployees((prev) => [employee, ...prev]);
    setSystemUsers((prev) => [
      ...prev,
      {
        phone: form.phone,
        password: form.password,
        role: "employee",
        name: form.name,
        managedDepartment: form.managerDepartment || form.department,
        managedBranch: form.location || "",
        mustChangePassword: true,
        passwordChangedOnce: false,
      },
    ]);
    setForm(emptyForm);
    setAddDialogOpen(false);
  };

  const approvePendingAccount = (accountId) => {
    const account = pendingAccounts.find((item) => item.id === accountId);
    if (!account) return;
    setPendingAccounts((prev) =>
      prev.map((item) =>
        item.id === accountId ? { ...item, status: "معتمد", approvedBy: authUser?.name || "-" } : item
      )
    );
    if (!systemUsers.some((user) => user.phone === account.phone)) {
      setSystemUsers((prev) => [
        ...prev,
        {
          phone: account.phone,
          password: account.password,
          role: "employee",
          name: account.name,
          managedDepartment: account.managerDepartment || account.department || "",
          mustChangePassword: true,
          passwordChangedOnce: false,
        },
      ]);
    }
  };

  const rejectPendingAccount = (accountId) => {
    setPendingAccounts((prev) =>
      prev.map((item) =>
        item.id === accountId ? { ...item, status: "مرفوض", approvedBy: authUser?.name || "-" } : item
      )
    );
  };

  const openCompleteEmployeeData = (account) => {
    setSelectedPendingAccount(account);
    setCompleteForm({
      ...emptyForm,
      name: account.name || "",
      department: account.department || "",
      managerDepartment: account.managerDepartment || "",
      location: account.location || "",
      phone: account.phone || "",
      password: account.password || "",
      email: account.email || "",
      basicSalary: String(account.basicSalary || account.salary || ""),
      salary: String(account.salary || ""),
      advance: String(account.advance || ""),
      leaveBalance: String(account.leaveBalance || ""),
      workHours: String(account.workHours || 8),
      shift: account.shift || "morning",
      fromHour: account.fromHour || "",
      toHour: account.toHour || "",
      description: account.description || "",
      attendanceLateDeductionMode: account.attendanceLateDeductionMode || "automatic",
      attendanceLateValueType: account.attendanceLateValueType || "amount",
      attendanceLateValue: String(account.attendanceLateValue || ""),
      attendanceAbsenceDeductionMode: account.attendanceAbsenceDeductionMode || "automatic",
      attendanceAbsenceValueType: account.attendanceAbsenceValueType || "amount",
      attendanceAbsenceValue: String(account.attendanceAbsenceValue || ""),
    });
    setCompleteDialogOpen(true);
  };

  const completeEmployeeData = () => {
    if (!selectedPendingAccount) return;
    const employeeRecord = {
      id: selectedPendingAccount.employeeId || Date.now(),
      name: completeForm.name,
      department: completeForm.department,
      managerDepartment: completeForm.managerDepartment,
      location: completeForm.location,
      phone: completeForm.phone,
      email: completeForm.email,
      description: completeForm.description,
      basicSalary: Number(completeForm.basicSalary || completeForm.salary || 0),
      salary: Number(completeForm.salary || 0),
      advance: Number(completeForm.advance || 0),
      leaveBalance: Number(completeForm.leaveBalance || 0),
      workHours: Number(completeForm.workHours || 0),
      shift: completeForm.shift || "morning",
      fromHour: completeForm.fromHour || "",
      toHour: completeForm.toHour || "",
      attendanceLateDeductionMode: completeForm.attendanceLateDeductionMode || "automatic",
      attendanceLateValueType: completeForm.attendanceLateValueType || "amount",
      attendanceLateValue: Number(completeForm.attendanceLateValue || 0),
      attendanceAbsenceDeductionMode: completeForm.attendanceAbsenceDeductionMode || "automatic",
      attendanceAbsenceValueType: completeForm.attendanceAbsenceValueType || "amount",
      attendanceAbsenceValue: Number(completeForm.attendanceAbsenceValue || 0),
    };

    setEmployees((prev) => {
      const exists = prev.some((emp) => emp.phone === selectedPendingAccount.phone);
      return exists
        ? prev.map((emp) => (emp.phone === selectedPendingAccount.phone ? { ...emp, ...employeeRecord } : emp))
        : [employeeRecord, ...prev];
    });

    setSystemUsers((prev) =>
      prev.map((user) =>
        user.phone === completeForm.phone
          ? {
              ...user,
              name: completeForm.name,
              password: completeForm.password || user.password,
              managedDepartment: completeForm.managerDepartment || completeForm.department,
              managedBranch: completeForm.location || user.managedBranch || "",
            }
          : user
      )
    );

    setPendingAccounts((prev) =>
      prev.map((item) =>
        item.id === selectedPendingAccount.id ? { ...item, addedToEmployees: true, employeeId: employeeRecord.id } : item
      )
    );

    setCompleteDialogOpen(false);
    setSelectedPendingAccount(null);
  };

  const openEmployeeDetails = (employee) => {
    setSelectedEmployee(employee);
    setEmployeeDetailsOpen(true);
  };

  const openEditEmployee = (employee) => {
    setSelectedEmployee(employee);
    setEditForm({
      ...emptyForm,
      name: employee.name || "",
      fingerprintId: String(employee.fingerprintId || ""),
      department: employee.department || "",
      password: systemUsers.find((u) => u.phone === employee.phone)?.password || "123456",
      managerDepartment: employee.managerDepartment || "",
      location: employee.location || "",
      phone: employee.phone || "",
      email: employee.email || "",
      description: employee.description || "",
      basicSalary: String(employee.basicSalary || employee.salary || ""),
      salary: String(employee.salary || ""),
      advance: String(employee.advance || ""),
      leaveBalance: String(employee.leaveBalance || ""),
      workHours: String(employee.workHours || ""),
      shift: employee.shift || "morning",
      requiredHours: employee.requiredHours != null ? String(employee.requiredHours) : "",
      requiredMinutes: employee.requiredMinutes != null ? String(employee.requiredMinutes) : "",
      fromHour: employee.fromHour || "",
      toHour: employee.toHour || "",
      attendanceLateDeductionMode: employee.attendanceLateDeductionMode || "automatic",
      attendanceLateValueType: employee.attendanceLateValueType || "amount",
      attendanceLateValue: String(employee.attendanceLateValue || ""),
      attendanceAbsenceDeductionMode: employee.attendanceAbsenceDeductionMode || "automatic",
      attendanceAbsenceValueType: employee.attendanceAbsenceValueType || "amount",
      attendanceAbsenceValue: String(employee.attendanceAbsenceValue || ""),
    });
    setEditDialogOpen(true);
  };

  const updateEmployeeFingerprintId = (employeeId, value) => {
    const clean = String(value || "").replace(/^'+/, "").trim();
    setEmployees((prev) => prev.map((emp) => emp.id === employeeId ? { ...emp, fingerprintId: clean } : emp));
  };

  const saveEmployeeEdit = async () => {
    if (!selectedEmployee) return;
    if (employees.some((emp) => emp.phone === editForm.phone && emp.id !== selectedEmployee.id)) return;

    const updatedEmployees = employees.map((emp) =>
      emp.id === selectedEmployee.id
        ? {
            ...emp,
            name: editForm.name,
            fingerprintId: String(editForm.fingerprintId || "").trim(),
            department: editForm.department,
            managerDepartment: editForm.managerDepartment,
            location: editForm.location,
            phone: editForm.phone,
            email: editForm.email,
            description: editForm.description,
            basicSalary: Number(editForm.basicSalary || editForm.salary || 0),
            salary: Number(editForm.salary || 0),
            advance: Number(editForm.advance || 0),
            leaveBalance: Number(editForm.leaveBalance || 0),
            workHours: Number(editForm.workHours || 0),
            shift: editForm.shift || "morning",
            requiredHours: Number(editForm.requiredHours || 0),
            requiredMinutes: Number(editForm.requiredMinutes || 0),
            fromHour: editForm.fromHour || "",
            toHour: editForm.toHour || "",
            attendanceLateDeductionMode: editForm.attendanceLateDeductionMode || "automatic",
            attendanceLateValueType: editForm.attendanceLateValueType || "amount",
            attendanceLateValue: Number(editForm.attendanceLateValue || 0),
            attendanceAbsenceDeductionMode: editForm.attendanceAbsenceDeductionMode || "automatic",
            attendanceAbsenceValueType: editForm.attendanceAbsenceValueType || "amount",
            attendanceAbsenceValue: Number(editForm.attendanceAbsenceValue || 0),
          }
        : emp
    );

    const existingAccount = systemUsers.find((user) => user.phone === selectedEmployee.phone);
    let updatedUsers;
    if (existingAccount) {
      updatedUsers = systemUsers.map((user) =>
        user.phone === selectedEmployee.phone
          ? {
              ...user,
              phone: editForm.phone,
              password: editForm.password || user.password,
              name: editForm.name,
              managedDepartment: editForm.managerDepartment || editForm.department,
              managedBranch: editForm.location || user.managedBranch || "",
            }
          : user
      );
    } else {
      updatedUsers = [
        ...systemUsers,
        {
          phone: editForm.phone,
          password: editForm.password || "123456",
          role: "employee",
          name: editForm.name,
          managedDepartment: editForm.managerDepartment || editForm.department || "",
          managedBranch: editForm.location || "",
          mustChangePassword: false,
        },
      ];
    }

    setEmployees(updatedEmployees);
    setSystemUsers(updatedUsers);

    // Push to the cloud immediately so the password/account change is not
    // overwritten by the old cloud snapshot on the next sync.
    try {
      await forceRemoteSaveSnapshot({
        employees: updatedEmployees,
        requests,
        users: updatedUsers,
        pending: pendingAccounts,
        upgrades: upgradeRequests,
        complaints,
        chats,
        chatCalls,
        feedback: feedbackEntries,
      });
    } catch (e) {
      console.error("Save employee cloud sync failed:", e);
    }

    setEditDialogOpen(false);
    setSelectedEmployee(null);
  };

  const deleteEmployee = (id) => {
    const target = employees.find((emp) => emp.id === id);
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
    if (target) {
      setSystemUsers((prev) => prev.filter((user) => user.phone !== target.phone));
    }
  };

  const handleEmployeeImageChange = (event, employeePhone) => {
    const file = event.target.files?.[0];
    if (!file || !employeePhone) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      if (!dataUrl) return;
      setEmployees((prev) =>
        prev.map((emp) => (emp.phone === employeePhone ? { ...emp, profileImage: dataUrl } : emp))
      );
      setSelectedEmployee((prev) => (prev && prev.phone === employeePhone ? { ...prev, profileImage: dataUrl } : prev));
    };
    reader.readAsDataURL(file);
  };

  const normalizeLeaveDateValue = (value) => {
    const raw = String(value || "").trim();
    if (!raw) return "";

    const isoMatch = raw.match(/(19|20)\d{2}-\d{2}-\d{2}/);
    if (isoMatch) return isoMatch[0];

    const cleaned = raw.replace(/[.\\]/g, "/").replace(/-/g, "/").replace(/\s+/g, "");
    const dmyMatch = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (dmyMatch) {
      const day = Number(dmyMatch[1]);
      const month = Number(dmyMatch[2]);
      const year = Number(dmyMatch[3]);
      if (year >= 1900 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
        return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      }
    }

    return "";
  };

  const isValidNormalizedLeaveDate = (value) => {
    if (!value) return false;
    const [yearText, monthText, dayText] = String(value).split("-");
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);
    if (!year || !month || !day) return false;
    if (year < 1900 || year > 2100) return false;
    const candidate = new Date(Date.UTC(year, month - 1, day));
    return (
      candidate.getUTCFullYear() === year &&
      candidate.getUTCMonth() === month - 1 &&
      candidate.getUTCDate() === day
    );
  };

  const getApprovedLeaveDays = (request) => {
    if (!request || request.type !== "إجازة") return 0;
    const fromValue = normalizeLeaveDateValue(request.leaveFrom);
    const toValue = normalizeLeaveDateValue(request.leaveTo);
    if (!isValidNormalizedLeaveDate(fromValue) || !isValidNormalizedLeaveDate(toValue)) return 0;
    const start = new Date(`${fromValue}T00:00:00`);
    const end = new Date(`${toValue}T00:00:00`);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) return 0;
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / 86400000) + 1;
    return Math.max(0, diffDays);
  };

  useEffect(() => {
    const requestsNeedingGuard = requests.filter(
      (req) => req.type === "إجازة" && req.status === "معتمد" && req.leaveBalanceApplied && Number(req.leaveDaysApproved || 0) <= 0
    );

    if (!requestsNeedingGuard.length) return;

    let changed = false;
    const nextRequests = requests.map((req) => {
      const normalizedFrom = normalizeLeaveDateValue(req.leaveFrom);
      const normalizedTo = normalizeLeaveDateValue(req.leaveTo);
      if (req.type !== "إجازة" || req.status !== "معتمد" || !req.leaveBalanceApplied || Number(req.leaveDaysApproved || 0) > 0) {
        return req;
      }
      if (!normalizedFrom || !normalizedTo) {
        changed = true;
        return {
          ...req,
          leaveBalanceApplied: false,
          leaveDaysApproved: 0,
        };
      }
      return req;
    });

    if (changed) {
      setRequests(nextRequests);
    }
  }, [requests]);

  useEffect(() => {
    const refundableRequests = requests.filter(
      (req) =>
        req.type === "إجازة" &&
        req.status === "معتمد" &&
        req.leaveBalanceApplied &&
        Number(req.leaveDaysApproved || 0) > 0 &&
        (!normalizeLeaveDateValue(req.leaveFrom) || !normalizeLeaveDateValue(req.leaveTo)) &&
        !req.leaveBalanceRefunded
    );

    if (!refundableRequests.length) return;

    let changed = false;
    const nextEmployees = employees.map((emp) => ({ ...emp }));
    const nextRequests = requests.map((req) => ({ ...req }));

    refundableRequests.forEach((req) => {
      const empIndex = nextEmployees.findIndex((emp) => emp.phone === req.employeePhone);
      const reqIndex = nextRequests.findIndex((item) => item.id === req.id);
      if (reqIndex === -1) return;

      nextRequests[reqIndex] = {
        ...nextRequests[reqIndex],
        leaveBalanceApplied: false,
        leaveBalanceRefunded: true,
        leaveDaysApproved: 0,
      };

      if (empIndex !== -1) {
        nextEmployees[empIndex] = {
          ...nextEmployees[empIndex],
          leaveBalance: Number(nextEmployees[empIndex].leaveBalance || 0) + Number(req.leaveDaysApproved || 0),
        };
      }
      changed = true;
    });

    if (changed) {
      setEmployees(nextEmployees);
      setRequests(nextRequests);
    }
  }, [requests, employees]);

  const updateRequestStatus = async (id, status) => {
    if (!authUser) return;

    const targetRequest = requests.find((r) => r.id === id) || null;
    if (!targetRequest || targetRequest.canDecide === false) return;

    if (status === "معتمد" && targetRequest.type === "إجازة") {
      const overlap = getOverlappingLeaveRequests(
        targetRequest.employeePhone,
        targetRequest.leaveFrom,
        targetRequest.leaveTo,
        { excludeId: targetRequest.id, includePending: false }
      );
      if (overlap.length) {
        const latestOverlap = overlap[0];
        window.alert(
          language === "ar"
            ? `لا يمكن اعتماد هذه الإجازة لأن هناك إجازة معتمدة متداخلة لنفس الموظف من ${normalizeLeaveDateValue(latestOverlap.leaveFrom)} إلى ${normalizeLeaveDateValue(latestOverlap.leaveTo || latestOverlap.leaveFrom)}.`
            : `This leave request overlaps with another approved leave for the same employee.`
        );
        return;
      }
    }

    let approvedAdvance = null;

    const updatedRequests = requests.map((r) => {
      if (r.id !== id || r.canDecide === false) return r;
      const leaveDays = status === "معتمد" && r.type === "إجازة" ? getApprovedLeaveDays({ ...r, leaveFrom: normalizeLeaveDateValue(r.leaveFrom), leaveTo: normalizeLeaveDateValue(r.leaveTo) }) : 0;
      const next = {
        ...r,
        status,
        decidedBy: authUser.name,
        approvedBy: authUser.name,
        canDecide: false,
        decidedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        leaveDaysApproved: leaveDays,
        leaveBalanceApplied: status === "معتمد" && r.type === "إجازة",
      };
      if (status === "معتمد" && r.type === "سلفة") approvedAdvance = next;
      return next;
    });

    let updatedEmployees = employees;

    if (approvedAdvance) {
      updatedEmployees = updatedEmployees.map((emp) =>
        emp.phone === approvedAdvance.employeePhone
          ? { ...emp, advance: Number(emp.advance || 0) + Number(approvedAdvance.amount || 0) }
          : emp
      );
    }

    const approvedLeaveRequest = updatedRequests.find((r) => r.id === id && r.type === "إجازة" && r.status === "معتمد");
    if (approvedLeaveRequest && approvedLeaveRequest.leaveDaysApproved > 0) {
      updatedEmployees = updatedEmployees.map((emp) =>
        emp.phone === approvedLeaveRequest.employeePhone
          ? { ...emp, leaveBalance: Math.max(0, Number(emp.leaveBalance || 0) - Number(approvedLeaveRequest.leaveDaysApproved || 0)) }
          : emp
      );
    }

    setRequests(updatedRequests);
    if (updatedEmployees !== employees) {
      setEmployees(updatedEmployees);
    }

    await forceRemoteSaveSnapshot({
      employees: updatedEmployees,
      requests: updatedRequests,
      users: systemUsers,
      pending: pendingAccounts,
      upgrades: upgradeRequests,
      complaints,
      chats,
      chatCalls,
      feedback: feedbackEntries,
    });
  };

  const submitLeaveRequest = async () => {
    const employee = getFinancialRowEmployee() || getCurrentEmployee();
    if (!employee || !leaveRequestForm.reason) return;

    if (leaveRequestForm.type === "إجازة") {
      const normalizedFrom = normalizeLeaveDateValue(leaveRequestForm.leaveFrom);
      const normalizedTo = normalizeLeaveDateValue(leaveRequestForm.leaveTo || leaveRequestForm.leaveFrom);
      if (!normalizedFrom || !normalizedTo) {
        window.alert(language === "ar" ? "يرجى إدخال تاريخ بداية ونهاية صحيحين للإجازة." : "Please enter valid leave dates.");
        return;
      }
      if (normalizedTo < normalizedFrom) {
        window.alert(language === "ar" ? "تاريخ نهاية الإجازة يجب أن يكون بعد أو مساويًا لتاريخ البداية." : "Leave end date must be on or after the start date.");
        return;
      }
      const overlap = getOverlappingLeaveRequests(employee.phone, normalizedFrom, normalizedTo, { includePending: true });
      if (overlap.length) {
        const latestOverlap = overlap[0];
        window.alert(
          language === "ar"
            ? `يوجد طلب إجازة متداخل لهذا الموظف من ${normalizeLeaveDateValue(latestOverlap.leaveFrom)} إلى ${normalizeLeaveDateValue(latestOverlap.leaveTo || latestOverlap.leaveFrom)}.`
            : "There is an overlapping leave request for this employee."
        );
        return;
      }
    }

    const newRequest = {
      id: Date.now(),
      employeePhone: employee.phone,
      employeeName: employee.name,
      department: employee.department,
      managerDepartment: employee.managerDepartment,
      type: leaveRequestForm.type,
      leaveFrom: leaveRequestForm.type === "إجازة" ? normalizeLeaveDateValue(leaveRequestForm.leaveFrom) : "",
      leaveTo: leaveRequestForm.type === "إجازة" ? normalizeLeaveDateValue(leaveRequestForm.leaveTo) : "",
      lateFrom: leaveRequestForm.type === "تأخير" ? leaveRequestForm.lateFrom : "",
      lateTo: leaveRequestForm.type === "تأخير" ? leaveRequestForm.lateTo : "",
      compensateAt: leaveRequestForm.type === "تأخير" ? leaveRequestForm.compensateAt : "",
      reason: leaveRequestForm.reason,
      status: "بانتظار الاعتماد",
      approver: canManageAll ? "HR / المالك" : canManageDepartment ? "مدير الإدارة" : "مدير الفرع",
      decidedBy: "",
      canDecide: true,
      createdByRole: authUser?.role || "employee",
      createdAt: new Date().toISOString(),
    };

    const updatedRequests = [newRequest, ...requests];
    setRequests(updatedRequests);

    await forceRemoteSaveSnapshot({
      employees,
      requests: updatedRequests,
      users: systemUsers,
      pending: pendingAccounts,
      upgrades: upgradeRequests,
      complaints,
      chats,
      chatCalls,
      feedback: feedbackEntries,
    });

    setLeaveRequestDialogOpen(false);
    setLeaveRequestForm(emptyLeaveRequestForm);
  };

  const submitAdvanceRequest = () => {
    const employee = getFinancialRowEmployee() || getCurrentEmployee();
    if (!employee || !advanceRequestForm.amount || !advanceRequestForm.reason) return;

    const newRequest = {
      id: Date.now(),
      employeePhone: employee.phone,
      employeeName: employee.name,
      department: employee.department,
      managerDepartment: employee.managerDepartment,
      type: "سلفة",
      amount: Number(advanceRequestForm.amount || 0),
      reason: advanceRequestForm.reason,
      status: canManageAll ? "معتمد" : "بانتظار الاعتماد",
      approver: "HR / المالك",
      decidedBy: canManageAll ? authUser?.name || "" : "",
      canDecide: !canManageAll,
      createdByRole: authUser?.role || "employee",
      createdAt: new Date().toISOString(),
    };

    setRequests((prev) => [newRequest, ...prev]);
    if (canManageAll) applyFinancialRequestEffect(newRequest);

    setAdvanceDialogOpen(false);
    setAdvanceRequestForm(emptyAdvanceRequestForm);
  };

  const submitRewardRequest = () => {
    const employee = getFinancialRowEmployee() || getCurrentEmployee();
    if (!employee || !rewardRequestForm.amount || !rewardRequestForm.reason) return;

    const actionType = canManageAll ? rewardRequestForm.actionType || "مكافأة" : "مكافأة";
    const valueType = actionType === "خصم" ? (rewardRequestForm.valueType || "amount") : "amount";
    const rawAmount = Number(rewardRequestForm.amount || 0);
    const resolvedAmount = valueType === "percentage"
      ? Math.max(0, Number(employee.salary || employee.basicSalary || 0) * rawAmount / 100)
      : rawAmount;

    const newRequest = {
      id: Date.now(),
      employeePhone: employee.phone,
      employeeName: employee.name,
      department: employee.department,
      managerDepartment: employee.managerDepartment,
      type: actionType,
      amount: valueType === "percentage" ? rawAmount : resolvedAmount,
      percentage: valueType === "percentage" ? rawAmount : 0,
      valueType,
      resolvedAmount,
      deductionMode: actionType === "خصم" ? (rewardRequestForm.deductionMode || "manual") : "manual",
      pendingPayroll: canManageAll,
      reason: rewardRequestForm.reason,
      status: canManageAll ? "معتمد" : "بانتظار الاعتماد",
      approver: "HR / المالك",
      decidedBy: canManageAll ? authUser?.name || "" : "",
      canDecide: !canManageAll,
      createdByRole: authUser?.role || "employee",
      createdAt: new Date().toISOString(),
    };

    setRequests((prev) => [newRequest, ...prev]);

    setRewardDialogOpen(false);
    setRewardRequestForm(emptyRewardRequestForm);
  };

  const submitSalaryDeposit = () => {
    const employee = getFinancialRowEmployee() || getCurrentEmployee();
    if (!employee || !salaryDepositForm.salaryAmount) return;

    const salaryAmount = Number(salaryDepositForm.salaryAmount || 0);
    const manualDeductionAmount = Number(salaryDepositForm.deductionAmount || 0);
    const pendingRequests = requests.filter((req) =>
      req.employeePhone === employee.phone &&
      req.status === "معتمد" &&
      !req.appliedToSalaryDepositId &&
      ["مكافأة", "خصم"].includes(req.type)
    );

    const rewardAmount = pendingRequests
      .filter((req) => req.type === "مكافأة")
      .reduce((sum, req) => sum + getRequestResolvedAmount(req, salaryAmount), 0);

    const payrollDeductionAmount = pendingRequests
      .filter((req) => req.type === "خصم")
      .reduce((sum, req) => sum + getRequestResolvedAmount(req, salaryAmount), 0);

    const advanceDeductionAuto = getAdvanceDeductionDetails(employee, salaryAmount);
    // If a manual advance deduction was entered in the wizard, use it (capped by balance).
    const manualAdvanceEntered = salaryDepositForm.advanceDeductionThisMonth;
    const advanceDeduction = (manualAdvanceEntered !== undefined && manualAdvanceEntered !== "" && manualAdvanceEntered !== null)
      ? { ...advanceDeductionAuto, amount: Math.max(0, Math.min(Number(employee.advance || 0), Number(manualAdvanceEntered || 0))) }
      : advanceDeductionAuto;
    const totalDeductionAmount = payrollDeductionAmount + manualDeductionAmount;
    const netAmount = Math.max(0, salaryAmount - advanceDeduction.amount + rewardAmount - totalDeductionAmount);
    const salaryDepositId = Date.now();

    const newRequest = {
      id: salaryDepositId,
      employeePhone: employee.phone,
      employeeName: employee.name,
      department: employee.department,
      managerDepartment: employee.managerDepartment,
      type: "إنزال مرتب",
      amount: netAmount,
      salaryAmount,
      rewardAmount,
      deductionAmount: totalDeductionAmount,
      payrollDeductionAmount,
      manualDeductionAmount,
      advanceSettledAmount: advanceDeduction.amount,
      advanceDeductionMode: advanceDeduction.mode,
      advanceDeductionValueType: advanceDeduction.valueType,
      month: salaryDepositForm.month || "",
      reason: salaryDepositForm.deductionReason || "-",
      status: "معتمد",
      approver: authUser?.name || "HR / المالك",
      decidedBy: authUser?.name || "HR / المالك",
      canDecide: false,
      createdByRole: authUser?.role || "owner",
      createdAt: new Date().toISOString(),
    };

    const updatedRequests = [newRequest, ...requests].map((req) => {
      if (
        req.employeePhone === employee.phone &&
        req.status === "معتمد" &&
        !req.appliedToSalaryDepositId &&
        ["مكافأة", "خصم"].includes(req.type)
      ) {
        return {
          ...req,
          appliedToSalaryDepositId: salaryDepositId,
          pendingPayroll: false,
          resolvedAmount: getRequestResolvedAmount(req, salaryAmount),
        };
      }
      return req;
    });

    const updatedEmployees = employees.map((emp) =>
      emp.phone === employee.phone
        ? {
            ...emp,
            salary: salaryAmount,
            advance: Math.max(0, Number(emp.advance || 0) - advanceDeduction.amount),
          }
        : emp
    );

    setRequests(updatedRequests);
    setEmployees(updatedEmployees);
    setSalaryDepositDialogOpen(false);
    setSalaryDepositForm(emptySalaryDepositForm);
    setSalaryDepositStep(1);
  };

  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <div style={ui.centerPage}>
          <Card style={ui.authCard}>
            <div style={ui.authHead}>
              <h1 style={ui.bigTitle}>{t.registerTitle}</h1>
              <p style={ui.subtitle}>{t.registerRequest}</p>
            </div>

            <div style={{ ...ui.grid2, ...(isMobileView ? ui.grid2Mobile : {}) }}>
              <Field label={t.name}>
                <Input value={registerForm.name} onChange={(e) => setRegisterForm((p) => ({ ...p, name: e.target.value }))} />
              </Field>
              <Field label={t.phone}>
                <Input value={registerForm.phone} onChange={(e) => setRegisterForm((p) => ({ ...p, phone: e.target.value }))} />
              </Field>
              <Field label={t.password}>
                <PasswordInput value={registerForm.password} onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))} />
              </Field>
              <Field label={t.department}>
                <Input value={registerForm.department} onChange={(e) => setRegisterForm((p) => ({ ...p, department: e.target.value }))} />
              </Field>
              <Field label={t.email}>
                <Input
                  type="email"
                  value={registerForm.email || ""}
                  onChange={(e) => setRegisterForm((p) => ({ ...p, email: e.target.value }))}
                />
              </Field>
              <Field label={t.location}>
                <Select
                  value={registerForm.location}
                  onChange={(e) => setRegisterForm((p) => ({ ...p, location: e.target.value }))}
                >
                  <option value="">{t.selectBranch || "اختر الفرع"}</option>
                  {branchOptions.map((branch) => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </Select>
              </Field>
            </div>

            {registerMessage ? <p style={ui.errorText}>{registerMessage}</p> : null}

            <div style={ui.authActions}>
              <Button onClick={submitRegisterRequest} width="100%">{t.registerRequest}</Button>
              <Button variant="outline" onClick={() => setShowRegister(false)} width="100%">{t.back}</Button>
            </div>
          </Card>
        </div>
      );
    }

    return (
      <div style={ui.centerPage}>
        <Card style={{ ...ui.authCard, maxWidth: 420, padding: "48px 28px" }}>
          <div style={{ ...ui.phoneWrap, marginBottom: 24 }}><img src={BRAND_ASSETS.logo} alt={BRAND_ASSETS.name} style={ui.brandLogoAuth} /></div>

          <div style={{ ...ui.authHead, marginBottom: 32 }}>
            <h1 style={ui.bigTitle}>{t.loginTitle}</h1>
            <p style={ui.subtitle}>{t.loginSubtitle}</p>
          </div>

          <div>
            <Input placeholder={t.phone} value={loginData.phone} onChange={(e) => setLoginData((p) => ({ ...p, phone: e.target.value }))} style={{ borderRadius: 999, height: 50, padding: "0 18px", marginBottom: 18 }} />
            <PasswordInput placeholder={t.password} value={loginData.password} onChange={(e) => setLoginData((p) => ({ ...p, password: e.target.value }))} style={{ borderRadius: 999, height: 50, padding: "0 18px", marginBottom: 8 }} />
            {loginError ? <p style={ui.errorText}>{loginError}</p> : null}
            <Button onClick={handleLogin} width="100%" style={{ height: 50, marginTop: 8 }}>{t.login}</Button>
            <Button variant="outline" onClick={() => setShowRegister(true)} width="100%" style={{ marginTop: 16, height: 50 }}>
              <UserPlus size={16} /> {t.createAccount}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ ...ui.appShell, ...(isMobileView ? ui.appShellMobile : {}) }}>
      <Card style={{ ...ui.heroCard, ...(isMobileView ? ui.heroCardMobile : {}) }}>
        <div style={{ ...ui.heroRow, ...(isMobileView ? ui.heroRowMobile : {}) }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start", flex: 1, minWidth: isMobileView ? 0 : 300 }}>
            <div style={ui.menuButtonWrap}>
              <Button variant="outline" onClick={() => setSidebarOpen(true)} style={{ width: 44, padding: 0 }} title={language === "ar" ? "القائمة" : "Menu"}>
                <Menu size={18} />
              </Button>
              {topMenuNotificationsCount > 0 && (
                <span style={ui.menuNotifBadge}>
                  {topMenuNotificationsCount > 99 ? "99+" : topMenuNotificationsCount}
                </span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={ui.heroBadge}><img src={BRAND_ASSETS.logo} alt={BRAND_ASSETS.name} style={ui.brandLogoBadge} /> {t.heroBadge}</div>
              <h1 style={{ ...ui.heroTitle, ...(isMobileView ? ui.heroTitleMobile : {}) }}>{t.appTitle}</h1>
              <p style={{ ...ui.heroDesc, ...(isMobileView ? ui.heroDescMobile : {}) }}>
                {authUser?.name || "-"} — {getRoleLabel(authUser?.role, language)}
              </p>
            </div>
          </div>

          <div style={{ ...ui.heroActions, ...(isMobileView ? ui.heroActionsMobile : {}) }}>
            {isAuthenticated && canAddEmployees && (
              <Button onClick={() => setAddDialogOpen(true)}><Plus size={16} /> {t.addEmployee}</Button>
            )}
            {isAuthenticated && canSearch && (
              <div style={{ position: "relative" }}>
                <Button variant="outline" onClick={() => setSearchOpen((o) => !o)} style={{ width: 44, padding: 0 }} title={t.search}>
                  <Search size={16} />
                </Button>
                {searchOpen && (
                  <div style={{ ...ui.searchBox, position: "absolute", top: 52, left: 0, width: 300, maxWidth: "78vw", zIndex: 60, boxShadow: "var(--shadow)" }}>
                    <Search size={16} />
                    <input
                      style={ui.searchInput}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder={t.search}
                      disabled={!canSearch}
                      autoFocus
                    />
                  </div>
                )}
              </div>
            )}
            {isUpgradedUser && (
              <Button
                variant={viewMode === "employee" ? "primary" : "outline"}
                onClick={() => setViewMode((m) => (m === "employee" ? "upgraded" : "employee"))}
                title={language === "ar" ? "تبديل بين حسابك الشخصي وصلاحية الترقية" : "Switch between personal and upgraded view"}
                style={isMobileView ? undefined : { padding: "0 12px", whiteSpace: "nowrap" }}
              >
                <ArrowLeftRight size={16} />
                {language === "ar"
                  ? (viewMode === "employee" ? " وضع الموظف" : " وضع الترقية")
                  : (viewMode === "employee" ? " Employee" : " Manager")}
              </Button>
            )}
            <Button variant="outline" onClick={() => setSettingsOpen(true)} style={{ width: 44, padding: 0 }}>
              <Settings size={16} />
            </Button>
            <Button variant="outline" onClick={handleLogout} title={t.logout} style={isMobileView ? ui.mobileLogoutButton : { width: 44, padding: 0 }}><LogOut size={16} />{isMobileView ? (language === "ar" ? " خروج" : " Logout") : null}</Button>
          </div>
        </div>
      </Card>

      <div
        title={getCloudStatusIndicatorTitle()}
        style={{
          ...ui.syncStatusDot,
          background: getCloudStatusIndicatorColor(),
        }}
      />

      <button
        type="button"
        title={language === "ar" ? "تقييم التطبيق" : "Rate the app"}
        onClick={() => {
          setFeedbackMessage("");
          setFeedbackWidgetOpen(true);
        }}
        style={ui.feedbackFloatingButton}
      >
        <Star size={18} />
      </button>

      {sidebarOpen && (
        <div style={ui.sidebarOverlay} onClick={() => setSidebarOpen(false)}>
          <aside style={ui.sidebarPanel} onClick={(e) => e.stopPropagation()}><div style={ui.sidebarGlowTop} /><div style={ui.sidebarGlowBottom} />
            <div style={ui.sidebarTop}>
              <div>
                <div style={ui.sidebarBrand}>{language === "ar" ? BRAND_ASSETS.sidebarLabelAr : BRAND_ASSETS.sidebarLabelEn}</div>
                <div style={ui.sidebarSubbrand}>{authUser?.name || t.appTitle}</div>
              </div>
              <button onClick={() => setSidebarOpen(false)} style={ui.sidebarCloseButton}><X size={18} /></button>
            </div>

            <div style={ui.sidebarBody}>
              <div style={ui.sidebarGroup}>
                <div style={ui.sidebarSectionLabel}>{language === "ar" ? "الأقسام الرئيسية" : "Main Sections"}</div>

                <button style={{ ...ui.sidebarItem, ...(activeTab === "employees" ? ui.sidebarItemActive : {}) }} onClick={() => openSidebarTab("employees")}>
                  <span style={ui.sidebarItemIcon}><Users size={18} /></span>
                  <span>{t.employeesTab}</span>
                </button>

                <button style={{ ...ui.sidebarItem, ...(activeTab === "salary" ? ui.sidebarItemActive : {}) }} onClick={() => openSidebarTab("salary")}>
                  <span style={ui.sidebarItemIcon}><Briefcase size={18} /></span>
                  <span>{t.salaryTab}</span>
                </button>

                <button style={{ ...ui.sidebarItem, ...(activeTab === "leave" ? ui.sidebarItemActive : {}) }} onClick={() => openSidebarTab("leave")}>
                  <span style={ui.sidebarItemIcon}><CalendarDays size={18} /></span>
                  <span>{t.leaveTab}</span>
                </button>
              </div>

              {canAccessRequestsHub && (
                <div style={ui.sidebarGroup}>
                  <div style={ui.sidebarSectionLabel}>{t.requestsHub}</div>

                  {(canManageAll || canManageBranch || canManageDepartment) && (
                    <button style={{ ...ui.sidebarItem, ...(activeTab === "accountApprovals" ? ui.sidebarItemActive : {}) }} onClick={() => openSidebarTab("accountApprovals")}>
                      <span style={ui.sidebarItemIcon}><UserCheck size={18} /></span>
                      <span style={ui.sidebarItemText}>{language === "ar" ? "اعتماد إنشاء الحسابات" : "Account Creation Approvals"}</span>
                      {pendingAccountCount > 0 && (
                        <span style={ui.sidebarNotifBadge}>{pendingAccountCount > 99 ? "99+" : pendingAccountCount}</span>
                      )}
                    </button>
                  )}

                  <button style={{ ...ui.sidebarItem, ...(activeTab === "requestApprovals" ? ui.sidebarItemActive : {}) }} onClick={() => openSidebarTab("requestApprovals")}>
                    <span style={ui.sidebarItemIcon}><ShieldCheck size={18} /></span>
                    <span style={ui.sidebarItemText}>{requestHubHasApprovalActions ? (language === "ar" ? "اعتماد الغياب والتأخير والسلف والمكافأة والخصم" : "Request Approvals") : (language === "ar" ? "طلبات الإجازة والتأخير والسلف" : "Leave, Late & Advance Requests")}</span>
                    {pendingRequestsCount > 0 && (
                      <span style={ui.sidebarNotifBadge}>{pendingRequestsCount > 99 ? "99+" : pendingRequestsCount}</span>
                    )}
                  </button>

                  <button style={{ ...ui.sidebarItem, ...(activeTab === "accountUpgrade" ? ui.sidebarItemActive : {}) }} onClick={() => openSidebarTab("accountUpgrade")}>
                    <span style={ui.sidebarItemIcon}><ShieldCheck size={18} /></span>
                    <span style={ui.sidebarItemText}>{canManageAll ? (language === "ar" ? "اعتماد ترقية الحسابات" : "Account Upgrade Approvals") : (language === "ar" ? "ترقية الحساب" : "Upgrade Account")}</span>
                    {pendingUpgradeCount > 0 && (
                      <span style={ui.sidebarNotifBadge}>{pendingUpgradeCount > 99 ? "99+" : pendingUpgradeCount}</span>
                    )}
                  </button>

                  <button style={{ ...ui.sidebarItem, ...(activeTab === "complaints" ? ui.sidebarItemActive : {}) }} onClick={() => openSidebarTab("complaints")}>
                    <span style={ui.sidebarItemIcon}><BadgeInfo size={18} /></span>
                    <span style={ui.sidebarItemText}>{t.complaintsTab}</span>
                    {pendingComplaintsCount > 0 && (
                      <span style={ui.sidebarNotifBadge}>{pendingComplaintsCount > 99 ? "99+" : pendingComplaintsCount}</span>
                    )}
                  </button>

                  {isProgrammerUser && (
                    <button style={{ ...ui.sidebarItem, ...(activeTab === "programmerFeedback" ? ui.sidebarItemActive : {}) }} onClick={() => openSidebarTab("programmerFeedback")}>
                      <span style={ui.sidebarItemIcon}><Star size={18} /></span>
                      <span style={ui.sidebarItemText}>{language === "ar" ? "تقييمات المستخدمين" : "User Feedback"}</span>
                      {visibleFeedbackEntries.length > 0 && (
                        <span style={ui.sidebarNotifBadge}>{visibleFeedbackEntries.length > 99 ? "99+" : visibleFeedbackEntries.length}</span>
                      )}
                    </button>
                  )}

                  {(canManageAll || canManageBranch || canManageDepartment) && (
                    <button style={{ ...ui.sidebarItem, ...(activeTab === "attendanceReport" ? ui.sidebarItemActive : {}) }} onClick={() => openSidebarTab("attendanceReport")}>
                      <span style={ui.sidebarItemIcon}><Fingerprint size={18} /></span>
                      <span style={ui.sidebarItemText}>{language === "ar" ? "تقرير البصمة" : "Attendance Report"}</span>
                    </button>
                  )}

                  <button style={{ ...ui.sidebarItem, ...(activeTab === "chat" ? ui.sidebarItemActive : {}) }} onClick={() => openSidebarTab("chat")}>
                    <span style={ui.sidebarItemIcon}><MessageCircle size={18} /></span>
                    <span style={ui.sidebarItemText}>{t.chatTab}</span>
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      <div style={{ ...ui.statsGrid, ...(isMobileView ? ui.statsGridMobile : {}) }}>
        {!isEmployee && (
          <>
            <SummaryCard title={t.employeeCount} value={formatNumber(totals.employeeCount)} icon={Users} isMobile={isMobileView} />
            <SummaryCard title={t.branchCount} value={formatNumber(totals.branchCount)} icon={MapPin} isMobile={isMobileView} />
          </>
        )}
        <SummaryCard title={t.payrollTotal} value={currency(totals.totalPayroll)} icon={Wallet} isMobile={isMobileView} />
        <SummaryCard title={t.leaveTotal} value={formatNumber(totals.totalLeaveBalance)} icon={CalendarDays} isMobile={isMobileView} />
        <SummaryCard title={t.advancesTotal} value={currency(totals.totalAdvances)} icon={BadgeInfo} isMobile={isMobileView} />
      </div>

      

      {activeTab === "programmerFeedback" && isProgrammerUser && (
        <Card>
          <SectionHeader
            isMobile={isMobileView}
            icon={Star}
            title={language === "ar" ? "تقييمات المستخدمين" : "User Feedback"}
            description={language === "ar" ? "هذه الرسائل تصل فقط إلى حساب مبرمجR1 مع التقييم النصي والنجوم." : "These messages are only visible to Programmer R1 with ratings and written feedback."}
          />

          {!visibleFeedbackEntries.length ? (
            <div style={{ ...ui.emptyState, textAlign: "center" }}>{language === "ar" ? "لا توجد تقييمات حتى الآن" : "No feedback yet."}</div>
          ) : isMobileView ? (
            <div style={ui.mobileCardsStack}>
              {visibleFeedbackEntries.map((item) => (
                <MobileDataCard key={item.id} title={`${item.senderName} - ${"★".repeat(Number(item.rating || 0))}`}>
                  <MobileFieldRow label={language === "ar" ? "المرسل" : "Sender"} value={item.senderPhone || "-"} />
                  <MobileFieldRow label={language === "ar" ? "التاريخ" : "Date"} value={item.createdAt ? new Date(item.createdAt).toLocaleString(language === "ar" ? "ar-EG" : "en-US") : "-"} />
                  <MobileFieldRow label={language === "ar" ? "الرأي" : "Feedback"} value={item.message || "-"} accent />
                </MobileDataCard>
              ))}
            </div>
          ) : (
            <div style={ui.tableWrap}>
              <table style={ui.table}>
                <thead>
                  <tr>
                    <th style={ui.th}>{language === "ar" ? "المرسل" : "Sender"}</th>
                    <th style={ui.th}>{language === "ar" ? "الحساب" : "Account"}</th>
                    <th style={ui.th}>{language === "ar" ? "التقييم" : "Rating"}</th>
                    <th style={ui.th}>{language === "ar" ? "الرأي" : "Feedback"}</th>
                    <th style={ui.th}>{language === "ar" ? "التاريخ" : "Date"}</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleFeedbackEntries.map((item) => (
                    <tr key={item.id}>
                      <td style={ui.td}>{item.senderName || "-"}</td>
                      <td style={ui.td}>{item.senderPhone || "-"}</td>
                      <td style={ui.td}>{"★".repeat(Number(item.rating || 0)) || "-"}</td>
                      <td style={ui.td}>{item.message || "-"}</td>
                      <td style={ui.td}>{item.createdAt ? new Date(item.createdAt).toLocaleString(language === "ar" ? "ar-EG" : "en-US") : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {activeTab === "attendanceReport" && (
        <Card>
          <SectionHeader
            isMobile={isMobileView}
            icon={Fingerprint}
            title={language === "ar" ? "تقرير البصمة" : "Attendance Report"}
            description={language === "ar" ? "متابعة الحضور والانصراف والتأخير مع فلترة حسب التاريخ والموظف وتصدير إلى Excel." : "Track attendance, exit times, and delays with employee/date filters and Excel export."}
          />

          <div style={{ ...ui.attendanceFiltersWrap, ...(isMobileView ? ui.attendanceFiltersWrapMobile : {}) }}>
            <Field label={language === "ar" ? "التاريخ" : "Date"}>
              <div style={{ display: "grid", gap: 8 }}>
                <Input type="date" value={attendanceDateFilter} onChange={(e) => setAttendanceDateFilter(e.target.value)} />
                {isEmployee ? (
                  <Button variant="outline" onClick={() => setAttendanceDateFilter("")} style={{ ...ui.smallBtn, ...(isMobileView ? ui.attendanceActionButtonMobile : {}) }}>
                    {language === "ar" ? "عرض كل الأيام" : "Show all days"}
                  </Button>
                ) : null}
              </div>
            </Field>
            {!isEmployee ? (
              <Field label={language === "ar" ? "الموظف" : "Employee"}>
                <Select value={attendanceEmployeeFilter} onChange={(e) => setAttendanceEmployeeFilter(e.target.value)}>
                  <option value="all">{language === "ar" ? "كل الموظفين" : "All employees"}</option>
                  {visibleEmployees.map((emp) => (
                    <option key={emp.phone} value={emp.phone}>{emp.name}</option>
                  ))}
                </Select>
              </Field>
            ) : (
              <Field label={language === "ar" ? "الموظف" : "Employee"}>
                <Input value={authUser?.name || currentEmployeeRecord?.name || "-"} disabled />
              </Field>
            )}
          </div>

          <div style={{ ...ui.attendanceActionsRow, ...(isMobileView ? ui.attendanceActionsRowMobile : {}) }}>
            {canManageAll && (
              <>
                <input
                  ref={attendanceUploadInputRef}
                  type="file"
                  accept=".xls,.xlsx,.csv,.txt,.html"
                  onChange={handleAttendanceUploadToSystem}
                  style={{ display: "none" }}
                />
                <Button variant="outline" onClick={openAttendanceUploadPicker} style={isMobileView ? ui.attendanceActionButtonMobile : undefined}>
                  <Download size={16} /> {language === "ar" ? "تنزيل التقرير للسستم" : "Upload Report to System"}
                </Button>
                <Button variant="outline" onClick={importEmployeesFromFile} disabled={!lastUploadedRows.length} style={isMobileView ? ui.attendanceActionButtonMobile : undefined}>
                  <Plus size={16} /> {language === "ar" ? "إضافة موظفي الملف للسستم" : "Import file employees"}
                </Button>
              </>
            )}
            <Button onClick={exportAttendanceReport} disabled={!attendanceRows.length} style={isMobileView ? ui.attendanceActionButtonMobile : undefined}>
              <Download size={16} /> {language === "ar" ? "تصدير Excel" : "Export Excel"}
            </Button>
          </div>

          {importEmployeesStatus ? (
            <div style={{ ...ui.infoBox, marginBottom: 18, borderColor: "#bbf7d0", background: "#f0fdf4", color: "#166534" }}>{importEmployeesStatus}</div>
          ) : null}

          {attendanceUploadStatus ? (
            <div style={{ ...ui.infoBox, marginBottom: 18 }}>{attendanceUploadStatus}</div>
          ) : null}

          {!attendanceRows.length ? (
            <div style={{ ...ui.emptyState, textAlign: "center" }}>{attendanceReportEmptyMessage}</div>
          ) : isMobileView ? (
            <div style={ui.mobileCardsStack}>
              {attendanceRows.map((row) => (
                <MobileDataCard
                  key={row.id}
                  title={row.name}
                  action={!isEmployee ? (
                    <Button
                      variant="outline"
                      style={{ ...ui.smallBtn, width: "100%" }}
                      onClick={() => openAttendanceHistoryModal(row)}
                    >
                      {language === "ar" ? "السجل" : "History"}
                    </Button>
                  ) : null}
                >
                  <MobileFieldRow label={language === "ar" ? "التاريخ" : "Date"} value={row.date || "-"} />
                  <MobileFieldRow label={language === "ar" ? "الإدارة" : "Department"} value={row.department} />
                  <MobileFieldRow label={language === "ar" ? "الدخول المجدول" : "Scheduled in"} value={row.scheduledIn} />
                  <MobileFieldRow label={language === "ar" ? "الخروج المجدول" : "Scheduled out"} value={row.scheduledOut} />
                  <MobileFieldRow label={language === "ar" ? "الدخول الفعلي" : "Actual in"} value={row.actualIn} />
                  <MobileFieldRow label={language === "ar" ? "الخروج الفعلي" : "Actual out"} value={row.actualOut} />
                  <MobileFieldRow label={language === "ar" ? "التأخير" : "Delay"} value={row.delayLabel} accent />
                  <MobileFieldRow label={language === "ar" ? "الحالة" : "Status"} value={row.status} />
                  <MobileFieldRow label={language === "ar" ? "ملاحظة" : "Note"} value={row.reason || "-"} />
                </MobileDataCard>
              ))}
            </div>
          ) : (
            <div style={ui.tableWrap}>
              <table style={ui.table}>
                <thead>
                  <tr>
                    <th style={ui.th}>{language === "ar" ? "التاريخ" : "Date"}</th>
                    <th style={ui.th}>{language === "ar" ? "الاسم" : "Name"}</th>
                    <th style={ui.th}>{language === "ar" ? "الإدارة" : "Department"}</th>
                    <th style={ui.th}>{language === "ar" ? "الدخول المجدول" : "Scheduled in"}</th>
                    <th style={ui.th}>{language === "ar" ? "الخروج المجدول" : "Scheduled out"}</th>
                    <th style={ui.th}>{language === "ar" ? "الدخول الفعلي" : "Actual in"}</th>
                    <th style={ui.th}>{language === "ar" ? "الخروج الفعلي" : "Actual out"}</th>
                    <th style={ui.th}>{language === "ar" ? "التأخير" : "Delay"}</th>
                    <th style={ui.th}>{language === "ar" ? "الحالة" : "Status"}</th>
                    <th style={ui.th}>{language === "ar" ? "ملاحظة" : "Note"}</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRows.map((row) => (
                    <tr
                      key={row.id}
                      onClick={!isEmployee ? () => openAttendanceHistoryModal(row) : undefined}
                      style={!isEmployee ? { cursor: "pointer" } : undefined}
                    >
                      <td style={ui.td}>{row.date || "-"}</td>
                      <td style={ui.td}>
                        {!isEmployee ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              openAttendanceHistoryModal(row);
                            }}
                            style={{ background: "transparent", border: "none", padding: 0, color: "inherit", cursor: "pointer", fontWeight: 700, textDecoration: "underline" }}
                          >
                            {row.name}
                          </button>
                        ) : (
                          <strong>{row.name}</strong>
                        )}
                      </td>
                      <td style={ui.td}>{row.department}</td>
                      <td style={ui.td}>{row.scheduledIn}</td>
                      <td style={ui.td}>{row.scheduledOut}</td>
                      <td style={ui.td}>{row.actualIn}</td>
                      <td style={ui.td}>{row.actualOut}</td>
                      <td style={ui.td}>{row.delayLabel}</td>
                      <td style={ui.td}>{row.status}</td>
                      <td style={ui.td}>{row.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      <Modal
        open={attendanceHistoryModalOpen}
        title={language === "ar" ? `سجل البصمة - ${attendanceHistoryEmployee?.name || ""}` : `Attendance History - ${attendanceHistoryEmployee?.name || ""}`}
        onClose={() => { setAttendanceHistoryModalOpen(false); setAttendanceHistoryEmployee(null); setAttendanceHistoryDateFilter(""); }}
        maxWidth={1100}
      >
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ ...ui.grid2, ...(isMobileView ? ui.grid2Mobile : {}) }}>
            <Field label={language === "ar" ? "الموظف" : "Employee"}>
              <Input value={attendanceHistoryEmployee?.name || "-"} disabled />
            </Field>
            <Field label={language === "ar" ? "تصفية حسب يوم" : "Filter by day"}>
              <div style={{ display: "grid", gap: 8 }}>
                <Input type="date" value={attendanceHistoryDateFilter} onChange={(e) => setAttendanceHistoryDateFilter(e.target.value)} />
                <Button variant="outline" style={ui.smallBtn} onClick={() => setAttendanceHistoryDateFilter("")}>
                  {language === "ar" ? "كل الأيام" : "All days"}
                </Button>
              </div>
            </Field>
          </div>

          {!attendanceHistoryModalRows.length ? (
            <div style={{ ...ui.emptyState, textAlign: "center" }}>{language === "ar" ? "لا توجد سجلات بصمة لهذا الموظف" : "No attendance records for this employee."}</div>
          ) : (
            <div style={{ ...ui.tableWrap, ...(isMobileView ? ui.tableWrapMobile : {}) }}>
              <table style={{ ...ui.table, ...(isMobileView ? ui.tableMobile : {}) }}>
                <thead>
                  <tr>
                    <th style={ui.th}>{language === "ar" ? "التاريخ" : "Date"}</th>
                    <th style={ui.th}>{language === "ar" ? "الإدارة" : "Department"}</th>
                    <th style={ui.th}>{language === "ar" ? "الدخول المجدول" : "Scheduled in"}</th>
                    <th style={ui.th}>{language === "ar" ? "الخروج المجدول" : "Scheduled out"}</th>
                    <th style={ui.th}>{language === "ar" ? "الدخول الفعلي" : "Actual in"}</th>
                    <th style={ui.th}>{language === "ar" ? "الخروج الفعلي" : "Actual out"}</th>
                    <th style={ui.th}>{language === "ar" ? "التأخير" : "Delay"}</th>
                    <th style={ui.th}>{language === "ar" ? "الحالة" : "Status"}</th>
                    <th style={ui.th}>{language === "ar" ? "ملاحظة" : "Note"}</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceHistoryModalRows.map((row) => (
                    <tr key={row.id}>
                      <td style={ui.td}>{row.date || "-"}</td>
                      <td style={ui.td}>{row.department}</td>
                      <td style={ui.td}>{row.scheduledIn}</td>
                      <td style={ui.td}>{row.scheduledOut}</td>
                      <td style={ui.td}>{row.actualIn}</td>
                      <td style={ui.td}>{row.actualOut}</td>
                      <td style={ui.td}>{row.delayLabel}</td>
                      <td style={ui.td}>{row.status}</td>
                      <td style={ui.td}>{row.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}>
          <Button variant="outline" onClick={() => { setAttendanceHistoryModalOpen(false); setAttendanceHistoryEmployee(null); setAttendanceHistoryDateFilter(""); }}>{t.close}</Button>
        </div>
      </Modal>

      {activeTab === "complaints" && (
        <Card>
          <SectionHeader icon={BadgeInfo} title={t.complaintsTitle} description={t.complaintsDesc} isMobile={isMobileView} />

          <div style={{ ...ui.grid2, ...(isMobileView ? ui.grid2Mobile : {}) }}>
            <Field label={t.complaintType}>
              <Select value={complaintForm.type} onChange={(e) => setComplaintForm((p) => ({ ...p, type: e.target.value }))}>
                <option value="شكوى">{language === "ar" ? "شكوى" : "Complaint"}</option>
                <option value="طلب">{language === "ar" ? "طلب" : "Request"}</option>
              </Select>
            </Field>

            <Field label={t.complaintTarget}>
              <div style={ui.complaintTargetStack}>
                <Select
                  value={complaintForm.targetCategory}
                  onChange={(e) => setComplaintForm((p) => ({ ...p, targetCategory: e.target.value, targetValue: "" }))}
                >
                  {complaintTargetCategoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>

                {(complaintForm.targetCategory === "branch" || complaintForm.targetCategory === "department") && (
                  <Select
                    value={complaintForm.targetValue}
                    onChange={(e) => setComplaintForm((p) => ({ ...p, targetValue: e.target.value }))}
                  >
                    {complaintTargetDetailOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </Select>
                )}
              </div>
            </Field>

            <Field label={t.complaintSubject} full>
              <Input value={complaintForm.subject} onChange={(e) => setComplaintForm((p) => ({ ...p, subject: e.target.value }))} />
            </Field>
            <Field label={t.complaintBody} full>
              <Textarea value={complaintForm.body} onChange={(e) => setComplaintForm((p) => ({ ...p, body: e.target.value }))} />
            </Field>

            <Field label={language === "ar" ? "صور مرفقة" : "Attached images"} full>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  ref={complaintImageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleComplaintImageSelection}
                  style={{ display: "none" }}
                />
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <Button variant="outline" onClick={() => complaintImageInputRef.current?.click?.()}>
                    <Image size={16} /> {language === "ar" ? "إضافة صور" : "Add images"}
                  </Button>
                  <span style={{ color: "var(--text-soft)", fontSize: 13 }}>
                    {Array.isArray(complaintForm.images) && complaintForm.images.length
                      ? `${complaintForm.images.length} ${language === "ar" ? "صورة مضافة" : "image(s) selected"}`
                      : (language === "ar" ? "يمكنك إرفاق صور مع الشكوى أو الطلب" : "You can attach images to the complaint or request")}
                  </span>
                </div>

                {Array.isArray(complaintForm.images) && complaintForm.images.length ? (
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {complaintForm.images.map((image) => (
                      <div key={image.id} style={{ position: "relative", width: 88, height: 88, borderRadius: 5, overflow: "hidden", border: "1px solid var(--border)", background: "var(--surface-soft)" }}>
                        <img src={image.url} alt={image.name || "complaint"} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button
                          type="button"
                          onClick={() => removeComplaintImage(image.id)}
                          style={{ position: "absolute", top: 6, insetInlineEnd: 6, width: 24, height: 24, borderRadius: 999, border: "none", background: "rgba(15, 23, 42, 0.82)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </Field>
          </div>

          <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}>
            <Button onClick={submitComplaint}>{t.submitComplaint}</Button>
          </div>

          <div style={{ height: 16 }} />

          {isMobileView ? (
            <div style={ui.mobileCardsStack}>
              {visibleComplaints.length ? visibleComplaints.map((item) => (
                <MobileDataCard key={item.id} title={item.senderName}>
                  <MobileFieldRow label={language === "ar" ? "النوع" : "Type"} value={item.type} />
                  <MobileFieldRow label={language === "ar" ? "تذهب إلى" : "Target"} value={getComplaintTargetLabel(item.target, language)} />
                  <MobileFieldRow label={language === "ar" ? "العنوان" : "Subject"} value={item.subject || "-"} />
                  <MobileFieldRow label={language === "ar" ? "الرسالة" : "Message"} value={item.body || "-"} />
                  <MobileFieldRow label={language === "ar" ? "الصور" : "Images"} value={Array.isArray(item.images) && item.images.length ? `${item.images.length} ${language === "ar" ? "مرفقة" : "attached"}` : "-"} />
                  {Array.isArray(item.images) && item.images.length ? (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                      {item.images.map((image) => (
                        <img key={image.id || image.url} src={image.url} alt={image.name || "complaint"} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 7, border: "1px solid var(--border)" }} />
                      ))}
                    </div>
                  ) : null}
                  <MobileFieldRow label={language === "ar" ? "التاريخ" : "Date"} value={item.createdAt || "-"} accent />
                </MobileDataCard>
              )) : (
                <div style={ui.chatEmptySide}>{language === "ar" ? "لا توجد شكاوي أو طلبات حالياً." : "No complaints or requests yet."}</div>
              )}
            </div>
          ) : (
            <div style={{ ...ui.tableWrap, ...(isMobileView ? ui.tableWrapMobile : {}) }}>
              <table style={{ ...ui.table, ...(isMobileView ? ui.tableMobile : {}) }}>
                <thead>
                  <tr>
                    <th style={ui.th}>{t.name}</th>
                    <th style={ui.th}>{language === "ar" ? "النوع" : "Type"}</th>
                    <th style={ui.th}>{language === "ar" ? "تذهب إلى" : "Target"}</th>
                    <th style={ui.th}>{language === "ar" ? "العنوان" : "Subject"}</th>
                    <th style={ui.th}>{language === "ar" ? "الرسالة" : "Message"}</th>
                    <th style={ui.th}>{language === "ar" ? "الصور" : "Images"}</th>
                    <th style={ui.th}>{language === "ar" ? "التاريخ" : "Date"}</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleComplaints.length ? visibleComplaints.map((item) => (
                    <tr key={item.id}>
                      <td style={ui.td}>{item.senderName}</td>
                      <td style={ui.td}>{item.type}</td>
                      <td style={ui.td}>{getComplaintTargetLabel(item.target, language)}</td>
                      <td style={ui.td}>{item.subject}</td>
                      <td style={ui.td}>{item.body}</td>
                      <td style={ui.td}>
                        {Array.isArray(item.images) && item.images.length ? (
                          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                            {item.images.map((image) => (
                              <img key={image.id || image.url} src={image.url} alt={image.name || "complaint"} style={{ width: 52, height: 52, objectFit: "cover", borderRadius: 6, border: "1px solid var(--border)" }} />
                            ))}
                          </div>
                        ) : "-"}
                      </td>
                      <td style={ui.td}>{item.createdAt}</td>
                    </tr>
                  )) : (
                    <tr><td style={ui.emptyCell} colSpan={7}>{language === "ar" ? "لا توجد شكاوي أو طلبات حالياً." : "No complaints or requests yet."}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {activeTab === "chat" && (
        <Card>
          <SectionHeader icon={MessageCircle} title={t.chatTitle} description={t.chatDesc} />

          <div style={{ ...ui.chatLayout, ...(isMobileView ? ui.chatLayoutMobile : {}) }}>
            {showMobileChatList && (
            <div style={{ ...ui.chatSidebar, ...(isMobileView ? ui.chatSidebarMobile : {}) }}>
              <div style={ui.chatSidebarTop}>
                <div style={{ ...ui.chatSidebarActions, ...(isMobileView ? ui.chatSidebarActionsMobile : {}) }}>
                  <div style={ui.searchBoxAlt}>
                    <Search size={16} />
                    <input
                      style={ui.searchInputAlt}
                      value={chatSearch}
                      onChange={(e) => setChatSearch(e.target.value)}
                      placeholder={t.chatSearch}
                    />
                  </div>
                  <Button onClick={() => setChatSearchDialogOpen(true)} style={{ ...ui.chatCreateGroupBtn, ...(isMobileView ? ui.chatCreateGroupBtnMobile : {}) }}><Search size={16} /> {chatLabels.searchByPhone}</Button>
                </div>

                <div style={ui.chatFilterBar}>
                  <button type="button" onClick={() => setChatFilter("all")} style={{ ...ui.chatFilterChip, ...(chatFilter === "all" ? ui.chatFilterChipActive : {}) }}>{t.chatAll}</button>
                  <button type="button" onClick={() => setChatFilter("groups")} style={{ ...ui.chatFilterChip, ...(chatFilter === "groups" ? ui.chatFilterChipActive : {}) }}>{t.chatGroups}</button>
                  <button type="button" onClick={() => { setGroupDialogOpen(true); setContactListMenuChatId(""); }} style={ui.chatFilterChip}>{t.chatCreateGroup}</button>
                  <button type="button" onClick={() => setChatFilter("archived")} style={{ ...ui.chatFilterChip, ...(chatFilter === "archived" ? ui.chatFilterChipActive : {}) }}>{chatLabels.archived}</button>
                </div>
              </div>

              <div style={{ ...ui.chatContactsList, ...(isMobileView ? ui.chatContactsListMobile : {}) }}>
                {chatContacts.length ? chatContacts.map((contact) => (
                  <div
                    key={contact.id}
                    style={{ ...ui.chatContactItemWrap, ...(contactListMenuChatId === contact.id ? ui.chatContactItemWrapRaised : {}) }}
                  >
                    <button
                      type="button"
                      style={{ ...ui.chatContactMenuButton, ...(!isMobileView ? ui.chatContactMenuButtonDesktop : {}) }}
                      onClick={() => setContactListMenuChatId((prev) => prev === contact.id ? "" : contact.id)}
                      title={chatLabels.more}
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    <button
                      type="button"
                      onClick={() => { setActiveChatId(contact.id); if (isMobileView) setMobileChatView("conversation"); }}
                      style={{ ...ui.chatContactItem, ...(activeChatId === contact.id ? ui.chatContactItemActive : {}), ...(isMobileView ? ui.chatContactItemMobile : {}) }}
                    >
                      <div style={ui.chatAvatarWrap}>
                        {contact.profileImage ? (
                          <img src={contact.profileImage} alt={contact.name} style={ui.chatAvatarImage} />
                        ) : (
                          <div style={ui.chatAvatarFallback}>{contact.type === "group" ? <UsersRound size={20} /> : (contact.name || "?").charAt(0)}</div>
                        )}
                      </div>
                      <div style={ui.chatContactBody}>
                        <div style={ui.chatContactTopLine}>
                          <strong style={{ ...ui.chatContactName, ...(isMobileView ? ui.chatContactNameMobile : {}) }}>{contact.name}</strong>
                        </div>
                        <div style={ui.chatMetaLine}>{contact.roleLabel} • {contact.department}</div>
                        <div style={ui.chatSnippet}>{formatChatSnippet(contact.lastMessage)}</div>
                        <div style={ui.chatTimeMuted}>{formatChatTime(contact.lastMessage?.sentAt)}</div>
                      </div>
                      <div style={ui.chatSideBadges}>
                        {(contact.pinnedBy || []).includes(authUser?.phone) && <span style={ui.chatTinyBadge}>{t.chatPinned}</span>}
                        {(contact.mutedBy || []).includes(authUser?.phone) && <span style={ui.chatTinyBadgeMuted}>{t.chatMuted}</span>}
                        {!!contact.unreadCount && <span style={ui.chatUnreadBubble}>{contact.unreadCount}</span>}
                      </div>
                    </button>

                    {contactListMenuChatId === contact.id && (
                      <div style={{ ...ui.chatContactMenuPopup, ...(!isMobileView ? ui.chatContactMenuPopupDesktop : {}) }}>
                        <button type="button" style={ui.chatContactMenuItem} onClick={() => { toggleChatFlagById(contact.id, "pinnedBy"); setContactListMenuChatId(""); }}>
                          <Pin size={16} /> <span>{t.chatPinned}</span>
                        </button>
                        <button type="button" style={ui.chatContactMenuItem} onClick={() => { toggleChatFlagById(contact.id, "mutedBy"); setContactListMenuChatId(""); }}>
                          <BellOff size={16} /> <span>{t.chatMuted}</span>
                        </button>
                        <button type="button" style={ui.chatContactMenuItem} onClick={() => { toggleChatFlagById(contact.id, "archivedBy"); setContactListMenuChatId(""); }}>
                          <Archive size={16} /> <span>{chatLabels.archived}</span>
                        </button>
                        <button type="button" style={ui.chatContactMenuItem} onClick={() => { toggleChatFlagById(contact.id, "blockedBy"); setContactListMenuChatId(""); }}>
                          <Lock size={16} /> <span>{(contact.blockedBy || []).includes(authUser?.phone) ? chatLabels.unblock : chatLabels.block}</span>
                        </button>
                        <button type="button" style={{ ...ui.chatContactMenuItem, ...ui.actionMenuDanger }} onClick={() => deleteChatById(contact.id)}>
                          <Trash2 size={16} /> <span>{chatLabels.deleteChat}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )) : (
                  <div style={ui.chatEmptySide}>{t.chatNoContacts}</div>
                )}
              </div>
            </div>
            )}

            {showMobileChatConversation && (
            <div style={{ ...ui.chatMainPanel, ...(isMobileView ? ui.chatMainPanelMobile : {}) }}>
              {activeConversation ? (
                <>
                  <div style={{ ...ui.chatHeaderBar, ...(isMobileView ? ui.chatHeaderBarMobile : {}), ...(!isMobileView ? ui.chatHeaderBarDesktop : {}) }}>
                    {!isMobileView && (
                      <div style={ui.chatDesktopMoreWrapper}>
                        <button
                          type="button"
                          style={ui.chatDesktopMoreButton}
                          onClick={() => setChatMoreOpen(true)}
                          title={chatLabels.more}
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    )}
                    <div style={{ ...ui.chatHeaderIdentity, ...(isMobileView ? ui.chatHeaderIdentityMobile : { alignItems: "center", minWidth: 0, flex: 1 }) }}>
                      {isMobileView && (
                        <button type="button" onClick={() => setMobileChatView("list")} style={ui.chatHeaderBackButton}>›</button>
                      )}
                      <button type="button" onClick={() => setContactInfoOpen(true)} style={ui.chatAvatarButton}>
                      <div style={ui.chatAvatarWrap}>
                        {activeConversation.profileImage ? (
                          <img src={activeConversation.profileImage} alt={activeConversation.name} style={ui.chatAvatarImage} />
                        ) : (
                          <div style={ui.chatAvatarFallback}>{activeConversation.type === "group" ? <UsersRound size={20} /> : (activeConversation.name || "?").charAt(0)}</div>
                        )}
                      </div>
                      </button>
                      <div style={{ minWidth: 0, flex: 1, textAlign: "right" }}>
                        <button type="button" onClick={() => setContactInfoOpen(true)} style={{ ...ui.chatNameButton, ...(isMobileView ? ui.chatNameButtonMobile : {}) }}>{activeConversation.name}</button>
                        <div style={{ ...ui.chatHeaderSub, ...(isMobileView ? ui.chatHeaderSubMobile : {}) }}>
                          {activeConversation.type === "group"
                            ? `${t.chatMembers}: ${activeConversation.participants?.length || 0}`
                            : `${activeConversation.roleLabel} • ${t.chatOnline}`}
                        </div>
                      </div>
                    </div>
                    <div style={{ ...ui.chatHeaderTools, ...(isMobileView ? ui.chatHeaderToolsMobile : {}) }}>
                      {isMobileView ? (
                        <>
                          <button type="button" style={{ ...ui.chatHeaderIconButton, ...ui.chatHeaderIconButtonMobile }} onClick={toggleActiveChatPin} title={t.chatPinned}><Pin size={16} /></button>
                          <button type="button" style={{ ...ui.chatHeaderIconButton, ...ui.chatHeaderIconButtonMobile }} onClick={toggleActiveChatMute} title={t.chatMuted}><BellOff size={16} /></button>
                          <button type="button" style={{ ...ui.chatHeaderIconButton, ...ui.chatHeaderIconButtonMobile }} onClick={() => setChatMoreOpen(true)} title={chatLabels.more}><MoreHorizontal size={16} /></button>
                          <span style={ui.chatHeaderMobileTime}>{formatChatTime(activeConversation.lastMessage?.sentAt)}</span>
                        </>
                      ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                          <Badge>{activeConversation.branch}</Badge>
                          <span style={ui.chatTimeMuted}>{formatChatTime(activeConversation.lastMessage?.sentAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ ...ui.chatMessagesAreaLarge, ...(isMobileView ? ui.chatMessagesAreaMobile : {}) }}>
                    {(activeConversation?.messages || []).length ? (
                      activeConversation.messages.map((message) => {
                        const isMine = message.senderPhone === authUser?.phone;
                        if (message.system) {
                          return <div key={message.id} style={ui.chatSystemMessage}>{message.text}</div>;
                        }
                        return (
                          <div key={message.id} style={{ ...ui.chatBubbleRow, justifyContent: isMine ? "flex-end" : "flex-start" }}>
                            <div style={ui.chatBubbleStack}>
                              {selectedMessage?.id === message.id && (
                              <div style={ui.chatReactionRail}>
                                {["👍","❤️","😂","😮","🥲","🙏","👎"].map((emoji) => (
                                  <button key={emoji} type="button" style={ui.chatReactionButton} onClick={() => reactToMessage(emoji)}>{emoji}</button>
                                ))}
                              </div>
                              )}
                              <div onContextMenu={(e) => { e.preventDefault(); openMessageMenu(message); }} onDoubleClick={() => openMessageMenu(message)} style={{ ...ui.chatBubble, ...(isMine ? ui.chatBubbleMine : ui.chatBubbleOther) }}>
                              <div style={ui.chatBubbleTypeRow}>
                                {message.type === "voice" && <span style={ui.chatTypePill}><Mic size={12} /> {t.chatVoiceNote}{message.duration ? ` • ${message.duration}` : ""}</span>}
                                {message.type === "image" && <span style={ui.chatTypePill}><Image size={12} /> {t.chatPhoto}</span>}
                                {message.type === "file" && <span style={ui.chatTypePill}><Paperclip size={12} /> {t.chatFile}</span>}
                              </div>
                              {message.type === "image" && message.mediaUrl ? (
                                <button
                                  type="button"
                                  style={ui.chatImageButton}
                                  onClick={() => setPreviewImage(message.mediaUrl)}
                                  title={language === "ar" ? "فتح الصورة" : "Open image"}
                                >
                                  <img src={message.mediaUrl} alt={message.fileName || "shared-image"} style={ui.chatImagePreview} />
                                </button>
                              ) : null}
                              {message.type === "voice" && message.mediaUrl ? (
                                <div style={ui.chatVoicePlayer}>
                                  <div style={ui.chatVoiceTopRow}>
                                    <button
                                      type="button"
                                      style={ui.chatVoicePlayButton}
                                      onClick={() => {
                                        const target = document.getElementById(`chat-audio-${message.id}`);
                                        if (!target) return;
                                        if (voicePlaybackId === message.id) {
                                          target.pause();
                                          setVoicePlaybackId(null);
                                        } else {
                                          target.play().catch(() => {});
                                          setVoicePlaybackId(message.id);
                                        }
                                      }}
                                    >
                                      {voicePlaybackId === message.id ? <Pause size={16} /> : <Play size={16} />}
                                    </button>
                                    <span style={ui.chatVoiceDuration}>{message.duration || "00:00"}</span>
                                  </div>
                                  <audio
                                    id={`chat-audio-${message.id}`}
                                    src={message.mediaUrl}
                                    preload="metadata"
                                    controls
                                    controlsList="nodownload noplaybackrate"
                                    style={ui.chatAudioElement}
                                    onPlay={() => setVoicePlaybackId(message.id)}
                                    onPause={() => setVoicePlaybackId((current) => current === message.id ? null : current)}
                                    onEnded={() => setVoicePlaybackId((current) => current === message.id ? null : current)}
                                  />
                                </div>
                              ) : null}
                              <div style={ui.chatBubbleText}>{message.text}</div>
                              {message.fileName && message.type === "file" ? (
                                message.mediaUrl ? (
                                  <a href={message.mediaUrl} download={message.fileName} target="_blank" rel="noreferrer" style={ui.chatAttachmentLink}>{message.fileName}</a>
                                ) : (
                                  <div style={ui.chatAttachmentName}>{message.fileName}</div>
                                )
                              ) : null}
                              {!!message.reactions?.length && <div style={ui.chatReactionSummary}>{message.reactions.map((item) => item.emoji).join(" ")}</div>}
                              <div style={ui.chatBubbleMeta}>
                                <span>{formatChatTime(message.sentAt)}</span>
                                {message.starred && <Star size={13} />}
                                {isMine && <CheckCheck size={14} />}
                              </div>
                            </div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div style={ui.chatEmptyMain}>{t.chatEmpty}</div>
                    )}
                  </div>
                  {isRecordingVoice ? (
                    <div style={ui.voiceRecorderBar}>
                      <button type="button" style={ui.voiceRecorderIcon} onClick={cancelVoiceRecording}><Trash2 size={20} /></button>
                      <div style={ui.voiceRecorderMiddle}>
                        <div style={ui.voiceRecorderTime}>{formatDuration(recordingSeconds)}</div>
                        <div style={ui.voiceRecorderWave}>{"• ".repeat(24)}</div>
                      </div>
                      <button type="button" style={ui.voiceRecorderPause} onClick={() => setRecordingPaused((prev) => !prev)}>{recordingPaused ? chatLabels.resume : chatLabels.pause}</button>
                      <button type="button" style={ui.chatSendButton} onClick={sendRecordedVoice} title={chatLabels.send}>
                        <Send size={18} />
                      </button>
                    </div>
                  ) : (
                  <div style={{ ...ui.chatComposerLarge, ...(isMobileView ? ui.chatComposerMobile : {}) }}>
                    <button type="button" style={{ ...ui.chatComposerEdgeButton, ...(isMobileView ? ui.chatComposerEdgeButtonMobile : {}) }} onClick={() => setAttachSheetOpen(true)} title={t.chatAttach}>
                      <Plus size={isMobileView ? 20 : 24} />
                    </button>
                    <button type="button" style={{ ...ui.chatComposerEdgeButton, ...(isMobileView ? ui.chatComposerEdgeButtonMobile : {}) }} onClick={openChatCamera} title={t.chatPhoto}>
                      <Camera size={isMobileView ? 18 : 22} />
                    </button>
                    <button type="button" style={{ ...ui.chatComposerEdgeButton, ...(isMobileView ? ui.chatComposerEdgeButtonMobile : {}) }} onClick={startVoiceRecording} title={t.chatVoiceNote}>
                      <Mic size={isMobileView ? 18 : 22} />
                    </button>
                    <input
                      style={{ ...ui.chatComposerInput, ...(isMobileView ? ui.chatComposerInputMobile : {}) }}
                      value={chatDraft}
                      onChange={(e) => setChatDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          sendChatMessage();
                        }
                      }}
                      placeholder={t.chatWrite}
                    />
                    <button type="button" style={{ ...ui.chatSendButton, ...(isMobileView ? ui.chatSendButtonMobile : {}) }} onClick={sendChatMessage} title={t.sendMessage}>
                      <Send size={isMobileView ? 16 : 18} />
                    </button>
                  </div>
                  )}
                </>
              ) : (
                <div style={ui.chatEmptyMain}>{t.chatEmpty}</div>
              )}
            </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === "accountApprovals" && (canManageAll || canManageBranch || canManageDepartment) && (
        <Card>
          <SectionHeader icon={UserCheck} title={t.approvals} description={t.approvalsDesc} isMobile={isMobileView} />
          <div style={{ ...ui.tableWrap, ...(isMobileView ? ui.tableWrapMobile : {}) }}>
            <table style={{ ...ui.table, ...(isMobileView ? ui.tableMobile : {}) }}>
              <thead>
                <tr>
                  <th style={ui.th}>{t.name}</th>
                  <th style={ui.th}>{t.phone}</th>
                  <th style={ui.th}>{t.department}</th>
                  <th style={ui.th}>{t.status}</th>
                  <th style={ui.th}>{t.approvedBy}</th>
                  <th style={ui.th}>{t.action}</th>
                </tr>
              </thead>
              <tbody>
                {visiblePendingAccounts.length ? (
                  visiblePendingAccounts.map((acc) => (
                    <tr key={acc.id}>
                      <td style={ui.td}>{acc.name}</td>
                      <td style={ui.td}>{acc.phone}</td>
                      <td style={ui.td}>{acc.department || "-"}</td>
                      <td style={ui.td}>{acc.status}</td>
                      <td style={ui.td}>{acc.approvedBy || "-"}</td>
                      <td style={ui.td}>
                        <div style={ui.rowActions}>
                          {acc.status === "بانتظار الاعتماد" ? (
                            <>
                              <Button onClick={() => approvePendingAccount(acc.id)} style={ui.smallBtn}> {t.approve} </Button>
                              <Button variant="outline" onClick={() => rejectPendingAccount(acc.id)} style={ui.smallBtn}> {t.reject} </Button>
                            </>
                          ) : acc.status === "معتمد" && !acc.addedToEmployees ? (
                            <Button onClick={() => openCompleteEmployeeData(acc)} style={ui.smallBtn}>{t.completeData}</Button>
                          ) : (
                            <span style={{ color: "var(--text-muted)" }}>{t.noPending}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td style={ui.emptyCell} colSpan={7}>{t.noPending}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === "requestApprovals" && canAccessRequestsHub && (
        <>
          <Card>
            <SectionHeader
              isMobile={isMobileView}
              icon={ShieldCheck}
              title={requestHubHasApprovalActions ? (language === "ar" ? "اعتماد الغياب والتأخير" : "Attendance Approvals") : (language === "ar" ? "طلبات الإجازة والتأخير" : "Leave & Late Requests")}
              description={requestHubHasApprovalActions ? (language === "ar" ? "طلبات الموظفين ومدير الإدارة ومدير الفرع التي تحتاج اعتمادًا." : "Pending leave and late requests that require approval.") : (language === "ar" ? "متابعة حالة طلبات الإجازة والتأخير الخاصة بك." : "Track the status of your leave and late requests.")}
            />
            <div style={ui.sectionActions}>
              <Button variant="outline" onClick={() => exportLeaveApprovalsReport()}>
                <Download size={16} />
                <span>{language === "ar" ? "تصدير Excel" : "Export Excel"}</span>
              </Button>
              <Button variant="outline" onClick={() => { setApprovalLogType("leave"); setApprovalLogOpen(true); }}>
                {language === "ar" ? "سجل الاعتماد أو الرفض" : "Approval / Rejection Log"}
              </Button>
            </div>
            {isMobileView ? (
              <div style={ui.mobileCardsStack}>
                {requestHubLeaveRequests.length ? requestHubLeaveRequests.map((req) => (
                  <MobileDataCard
                    key={req.id}
                    title={req.employeeName}
                    action={requestHubHasApprovalActions && req.canDecide ? (
                      <div style={ui.rowActions}>
                        <Button onClick={() => updateRequestStatus(req.id, "معتمد")} style={ui.smallBtn}>{t.approve}</Button>
                        <Button variant="outline" onClick={() => updateRequestStatus(req.id, "مرفوض")} style={ui.smallBtn}>{t.reject}</Button>
                      </div>
                    ) : null}
                  >
                    <MobileFieldRow label={t.type} value={req.type} />
                    <MobileFieldRow label={t.dateTime} value={req.type === "إجازة" ? `${req.leaveFrom || "-"} → ${req.leaveTo || "-"}` : `${req.lateFrom || "-"} → ${req.lateTo || "-"}${req.compensateAt ? ` | ${t.compensateAt}: ${req.compensateAt}` : ""}`} />
                    <MobileFieldRow label={t.reason} value={req.reason || "-"} />
                    <MobileFieldRow label={t.status} value={req.status} />
                    <MobileFieldRow label={t.approvedBy} value={req.decidedBy || "-"} accent />
                  </MobileDataCard>
                )) : <div style={ui.chatEmptySide}>{t.noRequests}</div>}
              </div>
            ) : (
              <div style={ui.tableWrap}>
                <table style={ui.table}>
                  <thead><tr><th style={ui.th}>{t.employee}</th><th style={ui.th}>{t.type}</th><th style={ui.th}>{t.dateTime}</th><th style={ui.th}>{t.reason}</th><th style={ui.th}>{t.status}</th><th style={ui.th}>{t.approvedBy}</th><th style={ui.th}>{t.action}</th></tr></thead>
                  <tbody>
                    {requestHubLeaveRequests.length ? requestHubLeaveRequests.map((req) => (
                      <tr key={req.id}>
                        <td style={ui.td}><strong>{req.employeeName}</strong></td>
                        <td style={ui.td}>{req.type}</td>
                        <td style={ui.td}>{req.type === "إجازة" ? `${req.leaveFrom || "-"} → ${req.leaveTo || "-"}` : `${req.lateFrom || "-"} → ${req.lateTo || "-"}${req.compensateAt ? ` | ${t.compensateAt}: ${req.compensateAt}` : ""}`}</td>
                        <td style={ui.td}>{req.reason}</td>
                        <td style={ui.td}>{req.status}</td>
                        <td style={ui.td}>{req.decidedBy || "-"}</td>
                        <td style={ui.td}>{requestHubHasApprovalActions && req.canDecide ? <div style={ui.rowActions}><Button onClick={() => updateRequestStatus(req.id, "معتمد")} style={ui.smallBtn}>{t.approve}</Button><Button variant="outline" onClick={() => updateRequestStatus(req.id, "مرفوض")} style={ui.smallBtn}>{t.reject}</Button></div> : <span style={{ color: "#64748b" }}>{req.status}</span>}</td>
                      </tr>
                    )) : <tr><td style={ui.emptyCell} colSpan={7}>{t.noRequests}</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </Card>

          <Card>
            <SectionHeader
              isMobile={isMobileView}
              icon={BadgeInfo}
              title={requestHubHasApprovalActions ? (language === "ar" ? "اعتماد السلف والمكافآت والخصومات" : "Financial Approvals") : (language === "ar" ? "طلبات السلف والمكافآت والخصومات" : "Advance, Reward & Deduction Requests")}
              description={requestHubHasApprovalActions ? (language === "ar" ? "طلبات الموظفين ومدير الإدارة ومدير الفرع الخاصة بالسلف والمكافآت والخصومات." : "Pending financial requests that require approval.") : (language === "ar" ? "متابعة حالة طلبات السلف والمكافآت والخصومات الخاصة بك." : "Track the status of your advance, reward, and deduction requests.")}
            />
            <div style={ui.sectionActions}>
              <Button variant="outline" onClick={() => exportFinancialApprovalsReport()}>
                <Download size={16} />
                <span>{language === "ar" ? "تصدير Excel" : "Export Excel"}</span>
              </Button>
              <Button variant="outline" onClick={() => { setApprovalLogType("financial"); setApprovalLogOpen(true); }}>
                {language === "ar" ? "سجل الاعتماد أو الرفض" : "Approval / Rejection Log"}
              </Button>
            </div>
            {isMobileView ? (
              <div style={ui.mobileCardsStack}>
                {requestHubFinancialRequests.length ? requestHubFinancialRequests.map((req) => (
                  <MobileDataCard
                    key={req.id}
                    title={req.employeeName}
                    action={requestHubHasApprovalActions && req.canDecide ? (
                      <div style={ui.rowActions}>
                        <Button onClick={() => updateRequestStatus(req.id, "معتمد")} style={ui.smallBtn}>{t.approve}</Button>
                        <Button variant="outline" onClick={() => updateRequestStatus(req.id, "مرفوض")} style={ui.smallBtn}>{t.reject}</Button>
                      </div>
                    ) : null}
                  >
                    <MobileFieldRow label={t.type} value={req.type} />
                    <MobileFieldRow label={t.amount} value={currency(req.resolvedAmount || req.amount)} />
                    <MobileFieldRow label={t.reason} value={req.reason || "-"} />
                    <MobileFieldRow label={t.status} value={req.status} />
                    <MobileFieldRow label={t.approvedBy} value={req.decidedBy || "-"} accent />
                  </MobileDataCard>
                )) : <div style={ui.chatEmptySide}>{t.noRequests}</div>}
              </div>
            ) : (
              <div style={ui.tableWrap}>
                <table style={ui.table}>
                  <thead><tr><th style={ui.th}>{t.employee}</th><th style={ui.th}>{t.type}</th><th style={ui.th}>{t.amount}</th><th style={ui.th}>{t.reason}</th><th style={ui.th}>{t.status}</th><th style={ui.th}>{t.approvedBy}</th><th style={ui.th}>{t.action}</th></tr></thead>
                  <tbody>
                    {requestHubFinancialRequests.length ? requestHubFinancialRequests.map((req) => (
                      <tr key={req.id}>
                        <td style={ui.td}><strong>{req.employeeName}</strong></td>
                        <td style={ui.td}>{req.type}</td>
                        <td style={ui.td}>{currency(req.resolvedAmount || req.amount)}</td>
                        <td style={ui.td}>{req.reason}</td>
                        <td style={ui.td}>{req.status}</td>
                        <td style={ui.td}>{req.decidedBy || "-"}</td>
                        <td style={ui.td}>{requestHubHasApprovalActions && req.canDecide ? <div style={ui.rowActions}><Button onClick={() => updateRequestStatus(req.id, "معتمد")} style={ui.smallBtn}>{t.approve}</Button><Button variant="outline" onClick={() => updateRequestStatus(req.id, "مرفوض")} style={ui.smallBtn}>{t.reject}</Button></div> : <span style={{ color: "#64748b" }}>{req.status}</span>}</td>
                      </tr>
                    )) : <tr><td style={ui.emptyCell} colSpan={7}>{t.noRequests}</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      {activeTab === "accountUpgrade" && (
        <Card>
          <SectionHeader
            isMobile={isMobileView}
            icon={ShieldCheck}
            title={language === "ar" ? "ترقية الحساب" : "Account Upgrade"}
            description={
              canManageAll
                ? (language === "ar"
                    ? "اكتب اسم الشخص ورقم هاتفه وحدد نوع الترقية. مدير الفرع يرى موظفي فرعه فقط، ومدير الإدارة يرى موظفي إدارته فقط."
                    : "Enter the employee name, phone number and the target role.")
                : (language === "ar"
                    ? "الترقية تتم من حساب المالك أو HR فقط."
                    : "Account upgrades are handled by owner or HR only.")
            }
          />

          {canManageAll ? (
            <Card style={{ ...ui.innerCard, marginBottom: 18 }}>
              <div style={{ ...ui.grid2, ...(isMobileView ? ui.grid2Mobile : {}) }}>
                <Field label={t.name}>
                  <Input value={upgradeRequestForm.employeeName} onChange={(e) => setUpgradeRequestForm((p) => ({ ...p, employeeName: e.target.value }))} />
                </Field>
                <Field label={t.phone}>
                  <Input value={upgradeRequestForm.employeePhone} onChange={(e) => setUpgradeRequestForm((p) => ({ ...p, employeePhone: e.target.value }))} />
                </Field>
                <Field label={language === "ar" ? "نوع الترقية" : "Upgrade Type"}>
                  <Select value={upgradeRequestForm.requestedRole} onChange={(e) => setUpgradeRequestForm((p) => ({ ...p, requestedRole: e.target.value, branch: "المركزية", managerDepartment: "", createNewDepartment: false, newDepartmentName: "" }))}>
                    <option value="branch_manager">{language === "ar" ? "مدير فرع" : "Branch Manager"}</option>
                    <option value="department_manager">{language === "ar" ? "مدير إدارة" : "Department Manager"}</option>
                    <option value="hr">{language === "ar" ? "موظف HR" : "HR"}</option>
                    <option value="owner">{language === "ar" ? "مالك" : "Owner"}</option>
                  </Select>
                </Field>

                {upgradeRequestForm.requestedRole === "branch_manager" ? (
                  <Field label={language === "ar" ? "الفرع" : "Branch"}>
                    <Select value={upgradeRequestForm.branch} onChange={(e) => setUpgradeRequestForm((p) => ({ ...p, branch: e.target.value }))}>
                      {BRANCH_OPTIONS.map((branch) => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </Select>
                  </Field>
                ) : (
                  <>
                    <Field label={language === "ar" ? "الإدارة" : "Department"}>
                      <Select
                        value={upgradeRequestForm.createNewDepartment ? "__new__" : upgradeRequestForm.managerDepartment}
                        onChange={(e) => {
                          const value = e.target.value;
                          setUpgradeRequestForm((p) => ({
                            ...p,
                            createNewDepartment: value === "__new__",
                            managerDepartment: value === "__new__" ? "" : value,
                            newDepartmentName: value === "__new__" ? p.newDepartmentName : "",
                          }));
                        }}
                      >
                        <option value="">{language === "ar" ? "اختر الإدارة" : "Select department"}</option>
                        {availableManagerDepartments.map((dept) => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                        <option value="__new__">{language === "ar" ? "إنشاء إدارة جديدة" : "Create new department"}</option>
                      </Select>
                    </Field>
                    {upgradeRequestForm.createNewDepartment && (
                      <Field label={language === "ar" ? "اسم الإدارة الجديدة" : "New Department Name"}>
                        <Input value={upgradeRequestForm.newDepartmentName} onChange={(e) => setUpgradeRequestForm((p) => ({ ...p, newDepartmentName: e.target.value }))} />
                      </Field>
                    )}
                  </>
                )}

                <Field label={language === "ar" ? "ملاحظة" : "Note"}>
                  <Input value={upgradeRequestForm.reason} onChange={(e) => setUpgradeRequestForm((p) => ({ ...p, reason: e.target.value }))} />
                </Field>
              </div>
              <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}>
                <Button onClick={submitUpgradeRequest}>{language === "ar" ? "تنفيذ الترقية" : "Apply Upgrade"}</Button>
              </div>
            </Card>
          ) : (
            <Card style={{ ...ui.innerCard, marginBottom: 18 }}>
              <p style={{ margin: 0, color: "var(--text-soft)", lineHeight: 1.9 }}>
                {language === "ar"
                  ? "هذا القسم للعرض فقط. الترقية تتم من حساب المالك أو HR بكتابة الاسم ورقم الهاتف ونوع الترقية."
                  : "This section is view-only. Upgrades are applied from owner or HR accounts."}
              </p>
            </Card>
          )}

          {isMobileView ? (
            <div style={ui.mobileCardsStack}>
              {visibleUpgradeRequests.length ? (
                visibleUpgradeRequests.map((req) => (
                  <MobileDataCard
                    key={req.id}
                    title={req.employeeName}
                    action={canManageAll && req.status === "بانتظار الاعتماد" ? (
                      <div style={ui.rowActions}>
                        <Button onClick={() => approveUpgradeRequest(req.id)} style={ui.smallBtn}>{t.approve}</Button>
                        <Button variant="outline" onClick={() => rejectUpgradeRequest(req.id)} style={ui.smallBtn}>{t.reject}</Button>
                      </div>
                    ) : canManageAll && req.status === "معتمد" ? (
                      <Button variant="danger" onClick={() => cancelRoleUpgrade(req)} style={ui.smallBtn}>{language === "ar" ? "إلغاء الترقية" : "Cancel upgrade"}</Button>
                    ) : null}
                  >
                    <MobileFieldRow label={t.phone} value={req.employeePhone || "-"} />
                    <MobileFieldRow label={language === "ar" ? "الصلاحية الحالية" : "Current Role"} value={getRoleLabel(req.currentRole, language)} />
                    <MobileFieldRow label={language === "ar" ? "نوع الترقية" : "Upgrade Type"} value={getRoleLabel(req.requestedRole, language)} />
                    <MobileFieldRow label={language === "ar" ? "القسم المقيد بعد الترقية" : "Managed Scope"} value={getUpgradeScopeLabel(req)} />
                    <MobileFieldRow label={t.status} value={req.status || "-"} />
                    <MobileFieldRow label={t.approvedBy} value={req.decidedBy || "-"} accent />
                  </MobileDataCard>
                ))
              ) : (
                <div style={ui.chatEmptySide}>{t.noRequests}</div>
              )}
            </div>
          ) : (
            <div style={{ ...ui.tableWrap, ...(isMobileView ? ui.tableWrapMobile : {}) }}>
              <table style={{ ...ui.table, ...(isMobileView ? ui.tableMobile : {}) }}>
                <thead>
                  <tr>
                    <th style={ui.th}>{t.name}</th>
                    <th style={ui.th}>{t.phone}</th>
                    <th style={ui.th}>{language === "ar" ? "الصلاحية الحالية" : "Current Role"}</th>
                    <th style={ui.th}>{language === "ar" ? "نوع الترقية" : "Upgrade Type"}</th>
                    <th style={ui.th}>{language === "ar" ? "القسم المقيد بعد الترقية" : "Managed Scope"}</th>
                    <th style={ui.th}>{t.status}</th>
                    <th style={ui.th}>{t.approvedBy}</th>
                    <th style={ui.th}>{t.action}</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleUpgradeRequests.length ? (
                    visibleUpgradeRequests.map((req) => (
                      <tr key={req.id}>
                        <td style={ui.td}><strong>{req.employeeName}</strong></td>
                        <td style={ui.td}>{req.employeePhone}</td>
                        <td style={ui.td}>{getRoleLabel(req.currentRole, language)}</td>
                        <td style={ui.td}>{getRoleLabel(req.requestedRole, language)}</td>
                        <td style={ui.td}>{getUpgradeScopeLabel(req)}</td>
                        <td style={ui.td}>{req.status}</td>
                        <td style={ui.td}>{req.decidedBy || "-"}</td>
                        <td style={ui.td}>
                          {canManageAll && req.status === "بانتظار الاعتماد" ? (
                            <div style={ui.rowActions}>
                              <Button onClick={() => approveUpgradeRequest(req.id)} style={ui.smallBtn}>{t.approve}</Button>
                              <Button variant="outline" onClick={() => rejectUpgradeRequest(req.id)} style={ui.smallBtn}>{t.reject}</Button>
                            </div>
                          ) : canManageAll && req.status === "معتمد" ? (
                            <Button variant="danger" onClick={() => cancelRoleUpgrade(req)} style={ui.smallBtn}>{language === "ar" ? "إلغاء الترقية" : "Cancel upgrade"}</Button>
                          ) : (
                            <span style={{ color: "var(--text-muted)" }}>{req.status}</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td style={ui.emptyCell} colSpan={8}>{t.noRequests}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}



      
{activeTab === "employees" && (
        effectiveRole === "employee" ? (
          <Card style={{ ...ui.employeeCvCard, ...(isMobileView ? ui.employeeCvCardMobile : {}) }}>
            <SectionHeader
              isMobile={isMobileView}
              icon={Users}
              title={t.employeeData}
              description={language === "ar" ? "بياناتك الشخصية والوظيفية تظهر مباشرة بهذا التنسيق." : "Your personal and job details appear directly in this layout."}
            />

            {filteredEmployees[0] ? (
              <div style={{ ...ui.employeeCvLayout, ...(isMobileView ? ui.employeeCvLayoutMobile : {}) }}>
                <div style={{ ...ui.employeeCvMain, ...(isMobileView ? ui.employeeCvMainMobile : {}) }}>
                  <div style={{ ...ui.employeeCvName, ...(isMobileView ? ui.employeeCvNameMobile : {}) }}>{filteredEmployees[0].name || "-"}</div>
                  <div style={{ ...ui.employeeCvSubtitle, ...(isMobileView ? ui.employeeCvSubtitleMobile : {}) }}>{filteredEmployees[0].department || "-"}</div>
                  <div style={ui.employeeCvLine} />

                  <div style={ui.employeeCvSection}>
                    <div style={ui.employeeCvSectionTitle}>{language === "ar" ? "البيانات الوظيفية" : "Job Details"}</div>

                    <div style={{ ...ui.employeeCvRow, ...(isMobileView ? ui.employeeCvRowMobile : {}) }}>
                      <div style={{ ...ui.employeeCvKey, ...(isMobileView ? ui.employeeCvKeyMobile : {}) }}>{language === "ar" ? "الإدارة" : "Department"}</div>
                      <div style={{ ...ui.employeeCvVal, ...(isMobileView ? ui.employeeCvValMobile : {}) }}>{filteredEmployees[0].department || "-"}</div>
                    </div>
                    <div style={{ ...ui.employeeCvRow, ...(isMobileView ? ui.employeeCvRowMobile : {}) }}>
                      <div style={{ ...ui.employeeCvKey, ...(isMobileView ? ui.employeeCvKeyMobile : {}) }}>{language === "ar" ? "اسم الإدارة" : "Department Name"}</div>
                      <div style={{ ...ui.employeeCvVal, ...(isMobileView ? ui.employeeCvValMobile : {}) }}>{filteredEmployees[0].managerDepartment || "-"}</div>
                    </div>
                    <div style={{ ...ui.employeeCvRow, ...(isMobileView ? ui.employeeCvRowMobile : {}) }}>
                      <div style={{ ...ui.employeeCvKey, ...(isMobileView ? ui.employeeCvKeyMobile : {}) }}>{language === "ar" ? "المرتب الأساسي" : "Basic Salary"}</div>
                      <div style={{ ...ui.employeeCvVal, ...(isMobileView ? ui.employeeCvValMobile : {}) }}>{currency(filteredEmployees[0].basicSalary || filteredEmployees[0].salary || 0)}</div>
                    </div>
                    <div style={{ ...ui.employeeCvRow, ...(isMobileView ? ui.employeeCvRowMobile : {}) }}>
                      <div style={{ ...ui.employeeCvKey, ...(isMobileView ? ui.employeeCvKeyMobile : {}) }}>{language === "ar" ? "الفترة" : "Shift"}</div>
                      <div style={{ ...ui.employeeCvVal, ...(isMobileView ? ui.employeeCvValMobile : {}) }}>{filteredEmployees[0].shift === "evening" ? t.evening : t.morning}</div>
                    </div>
                  </div>

                  <div style={ui.employeeCvSection}>
                    <div style={ui.employeeCvSectionTitle}>{language === "ar" ? "وصف الموظف" : "Employee Description"}</div>
                    <div style={{ ...ui.employeeCvDescription, ...(isMobileView ? ui.employeeCvDescriptionMobile : {}) }}>{filteredEmployees[0].description || "-"}</div>
                  </div>
                </div>

                <div style={{ ...ui.employeeCvSide, ...(isMobileView ? ui.employeeCvSideMobile : {}) }}>
                  <div style={{ ...ui.employeeCvArt, ...(isMobileView ? ui.employeeCvArtMobile : {}) }}>
                    <div style={{ ...ui.employeeCvCircleLarge, ...(isMobileView ? ui.employeeCvCircleLargeMobile : {}) }} />
                    <div style={{ ...ui.employeeCvCircleSmall, ...(isMobileView ? ui.employeeCvCircleSmallMobile : {}) }} />
                    <div style={{ ...ui.employeeCvImageWrap, ...(isMobileView ? ui.employeeCvImageWrapMobile : {}) }}>
                      {filteredEmployees[0].profileImage ? (
                        <img src={filteredEmployees[0].profileImage} alt={filteredEmployees[0].name} style={ui.employeeCvImage} />
                      ) : (
                        <div style={{ ...ui.employeeCvFallback, ...(isMobileView ? ui.employeeCvFallbackMobile : {}) }}>{(filteredEmployees[0].name || "?").charAt(0)}</div>
                      )}
                    </div>
                  </div>

                  <div style={ui.employeeCvActions}>
                    <input
                      ref={employeeImageInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => handleEmployeeImageChange(e, filteredEmployees[0].phone)}
                    />
                    <Button variant="outline" onClick={() => employeeImageInputRef.current?.click()} style={ui.smallBtn}>
                      {language === "ar" ? "تغيير الصورة" : "Change Photo"}
                    </Button>
                  </div>

                  <div style={ui.employeeCvContacts}>
                    <div style={{ ...ui.employeeCvContactItem, ...(isMobileView ? ui.employeeCvContactItemMobile : {}) }}>
                      <span style={{ ...ui.employeeCvContactIcon, ...(isMobileView ? ui.employeeCvContactIconMobile : {}) }}>📍</span>
                      <div>
                        <div style={{ ...ui.employeeCvContactValue, ...(isMobileView ? ui.employeeCvContactValueMobile : {}) }}>{filteredEmployees[0].location || filteredEmployees[0].branch || "-"}</div>
                        <div style={ui.employeeCvContactSub}>{language === "ar" ? "الفرع" : "Branch"}</div>
                      </div>
                    </div>
                    <div style={{ ...ui.employeeCvContactItem, ...(isMobileView ? ui.employeeCvContactItemMobile : {}) }}>
                      <span style={{ ...ui.employeeCvContactIcon, ...(isMobileView ? ui.employeeCvContactIconMobile : {}) }}>📞</span>
                      <div>
                        <div style={{ ...ui.employeeCvContactValue, ...(isMobileView ? ui.employeeCvContactValueMobile : {}) }}>{filteredEmployees[0].phone || "-"}</div>
                        <div style={ui.employeeCvContactSub}>{t.phone}</div>
                      </div>
                    </div>
                    <div style={{ ...ui.employeeCvContactItem, ...(isMobileView ? ui.employeeCvContactItemMobile : {}) }}>
                      <span style={{ ...ui.employeeCvContactIcon, ...(isMobileView ? ui.employeeCvContactIconMobile : {}) }}>✉️</span>
                      <div>
                        <div style={{ ...ui.employeeCvContactValue, ...(isMobileView ? ui.employeeCvContactValueMobile : {}) }}>{filteredEmployees[0].email || "-"}</div>
                        <div style={ui.employeeCvContactSub}>{t.email}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={ui.emptyCell}>{language === "ar" ? "لا توجد بيانات موظف." : "No employee data found."}</div>
            )}
          </Card>
        ) : (
          <Card>
            <SectionHeader
              isMobile={isMobileView}
              icon={Users}
              title={t.employeeData}
              description={language === "ar" ? "" : ""}
            />
            <div style={ui.sectionActions}>
              <Button variant="outline" onClick={() => exportEmployeeDataReport()}>
                <Download size={16} />
                <span>{language === "ar" ? "تصدير Excel" : "Export Excel"}</span>
              </Button>
            </div>

            {canManageAll && (
              <div style={ui.branchFilterBar}>
                <div style={ui.branchFilterLabel}>{language === "ar" ? "فلتر الفروع" : "Branch Filter"}</div>
                <div style={ui.branchFilterWrap}>
                  <button
                    type="button"
                    onClick={() => setBranchFilter("all")}
                    style={{ ...ui.branchPill, ...(branchFilter === "all" ? ui.branchPillActive : {}) }}
                  >
                    {language === "ar" ? "كل الفروع" : "All Branches"}
                  </button>

                  {BRANCH_OPTIONS.map((branch) => (
                    <button
                      key={branch}
                      type="button"
                      onClick={() => setBranchFilter(branch)}
                      style={{
                        ...ui.branchPill,
                        ...getBranchBadgeStyle(branch),
                        ...(branchFilter === branch ? ui.branchPillSelected : {}),
                      }}
                    >
                      {branch}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{ ...ui.tableWrap, ...(isMobileView ? ui.tableWrapMobile : {}) }}>
              <table style={{ ...ui.table, ...(isMobileView ? ui.tableMobile : {}) }}>
                <thead>
                  <tr>
                    <th style={ui.th}>{t.name}</th>
                    {canManageAll && <th style={ui.th}>{language === "ar" ? "رقم البصمة" : "Fingerprint ID"}</th>}
                    <th style={ui.th}>{language === "ar" ? "الفرع" : "Branch"}</th>
                    <th style={ui.th}>{t.phone}</th>
                    <th style={ui.th}>{t.department}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((emp) => (
                    <tr
                      key={emp.id}
                      onClick={() => openEmployeeDetails(emp)}
                      style={ui.clickableRow}
                    >
                      <td style={ui.td}><strong>{emp.name}</strong></td>
                      {canManageAll && (
                        <td style={{ ...ui.td, textAlign: "center" }}>
                          {emp.fingerprintId ? (
                            <span dir="ltr" style={{ fontWeight: 600, letterSpacing: "0.5px", color: "var(--text)" }}>{emp.fingerprintId}</span>
                          ) : (
                            <span style={{ color: "var(--muted, #9ca3af)" }}>—</span>
                          )}
                        </td>
                      )}
                      <td style={ui.td}>
                        <div style={ui.branchCellCenter}>
                          <span style={{ ...ui.branchBadge, ...getBranchBadgeStyle(emp.location || emp.branch) }}>
                            {emp.location || emp.branch || "-"}
                          </span>
                        </div>
                      </td>
                      <td style={ui.td}>{emp.phone}</td>
                      <td style={ui.td}><Badge>{emp.department}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )
      )}

      {activeTab === "salary" && (
        <>
          <Card>
            <SectionHeader icon={Briefcase} title={t.salaryData} description="" isMobile={isMobileView} />
            <div style={ui.sectionActions}>
              <Button variant="outline" onClick={() => exportSalaryDataReport()}>
                <Download size={16} />
                <span>{language === "ar" ? "تصدير Excel" : "Export Excel"}</span>
              </Button>
            </div>
            {isMobileView ? (
              <div style={ui.mobileCardsStack}>
                {filteredEmployees.map((emp) => {
                  const net = getEmployeeFinancialStatement(emp)?.estimatedNet ?? 0;
                  return (
                    <MobileDataCard
                      key={emp.id}
                      title={emp.name}
                      action={canOpenSalaryActions(emp) ? <Button style={ui.smallBtn} onClick={() => openStatementDialog(emp)}>{t.accountStatement}</Button> : null}
                    >
                      <MobileFieldRow label={t.department} value={emp.department || "-"} />
                      <MobileFieldRow label={t.basicSalary} value={currency(emp.basicSalary || emp.salary)} />
                      <MobileFieldRow label={t.phone} value={emp.phone || "-"} />
                      <MobileFieldRow label={t.location} value={emp.location || "-"} />
                      <MobileFieldRow label={t.net} value={currency(net)} accent />
                    </MobileDataCard>
                  );
                })}
              </div>
            ) : (
              <div style={ui.tableWrap}>
                <table style={ui.table}>
                  <thead>
                    <tr>
                      <th style={ui.th}>{t.name}</th>
                      <th style={ui.th}>{t.department}</th>
                      <th style={ui.th}>{t.basicSalary}</th>
                      <th style={ui.th}>{t.phone}</th>
                      <th style={ui.th}>{t.location}</th>
                      <th style={ui.th}>{t.net}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp) => {
                      const net = getEmployeeFinancialStatement(emp)?.estimatedNet ?? 0;
                      return (
                        <tr
                          key={emp.id}
                          onClick={() => canOpenSalaryActions(emp) && openStatementDialog(emp)}
                          style={canOpenSalaryActions(emp) ? { cursor: "pointer" } : undefined}
                        >
                          <td style={ui.td}><strong>{emp.name}</strong></td>
                          <td style={ui.td}>{emp.department}</td>
                          <td style={ui.td}>{currency(emp.basicSalary || emp.salary)}</td>
                          <td style={ui.td}>{emp.phone}</td>
                          <td style={ui.td}>{emp.location || "-"}</td>
                          <td style={ui.td}>{currency(net)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      {activeTab === "leave" && (
        <>
          <Card>
            <SectionHeader icon={Clock3} title={t.leaveData} description={t.leaveDataDesc} isMobile={isMobileView} />
            <div style={ui.sectionActions}>
              <Button variant="outline" onClick={() => exportLeaveManagementReport()}>
                <Download size={16} />
                <span>{language === "ar" ? "تصدير Excel" : "Export Excel"}</span>
              </Button>
            </div>
            {isMobileView ? (
              <div style={ui.mobileCardsStack}>
                {filteredEmployees.map((emp) => (
                  <MobileDataCard
                    key={emp.id}
                    title={emp.name}
                    action={canOpenSalaryActions(emp) ? (
                      <Button style={ui.smallBtn} onClick={() => { setExpandedSalaryEmployeeId(emp.id); setLeaveRequestDialogOpen(true); }}>
                        {t.requestLeave}
                      </Button>
                    ) : null}
                  >
                    <MobileFieldRow label={t.department} value={emp.department || "-"} />
                    <MobileFieldRow label={t.leaveBalance} value={emp.leaveBalance} />
                    <MobileFieldRow label={t.workHours} value={emp.workHours} />
                    <MobileFieldRow label={t.fromHour} value={emp.fromHour || "-"} />
                    <MobileFieldRow label={t.toHour} value={emp.toHour || "-"} />
                    <MobileFieldRow label={t.shift} value={emp.shift === "evening" ? t.evening : t.morning} accent />
                  </MobileDataCard>
                ))}
              </div>
            ) : (
              <div style={ui.tableWrap}>
                <table style={ui.table}>
                  <thead>
                    <tr>
                      <th style={ui.th}>{t.name}</th>
                      <th style={ui.th}>{t.department}</th>
                      <th style={ui.th}>{t.leaveBalance}</th>
                      <th style={ui.th}>{t.workHours}</th>
                      <th style={ui.th}>{t.fromHour}</th>
                      <th style={ui.th}>{t.toHour}</th>
                      <th style={ui.th}>{t.shift}</th>
                      <th style={ui.th}>{t.action}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredEmployees.map((emp) => (
                      <tr key={emp.id}>
                        <td style={ui.td}><strong>{emp.name}</strong></td>
                        <td style={ui.td}>{emp.department}</td>
                        <td style={ui.td}>{emp.leaveBalance}</td>
                        <td style={ui.td}>{emp.workHours}</td>
                        <td style={ui.td}>{emp.fromHour || "-"}</td>
                        <td style={ui.td}>{emp.toHour || "-"}</td>
                        <td style={ui.td}>{emp.shift === "evening" ? t.evening : t.morning}</td>
                        <td style={ui.td}>
                          {canOpenSalaryActions(emp) && (
                            <Button style={ui.smallBtn} onClick={() => { setExpandedSalaryEmployeeId(emp.id); setLeaveRequestDialogOpen(true); }}>
                              {t.requestLeave}
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}

      <Modal open={addDialogOpen} title={t.newEmployee} onClose={() => setAddDialogOpen(false)} maxWidth={1000}>
        <div style={{ ...ui.grid2, ...(isMobileView ? ui.grid2Mobile : {}) }}>
          <Field label={t.name}><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></Field>
          <Field label={language === "ar" ? "رقم البصمة (Person ID)" : "Fingerprint ID (Person ID)"}><Input value={form.fingerprintId} onChange={(e) => setForm((p) => ({ ...p, fingerprintId: e.target.value }))} placeholder={language === "ar" ? "مثال: 0001" : "e.g. 0001"} /></Field>
          <Field label={t.department}><Input value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} /></Field>
          <Field label={t.managerDepartment}><Input value={form.managerDepartment} onChange={(e) => setForm((p) => ({ ...p, managerDepartment: e.target.value }))} /></Field>
          <Field label={t.password}><PasswordInput value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} /></Field>
          <Field label={t.phone}><Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} /></Field>
          <Field label={t.location}>
            <Select value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}>
              <option value="">اختر الفرع</option>
              {BRANCH_OPTIONS.map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </Select>
          </Field>
          <Field label={t.email}><Input value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} /></Field>
          <Field label={t.basicSalary}><Input type="number" value={form.basicSalary} onChange={(e) => setForm((p) => ({ ...p, basicSalary: e.target.value }))} /></Field>
          <Field label={t.leaveBalance}><Input type="number" value={form.leaveBalance} onChange={(e) => setForm((p) => ({ ...p, leaveBalance: e.target.value }))} /></Field>
          <Field label={t.workHours}><Input type="number" value={form.workHours} onChange={(e) => setForm((p) => ({ ...p, workHours: e.target.value }))} /></Field>
          <Field label={t.shift}>
            <Select value={form.shift} onChange={(e) => setForm((p) => ({ ...p, shift: e.target.value }))}>
              <option value="morning">{t.morning}</option>
              <option value="evening">{t.evening}</option>
              <option value="hourly">{language === "ar" ? "بالساعات (دوام مرن)" : "Hourly (flexible)"}</option>
            </Select>
          </Field>
          {form.shift === "hourly" ? (
            <>
              <Field label={language === "ar" ? "المدة المطلوبة (ساعات)" : "Required hours"}><Input type="number" min="0" value={form.requiredHours} onChange={(e) => setForm((p) => ({ ...p, requiredHours: e.target.value }))} placeholder="8" /></Field>
              <Field label={language === "ar" ? "المدة المطلوبة (دقائق)" : "Required minutes"}><Input type="number" min="0" max="59" value={form.requiredMinutes} onChange={(e) => setForm((p) => ({ ...p, requiredMinutes: e.target.value }))} placeholder="0" /></Field>
            </>
          ) : (
            <>
              <Field label={t.fromHour}><Input type="time" value={form.fromHour} onChange={(e) => setForm((p) => ({ ...p, fromHour: e.target.value }))} /></Field>
              <Field label={t.toHour}><Input type="time" value={form.toHour} onChange={(e) => setForm((p) => ({ ...p, toHour: e.target.value }))} /></Field>
            </>
          )}
          <Field label="وضع خصم التأخير">
            <Select value={form.attendanceLateDeductionMode} onChange={(e) => setForm((p) => ({ ...p, attendanceLateDeductionMode: e.target.value }))}>
              <option value="automatic">تلقائي</option>
              <option value="manual">يدوي</option>
              <option value="none">لا يوجد خصم</option>
            </Select>
          </Field>
          <Field label="نوع خصم التأخير">
            <Select value={form.attendanceLateValueType} onChange={(e) => setForm((p) => ({ ...p, attendanceLateValueType: e.target.value }))}>
              <option value="amount">مبلغ ثابت</option>
              <option value="percentage">نسبة مئوية</option>
            </Select>
          </Field>
          <Field label="قيمة خصم التأخير">
            <Input type="number" value={form.attendanceLateValue} onChange={(e) => setForm((p) => ({ ...p, attendanceLateValue: e.target.value }))} />
          </Field>
          <Field label="وضع خصم الغياب">
            <Select value={form.attendanceAbsenceDeductionMode} onChange={(e) => setForm((p) => ({ ...p, attendanceAbsenceDeductionMode: e.target.value }))}>
              <option value="automatic">تلقائي</option>
              <option value="manual">يدوي</option>
              <option value="none">لا يوجد خصم</option>
            </Select>
          </Field>
          <Field label="نوع خصم الغياب">
            <Select value={form.attendanceAbsenceValueType} onChange={(e) => setForm((p) => ({ ...p, attendanceAbsenceValueType: e.target.value }))}>
              <option value="amount">مبلغ ثابت</option>
              <option value="percentage">نسبة مئوية</option>
            </Select>
          </Field>
          <Field label="قيمة خصم الغياب">
            <Input type="number" value={form.attendanceAbsenceValue} onChange={(e) => setForm((p) => ({ ...p, attendanceAbsenceValue: e.target.value }))} />
          </Field>
          <Field label={t.employeeDescription} full><Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></Field>
        </div>
        <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}><Button onClick={addEmployee}>{t.saveEmployee}</Button></div>
      </Modal>

      <Modal open={editDialogOpen} title={t.editEmployee} onClose={() => setEditDialogOpen(false)} maxWidth={1000}>
        <div style={{ ...ui.grid2, ...(isMobileView ? ui.grid2Mobile : {}) }}>
          <Field label={t.name}><Input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} /></Field>
          <Field label={language === "ar" ? "رقم البصمة (Person ID)" : "Fingerprint ID (Person ID)"}><Input value={editForm.fingerprintId} onChange={(e) => setEditForm((p) => ({ ...p, fingerprintId: e.target.value }))} placeholder={language === "ar" ? "مثال: 0001" : "e.g. 0001"} /></Field>
          <Field label={t.department}><Input value={editForm.department} onChange={(e) => setEditForm((p) => ({ ...p, department: e.target.value }))} /></Field>
          <Field label={t.managerDepartment}><Input value={editForm.managerDepartment} onChange={(e) => setEditForm((p) => ({ ...p, managerDepartment: e.target.value }))} /></Field>
          <Field label={t.password}><PasswordInput value={editForm.password} onChange={(e) => setEditForm((p) => ({ ...p, password: e.target.value }))} /></Field>
          <Field label={t.phone}><Input value={editForm.phone} onChange={(e) => setEditForm((p) => ({ ...p, phone: e.target.value }))} /></Field>
          <Field label={t.location}>
            <Select value={editForm.location} onChange={(e) => setEditForm((p) => ({ ...p, location: e.target.value }))}>
              <option value="">اختر الفرع</option>
              {BRANCH_OPTIONS.map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </Select>
          </Field>
          <Field label={t.email}><Input value={editForm.email} onChange={(e) => setEditForm((p) => ({ ...p, email: e.target.value }))} /></Field>
          <Field label={t.basicSalary}><Input type="number" value={editForm.basicSalary} onChange={(e) => setEditForm((p) => ({ ...p, basicSalary: e.target.value }))} /></Field>
          <Field label={t.leaveBalance}><Input type="number" value={editForm.leaveBalance} onChange={(e) => setEditForm((p) => ({ ...p, leaveBalance: e.target.value }))} /></Field>
          <Field label={t.workHours}><Input type="number" value={editForm.workHours} onChange={(e) => setEditForm((p) => ({ ...p, workHours: e.target.value }))} /></Field>
          <Field label={t.shift}>
            <Select value={editForm.shift} onChange={(e) => setEditForm((p) => ({ ...p, shift: e.target.value }))}>
              <option value="morning">{t.morning}</option>
              <option value="evening">{t.evening}</option>
              <option value="hourly">{language === "ar" ? "بالساعات (دوام مرن)" : "Hourly (flexible)"}</option>
            </Select>
          </Field>
          {editForm.shift === "hourly" ? (
            <>
              <Field label={language === "ar" ? "المدة المطلوبة (ساعات)" : "Required hours"}><Input type="number" min="0" value={editForm.requiredHours} onChange={(e) => setEditForm((p) => ({ ...p, requiredHours: e.target.value }))} placeholder="8" /></Field>
              <Field label={language === "ar" ? "المدة المطلوبة (دقائق)" : "Required minutes"}><Input type="number" min="0" max="59" value={editForm.requiredMinutes} onChange={(e) => setEditForm((p) => ({ ...p, requiredMinutes: e.target.value }))} placeholder="0" /></Field>
            </>
          ) : (
            <>
              <Field label={t.fromHour}><Input type="time" value={editForm.fromHour} onChange={(e) => setEditForm((p) => ({ ...p, fromHour: e.target.value }))} /></Field>
              <Field label={t.toHour}><Input type="time" value={editForm.toHour} onChange={(e) => setEditForm((p) => ({ ...p, toHour: e.target.value }))} /></Field>
            </>
          )}
          <Field label="وضع خصم التأخير">
            <Select value={editForm.attendanceLateDeductionMode} onChange={(e) => setEditForm((p) => ({ ...p, attendanceLateDeductionMode: e.target.value }))}>
              <option value="automatic">تلقائي</option>
              <option value="manual">يدوي</option>
              <option value="none">لا يوجد خصم</option>
            </Select>
          </Field>
          <Field label="نوع خصم التأخير">
            <Select value={editForm.attendanceLateValueType} onChange={(e) => setEditForm((p) => ({ ...p, attendanceLateValueType: e.target.value }))}>
              <option value="amount">مبلغ ثابت</option>
              <option value="percentage">نسبة مئوية</option>
            </Select>
          </Field>
          <Field label="قيمة خصم التأخير">
            <Input type="number" value={editForm.attendanceLateValue} onChange={(e) => setEditForm((p) => ({ ...p, attendanceLateValue: e.target.value }))} />
          </Field>
          <Field label="وضع خصم الغياب">
            <Select value={editForm.attendanceAbsenceDeductionMode} onChange={(e) => setEditForm((p) => ({ ...p, attendanceAbsenceDeductionMode: e.target.value }))}>
              <option value="automatic">تلقائي</option>
              <option value="manual">يدوي</option>
              <option value="none">لا يوجد خصم</option>
            </Select>
          </Field>
          <Field label="نوع خصم الغياب">
            <Select value={editForm.attendanceAbsenceValueType} onChange={(e) => setEditForm((p) => ({ ...p, attendanceAbsenceValueType: e.target.value }))}>
              <option value="amount">مبلغ ثابت</option>
              <option value="percentage">نسبة مئوية</option>
            </Select>
          </Field>
          <Field label="قيمة خصم الغياب">
            <Input type="number" value={editForm.attendanceAbsenceValue} onChange={(e) => setEditForm((p) => ({ ...p, attendanceAbsenceValue: e.target.value }))} />
          </Field>
          <Field label={t.employeeDescription} full><Textarea value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} /></Field>
        </div>
        <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}><Button onClick={saveEmployeeEdit}>{t.saveEdit}</Button></div>
      </Modal>

      <Modal open={completeDialogOpen} title={t.completeEmployee} onClose={() => setCompleteDialogOpen(false)} maxWidth={1000}>
        <div style={{ ...ui.grid2, ...(isMobileView ? ui.grid2Mobile : {}) }}>
          <Field label={t.name}><Input value={completeForm.name} onChange={(e) => setCompleteForm((p) => ({ ...p, name: e.target.value }))} /></Field>
          <Field label={t.department}><Input value={completeForm.department} onChange={(e) => setCompleteForm((p) => ({ ...p, department: e.target.value }))} /></Field>
          <Field label={t.managerDepartment}><Input value={completeForm.managerDepartment} onChange={(e) => setCompleteForm((p) => ({ ...p, managerDepartment: e.target.value }))} /></Field>
          <Field label={t.password}><PasswordInput value={completeForm.password} onChange={(e) => setCompleteForm((p) => ({ ...p, password: e.target.value }))} /></Field>
          <Field label={t.phone}><Input value={completeForm.phone} onChange={(e) => setCompleteForm((p) => ({ ...p, phone: e.target.value }))} /></Field>
          <Field label={t.location}>
            <Select value={completeForm.location} onChange={(e) => setCompleteForm((p) => ({ ...p, location: e.target.value }))}>
              <option value="">اختر الفرع</option>
              {BRANCH_OPTIONS.map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </Select>
          </Field>
          <Field label={t.email}><Input value={completeForm.email} onChange={(e) => setCompleteForm((p) => ({ ...p, email: e.target.value }))} /></Field>
          <Field label={t.basicSalary}><Input type="number" value={completeForm.basicSalary} onChange={(e) => setCompleteForm((p) => ({ ...p, basicSalary: e.target.value }))} /></Field>
          <Field label={t.leaveBalance}><Input type="number" value={completeForm.leaveBalance} onChange={(e) => setCompleteForm((p) => ({ ...p, leaveBalance: e.target.value }))} /></Field>
          <Field label={t.workHours}><Input type="number" value={completeForm.workHours} onChange={(e) => setCompleteForm((p) => ({ ...p, workHours: e.target.value }))} /></Field>
          <Field label={t.shift}>
            <Select value={completeForm.shift} onChange={(e) => setCompleteForm((p) => ({ ...p, shift: e.target.value }))}>
              <option value="morning">{t.morning}</option>
              <option value="evening">{t.evening}</option>
            </Select>
          </Field>
          <Field label={t.fromHour}><Input type="time" value={completeForm.fromHour} onChange={(e) => setCompleteForm((p) => ({ ...p, fromHour: e.target.value }))} /></Field>
          <Field label={t.toHour}><Input type="time" value={completeForm.toHour} onChange={(e) => setCompleteForm((p) => ({ ...p, toHour: e.target.value }))} /></Field>
          <Field label="وضع خصم التأخير">
            <Select value={completeForm.attendanceLateDeductionMode} onChange={(e) => setCompleteForm((p) => ({ ...p, attendanceLateDeductionMode: e.target.value }))}>
              <option value="automatic">تلقائي</option>
              <option value="manual">يدوي</option>
            </Select>
          </Field>
          <Field label="نوع خصم التأخير">
            <Select value={completeForm.attendanceLateValueType} onChange={(e) => setCompleteForm((p) => ({ ...p, attendanceLateValueType: e.target.value }))}>
              <option value="amount">مبلغ ثابت</option>
              <option value="percentage">نسبة مئوية</option>
            </Select>
          </Field>
          <Field label="قيمة خصم التأخير">
            <Input type="number" value={completeForm.attendanceLateValue} onChange={(e) => setCompleteForm((p) => ({ ...p, attendanceLateValue: e.target.value }))} />
          </Field>
          <Field label="وضع خصم الغياب">
            <Select value={completeForm.attendanceAbsenceDeductionMode} onChange={(e) => setCompleteForm((p) => ({ ...p, attendanceAbsenceDeductionMode: e.target.value }))}>
              <option value="automatic">تلقائي</option>
              <option value="manual">يدوي</option>
            </Select>
          </Field>
          <Field label="نوع خصم الغياب">
            <Select value={completeForm.attendanceAbsenceValueType} onChange={(e) => setCompleteForm((p) => ({ ...p, attendanceAbsenceValueType: e.target.value }))}>
              <option value="amount">مبلغ ثابت</option>
              <option value="percentage">نسبة مئوية</option>
            </Select>
          </Field>
          <Field label="قيمة خصم الغياب">
            <Input type="number" value={completeForm.attendanceAbsenceValue} onChange={(e) => setCompleteForm((p) => ({ ...p, attendanceAbsenceValue: e.target.value }))} />
          </Field>
          <Field label={t.employeeDescription} full><Textarea value={completeForm.description} onChange={(e) => setCompleteForm((p) => ({ ...p, description: e.target.value }))} /></Field>
        </div>
        <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}><Button onClick={completeEmployeeData}>{t.completeSave}</Button></div>
      </Modal>

      <Modal open={statementDialogOpen} title={t.accountStatement} onClose={() => { setStatementDialogOpen(false); setStatementEmployee(null); }} maxWidth={1100}>
        {statementEmployee && statementData ? (
          <div style={{ display: "grid", gap: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center", flexDirection: isMobileView ? "column" : "row" }}>
              <div style={{ width: isMobileView ? "100%" : "auto" }}>
                <h3 style={{ margin: "0 0 6px", fontSize: 24 }}>{statementEmployee.name}</h3>
                <p style={{ margin: 0, color: "var(--text-soft)", lineHeight: 1.8 }}>
                  {statementEmployee.department} — {statementEmployee.phone}
                </p>
              </div>
              <div style={{ width: isMobileView ? "100%" : "auto", display: "flex", justifyContent: isMobileView ? "flex-start" : "flex-end", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                <Button variant="outline" onClick={exportAccountStatementReport}>
                  {language === "ar" ? "تصدير Excel" : "Export Excel"}
                </Button>
                <Badge>{t.accountStatement}</Badge>
              </div>
            </div>

            {canRequestFinancialActions && canOpenSalaryActions(statementEmployee) && (
              <div style={{ ...ui.rowActions, ...(isMobileView ? ui.rowActionsMobile : {}) }}>
                <Button onClick={() => setAdvanceDialogOpen(true)}>{canManageAll ? t.advance : t.requestAdvance}</Button>
                <Button variant="outline" onClick={() => setRewardDialogOpen(true)}>
                  {canManageAll ? t.rewardOrDeduction : t.requestReward}
                </Button>
                {canManageAll && (
                  <Button variant="outline" onClick={() => { setSalaryDepositStep(1); setSalaryDepositDialogOpen(true); }}>{t.salaryDeposit}</Button>
                )}
              </div>
            )}

            <div style={{ ...ui.statementGrid, ...(isMobileView ? ui.statementGridMobile : {}) }}>
              <Card style={ui.statementCard}>
                <div style={ui.summaryTitle}>{t.basicSalary}</div>
                <div style={ui.statementValue}>{currency(statementData.basicSalary)}</div>
              </Card>
              <Card style={ui.statementCard}>
                <div style={ui.summaryTitle}>{t.salary}</div>
                <div style={ui.statementValue}>{currency(statementData.grossSalary)}</div>
              </Card>
              <Card style={ui.statementCard}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <div style={ui.summaryTitle}>{t.currentAdvanceBalance}</div>
                  {canManageAll && (
                    <button
                      type="button"
                      onClick={() => openAdvanceSettlementDialog(statementEmployee)}
                      style={ui.advanceMiniButton}
                      title={language === "ar" ? "إعداد خصم السلفة" : "Advance deduction settings"}
                    >
                      <Plus size={14} />
                    </button>
                  )}
                </div>
                <div style={ui.statementValue}>{currency(statementData.currentAdvanceBalance)}</div>
                <div style={ui.summarySubtitle}>{getAdvanceDeductionLabel(statementEmployee, statementData.grossSalary)}</div>
              </Card>
              <Card style={ui.statementCard}>
                <div style={ui.summaryTitle}>{t.approvedRewards}</div>
                <div style={ui.statementValue}>{currency(statementData.approvedRewards)}</div>
              </Card>
              <Card style={ui.statementCard}>
                <div style={ui.summaryTitle}>{t.approvedDeductions}</div>
                <div style={ui.statementValue}>{currency(statementData.approvedDeductions)}</div>
              </Card>
              <Card style={ui.statementCard}>
                <div style={ui.summaryTitle}>{t.estimatedNet}</div>
                <div style={ui.statementValue}>{currency(statementData.estimatedNet)}</div>
              </Card>
            </div>

            <Card style={{ padding: 18 }}>
              <h4 style={{ margin: "0 0 14px", fontSize: 20 }}>{t.statementTransactions}</h4>
              {isMobileView ? (
                <div style={ui.mobileCardsStack}>
                  {statementData.transactions.length ? (
                    statementData.transactions.map((req) => (
                      <MobileDataCard
                        key={req.id}
                        title={req.type}
                        action={
                          <div style={{ display: "flex", gap: 6 }}>
                            <Button variant="outline" style={ui.smallBtn} onClick={() => openNotificationDialog(req)}>{t.notification}</Button>
                            {canManageAll && (
                              <Button variant="danger" style={ui.smallBtn} onClick={() => deleteStatementTransaction(req)} title={language === "ar" ? "حذف الحركة" : "Delete transaction"}><Trash2 size={14} /></Button>
                            )}
                          </div>
                        }
                      >
                        <MobileFieldRow label={t.amount} value={currency(req.resolvedAmount || req.amount)} />
                        <MobileFieldRow label={t.status} value={getFinancialSettlementStatusLabel(req)} />
                        <MobileFieldRow label={t.approvedBy} value={req.decidedBy || "-"} />
                        <MobileFieldRow label={t.submittedAt} value={req.createdAt ? new Date(req.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US") : (language === "ar" ? "سجل سابق" : "Previous record")} />
                        <MobileFieldRow label={t.notification} value={getNotificationContent(req)} accent />
                      </MobileDataCard>
                    ))
                  ) : (
                    <div style={ui.chatEmptySide}>{t.noTransactions}</div>
                  )}
                </div>
              ) : (
                <div style={{ ...ui.tableWrap, ...(isMobileView ? ui.tableWrapMobile : {}) }}>
                  <table style={{ ...ui.table, ...(isMobileView ? ui.tableMobile : {}) }}>
                    <thead>
                      <tr>
                        <th style={ui.th}>{t.statementType}</th>
                        <th style={ui.th}>{t.amount}</th>
                        <th style={ui.th}>{t.status}</th>
                        <th style={ui.th}>{t.approvedBy}</th>
                        <th style={ui.th}>{t.submittedAt}</th>
                        <th style={ui.th}>{t.notification}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statementData.transactions.length ? (
                        statementData.transactions.map((req) => (
                          <tr key={req.id}>
                            <td style={ui.td}>{req.type}</td>
                            <td style={ui.td}>{currency(req.resolvedAmount || req.amount)}</td>
                            <td style={ui.td}>{req.status}</td>
                            <td style={ui.td}>{req.decidedBy || "-"}</td>
                            <td style={ui.td}>{req.createdAt ? new Date(req.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US") : "سجل سابق"}</td>
                            <td style={ui.td}>
                              <div style={{ display: "flex", gap: 6, justifyContent: "flex-start" }}>
                                <Button variant="outline" style={ui.smallBtn} onClick={() => openNotificationDialog(req)}>
                                  {t.notification}
                                </Button>
                                {canManageAll && (
                                  <Button variant="danger" style={ui.smallBtn} onClick={() => deleteStatementTransaction(req)} title={language === "ar" ? "حذف الحركة" : "Delete transaction"}>
                                    <Trash2 size={14} />
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td style={ui.emptyCell} colSpan={7}>{t.noTransactions}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        ) : null}
      </Modal>

      <Modal open={notificationDialogOpen} title={t.notificationDetails} onClose={() => { setNotificationDialogOpen(false); setSelectedNotification(null); }} maxWidth={620}>
        {selectedNotification ? (
          <div style={{ display: "grid", gap: 14 }}>
            <div>
              <div style={ui.label}>{t.statementType}</div>
              <div style={ui.noticeText}>{selectedNotification.type}</div>
            </div>
            <div>
              <div style={ui.label}>{t.status}</div>
              <div style={ui.noticeText}>{getFinancialSettlementStatusLabel(selectedNotification)}</div>
            </div>
            <div>
              <div style={ui.label}>{t.notification}</div>
              <div style={ui.noticeText}>{getNotificationContent(selectedNotification)}</div>
            </div>
            {getLinkedSalaryDeposit(selectedNotification) ? (
              <div>
                <div style={ui.label}>{language === "ar" ? "المرتب المرتبط" : "Linked salary deposit"}</div>
                <div style={ui.noticeText}>
                  {getLinkedSalaryDeposit(selectedNotification)?.month
                    ? `${language === "ar" ? "تمت التسوية مع مرتب شهر" : "Settled with salary for"} ${getLinkedSalaryDeposit(selectedNotification)?.month}`
                    : (language === "ar" ? "تمت التسوية مع إنزال مرتب" : "Settled with salary deposit")}
                  {` | ${language === "ar" ? "الصافي" : "Net"}: ${currency(getLinkedSalaryDeposit(selectedNotification)?.amount || 0)}`}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
        <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}>
          <Button variant="outline" onClick={() => { setNotificationDialogOpen(false); setSelectedNotification(null); }}>{t.close}</Button>
        </div>
      </Modal>

      <Modal open={!!transactionToDelete} title={language === "ar" ? "تأكيد حذف الحركة" : "Confirm delete transaction"} onClose={() => setTransactionToDelete(null)} maxWidth={480}>
        {transactionToDelete ? (
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ border: "1px solid #fecaca", background: "#fef2f2", borderRadius: 8, padding: 14, color: "#7f1d1d", fontSize: 14, lineHeight: 1.8 }}>
              {language === "ar"
                ? `سيتم حذف حركة "${transactionToDelete.type}" بقيمة ${currency(transactionToDelete.resolvedAmount || transactionToDelete.amount || transactionToDelete.advanceSettledAmount || 0)} وعكس أثرها على الرصيد. لا يمكن التراجع.`
                : `The "${transactionToDelete.type}" transaction will be deleted and its balance effect reversed. This cannot be undone.`}
            </div>
            <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}>
              <Button variant="outline" onClick={() => setTransactionToDelete(null)}>{language === "ar" ? "إلغاء" : "Cancel"}</Button>
              <Button variant="danger" onClick={confirmDeleteTransaction}>{language === "ar" ? "تأكيد الحذف" : "Confirm delete"}</Button>
            </div>
          </div>
        ) : null}
      </Modal>

      <Modal
        open={approvalLogOpen}
        title={
          approvalLogType === "leave"
            ? (language === "ar" ? "سجل اعتماد / رفض الغياب والتأخير" : "Attendance Approval / Rejection Log")
            : (language === "ar" ? "سجل اعتماد / رفض السلف والمكافآت والخصومات" : "Financial Approval / Rejection Log")
        }
        onClose={() => setApprovalLogOpen(false)}
        maxWidth={1100}
      >
        <div style={{ ...ui.sectionActions, marginBottom: 12 }}>
          <Button variant="outline" onClick={() => exportApprovalLogReport(approvalLogType)}>
            <Download size={16} />
            <span>{language === "ar" ? "تصدير Excel" : "Export Excel"}</span>
          </Button>
        </div>
        {isMobileView ? (
          <div style={ui.mobileCardsStack}>
            {(approvalLogType === "leave" ? approvalLogLeaveRequests : approvalLogFinancialRequests).length ? (
              (approvalLogType === "leave" ? approvalLogLeaveRequests : approvalLogFinancialRequests).map((req) => (
                <MobileDataCard key={req.id} title={req.employeeName}>
                  <MobileFieldRow label={t.type} value={req.type || "-"} />
                  <MobileFieldRow label={approvalLogType === "leave" ? t.dateTime : t.amount} value={getApprovalLogDetail(req, approvalLogType, t)} />
                  <MobileFieldRow label={t.reason} value={req.reason || "-"} />
                  <MobileFieldRow label={t.status} value={req.status || "-"} />
                  <MobileFieldRow label={t.approvedBy} value={req.decidedBy || "-"} accent />
                </MobileDataCard>
              ))
            ) : (
              <div style={ui.chatEmptySide}>{language === "ar" ? "لا توجد سجلات اعتماد أو رفض حالياً." : "No approval or rejection history yet."}</div>
            )}
          </div>
        ) : (
          <div style={{ ...ui.tableWrap, ...(isMobileView ? ui.tableWrapMobile : {}) }}>
            <table style={{ ...ui.table, ...(isMobileView ? ui.tableMobile : {}) }}>
              <thead>
                <tr>
                  <th style={ui.th}>{t.employee}</th>
                  <th style={ui.th}>{t.type}</th>
                  <th style={ui.th}>{approvalLogType === "leave" ? t.dateTime : t.amount}</th>
                  <th style={ui.th}>{t.reason}</th>
                  <th style={ui.th}>{t.status}</th>
                  <th style={ui.th}>{t.approvedBy}</th>
                </tr>
              </thead>
              <tbody>
                {(approvalLogType === "leave" ? approvalLogLeaveRequests : approvalLogFinancialRequests).length ? (
                  (approvalLogType === "leave" ? approvalLogLeaveRequests : approvalLogFinancialRequests).map((req) => (
                    <tr key={req.id}>
                      <td style={ui.td}><strong>{req.employeeName}</strong></td>
                      <td style={ui.td}>{req.type}</td>
                      <td style={ui.td}>{getApprovalLogDetail(req, approvalLogType, t)}</td>
                      <td style={ui.td}>{req.reason || "-"}</td>
                      <td style={ui.td}>{req.status}</td>
                      <td style={ui.td}>{req.decidedBy || "-"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td style={ui.emptyCell} colSpan={7}>
                      {language === "ar" ? "لا توجد سجلات اعتماد أو رفض حالياً." : "No approval or rejection history yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Modal>

      <Modal open={employeeDetailsOpen} title={language === "ar" ? "تفاصيل الموظف" : "Employee Details"} onClose={() => setEmployeeDetailsOpen(false)} maxWidth={980}>
        {selectedEmployee && (
          <div style={{ ...ui.employeeCvLayout, ...(isMobileView ? ui.employeeCvLayoutMobile : {}) }}>
            <div style={{ ...ui.employeeCvMain, ...(isMobileView ? ui.employeeCvMainMobile : {}) }}>
              <div style={{ ...ui.employeeCvName, ...(isMobileView ? ui.employeeCvNameMobile : {}) }}>{selectedEmployee.name || "-"}</div>
              <div style={{ ...ui.employeeCvSubtitle, ...(isMobileView ? ui.employeeCvSubtitleMobile : {}) }}>{selectedEmployee.department || "-"}</div>
              <div style={ui.employeeCvLine} />

              <div style={ui.employeeCvSection}>
                <div style={ui.employeeCvSectionTitle}>{language === "ar" ? "البيانات الوظيفية" : "Job Details"}</div>

                <div style={{ ...ui.employeeCvRow, ...(isMobileView ? ui.employeeCvRowMobile : {}) }}>
                  <div style={{ ...ui.employeeCvKey, ...(isMobileView ? ui.employeeCvKeyMobile : {}) }}>{language === "ar" ? "الإدارة" : "Department"}</div>
                  <div style={{ ...ui.employeeCvVal, ...(isMobileView ? ui.employeeCvValMobile : {}) }}>{selectedEmployee.department || "-"}</div>
                </div>
                <div style={{ ...ui.employeeCvRow, ...(isMobileView ? ui.employeeCvRowMobile : {}) }}>
                  <div style={{ ...ui.employeeCvKey, ...(isMobileView ? ui.employeeCvKeyMobile : {}) }}>{language === "ar" ? "اسم الإدارة" : "Department Name"}</div>
                  <div style={{ ...ui.employeeCvVal, ...(isMobileView ? ui.employeeCvValMobile : {}) }}>{selectedEmployee.managerDepartment || "-"}</div>
                </div>
                <div style={{ ...ui.employeeCvRow, ...(isMobileView ? ui.employeeCvRowMobile : {}) }}>
                  <div style={{ ...ui.employeeCvKey, ...(isMobileView ? ui.employeeCvKeyMobile : {}) }}>{language === "ar" ? "المرتب الأساسي" : "Basic Salary"}</div>
                  <div style={{ ...ui.employeeCvVal, ...(isMobileView ? ui.employeeCvValMobile : {}) }}>{currency(selectedEmployee.basicSalary || selectedEmployee.salary || 0)}</div>
                </div>
                <div style={{ ...ui.employeeCvRow, ...(isMobileView ? ui.employeeCvRowMobile : {}) }}>
                  <div style={{ ...ui.employeeCvKey, ...(isMobileView ? ui.employeeCvKeyMobile : {}) }}>{language === "ar" ? "الفترة" : "Shift"}</div>
                  <div style={{ ...ui.employeeCvVal, ...(isMobileView ? ui.employeeCvValMobile : {}) }}>{selectedEmployee.shift === "evening" ? t.evening : t.morning}</div>
                </div>
              </div>

              <div style={ui.employeeCvSection}>
                <div style={ui.employeeCvSectionTitle}>{language === "ar" ? "وصف الموظف" : "Employee Description"}</div>
                <div style={{ ...ui.employeeCvDescription, ...(isMobileView ? ui.employeeCvDescriptionMobile : {}) }}>{selectedEmployee.description || "-"}</div>
              </div>

              <div style={ui.modalFooterActions}>
                {canManageAll && <Button variant="outline" onClick={() => { setEmployeeDetailsOpen(false); openEditEmployee(selectedEmployee); }} style={ui.smallBtn}><Pencil size={14} /> {t.editData}</Button>}
                {canDeleteEmployees && <Button variant="danger" onClick={() => { deleteEmployee(selectedEmployee.id); setEmployeeDetailsOpen(false); }} style={ui.smallBtn}><Trash2 size={14} /> {t.delete}</Button>}
              </div>
            </div>

            <div style={{ ...ui.employeeCvSide, ...(isMobileView ? ui.employeeCvSideMobile : {}) }}>
              <div style={{ ...ui.employeeCvArt, ...(isMobileView ? ui.employeeCvArtMobile : {}) }}>
                <div style={{ ...ui.employeeCvCircleLarge, ...(isMobileView ? ui.employeeCvCircleLargeMobile : {}) }} />
                <div style={{ ...ui.employeeCvCircleSmall, ...(isMobileView ? ui.employeeCvCircleSmallMobile : {}) }} />
                <div style={{ ...ui.employeeCvImageWrap, ...(isMobileView ? ui.employeeCvImageWrapMobile : {}) }}>
                  {selectedEmployee.profileImage ? (
                    <img src={selectedEmployee.profileImage} alt={selectedEmployee.name} style={ui.employeeCvImage} />
                  ) : (
                    <div style={{ ...ui.employeeCvFallback, ...(isMobileView ? ui.employeeCvFallbackMobile : {}) }}>{(selectedEmployee.name || "?").charAt(0)}</div>
                  )}
                </div>
              </div>

              {canManageAll && (
                <div style={ui.employeeCvActions}>
                  <input
                    ref={modalImageInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleEmployeeImageChange(e, selectedEmployee.phone)}
                  />
                  <Button variant="outline" onClick={() => modalImageInputRef.current?.click()} style={ui.smallBtn}>
                    {language === "ar" ? "تغيير الصورة" : "Change Photo"}
                  </Button>
                </div>
              )}

              <div style={ui.employeeCvContacts}>
                <div style={{ ...ui.employeeCvContactItem, ...(isMobileView ? ui.employeeCvContactItemMobile : {}) }}>
                  <span style={{ ...ui.employeeCvContactIcon, ...(isMobileView ? ui.employeeCvContactIconMobile : {}) }}>📍</span>
                  <div>
                    <div style={{ ...ui.employeeCvContactValue, ...(isMobileView ? ui.employeeCvContactValueMobile : {}) }}>{selectedEmployee.location || selectedEmployee.branch || "-"}</div>
                    <div style={ui.employeeCvContactSub}>{language === "ar" ? "الفرع" : "Branch"}</div>
                  </div>
                </div>
                <div style={{ ...ui.employeeCvContactItem, ...(isMobileView ? ui.employeeCvContactItemMobile : {}) }}>
                  <span style={{ ...ui.employeeCvContactIcon, ...(isMobileView ? ui.employeeCvContactIconMobile : {}) }}>📞</span>
                  <div>
                    <div style={{ ...ui.employeeCvContactValue, ...(isMobileView ? ui.employeeCvContactValueMobile : {}) }}>{selectedEmployee.phone || "-"}</div>
                    <div style={ui.employeeCvContactSub}>{t.phone}</div>
                  </div>
                </div>
                <div style={{ ...ui.employeeCvContactItem, ...(isMobileView ? ui.employeeCvContactItemMobile : {}) }}>
                  <span style={{ ...ui.employeeCvContactIcon, ...(isMobileView ? ui.employeeCvContactIconMobile : {}) }}>✉️</span>
                  <div>
                    <div style={{ ...ui.employeeCvContactValue, ...(isMobileView ? ui.employeeCvContactValueMobile : {}) }}>{selectedEmployee.email || "-"}</div>
                    <div style={ui.employeeCvContactSub}>{t.email}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal open={groupDialogOpen} title={t.chatCreateGroup} onClose={() => setGroupDialogOpen(false)} maxWidth={760}>
        <div style={{ ...ui.grid2, ...(isMobileView ? ui.grid2Mobile : {}) }}>
          <Field label={t.chatGroupName} full>
            <Input value={groupForm.name} onChange={(e) => setGroupForm((prev) => ({ ...prev, name: e.target.value }))} />
          </Field>
          <Field label={chatLabels.searchByPhone} full>
            <Textarea
              rows={3}
              placeholder={t.chatGroupPhonesHint}
              value={groupForm.phoneNumbers || ""}
              onChange={(e) => setGroupForm((prev) => ({ ...prev, phoneNumbers: e.target.value }))}
            />
          </Field>
          <Field label={t.chatMembers} full>
            <div style={ui.groupMemberGrid}>
              {availableGroupMembers.map((member) => {
                const memberPhone = member.participants.find((phone) => phone !== authUser?.phone) || member.participants[1];
                const checked = groupForm.members.includes(memberPhone);
                return (
                  <label key={member.id} style={{ ...ui.groupMemberChip, ...(checked ? ui.groupMemberChipActive : {}) }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const value = memberPhone;
                        setGroupForm((prev) => ({
                          ...prev,
                          members: e.target.checked ? [...prev.members, value] : prev.members.filter((item) => item !== value),
                        }));
                      }}
                    />
                    <span>{member.name} - {memberPhone}</span>
                  </label>
                );
              })}
            </div>
          </Field>
        </div>
        <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}>
          <Button variant="outline" onClick={() => setGroupDialogOpen(false)}>{t.chatCancel}</Button>
          <Button onClick={createGroupChat}>{t.chatCreate}</Button>
        </div>
      </Modal>

      <Modal open={messageMenuOpen} title={language === "ar" ? "خيارات الرسالة" : "Message actions"} onClose={() => setMessageMenuOpen(false)} maxWidth={520}>
        <div style={ui.actionMenuList}>
          <button type="button" style={ui.actionMenuItem} onClick={() => { setChatDraft(`${language === "ar" ? "رد على: " : "Reply to: "}${selectedMessage?.text || ""}`); setMessageMenuOpen(false); }}><Reply size={18} /> <span>{chatLabels.reply}</span></button>
          <button type="button" style={ui.actionMenuItem} onClick={() => { setChatDraft(`${language === "ar" ? "إعادة توجيه: " : "Forward: "}${selectedMessage?.text || ""}`); setMessageMenuOpen(false); }}><Forward size={18} /> <span>{chatLabels.forward}</span></button>
          <button type="button" style={ui.actionMenuItem} onClick={copySelectedMessage}><Copy size={18} /> <span>{chatLabels.copy}</span></button>
          <button type="button" style={ui.actionMenuItem} onClick={() => toggleSelectedMessageMeta("starred")}><Star size={18} /> <span>{chatLabels.star}</span></button>
          <button type="button" style={ui.actionMenuItem} onClick={() => toggleSelectedMessageMeta("saved")}><Download size={18} /> <span>{chatLabels.save}</span></button>
          <button type="button" style={{ ...ui.actionMenuItem, ...ui.actionMenuDanger }} onClick={deleteSelectedMessage}><Trash2 size={18} /> <span>{chatLabels.delete}</span></button>
          <button type="button" style={ui.actionMenuItem} onClick={() => { setMessageMenuOpen(false); setMessageMoreOpen(true); }}><MoreHorizontal size={18} /> <span>{chatLabels.more}</span></button>
        </div>
      </Modal>

      <Modal open={messageMoreOpen} title={language === "ar" ? "المزيد" : "More"} onClose={() => setMessageMoreOpen(false)} maxWidth={520}>
        <div style={ui.actionMenuList}>
          <button type="button" style={ui.actionMenuItem} onClick={() => { toggleActiveChatPin(); setMessageMoreOpen(false); }}><Pin size={18} /> <span>{chatLabels.pin}</span></button>
          <button type="button" style={ui.actionMenuItem} onClick={() => { setChatDraft(`${language === "ar" ? "رسالة خاصة بخصوص: " : "Private reply about: "}${selectedMessage?.text || ""}`); setMessageMoreOpen(false); }}><Reply size={18} /> <span>{chatLabels.privateReply}</span></button>
          <button type="button" style={ui.actionMenuItem} onClick={() => setMessageMoreOpen(false)}><UserPlus size={18} /> <span>{chatLabels.addContact}</span></button>
          <button type="button" style={ui.actionMenuItem} onClick={() => { setMessageMoreOpen(false); setContactInfoOpen(true); }}><MessageCircle size={18} /> <span>{chatLabels.messageContact} {activeConversation?.phone ? activeConversation.phone : ""}</span></button>
          <button type="button" style={ui.actionMenuItem} onClick={() => setMessageMoreOpen(false)}><BadgeInfo size={18} /> <span>{chatLabels.report}</span></button>
          <button type="button" style={{ ...ui.actionMenuItem, ...ui.actionMenuDanger }} onClick={deleteSelectedMessage}><Trash2 size={18} /> <span>{chatLabels.delete}</span></button>
        </div>
      </Modal>


      <Modal open={cameraCaptureOpen} title={chatLabels.camera} onClose={closeCameraCapture} maxWidth={760}>
        <div style={ui.cameraCaptureWrap}>
          {cameraError ? <div style={ui.cameraErrorBox}>{cameraError}</div> : null}
          <div style={ui.cameraPreviewBox}>
            <video
              ref={cameraVideoRef}
              autoPlay
              playsInline
              muted
              style={ui.cameraPreviewVideo}
              onLoadedData={() => setCameraReady(true)}
              onCanPlay={() => setCameraReady(true)}
            />
            {!cameraReady && (
              <div style={ui.cameraPreviewOverlay}>
                {language === "ar" ? "جاري تشغيل الكاميرا..." : "Starting camera..."}
              </div>
            )}
            <canvas ref={cameraCanvasRef} style={{ display: "none" }} />
          </div>
          <div style={ui.cameraActionsRow}>
            <Button variant="outline" onClick={() => chatCameraInputRef.current?.click()}>{language === "ar" ? "اختيار من الجهاز" : "Choose from device"}</Button>
            <Button onClick={captureCameraPhoto} disabled={!cameraReady}>{language === "ar" ? "التقاط الصورة" : "Capture photo"}</Button>
          </div>
        </div>
      </Modal>

      <Modal open={!!previewImage} title={language === "ar" ? "معاينة الصورة" : "Image preview"} onClose={() => setPreviewImage("")} maxWidth={920}>
        {previewImage ? <img src={previewImage} alt="preview" style={ui.previewImageModal} /> : null}
      </Modal>

      <input
        ref={chatCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={(e) => handleChatFileSelection(e, "image")}
      />
      <input
        ref={chatPhotosInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => handleChatFileSelection(e, "image")}
      />
      <input
        ref={chatDocumentInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
        style={{ display: "none" }}
        onChange={(e) => handleChatFileSelection(e, "file")}
      />
      <input
        ref={chatAudioInputRef}
        type="file"
        accept="audio/*"
        capture
        style={{ display: "none" }}
        onChange={handleAudioFileSelection}
      />

      <Modal open={chatSearchDialogOpen} title={chatLabels.searchByPhone} onClose={() => setChatSearchDialogOpen(false)} maxWidth={560}>
        <div style={{ display: "grid", gap: 14 }}>
          <Input
            value={chatPhoneSearch}
            onChange={(e) => setChatPhoneSearch(e.target.value.replace(/\D/g, ""))}
            placeholder={language === "ar" ? "اكتب رقم الهاتف كاملاً" : "Enter full phone number"}
          />
          <div style={{ display: "grid", gap: 10, maxHeight: 320, overflowY: "auto" }}>
            {searchableChatUsers.length ? searchableChatUsers.map((user) => (
              <div key={user.phone} style={{ ...ui.chatContactItem, padding: 14 }}>
                <div style={ui.chatAvatarWrap}>
                  {user.profileImage ? <img src={user.profileImage} alt={user.name} style={ui.chatAvatarImage} /> : <div style={ui.chatAvatarFallback}>{(user.name || "?").charAt(0)}</div>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 800 }}>{user.name}</div>
                  <div style={ui.chatMetaLine}>{getRoleLabel(user.role, language)} • {user.department}</div>
                  <div style={ui.chatSnippet}>{user.phone}</div>
                </div>
                <Button onClick={() => openChatFromSearch(user)}>{chatLabels.chatNow}</Button>
              </div>
            )) : (
              <div style={ui.chatEmptySide}>{chatPhoneSearch ? (language === "ar" ? "لا يوجد مستخدم بهذا الرقم." : "No user found with this number.") : (language === "ar" ? "اكتب الرقم للبحث." : "Type a number to search.")}</div>
            )}
          </div>
        </div>
      </Modal>

      <Modal open={contactInfoOpen} title={chatLabels.contactInfo} onClose={() => setContactInfoOpen(false)} maxWidth={640}>
        {activeConversation && (
          <div style={ui.contactInfoWrap}>
            <div style={ui.contactInfoHero}>
              <div style={ui.contactInfoAvatar}>{activeConversation.profileImage ? <img src={activeConversation.profileImage} alt={activeConversation.name} style={ui.contactInfoAvatarImg} /> : <span>{activeConversation.type === "group" ? "👥" : (activeConversation.name || "?").charAt(0)}</span>}</div>
              <div style={ui.contactInfoName}>{activeConversation.name}</div>
              <div style={ui.contactInfoPhone}>{activeConversation.phone || activeConversation.participants?.[0] || ""}</div>
            </div>
            <div style={ui.contactInfoActions}>
              <button type="button" style={ui.contactActionBox}><Search size={22} /><span>{language === "ar" ? "بحث" : "Search"}</span></button>
              <button type="button" style={ui.contactActionBox} onClick={() => { setContactInfoOpen(false); setChatSearchDialogOpen(true); }}><Search size={22} /><span>{chatLabels.searchByPhone}</span></button>
              <button type="button" style={ui.contactActionBox}><MessageCircle size={22} /><span>{chatLabels.messageContact}</span></button>
            </div>
            <div style={ui.infoList}>
              <div style={ui.infoRow}><span>{chatLabels.media}</span><strong>{(activeConversation.messages || []).filter((m) => m.type !== "text").length}</strong></div>
              <div style={ui.infoRow}><span>{chatLabels.storage}</span><strong>{`${((activeConversation.messages || []).length * 1.8).toFixed(1)} MB`}</strong></div>
              <div style={ui.infoRow}><span>{chatLabels.starred}</span><strong>{(activeConversation.messages || []).filter((m) => m.starred).length}</strong></div>
              <div style={ui.infoRow}><span>{chatLabels.wallpaper}</span><strong>{language === "ar" ? "الافتراضي" : "Default"}</strong></div>
              <div style={ui.infoRow}><span>{chatLabels.saveToPhotos}</span><strong>{language === "ar" ? "الافتراضي" : "Default"}</strong></div>
              <div style={ui.infoRow}><span>{chatLabels.disappearing}</span><strong>{language === "ar" ? "متوقفة" : "Off"}</strong></div>
            </div>
            <label style={ui.lockRow}>
              <span style={ui.lockSwitch}><input type="checkbox" checked={(activeConversation.lockedBy || []).includes(authUser?.phone)} onChange={toggleActiveChatLock} /></span>
              <div>
                <div style={{ fontWeight: 700 }}>{chatLabels.lockChat}</div>
                <div style={{ color: "var(--text-soft)", fontSize: 13 }}>{language === "ar" ? "تمكن من قفل هذه الدردشة وإخفائها على هذا الجهاز." : "Lock and hide this chat on this device."}</div>
              </div>
            </label>
          </div>
        )}
      </Modal>

      <Modal open={attachSheetOpen} title={t.chatAttach} onClose={() => setAttachSheetOpen(false)} maxWidth={620}>
        <div style={ui.attachGrid}>
          {[
            { icon: <Image size={22} />, label: chatLabels.photos, onClick: () => { sendQuickAttachment("image"); setAttachSheetOpen(false); } },
            { icon: <Camera size={22} />, label: chatLabels.camera, onClick: () => { openChatCamera(); } },
            { icon: <FileText size={22} />, label: chatLabels.document, onClick: () => { sendQuickAttachment("file"); setAttachSheetOpen(false); } },
            { icon: <BadgeInfo size={22} />, label: chatLabels.poll, onClick: () => { sendQuickAttachment("poll"); setAttachSheetOpen(false); } },
          ].map((item) => (
            <button key={item.label} type="button" onClick={item.onClick} style={ui.attachOption}>
              <span style={ui.attachOptionIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </Modal>

      <Modal open={chatMoreOpen} title={language === "ar" ? "إعدادات الدردشة" : "Chat settings"} onClose={() => setChatMoreOpen(false)} maxWidth={560}>
        <div style={ui.actionMenuList}>
          <button type="button" style={ui.actionMenuItem} onClick={() => { toggleActiveChatMute(); setChatMoreOpen(false); }}><BellOff size={18} /> <span>{chatLabels.mute}</span></button>
          <button type="button" style={ui.actionMenuItem} onClick={() => { setContactInfoOpen(true); setChatMoreOpen(false); }}><Info size={18} /> <span>{chatLabels.info}</span></button>
          <button type="button" style={ui.actionMenuItem} onClick={() => { toggleActiveChatLock(); setChatMoreOpen(false); }}><Lock size={18} /> <span>{chatLabels.lock}</span></button>
          <button type="button" style={ui.actionMenuItem} onClick={() => { toggleActiveChatFavorite(); setChatMoreOpen(false); }}><Star size={18} /> <span>{chatLabels.addToFav}</span></button>
          {chatFilter === "archived" && <button type="button" style={ui.actionMenuItem} onClick={() => { toggleActiveChatArchive(); setChatMoreOpen(false); }}><Archive size={18} /> <span>{chatLabels.unarchive}</span></button>}
          <button type="button" style={ui.actionMenuItem} onClick={() => { toggleActiveChatUnread(); setChatMoreOpen(false); }}><MessageCircle size={18} /> <span>{chatLabels.markUnread}</span></button>
          {activeConversation?.type === "direct" && <button type="button" style={ui.actionMenuItem} onClick={() => { toggleActiveChatFlag("blockedBy"); setChatMoreOpen(false); }}><Lock size={18} /> <span>{(activeConversation?.blockedBy || []).includes(authUser?.phone) ? chatLabels.unblock : chatLabels.block}</span></button>}
          <button type="button" style={{ ...ui.actionMenuItem, ...ui.actionMenuDanger }} onClick={() => { deleteChatById(activeConversation?.id); setChatMoreOpen(false); }}><Trash2 size={18} /> <span>{chatLabels.deleteChat}</span></button>
          <button type="button" style={ui.actionMenuItem} onClick={clearActiveChatMessages}><Trash2 size={18} /> <span>{chatLabels.clearChat}</span></button>
          {activeConversation?.type === "group" && <button type="button" style={{ ...ui.actionMenuItem, ...ui.actionMenuDanger }} onClick={leaveCurrentGroup}><LogOut size={18} /> <span>{chatLabels.leaveGroup}</span></button>}
        </div>
      </Modal>

      <Modal open={feedbackWidgetOpen} title={language === "ar" ? "تقييم التطبيق وإرسال رأيك" : "Rate the app and send feedback"} onClose={() => setFeedbackWidgetOpen(false)} maxWidth={520}>
        <div style={{ display: "grid", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, flexWrap: "wrap" }}>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFeedbackForm((prev) => ({ ...prev, rating: value }))}
                style={{
                  ...ui.feedbackStarButton,
                  ...(value <= Number(feedbackForm.rating || 0) ? ui.feedbackStarButtonActive : {}),
                }}
              >
                <Star size={22} fill={value <= Number(feedbackForm.rating || 0) ? "currentColor" : "none"} />
              </button>
            ))}
          </div>
          <Field label={language === "ar" ? "اكتب رأيك" : "Write your feedback"} full>
            <Textarea
              rows={5}
              value={feedbackForm.message}
              onChange={(e) => setFeedbackForm((prev) => ({ ...prev, message: e.target.value }))}
              placeholder={language === "ar" ? "اكتب ملاحظتك أو اقتراحك هنا..." : "Write your comment or suggestion here..."}
            />
          </Field>
          {feedbackMessage ? <div style={ui.infoBox}>{feedbackMessage}</div> : null}
          <div style={{ display: "flex", gap: 10, justifyContent: language === "ar" ? "flex-start" : "flex-end", flexWrap: "wrap" }}>
            <Button onClick={submitFeedback}><Send size={16} /> {language === "ar" ? "إرسال" : "Send"}</Button>
            <Button variant="outline" onClick={() => setFeedbackWidgetOpen(false)}>{language === "ar" ? "إغلاق" : "Close"}</Button>
          </div>
        </div>
      </Modal>

      <Modal open={settingsOpen} title={t.settings} onClose={() => setSettingsOpen(false)} maxWidth={640}>
        <div style={ui.settingsStack}>
          <div style={ui.settingsBox}>
            <div style={ui.settingsTitle}><Languages size={16} /> {t.language}</div>
            <div style={ui.rowActions}>
              <Button variant={language === "en" ? "primary" : "outline"} onClick={() => setLanguage("en")}>{t.english}</Button>
              <Button variant={language === "ar" ? "primary" : "outline"} onClick={() => setLanguage("ar")}>{t.arabic}</Button>
            </div>
          </div>

          <div style={ui.settingsBox}>
            <div style={ui.settingsTitle}><ShieldCheck size={16} /> {t.accountType}</div>
            <p style={{ margin: 0 }}>{authUser?.name} — {authUser?.role}</p>
          </div>

          <div style={ui.settingsBox}>
            <div style={ui.settingsTitle}>{themeMode === "light" ? <Sun size={16} /> : <Moon size={16} />} {t.mode}</div>
            <div style={ui.rowActions}>
              <Button variant={themeMode === "light" ? "primary" : "outline"} onClick={() => setThemeMode("light")}>{t.light}</Button>
              <Button variant={themeMode === "dark" ? "primary" : "outline"} onClick={() => setThemeMode("dark")}>{t.dark}</Button>
            </div>
          </div>

          <div style={ui.settingsBox}>
            <div style={ui.settingsTitle}><KeyRound size={16} /> {t.changePassword}</div>
            <Button onClick={openPasswordDialog}>{t.openPassword}</Button>
          </div>

          {["owner", "hr"].includes(authUser?.role) && (
            <div style={ui.settingsBox}>
              <div style={ui.settingsTitle}><Search size={16} /> {chatLabels.searchByPhone}</div>
              <Button variant={authUser?.searchHidden ? "danger" : "outline"} onClick={toggleMySearchVisibility}>
                {authUser?.searchHidden ? chatLabels.showMyNumber : chatLabels.hideMyNumber}
              </Button>
            </div>
          )}

          {["owner", "hr"].includes(authUser?.role) && (
            <div style={ui.settingsBox}>
              <div style={ui.settingsTitle}><Download size={16} /> {language === "ar" ? "النسخة الاحتياطية" : "Backup"}</div>
              <p style={{ margin: "0 0 10px", fontSize: 13, color: "var(--text-soft)", lineHeight: 1.7 }}>
                {language === "ar"
                  ? "تصدير نسخة احتياطية بكل بيانات السستم (JSON و Excel)، أو استرجاع البيانات من ملف نسخة احتياطية. تعمل محليًا بدون إنترنت."
                  : "Export a full backup of all system data (JSON & Excel), or restore from a backup file. Works locally without internet."}
              </p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Button variant="outline" onClick={exportSystemBackup}>
                  <Download size={16} /> {language === "ar" ? "تصدير نسخة احتياطية" : "Export backup"}
                </Button>
                <Button variant="outline" onClick={() => document.getElementById("restoreBackupInputSettings")?.click()}>
                  <Upload size={16} /> {language === "ar" ? "استرجاع من ملف" : "Restore from file"}
                </Button>
                <input id="restoreBackupInputSettings" type="file" accept="application/json,.json" style={{ display: "none" }}
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) restoreSystemBackup(f); e.target.value = ""; }} />
              </div>
              {resetSystemMessage ? (
                <p style={/تم تنزيل|downloaded|استرجاع|restored/.test(resetSystemMessage) ? { margin: "8px 0 0", color: "#15803d", fontSize: 13 } : { margin: "8px 0 0", color: "#b91c1c", fontSize: 13 }}>{resetSystemMessage}</p>
              ) : null}
            </div>
          )}

          {authUser?.role === "owner" && (
            <div style={{ ...ui.settingsBox, border: "1px solid #fecaca", background: "#fef2f2" }}>
              <div style={{ ...ui.settingsTitle, color: "#b91c1c" }}><Trash2 size={16} /> {language === "ar" ? "تصفير السستم" : "Reset system"}</div>
              <p style={{ margin: "0 0 10px", fontSize: 13, color: "#7f1d1d", lineHeight: 1.7 }}>
                {language === "ar"
                  ? "يمسح كل البيانات (الطلبات، الرسائل، التقارير، الشكاوى...) ويرجّع السستم للوضع الافتراضي. لا يمكن التراجع عن هذه العملية. حسابات الدخول تبقى كما هي."
                  : "Erases all data (requests, messages, reports, complaints...) and restores the default state. This cannot be undone. Login accounts are preserved."}
              </p>
              <Button variant="danger" onClick={openResetSystemDialog}>
                {language === "ar" ? "تصفير السستم" : "Reset system"}
              </Button>
            </div>
          )}

          {authUser?.role === "owner" && (
            <div style={{ ...ui.settingsBox, border: "1px solid #fed7aa", background: "#fff7ed" }}>
              <div style={{ ...ui.settingsTitle, color: "#9a3412" }}><Trash2 size={16} /> {language === "ar" ? "بدء فارغ" : "Start empty"}</div>
              <p style={{ margin: "0 0 10px", fontSize: 13, color: "#7c2d12", lineHeight: 1.7 }}>
                {language === "ar"
                  ? "يمسح كل شيء بما في ذلك الموظفين، ويبدأ السستم فارغًا تمامًا لتبنيه من الصفر. يبقى حساب المالك فقط للدخول. لا يمكن التراجع."
                  : "Erases everything including employees, leaving the system completely empty to build from scratch. Only the owner account remains for login. Cannot be undone."}
              </p>
              <Button variant="danger" onClick={openStartEmptyDialog}>
                {language === "ar" ? "بدء فارغ" : "Start empty"}
              </Button>
            </div>
          )}

          {authUser?.role === "owner" && (
            <div style={{ ...ui.settingsBox, border: "1px solid #fecaca", background: "#fef2f2" }}>
              <div style={{ ...ui.settingsTitle, color: "#b91c1c" }}><Trash2 size={16} /> {language === "ar" ? "مسح بيانات الموظفين" : "Clear employees data"}</div>
              <p style={{ margin: "0 0 10px", fontSize: 13, color: "#7f1d1d", lineHeight: 1.7 }}>
                {language === "ar"
                  ? "يمسح سجل البصمة وكشوف الحساب (السلف، المرتبات، المكافآت، الخصومات)، الطلبات والشكاوى، ويُصفّر رصيد السلف لكل موظف. يبقى الموظفون أنفسهم وحساباتهم كما هي. لا يمكن التراجع."
                  : "Clears attendance log and account statements (advances, salaries, rewards, deductions), requests and complaints, and resets each employee's advance balance to 0. Employees and their accounts are kept. Cannot be undone."}
              </p>
              <Button variant="danger" onClick={openClearDataDialog}>
                {language === "ar" ? "مسح بيانات الموظفين" : "Clear employees data"}
              </Button>
            </div>
          )}
        </div>
      </Modal>

      <Modal open={resetSystemDialogOpen} title={language === "ar" ? "تأكيد تصفير السستم" : "Confirm system reset"} onClose={() => setResetSystemDialogOpen(false)} maxWidth={520}>
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ border: "1px solid #fecaca", background: "#fef2f2", borderRadius: 8, padding: 14, color: "#7f1d1d", fontSize: 14, lineHeight: 1.8 }}>
            {language === "ar"
              ? "تحذير: هذه العملية ستمسح كل بيانات السستم (الموظفين المضافين، الطلبات، الرسائل، التقارير، الشكاوى) وترجّعه للوضع الافتراضي. لا يمكن التراجع."
              : "Warning: this will erase all system data (added employees, requests, messages, reports, complaints) and restore defaults. This cannot be undone."}
          </div>
          <Field label={language === "ar" ? "اكتب كلمة \"تصفير\" للتأكيد" : "Type \"تصفير\" to confirm"}>
            <Input value={resetConfirmText} onChange={(e) => { setResetConfirmText(e.target.value); setResetSystemMessage(""); }} placeholder="تصفير" />
          </Field>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <Button variant="outline" onClick={exportSystemBackup}>
              <Download size={16} /> {language === "ar" ? "تصدير نسخة احتياطية أولاً" : "Export backup first"}
            </Button>
            <Button variant="outline" onClick={() => document.getElementById("restoreBackupInputReset")?.click()}>
              <Upload size={16} /> {language === "ar" ? "استرجاع من نسخة احتياطية" : "Restore from backup"}
            </Button>
            <input id="restoreBackupInputReset" type="file" accept="application/json,.json" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) restoreSystemBackup(f); e.target.value = ""; }} />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {language === "ar" ? "(يُنزّل ملف JSON و Excel بكل البيانات)" : "(downloads JSON + Excel of all data)"}
            </span>
          </div>
          {resetSystemMessage ? (
            <p style={/تم تنزيل|downloaded/.test(resetSystemMessage) ? { margin: 0, color: "#15803d", fontSize: 13 } : ui.errorText}>{resetSystemMessage}</p>
          ) : null}
          <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}>
            <Button variant="outline" onClick={() => setResetSystemDialogOpen(false)}>{language === "ar" ? "إلغاء" : "Cancel"}</Button>
            <Button variant="danger" onClick={handleResetSystem} disabled={String(resetConfirmText || "").trim() !== "تصفير"}>
              {language === "ar" ? "تأكيد التصفير" : "Confirm reset"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={startEmptyDialogOpen} title={language === "ar" ? "تأكيد بدء فارغ" : "Confirm start empty"} onClose={() => setStartEmptyDialogOpen(false)} maxWidth={520}>
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ border: "1px solid #fed7aa", background: "#fff7ed", borderRadius: 8, padding: 14, color: "#7c2d12", fontSize: 14, lineHeight: 1.8 }}>
            {language === "ar"
              ? "تحذير: ستُمسح كل البيانات بما في ذلك جميع الموظفين، وسيبدأ السستم فارغًا تمامًا. يبقى حساب المالك فقط للدخول. لا يمكن التراجع — يُنصح بتصدير نسخة احتياطية أولاً."
              : "Warning: all data including every employee will be erased, leaving the system completely empty. Only the owner account remains. Cannot be undone — export a backup first."}
          </div>
          <Field label={language === "ar" ? "اكتب \"بدء فارغ\" للتأكيد" : "Type \"بدء فارغ\" to confirm"}>
            <Input value={startEmptyConfirmText} onChange={(e) => { setStartEmptyConfirmText(e.target.value); setStartEmptyMessage(""); }} placeholder="بدء فارغ" />
          </Field>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <Button variant="outline" onClick={exportSystemBackup}>
              <Download size={16} /> {language === "ar" ? "تصدير نسخة احتياطية أولاً" : "Export backup first"}
            </Button>
            <Button variant="outline" onClick={() => document.getElementById("restoreBackupInputEmpty")?.click()}>
              <Upload size={16} /> {language === "ar" ? "استرجاع من نسخة احتياطية" : "Restore from backup"}
            </Button>
            <input id="restoreBackupInputEmpty" type="file" accept="application/json,.json" style={{ display: "none" }}
              onChange={(e) => { const f = e.target.files?.[0]; if (f) restoreSystemBackup(f); e.target.value = ""; }} />
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              {language === "ar" ? "(يُنزّل ملف JSON و Excel بكل البيانات)" : "(downloads JSON + Excel of all data)"}
            </span>
          </div>
          {startEmptyMessage ? (
            <p style={/تم تنزيل|downloaded/.test(startEmptyMessage) ? { margin: 0, color: "#15803d", fontSize: 13 } : ui.errorText}>{startEmptyMessage}</p>
          ) : null}
          <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}>
            <Button variant="outline" onClick={() => setStartEmptyDialogOpen(false)}>{language === "ar" ? "إلغاء" : "Cancel"}</Button>
            <Button variant="danger" onClick={handleStartEmpty} disabled={String(startEmptyConfirmText || "").trim() !== "بدء فارغ"}>
              {language === "ar" ? "تأكيد البدء الفارغ" : "Confirm start empty"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={clearDataDialogOpen} title={language === "ar" ? "تأكيد مسح بيانات الموظفين" : "Confirm clear employees data"} onClose={() => setClearDataDialogOpen(false)} maxWidth={520}>
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ border: "1px solid #fecaca", background: "#fef2f2", borderRadius: 8, padding: 14, color: "#7f1d1d", fontSize: 14, lineHeight: 1.8 }}>
            {language === "ar"
              ? "تحذير: سيُمسح سجل البصمة وكشوف الحساب (السلف، المرتبات، المكافآت، الخصومات)، الطلبات والشكاوى، ويُصفّر رصيد السلف لكل موظف. يبقى الموظفون أنفسهم وحساباتهم. لا يمكن التراجع — يُنصح بتصدير نسخة احتياطية أولاً."
              : "Warning: attendance log, account statements (advances, salaries, rewards, deductions), requests and complaints will be cleared, and each employee's advance balance reset to 0. Employees and accounts are kept. Cannot be undone — export a backup first."}
          </div>
          <Field label={language === "ar" ? "اكتب \"مسح\" للتأكيد" : "Type \"مسح\" to confirm"}>
            <Input value={clearDataConfirmText} onChange={(e) => { setClearDataConfirmText(e.target.value); setClearDataMessage(""); }} placeholder="مسح" />
          </Field>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <Button variant="outline" onClick={exportSystemBackup}>
              <Download size={16} /> {language === "ar" ? "تصدير نسخة احتياطية أولاً" : "Export backup first"}
            </Button>
          </div>
          {clearDataMessage ? (
            <p style={ui.errorText}>{clearDataMessage}</p>
          ) : null}
          <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}>
            <Button variant="outline" onClick={() => setClearDataDialogOpen(false)}>{language === "ar" ? "إلغاء" : "Cancel"}</Button>
            <Button variant="danger" onClick={clearEmployeesData} disabled={String(clearDataConfirmText || "").trim() !== "مسح"}>
              {language === "ar" ? "تأكيد المسح" : "Confirm clear"}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal open={passwordDialogOpen} title={t.changePassword} onClose={() => setPasswordDialogOpen(false)} maxWidth={520}>
        {!authUser?.mustChangePassword && (
          <Field label={t.currentPassword}>
            <PasswordInput value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))} />
          </Field>
        )}
        <Field label={t.newPassword}>
          <PasswordInput value={passwordForm.newPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))} />
        </Field>
        <Field label={t.confirmPassword}>
          <PasswordInput value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))} />
        </Field>
        {passwordMessage ? <p style={ui.errorText}>{passwordMessage}</p> : null}
        <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}><Button onClick={changePassword}>{t.changePassword}</Button></div>
      </Modal>

      <Modal open={leaveRequestDialogOpen} title={t.requestLeave} onClose={() => setLeaveRequestDialogOpen(false)} maxWidth={720}>
        <Field label={t.type}>
          <Select value={leaveRequestForm.type} onChange={(e) => setLeaveRequestForm((p) => ({ ...p, type: e.target.value }))}>
            <option value="إجازة">إجازة</option>
            <option value="تأخير">تأخير</option>
          </Select>
        </Field>

        {leaveRequestForm.type === "إجازة" ? (
          <div style={{ ...ui.grid2, ...(isMobileView ? ui.grid2Mobile : {}) }}>
            <Field label={t.leaveFrom}><Input type="date" value={leaveRequestForm.leaveFrom} onChange={(e) => setLeaveRequestForm((p) => ({ ...p, leaveFrom: e.target.value }))} /></Field>
            <Field label={t.leaveTo}><Input type="date" value={leaveRequestForm.leaveTo} onChange={(e) => setLeaveRequestForm((p) => ({ ...p, leaveTo: e.target.value }))} /></Field>
          </div>
        ) : (
          <div style={{ ...ui.grid3, ...(isMobileView ? ui.grid3Mobile : {}) }}>
            <Field label={t.lateFrom}><Input type="time" value={leaveRequestForm.lateFrom} onChange={(e) => setLeaveRequestForm((p) => ({ ...p, lateFrom: e.target.value }))} /></Field>
            <Field label={t.lateTo}><Input type="time" value={leaveRequestForm.lateTo} onChange={(e) => setLeaveRequestForm((p) => ({ ...p, lateTo: e.target.value }))} /></Field>
            <Field label={t.compensateAt}><Input type="time" value={leaveRequestForm.compensateAt} onChange={(e) => setLeaveRequestForm((p) => ({ ...p, compensateAt: e.target.value }))} /></Field>
          </div>
        )}

        <Field label={t.reason}><Textarea value={leaveRequestForm.reason} onChange={(e) => setLeaveRequestForm((p) => ({ ...p, reason: e.target.value }))} /></Field>
        <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}><Button onClick={submitLeaveRequest}>{t.requestLeave}</Button></div>
      </Modal>

      <Modal open={advanceDialogOpen} title={canManageAll ? t.advance : t.requestAdvance} onClose={() => setAdvanceDialogOpen(false)} maxWidth={520}>
        <Field label={t.amount}><Input type="number" value={advanceRequestForm.amount} onChange={(e) => setAdvanceRequestForm((p) => ({ ...p, amount: e.target.value }))} /></Field>
        <Field label={t.reason}><Textarea value={advanceRequestForm.reason} onChange={(e) => setAdvanceRequestForm((p) => ({ ...p, reason: e.target.value }))} /></Field>
        <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}><Button onClick={submitAdvanceRequest}>{canManageAll ? t.advance : t.requestAdvance}</Button></div>
      </Modal>

      <Modal open={advanceSettlementDialogOpen} title={language === "ar" ? "إعداد خصم السلفة" : "Advance deduction settings"} onClose={() => setAdvanceSettlementDialogOpen(false)} maxWidth={520}>
        <Field label={language === "ar" ? "طريقة خصم السلفة" : "Advance deduction mode"}>
          <Select value={advanceSettlementForm.deductionMode} onChange={(e) => setAdvanceSettlementForm((p) => ({ ...p, deductionMode: e.target.value }))}>
            <option value="automatic">{language === "ar" ? "تلقائي من المرتب" : "Automatic from salary"}</option>
            <option value="manual">{language === "ar" ? "يدوي" : "Manual"}</option>
          </Select>
        </Field>
        <Field label={language === "ar" ? "نوع التنقيص" : "Reduction type"}>
          <Select value={advanceSettlementForm.valueType} onChange={(e) => setAdvanceSettlementForm((p) => ({ ...p, valueType: e.target.value }))}>
            <option value="amount">{language === "ar" ? "قيمة ثابتة" : "Fixed amount"}</option>
            <option value="percentage">{language === "ar" ? "نسبة من المرتب" : "Salary percentage"}</option>
          </Select>
        </Field>
        <Field label={advanceSettlementForm.valueType === "percentage" ? (language === "ar" ? "النسبة %" : "Percentage %") : t.amount}>
          <Input
            type="number"
            min="0"
            max={statementEmployee ? getAdvanceDeductionDetails({ ...statementEmployee, advanceDeductionMode: advanceSettlementForm.deductionMode, advanceDeductionValueType: advanceSettlementForm.valueType, advanceDeductionValue: advanceSettlementForm.value }, statementData?.grossSalary || statementEmployee.salary || statementEmployee.basicSalary).maxAllowedValue : undefined}
            value={advanceSettlementForm.value}
            onChange={(e) => setAdvanceSettlementForm((p) => ({ ...p, value: e.target.value }))}
          />
        </Field>
        {statementEmployee && (() => {
          const previewDetails = getAdvanceDeductionDetails({
            ...statementEmployee,
            advanceDeductionMode: advanceSettlementForm.deductionMode,
            advanceDeductionValueType: advanceSettlementForm.valueType,
            advanceDeductionValue: advanceSettlementForm.value,
          }, statementData?.grossSalary || statementEmployee.salary || statementEmployee.basicSalary);
          return (
          <Card style={{ ...ui.statementCard, padding: 14 }}>
            <div style={ui.summaryTitle}>{language === "ar" ? "المبلغ المتوقع خصمه من السلفة" : "Expected advance deduction"}</div>
            <div style={ui.statementValue}>
              {currency(previewDetails.amount)}
            </div>
            <div style={{ ...ui.summarySubtitle, marginTop: 8 }}>
              {advanceSettlementForm.valueType === "percentage"
                ? `${language === "ar" ? "الحد الأقصى المسموح" : "Maximum allowed"}: ${Number(previewDetails.maxAllowedValue).toFixed(2).replace(/\.00$/, "")} %`
                : `${language === "ar" ? "الحد الأقصى المسموح" : "Maximum allowed"}: ${currency(previewDetails.maxAllowedValue)}`}
            </div>
          </Card>
          );
        })()}
        <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}><Button onClick={saveAdvanceSettlementSettings}>{language === "ar" ? "حفظ" : "Save"}</Button></div>
      </Modal>

      <Modal open={salaryDepositDialogOpen} title={t.salaryDeposit} onClose={() => setSalaryDepositDialogOpen(false)} maxWidth={560}>
        {(() => {
          const depositEmp = getFinancialRowEmployee() || getCurrentEmployee();
          const isManualAdvance = depositEmp && (depositEmp.advanceDeductionMode === "manual") && Number(depositEmp.advance || 0) > 0;
          const steps = [1, ...(isManualAdvance ? [2] : []), 3];
          const currentIndex = steps.indexOf(salaryDepositStep) === -1 ? 0 : steps.indexOf(salaryDepositStep);
          const isLast = currentIndex === steps.length - 1;
          const goNext = () => setSalaryDepositStep(steps[Math.min(currentIndex + 1, steps.length - 1)]);
          const goPrev = () => setSalaryDepositStep(steps[Math.max(currentIndex - 1, 0)]);
          const stepLabel = `${language === "ar" ? "خطوة" : "Step"} ${currentIndex + 1} / ${steps.length}`;

          return (
            <div>
              <div style={{ fontSize: 13, color: "var(--text-soft)", marginBottom: 14 }}>{stepLabel}</div>

              {salaryDepositStep === 1 && (
                <>
                  <Field label={t.month}>
                    <Select value={salaryDepositForm.month} onChange={(e) => setSalaryDepositForm((p) => ({ ...p, month: e.target.value }))}>
                      <option value="">{t.selectMonth}</option>
                      <option value="1">يناير</option>
                      <option value="2">فبراير</option>
                      <option value="3">مارس</option>
                      <option value="4">أبريل</option>
                      <option value="5">مايو</option>
                      <option value="6">يونيو</option>
                      <option value="7">يوليو</option>
                      <option value="8">أغسطس</option>
                      <option value="9">سبتمبر</option>
                      <option value="10">أكتوبر</option>
                      <option value="11">نوفمبر</option>
                      <option value="12">ديسمبر</option>
                    </Select>
                  </Field>
                  <Field label={t.salaryAmount}><Input type="number" value={salaryDepositForm.salaryAmount} onChange={(e) => setSalaryDepositForm((p) => ({ ...p, salaryAmount: e.target.value }))} /></Field>
                </>
              )}

              {salaryDepositStep === 2 && (
                <>
                  <div style={{ fontSize: 14, color: "var(--text-soft)", marginBottom: 10, lineHeight: 1.7 }}>
                    {language === "ar" ? `الرصيد الحالي للسلف: ${currency(depositEmp?.advance || 0)}. حدّد قيمة خصم السلفة لهذا الشهر.` : `Current advance: ${currency(depositEmp?.advance || 0)}. Set the advance deduction for this month.`}
                  </div>
                  <Field label={language === "ar" ? "قيمة خصم السلفة هذا الشهر" : "Advance deduction this month"}>
                    <Input
                      type="number"
                      value={salaryDepositForm.advanceDeductionThisMonth !== undefined && salaryDepositForm.advanceDeductionThisMonth !== null && salaryDepositForm.advanceDeductionThisMonth !== ""
                        ? salaryDepositForm.advanceDeductionThisMonth
                        : String(getAdvanceDeductionDetails(depositEmp, Number(salaryDepositForm.salaryAmount || depositEmp?.salary || 0)).amount || 0)}
                      onChange={(e) => setSalaryDepositForm((p) => ({ ...p, advanceDeductionThisMonth: e.target.value }))}
                      placeholder="0"
                    />
                  </Field>
                </>
              )}

              {salaryDepositStep === 3 && (() => {
                const empDeductions = depositEmp ? requests.filter((req) =>
                  req.employeePhone === depositEmp.phone &&
                  req.status === "معتمد" &&
                  !req.appliedToSalaryDepositId &&
                  ["مكافأة", "خصم"].includes(req.type)
                ) : [];
                return (
                  <>
                    <div style={{ fontSize: 14, color: "var(--text-soft)", marginBottom: 12, lineHeight: 1.7 }}>
                      {language === "ar" ? "الخصومات والمكافآت المعتمدة لهذا المرتب — يمكنك التعديل أو الإلغاء:" : "Approved rewards/deductions for this payroll — edit or remove:"}
                    </div>
                    {empDeductions.length ? (
                      <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
                        {empDeductions.map((req) => (
                          <div key={req.id} style={{ border: "1px solid var(--border)", borderRadius: 8, padding: 12, background: "var(--surface)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 8 }}>
                              <span style={{ fontWeight: 700, color: req.type === "خصم" ? "#b91c1c" : "#15803d" }}>{req.type}</span>
                              <Button variant="danger" style={ui.smallBtn} onClick={() => setRequests((prev) => prev.filter((r) => r.id !== req.id))} title={language === "ar" ? "إلغاء نهائي" : "Remove"}><Trash2 size={14} /></Button>
                            </div>
                            <Field label={t.amount}>
                              <Input type="number" value={req.amount} onChange={(e) => setRequests((prev) => prev.map((r) => r.id === req.id ? { ...r, amount: Number(e.target.value || 0) } : r))} />
                            </Field>
                            {req.reason ? <div style={{ fontSize: 12, color: "var(--text-soft)", marginTop: 4 }}>{language === "ar" ? "السبب" : "Reason"}: {req.reason}</div> : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: 13, color: "var(--text-soft)", marginBottom: 16 }}>{language === "ar" ? "لا توجد خصومات أو مكافآت معتمدة." : "No approved rewards or deductions."}</div>
                    )}
                    <Field label={language === "ar" ? "خصم يدوي إضافي (اختياري)" : "Extra manual deduction (optional)"}><Input type="number" value={salaryDepositForm.deductionAmount} onChange={(e) => setSalaryDepositForm((p) => ({ ...p, deductionAmount: e.target.value }))} /></Field>
                    <Field label={t.deductionReason}><Textarea value={salaryDepositForm.deductionReason} onChange={(e) => setSalaryDepositForm((p) => ({ ...p, deductionReason: e.target.value }))} /></Field>
                  </>
                );
              })()}

              <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}), marginTop: 18 }}>
                {currentIndex > 0 && (
                  <Button variant="outline" onClick={goPrev}>{language === "ar" ? "السابق" : "Back"}</Button>
                )}
                {!isLast ? (
                  <Button onClick={goNext} disabled={salaryDepositStep === 1 && !salaryDepositForm.salaryAmount}>{language === "ar" ? "التالي" : "Next"}</Button>
                ) : (
                  <Button onClick={submitSalaryDeposit} disabled={!salaryDepositForm.salaryAmount}>{t.salaryDeposit}</Button>
                )}
              </div>
            </div>
          );
        })()}
      </Modal>

      <Modal open={rewardDialogOpen} title={canManageAll ? t.rewardOrDeduction : t.requestReward} onClose={() => setRewardDialogOpen(false)} maxWidth={520}>
        {canManageAll && (
          <Field label={language === "ar" ? "نوع العملية" : "Action Type"}>
            <Select value={rewardRequestForm.actionType} onChange={(e) => setRewardRequestForm((p) => ({ ...p, actionType: e.target.value }))}>
              <option value="مكافأة">{language === "ar" ? "مكافأة" : "Reward"}</option>
              <option value="خصم">{t.deduction}</option>
            </Select>
          </Field>
        )}
        {canManageAll && rewardRequestForm.actionType === "خصم" && (
          <>
            <Field label={language === "ar" ? "طريقة الخصم" : "Deduction mode"}>
              <Select value={rewardRequestForm.deductionMode} onChange={(e) => setRewardRequestForm((p) => ({ ...p, deductionMode: e.target.value }))}>
                <option value="manual">{language === "ar" ? "يدوي" : "Manual"}</option>
                <option value="automatic">{language === "ar" ? "تلقائي" : "Automatic"}</option>
              </Select>
            </Field>
            <Field label={language === "ar" ? "نوع القيمة" : "Value type"}>
              <Select value={rewardRequestForm.valueType} onChange={(e) => setRewardRequestForm((p) => ({ ...p, valueType: e.target.value }))}>
                <option value="amount">{language === "ar" ? "قيمة ثابتة" : "Fixed amount"}</option>
                <option value="percentage">{language === "ar" ? "نسبة من الراتب" : "Salary percentage"}</option>
              </Select>
            </Field>
          </>
        )}
        <Field label={canManageAll && rewardRequestForm.actionType === "خصم" && rewardRequestForm.valueType === "percentage" ? (language === "ar" ? "النسبة %" : "Percentage %") : t.amount}><Input type="number" value={rewardRequestForm.amount} onChange={(e) => setRewardRequestForm((p) => ({ ...p, amount: e.target.value }))} /></Field>
        <Field label={t.reason}><Textarea value={rewardRequestForm.reason} onChange={(e) => setRewardRequestForm((p) => ({ ...p, reason: e.target.value }))} /></Field>
        <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}><Button onClick={submitRewardRequest}>{canManageAll ? t.rewardOrDeduction : t.requestReward}</Button></div>
      </Modal>
    </div>
  );
}

const ui = {
  appShell: {
    minHeight: "100vh",
    padding: 16,
    background: "var(--bg)",
    display: "grid",
    gap: 12,
    boxSizing: "border-box",
    width: "100%",
    maxWidth: 1600,
    margin: "0 auto",
    overflowX: "hidden",
  },
  appShellMobile: {
    padding: 8,
    gap: 10,
    maxWidth: "100%",
  },
  heroCardMobile: {
    padding: 14,
    borderRadius: 6,
  },
  heroTitleMobile: {
    fontSize: "clamp(16px, 6.2vw, 26px)",
    lineHeight: 1.2,
  },
  heroDescMobile: {
    fontSize: 13,
    lineHeight: 1.6,
    marginTop: 8,
    maxWidth: "100%",
  },
  heroRowMobile: {
    flexDirection: "column",
    alignItems: "stretch",
    gap: 14,
  },
  heroActionsMobile: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    justifyContent: "stretch",
    gap: 8,
  },
  searchBoxMobile: {
    minWidth: 0,
    width: "100%",
    order: 10,
    gridColumn: "1 / -1",
  },
  sectionHeaderMobile: {
    gap: 10,
    marginBottom: 12,
  },
  sectionTitleMobile: {
    fontSize: 18,
  },
  sectionDescMobile: {
    fontSize: 13,
    lineHeight: 1.7,
  },
  statsGridMobile: {
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
  },
  summaryCardMobile: {
    padding: 14,
    borderRadius: 6,
  },
  summaryValueMobile: {
    fontSize: 18,
  },
  cardMobile: {
    padding: 14,
    borderRadius: 7,
  },
  centerPage: {
    minHeight: "100vh",
    background: "var(--bg)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    boxSizing: "border-box",
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 7,
    padding: 16,
    boxShadow: "var(--shadow)",
    overflow: "hidden",
    maxWidth: "100%",
  },
  innerCard: {
    padding: 18,
    borderRadius: 5,
  },
  authCard: {
    width: "100%",
    maxWidth: 560,
    padding: 12,
  },
  authHead: {
    textAlign: "center",
    marginBottom: 18,
  },
  bigTitle: {
    margin: 0,
    fontSize: 30,
  },
  subtitle: {
    marginTop: 8,
    color: "var(--text-soft)",
    lineHeight: 1.8,
  },
  brandLogoAuth: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
    display: "block",
  },
  brandLogoBadge: {
    width: 18,
    height: 18,
    objectFit: "cover",
    filter: "none",
    borderRadius: 5,
  },
  phoneWrap: {
    width: 64,
    height: 64,
    margin: "0 auto 14px",
    borderRadius: "50%",
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.28), 0 4px 8px rgba(0, 0, 0, 0.18), inset 0 2px 3px rgba(255, 255, 255, 0.45), inset 0 -4px 8px rgba(0, 0, 0, 0.22)",
    border: "1px solid rgba(255, 255, 255, 0.25)",
  },
  authActions: {
    display: "grid",
    gap: 10,
    marginTop: 16,
  },
  demoBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 6,
    background: "var(--surface-muted)",
    border: "1px solid var(--border)",
    lineHeight: 1.9,
  },
  demoTitle: {
    margin: "0 0 12px",
    fontWeight: 800,
  },
  heroCard: {
    padding: 18,
  },
  heroRow: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 20,
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  heroActions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
  },
  feedbackFloatingButton: {
    position: "fixed",
    left: 18,
    bottom: 18,
    width: 52,
    height: 52,
    borderRadius: 999,
    border: "1px solid rgba(245, 158, 11, 0.35)",
    background: "linear-gradient(135deg, #f59e0b, #f97316)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 14px 32px rgba(249, 115, 22, 0.28)",
    cursor: "pointer",
    zIndex: 1200,
  },
  feedbackStarButton: {
    width: 52,
    height: 52,
    borderRadius: 5,
    border: "1px solid var(--border)",
    background: "var(--surface-soft)",
    color: "#f59e0b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  feedbackStarButtonActive: {
    background: "rgba(245, 158, 11, 0.14)",
    borderColor: "rgba(245, 158, 11, 0.45)",
  },
  syncStatusDot: {
    position: "fixed",
    left: 14,
    bottom: 14,
    width: 10,
    height: 10,
    borderRadius: "50%",
    boxShadow: "0 0 0 2px rgba(255,255,255,0.9), 0 2px 10px rgba(15,23,42,0.18)",
    zIndex: 1300,
  },
  heroBadge: {
    display: "inline-flex",
    gap: 8,
    alignItems: "center",
    border: "1px solid var(--border)",
    background: "var(--surface-soft)",
    borderRadius: 999,
    padding: "8px 13px",
    marginBottom: 12,
    fontSize: 14,
    fontWeight: 700,
  },
  heroTitle: {
    margin: 0,
    fontSize: "clamp(24px, 3.4vw, 40px)",
    lineHeight: 1.1,
    color: "var(--text)",
  },
  heroDesc: {
    margin: "10px 0 0",
    color: "var(--text-soft)",
    fontSize: 15,
    lineHeight: 1.8,
    maxWidth: 560,
  },
  searchBox: {
    minWidth: 220,
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    borderRadius: 5,
    padding: "0 12px",
    height: 46,
  },
  searchInput: {
    border: 0,
    outline: "none",
    background: "transparent",
    width: "100%",
    fontSize: 14,
    color: "var(--text)",
  },
  statsGrid: {
    display: "grid",
    gap: 10,
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
    alignItems: "start",
  },
  summaryCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  summaryTitle: {
    color: "var(--text-soft)",
    fontSize: 14,
    fontWeight: 700,
  },
  summaryValue: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: 900,
    color: "var(--text)",
  },
  summarySubtitle: {
    marginTop: 4,
    color: "var(--text-muted)",
    fontSize: 13,
    lineHeight: 1.7,
  },
  summaryIcon: {
    width: 38,
    height: 38,
    borderRadius: 5,
    background: "var(--surface-muted)",
    border: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tabsBar: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
    padding: 18,
  },
  tabButton: {
    minHeight: 56,
    minWidth: 240,
    padding: "0 22px",
    fontSize: 16,
    borderRadius: 6,
  },
  sectionHeader: {
    display: "flex",
    gap: 14,
    alignItems: "flex-start",
    marginBottom: 16,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 5,
    background: "var(--surface-muted)",
    border: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  tableWrap: {
    overflowX: "auto",
    overflowY: "hidden",
    border: "1px solid var(--border)",
    borderRadius: 6,
    background: "rgba(255,255,255,0.01)",
    maxWidth: "100%",
    WebkitOverflowScrolling: "touch",
  },
  tableWrapMobile: {
    overflowX: "auto",
    marginInline: -4,
  },
  table: {
    width: "100%",
    minWidth: 0,
    borderCollapse: "collapse",
    tableLayout: "fixed",
  },
  tableMobile: {
    minWidth: 860,
    width: "max-content",
    tableLayout: "auto",
  },
  th: {
    padding: 14,
    background: "var(--surface-soft)",
    borderBottom: "1px solid var(--border)",
    textAlign: "start",
    fontWeight: 800,
    fontSize: 14,
  },
  td: {
    padding: 14,
    borderBottom: "1px solid var(--border)",
    textAlign: "start",
    verticalAlign: "top",
    lineHeight: 1.8,
    fontSize: 14,
    wordBreak: "break-word",
    overflowWrap: "anywhere",
  },
  emptyCell: {
    textAlign: "center",
    padding: 28,
    color: "var(--text-muted)",
  },
  iconInline: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
  },
  rowActions: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  rowActionsMobile: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    width: "100%",
  },
  badge: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: 999,
    background: "var(--surface-muted)",
    border: "1px solid var(--border)",
    fontSize: 12,
    fontWeight: 700,
  },
  label: {
    display: "block",
    marginBottom: 8,
    fontWeight: 800,
    fontSize: 14,
    color: "var(--text)",
  },
  input: {
    width: "100%",
    height: 46,
    borderRadius: 7,
    border: "1.5px solid var(--input-border)",
    padding: "0 14px",
    outline: "none",
    boxSizing: "border-box",
    fontSize: 14,
    background: "var(--input-bg)",
    color: "var(--input-text)",
    marginBottom: 0,
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.02)",
  },
  select: {
    width: "100%",
    height: 46,
    borderRadius: 7,
    border: "1.5px solid var(--input-border)",
    padding: "0 14px",
    outline: "none",
    boxSizing: "border-box",
    fontSize: 14,
    background: "var(--input-bg)",
    color: "var(--input-text)",
    marginBottom: 0,
    appearance: "auto",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.02)",
  },
  infoBox: {
    padding: "12px 14px",
    borderRadius: 5,
    border: "1px solid var(--border)",
    background: "var(--surface-soft)",
    color: "var(--text-soft)",
    fontSize: 14,
  },
  emptyState: {
    padding: "30px 16px",
    borderRadius: 6,
    border: "1px dashed var(--border)",
    background: "var(--surface-soft)",
    color: "var(--text-soft)",
    fontSize: 16,
  },
  textarea: {
    width: "100%",
    minHeight: 120,
    borderRadius: 7,
    border: "1.5px solid var(--input-border)",
    background: "var(--modal-textarea-bg)",
    color: "var(--input-text)",
    padding: 14,
    outline: "none",
    boxSizing: "border-box",
    fontSize: 14,
    resize: "vertical",
    boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.02)",
  },
  buttonBase: {
    height: 42,
    padding: "0 14px",
    borderRadius: 7,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    cursor: "pointer",
    fontWeight: 700,
    border: "1px solid transparent",
    fontSize: 14,
  },
  buttonPrimary: {
    background: "var(--primary)",
    color: "var(--primary-contrast)",
    borderColor: "var(--primary)",
  },
  buttonOutline: {
    background: "var(--surface)",
    color: "var(--text)",
    borderColor: "var(--border)",
  },
  buttonDanger: {
    background: "#b03a2e",
    color: "#ffffff",
    borderColor: "#dc2626",
  },
  smallBtn: {
    height: 36,
    fontSize: 13,
    padding: "0 12px",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 10000,
  },
  modalBox: {
    width: "100%",
    maxHeight: "88vh",
    overflow: "auto",
    background: "var(--surface-soft)",
    borderRadius: 7,
    border: "1px solid var(--border)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.22)",
  },
  modalHeader: {
    padding: 14,
    borderBottom: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(255,255,255,0.02)",
  },
  modalBody: {
    padding: 16,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 7,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },
  grid2: {
    display: "grid",
    gap: 14,
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  },
  grid2Mobile: {
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 12,
  },
  attendanceFiltersWrap: {
    display: "grid",
    gap: 14,
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    alignItems: "end",
    marginBottom: 18,
  },
  attendanceFiltersWrapMobile: {
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 14,
  },
  attendanceActionsRow: {
    display: "flex",
    justifyContent: "flex-start",
    gap: 10,
    flexWrap: "wrap",
    marginBottom: 18,
  },
  attendanceActionsRowMobile: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 10,
  },
  attendanceActionButtonMobile: {
    width: "100%",
  },
  grid3: {
    display: "grid",
    gap: 14,
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
  },
  grid3Mobile: {
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 12,
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  modalActionsMobile: {
    justifyContent: "stretch",
  },
  settingsStack: {
    display: "grid",
    gap: 12,
  },
  settingsBox: {
    border: "1px solid var(--border)",
    background: "var(--surface-soft)",
    borderRadius: 6,
    padding: 18,
  },
  settingsTitle: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
    fontWeight: 800,
  },
  statementGrid: {
    display: "grid",
    gap: 12,
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  },
  statementGridMobile: {
    gridTemplateColumns: "minmax(0, 1fr)",
  },
  statementCard: {
    padding: 18,
  },
  statementValue: {
    marginTop: 8,
    fontSize: 28,
    fontWeight: 900,
    color: "var(--text)",
  },
  noticeText: {
    border: "1px solid var(--border)",
    background: "var(--surface-soft)",
    borderRadius: 5,
    padding: 14,
    lineHeight: 1.9,
    color: "var(--text)",
    whiteSpace: "pre-wrap",
  },

  sidebarOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(2, 6, 23, 0.42)",
    zIndex: 1200,
  },
  sidebarPanel: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "min(360px, 92vw)",
    height: "100vh",
    background: "var(--surface)",
    backdropFilter: "blur(22px)",
    color: "var(--text)",
    borderLeft: "1px solid var(--border)",
    boxShadow: "-24px 0 60px rgba(0,0,0,0.18)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  sidebarTop: {
    padding: "18px 18px 16px",
    borderBottom: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    position: "relative",
    zIndex: 1,
  },
  sidebarBrand: {
    fontSize: 13,
    fontWeight: 700,
    color: "var(--text-soft)",
    marginBottom: 6,
  },
  sidebarSubbrand: {
    fontSize: 24,
    fontWeight: 900,
    color: "var(--accent)",
    lineHeight: 1.2,
  },
  sidebarCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 7,
    border: "1px solid var(--border)",
    background: "var(--surface-soft)",
    color: "var(--text)",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  sidebarBody: {
    padding: 18,
    display: "grid",
    gap: 18,
    overflowY: "auto",
    position: "relative",
    zIndex: 1,
  },
  sidebarGroup: {
    display: "grid",
    gap: 10,
  },
  sidebarSectionLabel: {
    fontSize: 12,
    fontWeight: 800,
    color: "var(--text-soft)",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    paddingInline: 6,
  },
  sidebarItem: {
    width: "100%",
    minHeight: 52,
    padding: "0 14px",
    borderRadius: 5,
    border: "1px solid transparent",
    background: "transparent",
    color: "var(--text)",
    display: "flex",
    alignItems: "center",
    gap: 12,
    cursor: "pointer",
    fontSize: 15,
    fontWeight: 700,
    textAlign: "start",
    transition: "background 0.2s ease, border-color 0.2s ease, color 0.2s ease",
  },
  sidebarItemActive: {
    background: "var(--accent-soft)",
    borderColor: "var(--accent-border)",
    color: "var(--accent)",
  },

  chatLayoutMobile: {
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 12,
  },
  chatSidebarMobile: {
    minHeight: "auto",
    maxHeight: "none",
    borderRadius: 7,
  },
  chatSidebarActionsMobile: {
    gridTemplateColumns: "1fr",
  },
  chatCreateGroupBtnMobile: {
    width: "100%",
  },
  chatContactsListMobile: {
    padding: 10,
    gap: 10,
  },
  chatMainPanelMobile: {
    minHeight: "calc(100vh - 180px)",
    maxHeight: "calc(100vh - 180px)",
    borderRadius: 7,
  },
  chatHeaderBarMobile: {
    padding: "12px 10px",
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
    position: "relative",
    overflow: "visible",
  },
  chatHeaderToolsMobile: {
    gap: 6,
    justifyContent: "flex-start",
    flexWrap: "nowrap",
    flexDirection: "column",
    alignItems: "flex-start",
    alignSelf: "flex-start",
    direction: "ltr",
    flexShrink: 0,
    position: "absolute",
    left: -46,
    top: 10,
    zIndex: 3,
  },
  chatContactItemWrap: {
    position: "relative",
  },
  chatContactItemWrapRaised: {
    zIndex: 4,
  },
  chatContactItemMobile: {
    paddingInlineEnd: 52,
  },
  chatContactMenuButton: {
    position: "absolute",
    left: 10,
    top: 12,
    width: 34,
    height: 34,
    borderRadius: 7,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--text-soft)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  chatContactMenuButtonDesktop: {
    left: 16,
    top: "50%",
    transform: "translateY(-50%)",
  },
  chatContactMenuPopup: {
    position: "absolute",
    left: 10,
    top: 52,
    width: 150,
    borderRadius: 5,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    boxShadow: "var(--shadow)",
    padding: 8,
    display: "grid",
    gap: 6,
    zIndex: 5,
  },
  chatContactMenuPopupDesktop: {
    left: 16,
    top: "calc(50% + 26px)",
  },
  chatContactMenuItem: {
    border: "none",
    background: "transparent",
    borderRadius: 7,
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    gap: 8,
    cursor: "pointer",
    color: "var(--text)",
    textAlign: "start",
    fontWeight: 700,
  },
  chatContactNameMobile: {
    fontSize: 18,
    lineHeight: 1.35,
    whiteSpace: "normal",
    wordBreak: "normal",
  },
  mobileLogoutButton: {
    minWidth: 110,
    fontSize: 14,
    paddingInline: 14,
    whiteSpace: "nowrap",
  },

  mobileCardsStack: {
    display: "grid",
    gap: 14,
    gridTemplateColumns: "minmax(0, 1fr)",
  },
  mobileDataCard: {
    padding: 16,
    width: "100%",
    borderRadius: 7,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    boxShadow: "0 10px 24px rgba(15,23,42,0.06)",
  },
  mobileDataCardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  mobileDataCardTitle: {
    margin: 0,
    fontSize: 24,
    lineHeight: 1.25,
  },
  mobileDataCardBody: {
    display: "grid",
    gap: 10,
  },
  complaintTargetStack: {
    display: "grid",
    gap: 10,
  },
  mobileFieldRow: {
    display: "grid",
    gridTemplateColumns: "minmax(110px, 140px) 1fr",
    alignItems: "start",
    gap: 12,
    paddingBottom: 10,
    borderBottom: "1px solid var(--border)",
  },
  mobileFieldLabel: {
    color: "var(--text-soft)",
    fontSize: 14,
    fontWeight: 700,
  },
  mobileFieldLabelAccent: {
    color: "#0f172a",
  },
  mobileFieldValue: {
    color: "var(--text)",
    fontSize: 16,
    fontWeight: 800,
    lineHeight: 1.7,
    textAlign: "right",
    wordBreak: "break-word",
  },

  chatMessagesAreaMobile: {
    padding: 10,
    gap: 8,
  },
  chatComposerMobile: {
    padding: 6,
    gap: 2,
  },
  chatHeaderBackButton: {
    width: 38,
    height: 38,
    borderRadius: 7,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--text)",
    fontSize: 20,
    fontWeight: 700,
    flexShrink: 0,
  },
  chatLayout: {
    display: "grid",
    gridTemplateColumns: "430px minmax(0, 1fr)",
    gap: 18,
    alignItems: "stretch",
  },
  chatSidebar: {
    border: "1px solid var(--border)",
    borderRadius: 8,
    background: "var(--surface-soft)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    minHeight: 860,
    maxHeight: 860,
  },
  chatSidebarTop: {
    padding: 16,
    borderBottom: "1px solid var(--border)",
    background: "var(--surface)",
    display: "grid",
    gap: 12,
  },
  chatSidebarActions: {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1fr) auto",
    gap: 10,
    alignItems: "center",
  },
  chatCreateGroupBtn: {
    whiteSpace: "nowrap",
  },
  searchBoxAlt: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    border: "1px solid var(--border)",
    background: "var(--surface-soft)",
    borderRadius: 5,
    padding: "0 14px",
    minHeight: 52,
  },
  searchInputAlt: {
    border: "none",
    outline: "none",
    background: "transparent",
    flex: 1,
    color: "var(--text)",
    fontSize: 15,
  },
  chatFilterBar: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },
  chatFilterChip: {
    minHeight: 38,
    padding: "0 14px",
    borderRadius: 999,
    border: "1px solid var(--border)",
    background: "var(--surface-soft)",
    color: "var(--text-soft)",
    cursor: "pointer",
    fontWeight: 700,
  },
  chatFilterChipActive: {
    background: "var(--accent-soft)",
    color: "var(--text)",
    borderColor: "var(--accent-border)",
  },
  chatContactsList: {
    display: "grid",
    gap: 8,
    padding: 12,
    overflowY: "auto",
  },
  chatContactItem: {
    display: "grid",
    gridTemplateColumns: "52px minmax(0, 1fr) auto",
    alignItems: "start",
    gap: 12,
    width: "100%",
    border: "1px solid transparent",
    background: "transparent",
    borderRadius: 6,
    padding: 12,
    cursor: "pointer",
    textAlign: "inherit",
  },
  chatContactItemActive: {
    background: "var(--surface)",
    borderColor: "var(--border)",
    boxShadow: "var(--shadow)",
  },
  chatAvatarButton: { background: "transparent", border: "none", padding: 0, cursor: "pointer" },
  chatAvatarWrap: {
    width: 52,
    height: 52,
    minWidth: 52,
    borderRadius: "50%",
    overflow: "hidden",
    background: "var(--accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: 700,
    fontSize: 20,
  },
  chatAvatarImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  chatAvatarFallback: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  chatContactBody: {
    minWidth: 0,
    display: "grid",
    gap: 4,
  },
  chatContactTopLine: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  chatContactName: {
    fontSize: 15,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  chatMetaLine: {
    color: "var(--text-soft)",
    fontSize: 12,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  chatSnippet: {
    color: "var(--text-muted)",
    fontSize: 13,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  chatTimeMuted: {
    color: "var(--text-muted)",
    fontSize: 12,
    whiteSpace: "nowrap",
  },
  chatSideBadges: {
    display: "grid",
    gap: 6,
    justifyItems: "end",
  },
  chatTinyBadge: {
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: 11,
    background: "rgba(15, 23, 42, 0.08)",
    color: "var(--text-soft)",
  },
  chatTinyBadgeMuted: {
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: 11,
    background: "rgba(239, 68, 68, 0.12)",
    color: "#b91c1c",
  },
  chatUnreadBubble: {
    minWidth: 22,
    height: 22,
    borderRadius: 999,
    background: "#25d366",
    color: "#fff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 700,
    paddingInline: 6,
  },
  chatMainPanel: {
    border: "1px solid var(--border)",
    borderRadius: 8,
    background: "var(--surface)",
    minHeight: 860,
    maxHeight: 860,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  chatHeaderBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "18px 20px",
    borderBottom: "1px solid var(--border)",
    background: "var(--surface-soft)",
  },
  chatHeaderBarDesktop: {
    position: "relative",
    overflow: "visible",
  },
  chatDesktopMoreWrapper: {
    position: "absolute",
    left: -58,
    top: 18,
    zIndex: 6,
  },
  chatDesktopMoreButton: {
    width: 44,
    height: 44,
    borderRadius: 5,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--text-soft)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 12px 28px rgba(15, 23, 42, 0.10)",
  },
  chatHeaderIdentity: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  chatHeaderIdentityMobile: {
    display: "grid",
    gridTemplateColumns: "40px 52px minmax(0,1fr)",
    alignItems: "center",
    gap: 8,
    flex: 1,
    minWidth: 0,
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: 700,
  },
  chatHeaderSub: {
    color: "var(--text-soft)",
    fontSize: 13,
    marginTop: 4,
  },
  chatHeaderSubMobile: {
    fontSize: 13,
    lineHeight: 1.4,
    whiteSpace: "normal",
    wordBreak: "keep-all",
    overflowWrap: "break-word",
  },
  chatHeaderTools: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "flex-end",
  },
  chatHeaderIconButton: {
    width: 42,
    height: 42,
    borderRadius: 5,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--text-soft)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  chatHeaderIconButtonMobile: {
    width: 36,
    height: 36,
    borderRadius: 7,
    boxShadow: "0 8px 18px rgba(15, 23, 42, 0.08)",
  },
  chatHeaderMobileTime: {
    fontSize: 11,
    color: "var(--text-muted)",
    lineHeight: 1.2,
    textAlign: "center",
    width: 36,
  },
  chatCallBanner: {
    margin: "14px 16px 0",
    padding: "14px 16px",
    borderRadius: 6,
    background: "rgba(37,211,102,0.14)",
    border: "1px solid rgba(37,211,102,0.25)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  chatCallBannerSub: {
    color: "var(--text-soft)",
    fontSize: 13,
    marginTop: 4,
  },
  chatMessagesAreaLarge: {
    flex: 1,
    padding: 18,
    background: "radial-gradient(circle at top, rgba(37,211,102,0.08), transparent 34%), radial-gradient(circle at bottom, rgba(0,136,204,0.08), transparent 28%), var(--surface-soft)",
    overflowY: "auto",
    display: "grid",
    gap: 10,
  },
  chatBubbleRow: {
    display: "flex",
    width: "100%",
  },
  chatBubble: {
    maxWidth: "82%",
    borderRadius: 7,
    padding: "12px 14px",
    boxShadow: "var(--shadow)",
    border: "1px solid var(--border)",
  },
  chatBubbleMine: {
    background: "var(--accent-soft)",
  },
  chatBubbleOther: {
    background: "var(--surface)",
  },
  chatBubbleTypeRow: {
    display: "flex",
    gap: 8,
    marginBottom: 6,
    flexWrap: "wrap",
  },
  chatTypePill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "4px 8px",
    borderRadius: 999,
    background: "rgba(15,23,42,0.08)",
    fontSize: 12,
    color: "var(--text-soft)",
  },
  chatBubbleText: {
    lineHeight: 1.9,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
  chatImageButton: {
    marginTop: 8,
    padding: 0,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    display: "block",
    width: "100%",
  },
  chatImagePreview: {
    width: "100%",
    maxWidth: 320,
    maxHeight: 260,
    objectFit: "cover",
    borderRadius: 6,
    display: "block",
    border: "1px solid rgba(15,23,42,0.08)",
  },
  chatVoicePlayer: {
    marginTop: 8,
    padding: 10,
    borderRadius: 6,
    background: "rgba(255,255,255,0.72)",
    border: "1px solid rgba(15,23,42,0.08)",
    display: "grid",
    gap: 8,
    minWidth: 0,
    width: "100%",
  },
  chatVoiceTopRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  chatVoicePlayButton: {
    width: 38,
    height: 38,
    borderRadius: 999,
    border: "none",
    background: "var(--accent)",
    color: "#fff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },
  chatVoiceDuration: {
    fontSize: 13,
    fontWeight: 700,
    color: "var(--text-soft)",
  },
  chatAudioElement: {
    width: "100%",
    height: 40,
    display: "block",
  },
  chatAttachmentName: {
    marginTop: 8,
    fontSize: 12,
    color: "var(--text-soft)",
  },
  chatBubbleMeta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
    marginTop: 8,
    color: "var(--text-muted)",
    fontSize: 12,
  },
  chatSystemMessage: {
    justifySelf: "center",
    padding: "8px 14px",
    borderRadius: 999,
    background: "rgba(15,23,42,0.08)",
    color: "var(--text-soft)",
    fontSize: 12,
  },
  chatQuickActions: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 16px 0",
    background: "var(--surface)",
  },
  chatComposerLarge: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 16,
    borderTop: "1px solid var(--border)",
    background: "var(--surface)",
  },
  chatAttachButton: {
    width: 46,
    height: 46,
    borderRadius: 5,
    border: "1px solid var(--border)",
    background: "var(--surface-soft)",
    color: "var(--text-soft)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  chatComposerInput: {
    flex: 1,
    minHeight: 56,
    borderRadius: 6,
    border: "1px solid var(--border)",
    background: "var(--surface-soft)",
    color: "var(--text)",
    padding: "0 16px",
    fontSize: 15,
    outline: "none",
  },
  chatComposerInputMobile: {
    minHeight: 40,
    borderRadius: 5,
    padding: "0 10px",
    fontSize: 14,
  },
  chatSendButton: {
    width: 56,
    height: 56,
    minWidth: 56,
    borderRadius: 6,
    border: "none",
    background: "var(--accent)",
    color: "#fff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 16px 32px rgba(0, 136, 204, 0.24)",
  },
  chatSendButtonMobile: {
    width: 38,
    height: 38,
    minWidth: 38,
    borderRadius: 7,
  },
  chatEmptyMain: {
    minHeight: 320,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "var(--text-soft)",
    padding: 24,
  },
  chatEmptySide: {
    padding: 24,
    textAlign: "center",
    color: "var(--text-soft)",
  },
  cameraCaptureWrap: {
    display: "grid",
    gap: 14,
  },
  cameraErrorBox: {
    padding: 14,
    borderRadius: 5,
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.2)",
    color: "#b91c1c",
    lineHeight: 1.8,
  },
  cameraPreviewBox: {
    width: "100%",
    minHeight: 320,
    borderRadius: 6,
    overflow: "hidden",
    background: "#000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  cameraPreviewVideo: {
    width: "100%",
    maxHeight: 520,
    objectFit: "cover",
    display: "block",
    background: "#000",
  },
  cameraPreviewOverlay: {
    position: "absolute",
    inset: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    background: "rgba(0,0,0,0.35)",
    fontSize: 18,
    fontWeight: 700,
    zIndex: 2,
  },
  cameraActionsRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
  },
  previewImageModal: {
    width: "100%",
    maxHeight: "75vh",
    objectFit: "contain",
    borderRadius: 6,
    display: "block",
    background: "#fff",
  },
  groupMemberGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 10,
  },
  groupMemberChip: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 14px",
    borderRadius: 5,
    border: "1px solid var(--border)",
    background: "var(--surface-soft)",
    cursor: "pointer",
  },
  groupMemberChipActive: {
    borderColor: "var(--accent-border)",
    background: "rgba(37,211,102,0.12)",
  },
  sidebarItemIcon: {
    width: 34,
    height: 34,
    borderRadius: 7,
    background: "rgba(251,146,60,0.15)",
    border: "1px solid rgba(251,146,60,0.25)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  chatNameButton: {
    border: "none",
    background: "transparent",
    padding: 0,
    color: "var(--text)",
    fontSize: 18,
    fontWeight: 700,
    cursor: "pointer",
  },
  chatBubbleStack: {
    display: "grid",
    gap: 6,
  },
  chatReactionRail: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    padding: "10px 14px",
    borderRadius: 999,
    background: "rgba(15,23,42,0.86)",
    color: "#fff",
    width: "fit-content",
    maxWidth: "100%",
    overflowX: "auto",
  },
  chatReactionButton: {
    border: "none",
    background: "transparent",
    fontSize: 26,
    cursor: "pointer",
    lineHeight: 1,
  },
  chatReactionSummary: {
    marginTop: 8,
    fontSize: 18,
  },
  chatComposerEdgeButton: {
    width: 56,
    height: 56,
    borderRadius: 6,
    border: "none",
    background: "transparent",
    color: "var(--text)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  chatComposerEdgeButtonMobile: {
    width: 32,
    height: 32,
    minWidth: 32,
    borderRadius: 6,
  },
  voiceRecorderBar: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "18px 16px",
    borderTop: "1px solid var(--border)",
    background: "#05070c",
    color: "#fff",
  },
  voiceRecorderIcon: {
    border: "none",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
  },
  voiceRecorderMiddle: { flex: 1, display: "grid", gap: 8 },
  voiceRecorderTime: { fontSize: 18, fontWeight: 700 },
  voiceRecorderWave: { opacity: 0.8, letterSpacing: 2, whiteSpace: "nowrap", overflow: "hidden" },
  voiceRecorderPause: {
    borderRadius: 999,
    border: "2px solid #ff5c7c",
    color: "#ff5c7c",
    background: "transparent",
    padding: "10px 14px",
    cursor: "pointer",
    fontWeight: 700,
  },
  actionMenuList: { display: "grid", gap: 8 },
  actionMenuItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    justifyContent: "space-between",
    flexDirection: "row-reverse",
    width: "100%",
    padding: "16px 18px",
    borderRadius: 6,
    border: "1px solid var(--border)",
    background: "var(--surface-soft)",
    color: "var(--text)",
    cursor: "pointer",
    fontSize: 16,
  },
  actionMenuDanger: { color: "#ef4444" },
  contactInfoWrap: { display: "grid", gap: 18 },
  contactInfoHero: { display: "grid", justifyItems: "center", gap: 8, paddingBottom: 12 },
  contactInfoAvatar: { width: 160, height: 160, borderRadius: 999, overflow: "hidden", background: "rgba(239,68,68,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 52, border: "1px solid var(--border)" },
  contactInfoAvatarImg: { width: "100%", height: "100%", objectFit: "cover" },
  contactInfoName: { fontSize: 30, fontWeight: 800 },
  contactInfoPhone: { fontSize: 18, color: "var(--text-soft)" },
  contactInfoActions: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 },
  contactActionBox: { display: "grid", gap: 8, justifyItems: "center", padding: "18px 12px", borderRadius: 7, border: "1px solid var(--border)", background: "var(--surface-soft)", color: "#22c55e", cursor: "pointer" },
  infoList: { display: "grid", gap: 10 },
  infoRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderRadius: 6, background: "var(--surface-soft)", border: "1px solid var(--border)" },
  lockRow: { display: "flex", gap: 12, alignItems: "center", padding: "18px", borderRadius: 6, background: "var(--surface-soft)", border: "1px solid var(--border)" },
  lockSwitch: { minWidth: 56 },
  attachGrid: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 10 },
  attachOption: { display: "grid", justifyItems: "center", gap: 8, border: "none", background: "transparent", color: "var(--text)", cursor: "pointer", fontSize: 15 },
  attachOptionIcon: { width: 54, height: 54, borderRadius: 999, background: "rgba(15,23,42,0.08)", display: "inline-flex", alignItems: "center", justifyContent: "center" },

  errorText: {
    color: "#dc2626",
    fontWeight: 700,
  },

  branchFilterBar: {
    display: "grid",
    gap: 10,
    marginBottom: 16,
  },
  branchFilterLabel: {
    color: "#475569",
    fontSize: 14,
    fontWeight: 800,
  },
  branchFilterWrap: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
  },
  branchPill: {
    height: 40,
    padding: "0 14px",
    borderRadius: 999,
    border: "1px solid var(--border)",
    background: "#fff",
    color: "#0f172a",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: 14,
  },
  branchPillActive: {
    background: "#0f172a",
    color: "#fff",
    borderColor: "#0f172a",
  },
  branchPillSelected: {
    boxShadow: "0 0 0 2px rgba(15, 23, 42, 0.08) inset",
    transform: "translateY(-1px)",
  },
  clickableRow: {
    cursor: "pointer",
    transition: "background 0.18s ease",
  },
  branchCellCenter: {
    display: "flex",
    justifyContent: "center",
  },
  branchBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 94,
    padding: "8px 14px",
    borderRadius: 999,
    border: "1px solid",
    fontWeight: 800,
    fontSize: 14,
    textAlign: "center",
  },
  employeeModalLayout: {
    display: "grid",
    gap: 18,
  },
  employeeModalHero: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 16,
    padding: 16,
    border: "1px solid var(--border)",
    borderRadius: 7,
    background: "linear-gradient(180deg, #f8fbff 0%, #f8fafc 100%)",
  },
  employeeModalHeroMain: {
    display: "grid",
    gap: 8,
  },
  employeeHeroBadges: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  employeeModalName: {
    fontSize: 26,
    fontWeight: 900,
    color: "#0f172a",
    lineHeight: 1.2,
  },
  employeeModalMeta: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    alignItems: "center",
    color: "#64748b",
    fontSize: 15,
    fontWeight: 700,
  },
  employeeDetailsGrid: {
    display: "grid",
    gap: 14,
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  },
  employeeInfoCard: {
    border: "1px solid var(--border)",
    background: "#ffffff",
    borderRadius: 6,
    padding: 16,
    minHeight: 92,
    boxSizing: "border-box",
  },
  employeeInfoLabel: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: 800,
    marginBottom: 10,
  },
  employeeInfoValue: {
    color: "#0f172a",
    fontSize: 16,
    lineHeight: 1.8,
    fontWeight: 700,
    wordBreak: "break-word",
  },
  employeeModalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    flexWrap: "wrap",
    paddingTop: 6,
  },
  modalActionBtn: {
    minWidth: 132,
  },
  modalFooterActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    flexWrap: "wrap",
  },
  employeeCvCard: {
    overflow: "hidden",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    color: "var(--text)",
  },
  employeeCvLayout: {
    display: "grid",
    gridTemplateColumns: "1fr 320px",
    gap: 30,
    alignItems: "start",
  },
  employeeCvLayoutMobile: {
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 16,
  },
  employeeCvMainMobile: {
    gap: 12,
  },
  employeeCvNameMobile: {
    fontSize: 26,
  },
  employeeCvSubtitleMobile: {
    fontSize: 18,
  },
  employeeCvRowMobile: {
    gridTemplateColumns: "1fr",
    gap: 6,
    padding: "10px 0",
  },
  employeeCvKeyMobile: {
    fontSize: 15,
  },
  employeeCvValMobile: {
    fontSize: 16,
    lineHeight: 1.7,
  },
  employeeCvDescriptionMobile: {
    padding: 14,
    minHeight: 90,
    fontSize: 15,
    lineHeight: 1.8,
  },
  employeeCvSideMobile: {
    order: -1,
    padding: 14,
    gap: 12,
  },
  employeeCvArtMobile: {
    minHeight: 160,
  },
  employeeCvCircleLargeMobile: {
    width: 140,
    height: 140,
    borderWidth: 14,
    boxShadow: "0 0 0 12px rgba(251, 146, 60, 0.18)",
  },
  employeeCvCircleSmallMobile: {
    width: 34,
    height: 34,
    top: 8,
    right: 10,
    boxShadow: "-42px 18px 0 rgba(251,146,60,0.24)",
  },
  employeeCvImageWrapMobile: {
    width: 104,
    height: 104,
  },
  employeeCvFallbackMobile: {
    fontSize: 34,
  },
  employeeCvContactItemMobile: {
    gridTemplateColumns: "40px 1fr",
    gap: 10,
  },
  employeeCvContactIconMobile: {
    width: 40,
    height: 40,
    fontSize: 18,
  },
  employeeCvContactValueMobile: {
    fontSize: 14,
  },
  employeeCvCardMobile: {
    padding: 14,
    borderRadius: 6,
  },
  employeeCvMain: {
    display: "grid",
    gap: 18,
    alignContent: "start",
    color: "var(--text)",
  },
  employeeCvName: {
    fontSize: 42,
    fontWeight: 900,
    color: "var(--accent)",
    lineHeight: 1.15,
  },
  employeeCvSubtitle: {
    color: "var(--text-soft)",
    fontSize: 22,
    fontWeight: 700,
    marginTop: -2,
  },
  employeeCvLine: {
    width: "100%",
    height: 4,
    borderRadius: 999,
    background: "var(--accent)",
  },
  employeeCvSection: {
    display: "grid",
    gap: 8,
  },
  employeeCvSectionTitle: {
    color: "var(--accent)",
    fontSize: 20,
    fontWeight: 900,
    marginBottom: 4,
  },
  employeeCvRow: {
    display: "grid",
    gridTemplateColumns: "180px 1fr",
    gap: 18,
    alignItems: "start",
    padding: "12px 0",
    borderBottom: "1px solid var(--border)",
  },
  employeeCvKey: {
    color: "#ea580c",
    fontSize: 17,
    fontWeight: 800,
  },
  employeeCvVal: {
    color: "var(--text)",
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.9,
  },
  employeeCvDescription: {
    border: "1px solid var(--border)",
    borderRadius: 6,
    background: "var(--surface-soft)",
    padding: 22,
    minHeight: 150,
    boxSizing: "border-box",
    color: "var(--text)",
    fontSize: 18,
    lineHeight: 2,
  },
  employeeCvSide: {
    background: "var(--surface-soft)",
    borderRadius: 8,
    padding: 22,
    display: "grid",
    gap: 22,
    alignContent: "start",
    border: "1px solid var(--border)",
    minHeight: 100,
    color: "var(--text)",
  },
  employeeCvArt: {
    position: "relative",
    minHeight: 330,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  employeeCvCircleLarge: {
    position: "absolute",
    width: 250,
    height: 250,
    borderRadius: "50%",
    border: "22px solid #fb923c",
    boxShadow: "0 0 0 26px rgba(251, 146, 60, 0.18)",
    top: 20,
    left: "50%",
    transform: "translateX(-50%)",
  },
  employeeCvCircleSmall: {
    position: "absolute",
    width: 56,
    height: 56,
    borderRadius: "50%",
    background: "rgba(251,146,60,0.45)",
    top: 18,
    right: 26,
    boxShadow: "-84px 34px 0 rgba(251,146,60,0.30)",
  },
  employeeCvImageWrap: {
    position: "relative",
    zIndex: 2,
    width: 170,
    height: 170,
    borderRadius: "50%",
    background: "#ffffff",
    padding: 6,
    boxSizing: "border-box",
    boxShadow: "0 16px 30px rgba(15,23,42,0.12)",
  },
  employeeCvImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
    display: "block",
  },
  employeeCvFallback: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: "linear-gradient(180deg, #ffffff 0%, #fff7ed 100%)",
    color: "var(--accent)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 56,
    fontWeight: 900,
    border: "3px solid #fdba74",
  },
  employeeCvActions: {
    display: "flex",
    justifyContent: "center",
  },
  employeeCvContacts: {
    display: "grid",
    gap: 16,
  },
  employeeCvContactItem: {
    display: "grid",
    gridTemplateColumns: "52px 1fr",
    gap: 12,
    alignItems: "center",
  },
  employeeCvContactIcon: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: "#f59e0b",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
    boxShadow: "0 10px 20px rgba(245,158,11,0.18)",
  },
  employeeCvContactValue: {
    color: "var(--text)",
    fontSize: 17,
    fontWeight: 800,
    lineHeight: 1.8,
    wordBreak: "break-word",
  },
  employeeCvContactSub: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: 700,
    lineHeight: 1.5,
  },
};