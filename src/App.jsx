import React, { useEffect, useMemo, useRef, useState } from "react";
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
} from "lucide-react";

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
    id: "direct-0910000000-0912026390",
    type: "direct",
    participants: ["0912026390", "0910000000"],
    pinnedBy: ["0912026390"],
    mutedBy: [],
    messages: [
      {
        id: 11,
        senderPhone: "0912026390",
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
    participants: ["0912026390", "0910000000", "0912345678", "0941111111"],
    admins: ["0912026390", "0910000000"],
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

const initialSystemUsers = [
  { phone: "0912026390", password: "12345678", role: "owner", name: "المالك", managedDepartment: "all", managedBranch: "all", mustChangePassword: false, passwordChangedOnce: true },
  { phone: "0910000000", password: "999999", role: "hr", name: "موظف HR", managedDepartment: "all", managedBranch: "all", mustChangePassword: false, passwordChangedOnce: true },
  { phone: "0941111111", password: "444444", role: "branch_manager", name: "خالد فرج", managedDepartment: "all", managedBranch: "طرابلس", mustChangePassword: false, passwordChangedOnce: true },
  { phone: "0942222222", password: "555555", role: "department_manager", name: "منى عبدالسلام", managedDepartment: "الحسابات", managedBranch: "بنغازي", mustChangePassword: false, passwordChangedOnce: true },
  { phone: "0912345678", password: "111111", role: "employee", name: "أحمد سالم", managedDepartment: "شؤون الموظفين", managedBranch: "طرابلس", mustChangePassword: false, passwordChangedOnce: true },
  { phone: "0923456789", password: "222222", role: "employee", name: "سارة علي", managedDepartment: "الحسابات", managedBranch: "بنغازي", mustChangePassword: false, passwordChangedOnce: true },
  { phone: "0934567890", password: "333333", role: "employee", name: "محمد مفتاح", managedDepartment: "الدعم الفني", managedBranch: "مصراتة", mustChangePassword: false, passwordChangedOnce: true },
];

const emptyForm = {
  name: "",
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
  fromHour: "",
  toHour: "",
};

const emptyRegisterForm = {
  name: "",
  phone: "",
  password: "",
  department: "",
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
const emptyRewardRequestForm = { amount: "", reason: "", actionType: "مكافأة" };
const emptyUpgradeRequestForm = { employeeName: "", employeePhone: "", requestedRole: "branch_manager", reason: "", branch: "المركزية", managerDepartment: "", createNewDepartment: false, newDepartmentName: "" };
const emptySalaryDepositForm = { month: "", salaryAmount: "", deductionAmount: "", deductionReason: "" };
const emptyComplaintForm = { type: "شكوى", targetCategory: "owner", targetValue: "", subject: "", body: "" };


function getSupabaseUrl() {
  return (
    (typeof window !== "undefined" && (
      window.__HR_SUPABASE_URL__ ||
      window.localStorage?.getItem("HR_SUPABASE_URL") ||
      window.localStorage?.getItem("VITE_SUPABASE_URL")
    )) ||
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_URL) ||
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
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_SUPABASE_ANON_KEY) ||
    ""
  );
}

function isRemoteSyncEnabled() {
  return Boolean(getSupabaseUrl() && getSupabaseAnonKey());
}

const REMOTE_STATE_TABLE = "hr_app_state";
const REMOTE_STATE_ROW_ID = "main";

async function requestBrowserNotificationPermission() {
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
    users: initialSystemUsers.map((user) => ({ ...user })),
    pending: [],
    upgrades: [],
    complaints: initialComplaints.map((item) => ({ ...item })),
    chats: initialChats.map((chat) => ({ ...chat })),
    chatCalls: initialChatCalls.map((call) => ({ ...call })),
  };
}

function normalizeEmployeesCollection(list) {
  return Array.isArray(list)
    ? list.map((emp) => ({
        ...emp,
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
    users: Array.isArray(payload.users) ? payload.users : defaults.users,
    pending: Array.isArray(payload.pending) ? payload.pending : defaults.pending,
    upgrades: Array.isArray(payload.upgrades) ? payload.upgrades : defaults.upgrades,
    complaints: Array.isArray(payload.complaints) ? payload.complaints : defaults.complaints,
    chats: Array.isArray(payload.chats) ? payload.chats : defaults.chats,
    chatCalls: Array.isArray(payload.chatCalls) ? payload.chatCalls : defaults.chatCalls,
  };
}

const translations = {
  ar: {
    loginTitle: "تسجيل الدخول",
    loginSubtitle: "أدخل رقم الهاتف وكلمة المرور حسب نوع الحساب والصلاحية.",
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
    appTitle: "نظام إدارة الموارد البشرية",
    heroBadge: "لوحة إدارة HR الحديثة",
    ownerDesc: "واجهة كاملة للمالك و HR مع جميع الصلاحيات.",
    branchDesc: "هذه لوحة مدير الفرع.",
    deptDesc: "هذه لوحة الإدارة.",
    empDesc: "هذه اللوحة تعرض بياناتك الشخصية فقط.",
    addEmployee: "إضافة موظف",
    logout: "تسجيل خروج",
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
    appTitle: "Human Resources Management System",
    heroBadge: "Modern HR Panel",
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
  return `${Number(value || 0).toLocaleString()} د.ل`;
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
  return <input {...props} style={{ ...ui.input, ...props.style }} />;
}

function Textarea(props) {
  return <textarea {...props} style={{ ...ui.textarea, ...props.style }} />;
}

function Select(props) {
  return <select {...props} style={{ ...ui.input, ...props.style }} />;
}

function Card({ children, style }) {
  return <div style={{ ...ui.card, ...style }}>{children}</div>;
}

function Badge({ children }) {
  return <span style={ui.badge}>{children}</span>;
}

function Modal({ open, title, children, onClose, maxWidth = 900 }) {
  if (!open) return null;
  return (
    <div style={ui.modalOverlay} onClick={onClose}>
      <div style={{ ...ui.modalBox, maxWidth }} onClick={(e) => e.stopPropagation()}>
        <div style={ui.modalHeader}>
          <h3 style={{ margin: 0, fontSize: 24 }}>{title}</h3>
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
        <p style={{ margin: 0, color: "var(--text-soft)", lineHeight: compact ? 1.7 : 1.8, fontSize: compact ? 13 : 16 }}>{description}</p>
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
        <div style={ui.summarySubtitle}>{subtitle}</div>
      </div>
      <div style={ui.summaryIcon}><Icon size={18} /></div>
    </Card>
  );
}

function Field({ label, children, full = false }) {
  return (
    <div style={full ? { gridColumn: "1 / -1" } : undefined}>
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
  const [loginData, setLoginData] = useState({ phone: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [employees, setEmployees] = useState(() => readStorage(STORAGE_KEYS.employees, initialEmployees, isArray).map((emp) => ({ ...emp, basicSalary: Number(emp?.basicSalary ?? emp?.salary ?? 0) })));
  const [requests, setRequests] = useState(() => readStorage(STORAGE_KEYS.requests, initialRequests, isArray));
  const [systemUsers, setSystemUsers] = useState(() => readStorage(STORAGE_KEYS.users, initialSystemUsers, isArray));
  const [pendingAccounts, setPendingAccounts] = useState(() => readStorage(STORAGE_KEYS.pending, [], isArray));
  const [upgradeRequests, setUpgradeRequests] = useState(() => readStorage(STORAGE_KEYS.upgrades, [], isArray));
  const [complaints, setComplaints] = useState(() => readStorage(STORAGE_KEYS.complaints, initialComplaints, isArray));
  const [chats, setChats] = useState(() => readStorage(STORAGE_KEYS.chats, initialChats, isArray));
  const [chatCalls, setChatCalls] = useState(() => readStorage(STORAGE_KEYS.chatCalls, initialChatCalls, isArray));
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [chatSearch, setChatSearch] = useState("");
  const [chatDraft, setChatDraft] = useState("");
  const [activeChatId, setActiveChatId] = useState("");
  const [chatFilter, setChatFilter] = useState("all");
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [groupForm, setGroupForm] = useState({ name: "", members: [] });
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
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [leaveRequestDialogOpen, setLeaveRequestDialogOpen] = useState(false);
  const [advanceDialogOpen, setAdvanceDialogOpen] = useState(false);
  const [rewardDialogOpen, setRewardDialogOpen] = useState(false);
  const [salaryDepositDialogOpen, setSalaryDepositDialogOpen] = useState(false);
  const [statementDialogOpen, setStatementDialogOpen] = useState(false);
  const [statementEmployee, setStatementEmployee] = useState(null);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [approvalLogOpen, setApprovalLogOpen] = useState(false);
  const [approvalLogType, setApprovalLogType] = useState("leave");

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
  const modalImageInputRef = useRef(null);
  const chatCameraInputRef = useRef(null);
  const chatPhotosInputRef = useRef(null);
  const chatDocumentInputRef = useRef(null);
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
  } : {
    reply: "Reply", forward: "Forward", copy: "Copy", star: "Star", save: "Save", delete: "Delete", more: "More...", pin: "Pin", privateReply: "Reply privately", addContact: "Add to contacts", messageContact: "Message", report: "Report", mute: "Mute", info: "Chat info", lock: "Lock chat", addToFav: "Add to favorites", addToList: "Add to list", clearChat: "Clear chat", leaveGroup: "Leave group", markUnread: "Mark unread", archive: "Archive", unarchive: "Unarchive", contactInfo: "Contact info", media: "Media, links and docs", storage: "Manage storage", starred: "Starred", wallpaper: "Chat theme", saveToPhotos: "Save to photos", disappearing: "Disappearing messages", lockChat: "Lock chat", recording: "Voice recording", send: "Send", pause: "Pause", resume: "Resume", contact: "Contact", location: "Location", camera: "Camera", photos: "Photos", aiImages: "AI images", event: "Event", poll: "Poll", document: "Document",
  };

  const isEmployee = authUser?.role === "employee";
  const canManageAll = authUser?.role === "owner" || authUser?.role === "hr";
  const canManageBranch = authUser?.role === "branch_manager";
  const canManageDepartment = authUser?.role === "department_manager";
  const canApproveRequests = canManageAll || canManageBranch || canManageDepartment;
  const canApproveFinancialRequests = canManageAll;
  const canRequestFinancialActions = canManageAll || canManageBranch || canManageDepartment || authUser?.role === "employee";
  const canAddEmployees = canManageAll;
  const canDeleteEmployees = canManageAll;
  const canSearch = canManageAll || canManageBranch || canManageDepartment;
  const canAccessRequestsHub = isAuthenticated;


  const applyRemoteSnapshot = (payload) => {
    const next = sanitizeRemoteState(payload);
    applyingRemoteRef.current = true;
    setEmployees(normalizeEmployeesCollection(next.employees));
    setRequests(next.requests);
    setSystemUsers(next.users);
    setPendingAccounts(next.pending);
    setUpgradeRequests(next.upgrades);
    setComplaints(next.complaints);
    setChats(next.chats);
    setChatCalls(next.chatCalls);
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
      remoteReadyRef.current = false;
      setCloudStatus("error");
    }
  };

  const getCloudStatusLabel = () => {
    if (language === "ar") {
      if (!cloudEnabled) return "المزامنة غير مفعلة - أضف بيانات Supabase";
      if (cloudStatus === "online") return "متصل بقاعدة البيانات";
      if (cloudStatus === "syncing") return "جاري المزامنة";
      if (cloudStatus === "error") return "خطأ في المزامنة - راجع مفاتيح Supabase و SQL";
      if (cloudStatus === "connecting") return "جاري الاتصال";
      return "تخزين محلي فقط";
    }
    if (!cloudEnabled) return "Local only - add Supabase config";
    if (cloudStatus === "online") return "Database connected";
    if (cloudStatus === "syncing") return "Syncing";
    if (cloudStatus === "error") return "Sync error - check Supabase config";
    if (cloudStatus === "connecting") return "Connecting";
    return "Local storage only";
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
    if (authUser?.role === "employee") {
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

    if (authUser?.role === "employee") {
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
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify({ language, theme: themeMode }));
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
    document.body.style.margin = "0";
    document.body.style.fontFamily = "Arial, sans-serif";
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
      select {
        background: var(--input-bg) !important;
        color: var(--input-text) !important;
        color-scheme: ${'${themeMode === "dark" ? "dark" : "light"}'};
      }
      select option {
        background: ${'${themeMode === "dark" ? "#101c33" : "#ffffff"}'} !important;
        color: ${'${themeMode === "dark" ? "#f8fafc" : "#0f172a"}'} !important;
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
          "--bg": "#0b1220",
          "--surface": "#121a2b",
          "--surface-soft": "#182235",
          "--surface-muted": "#1e293b",
          "--border": "#2b3a55",
          "--text": "#e5eefc",
          "--text-soft": "#b9c6dc",
          "--text-muted": "#8ea0be",
          "--primary": "#dbeafe",
          "--primary-contrast": "#081225",
          "--shadow": "0 16px 40px rgba(2, 6, 23, 0.45)",
        }
      : {
          "--bg": "#eef3fb",
          "--surface": "#ffffff",
          "--surface-soft": "#f8fafc",
          "--surface-muted": "#edf3fb",
          "--border": "#dbe4f0",
          "--text": "#0f172a",
          "--text-soft": "#475569",
          "--text-muted": "#64748b",
          "--primary": "#0f172a",
          "--primary-contrast": "#ffffff",
          "--shadow": "0 12px 30px rgba(15, 23, 42, 0.08)",
        };

    Object.entries(vars).forEach(([key, value]) => root.style.setProperty(key, value));
    document.body.style.background = "var(--bg)";
    document.body.style.color = "var(--text)";
  }, [language, themeMode]);

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
      notificationPermissionRef.current = await requestBrowserNotificationPermission();

      let { data, error } = await fetchRemoteStateRow();
      if (error) throw error;

      if (!data) {
        const created = await upsertRemoteStateRow(defaults);
        if (created.error) throw created.error;
        data = created.data || { payload: defaults, updated_at: new Date().toISOString() };
      }

      if (cancelled) return;
      const snapshot = data?.payload || defaults;
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
  if (!cloudEnabled || !remoteReadyRef.current || applyingRemoteRef.current || cloudStatus === "error") return undefined;

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
}, [employees, requests, systemUsers, pendingAccounts, upgradeRequests, complaints, chats, chatCalls]);

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
    totalPayroll: visibleEmployees.reduce((sum, emp) => sum + Number(emp.salary || 0), 0),
    totalAdvances: visibleEmployees.reduce((sum, emp) => sum + Number(emp.advance || 0), 0),
    totalLeaveBalance: visibleEmployees.reduce((sum, emp) => sum + Number(emp.leaveBalance || 0), 0),
  }), [visibleEmployees]);

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

  const approvalLeaveRequests = useMemo(() => {
    if (!(canManageAll || canManageBranch || canManageDepartment)) return [];
    return visibleLeaveRequests.filter((req) => ["إجازة", "تأخير"].includes(req.type) && req.canDecide);
  }, [visibleLeaveRequests, canManageAll, canManageBranch, canManageDepartment]);

  const approvalFinancialRequests = useMemo(() => {
    if (!(canManageAll || canManageBranch || canManageDepartment)) return [];
    return visibleFinancialRequests.filter((req) => ["سلفة", "مكافأة", "خصم"].includes(req.type) && req.canDecide);
  }, [visibleFinancialRequests, canManageAll, canManageBranch, canManageDepartment]);

  const requestHubHasApprovalActions = canManageAll || canManageBranch || canManageDepartment;
  const requestHubLeaveRequests = requestHubHasApprovalActions ? approvalLeaveRequests : visibleLeaveRequests;
  const requestHubFinancialRequests = requestHubHasApprovalActions
    ? approvalFinancialRequests
    : visibleFinancialRequests.filter((req) => ["سلفة", "مكافأة", "خصم"].includes(req.type));
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
    if (canManageAll) return upgradeRequests;
    return upgradeRequests.filter((req) => req.employeePhone === authUser.phone);
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
        if (user.phone !== authUser.phone) allowedPhones.add(user.phone);
      });
    } else if (canManageBranch) {
      systemUsers.forEach((user) => {
        if (user.phone !== authUser.phone && (user.managedBranch === authUser.managedBranch || ["owner", "hr"].includes(user.role))) {
          allowedPhones.add(user.phone);
        }
      });
    } else if (canManageDepartment) {
      systemUsers.forEach((user) => {
        if (user.phone !== authUser.phone && (user.managedDepartment === authUser.managedDepartment || ["owner", "hr"].includes(user.role))) {
          allowedPhones.add(user.phone);
        }
      });
    } else {
      systemUsers.forEach((user) => {
        if (
          user.phone !== authUser.phone &&
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
        if ((thread.archivedBy || []).includes(authUser?.phone)) return false;
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
  }, [authUser, systemUsers, employees, chats, language, canManageAll, canManageBranch, canManageDepartment, chatSearch, chatFilter]);

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
    if (!authUser || !groupForm.name.trim() || groupForm.members.length < 1) return;
    const nextGroup = {
      id: `group-${Date.now()}`,
      type: "group",
      name: groupForm.name.trim(),
      participants: [authUser.phone, ...groupForm.members],
      admins: [authUser.phone],
      pinnedBy: [],
      mutedBy: [],
      messages: [createChatMessage({ type: "system", system: true, text: `${t.chatGroupCreated}: ${groupForm.name.trim()}` })],
    };
    setChats((prev) => [nextGroup, ...prev]);
    setGroupDialogOpen(false);
    setGroupForm({ name: "", members: [] });
    setActiveChatId(nextGroup.id);
  };

  const startChatCall = (mode) => {
    if (!authUser || !activeConversation) return;
    const entry = {
      id: Date.now(),
      chatId: activeConversation.id,
      mode,
      startedAt: new Date().toISOString(),
      title: activeConversation.name,
    };
    setChatCalls((prev) => [entry, ...prev]);
    setOngoingCall(entry);
    upsertConversationWithMessage(activeConversation, createChatMessage({
      type: "system",
      system: true,
      text: mode === "video" ? (language === "ar" ? "بدأ اتصال فيديو" : "Video call started") : (language === "ar" ? "بدأ اتصال صوتي" : "Voice call started"),
    }));
  };

  const endChatCall = () => {
    if (!ongoingCall || !activeConversation) {
      setOngoingCall(null);
      return;
    }
    upsertConversationWithMessage(activeConversation, createChatMessage({
      type: "system",
      system: true,
      text: language === "ar" ? "تم إنهاء المكالمة" : "Call ended",
    }));
    setOngoingCall(null);
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
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      upsertConversationWithMessage(activeConversation, createChatMessage({
        type: "system",
        system: true,
        text: language === "ar" ? "المتصفح لا يدعم تسجيل الصوت المباشر." : "This browser does not support direct voice recording.",
      }));
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

  const getEmployeeFinancialStatement = (employee) => {
    if (!employee) return null;
    const employeeRequests = requests
      .filter((req) => req.employeePhone === employee.phone && ["سلفة", "مكافأة", "خصم", "إنزال مرتب"].includes(req.type))
      .sort((a, b) => Number(b.id || 0) - Number(a.id || 0));

    const approvedAdvances = employeeRequests
      .filter((req) => req.type === "سلفة" && req.status === "معتمد")
      .reduce((sum, req) => sum + Number(req.amount || 0), 0);

    const approvedRewards = employeeRequests
      .filter((req) => req.type === "مكافأة" && req.status === "معتمد")
      .reduce((sum, req) => sum + Number(req.amount || 0), 0);

    const approvedDeductions = employeeRequests
      .filter((req) => req.type === "خصم" && req.status === "معتمد")
      .reduce((sum, req) => sum + Number(req.amount || 0), 0);

    const currentAdvanceBalance = Number(employee.advance || 0);
    const grossSalary = Number(employee.salary || employee.basicSalary || 0);
    const basicSalary = Number(employee.basicSalary || employee.salary || 0);
    const baseNet = grossSalary - currentAdvanceBalance;
    const estimatedNet = baseNet + approvedRewards - approvedDeductions;

    return {
      basicSalary,
      grossSalary,
      currentAdvanceBalance,
      approvedAdvances,
      approvedRewards,
      approvedDeductions,
      baseNet,
      estimatedNet,
      transactions: employeeRequests,
    };
  };

  const statementData = statementEmployee ? getEmployeeFinancialStatement(statementEmployee) : null;

  const openNotificationDialog = (requestItem) => {
    if (!requestItem) return;
    setSelectedNotification(requestItem);
    setNotificationDialogOpen(true);
  };

  const getNotificationContent = (requestItem) => {
    if (!requestItem) return t.noReasonAvailable;
    if (requestItem.type === "إنزال مرتب") {
      const parts = [];
      if (requestItem.month) {
        parts.push(`${t.month}: ${requestItem.month}`);
      }
      parts.push(
        `${t.salaryAmount}: ${currency(requestItem.salaryAmount || 0)}`
      );
      if (Number(requestItem.deductionAmount || 0)) {
        parts.push(`${t.deductionAmount}: ${currency(requestItem.deductionAmount || 0)}`);
      }
      if (requestItem.reason && requestItem.reason !== "-") {
        parts.push(`${t.deductionReason}: ${requestItem.reason}`);
      }
      return parts.join(" | ");
    }
    return requestItem.reason && requestItem.reason !== "-" ? requestItem.reason : t.noReasonAvailable;
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
    if (canManageBranch && authUser.phone === employee.phone) return true;
    if (canManageDepartment && authUser.phone === employee.phone) return true;
    return authUser.role === "employee" && authUser.phone === employee.phone;
  };



  const applyUserRoleUpgrade = (request) => {
    const employee = employees.find((emp) => emp.phone === request.employeePhone);
    const targetBranch = request.branch || employee?.location || "";
    const targetManagedDepartment = request.requestedRole === "department_manager"
      ? (request.managerDepartment || employee?.managerDepartment || "")
      : "all";

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
                managedBranch: request.requestedRole === "branch_manager" ? targetBranch : (user.managedBranch || targetBranch),
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
          managedBranch: request.requestedRole === "branch_manager" ? targetBranch : targetBranch,
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
              managedBranch: request.requestedRole === "branch_manager" ? targetBranch : (prev.managedBranch || targetBranch),
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
    const matchedUser = systemUsers.find((user) => user.phone === loginData.phone && user.password === loginData.password);
    if (!matchedUser) {
      setLoginError(language === "ar" ? "رقم الهاتف أو كلمة المرور غير صحيحة" : "Phone number or password is incorrect.");
      return;
    }
    setIsAuthenticated(true);
    setAuthUser(matchedUser);
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
    if (!registerForm.name || !registerForm.phone || !registerForm.password) {
      setRegisterMessage(language === "ar" ? "املأ الاسم ورقم الهاتف وكلمة المرور" : "Fill in name, phone and password.");
      return;
    }
    const existsUser = systemUsers.some((user) => user.phone === registerForm.phone);
    const existsPending = pendingAccounts.some((acc) => acc.phone === registerForm.phone && acc.status === "بانتظار الاعتماد");
    if (existsUser || existsPending) {
      setRegisterMessage(language === "ar" ? "رقم الهاتف مستخدم بالفعل أو لديه طلب مفتوح" : "Phone number is already used or has an open request.");
      return;
    }
    setPendingAccounts((prev) => [
      {
        id: Date.now(),
        ...registerForm,
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
      fromHour: form.fromHour || "",
      toHour: form.toHour || "",
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
      department: employee.department || "",
      password: systemUsers.find((u) => u.phone === employee.phone)?.password || "",
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
      fromHour: employee.fromHour || "",
      toHour: employee.toHour || "",
    });
    setEditDialogOpen(true);
  };

  const saveEmployeeEdit = () => {
    if (!selectedEmployee) return;
    if (employees.some((emp) => emp.phone === editForm.phone && emp.id !== selectedEmployee.id)) return;

    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === selectedEmployee.id
          ? {
              ...emp,
              name: editForm.name,
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
              fromHour: editForm.fromHour || "",
              toHour: editForm.toHour || "",
            }
          : emp
      )
    );

    setSystemUsers((prev) =>
      prev.map((user) =>
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
      )
    );

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

  const updateRequestStatus = async (id, status) => {
    if (!authUser) return;

    let approvedAdvance = null;
    let approvedDeduction = null;

    const updatedRequests = requests.map((r) => {
      if (r.id !== id || r.canDecide === false) return r;
      const next = { ...r, status, decidedBy: authUser.name, approvedBy: authUser.name, canDecide: false };
      if (status === "معتمد" && r.type === "سلفة") approvedAdvance = next;
      if (status === "معتمد" && r.type === "خصم") approvedDeduction = next;
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

    if (approvedDeduction) {
      updatedEmployees = updatedEmployees.map((emp) =>
        emp.phone === approvedDeduction.employeePhone
          ? { ...emp, advance: Math.max(0, Number(emp.advance || 0) - Number(approvedDeduction.amount || 0)) }
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
    });
  };

  const submitLeaveRequest = async () => {
    const employee = getFinancialRowEmployee() || getCurrentEmployee();
    if (!employee || !leaveRequestForm.reason) return;

    const newRequest = {
      id: Date.now(),
      employeePhone: employee.phone,
      employeeName: employee.name,
      department: employee.department,
      managerDepartment: employee.managerDepartment,
      type: leaveRequestForm.type,
      leaveFrom: leaveRequestForm.type === "إجازة" ? leaveRequestForm.leaveFrom : "",
      leaveTo: leaveRequestForm.type === "إجازة" ? leaveRequestForm.leaveTo : "",
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
    const newRequest = {
      id: Date.now(),
      employeePhone: employee.phone,
      employeeName: employee.name,
      department: employee.department,
      managerDepartment: employee.managerDepartment,
      type: actionType,
      amount: Number(rewardRequestForm.amount || 0),
      reason: rewardRequestForm.reason,
      status: canManageAll ? "معتمد" : "بانتظار الاعتماد",
      approver: "HR / المالك",
      decidedBy: canManageAll ? authUser?.name || "" : "",
      canDecide: !canManageAll,
      createdByRole: authUser?.role || "employee",
      createdAt: new Date().toISOString(),
    };

    setRequests((prev) => [newRequest, ...prev]);
    if (canManageAll && actionType === "خصم") applyFinancialRequestEffect(newRequest);

    setRewardDialogOpen(false);
    setRewardRequestForm(emptyRewardRequestForm);
  };

  const submitSalaryDeposit = () => {
    const employee = getFinancialRowEmployee() || getCurrentEmployee();
    if (!employee || !salaryDepositForm.salaryAmount) return;

    const salaryAmount = Number(salaryDepositForm.salaryAmount || 0);
    const deductionAmount = Number(salaryDepositForm.deductionAmount || 0);
    const netAmount = Math.max(0, salaryAmount - deductionAmount);

    const newRequest = {
      id: Date.now(),
      employeePhone: employee.phone,
      employeeName: employee.name,
      department: employee.department,
      managerDepartment: employee.managerDepartment,
      type: "إنزال مرتب",
      amount: netAmount,
      salaryAmount,
      deductionAmount,
      month: salaryDepositForm.month || "",
      reason: salaryDepositForm.deductionReason || "-",
      status: "معتمد",
      approver: authUser?.name || "HR / المالك",
      decidedBy: authUser?.name || "HR / المالك",
      canDecide: false,
      createdByRole: authUser?.role || "owner",
      createdAt: new Date().toISOString(),
    };

    setRequests((prev) => [newRequest, ...prev]);
    setSalaryDepositDialogOpen(false);
    setSalaryDepositForm(emptySalaryDepositForm);
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
              <Field label={t.name}><Input value={registerForm.name} onChange={(e) => setRegisterForm((p) => ({ ...p, name: e.target.value }))} /></Field>
              <Field label={t.phone}><Input value={registerForm.phone} onChange={(e) => setRegisterForm((p) => ({ ...p, phone: e.target.value }))} /></Field>
              <Field label={t.password}><Input type="password" value={registerForm.password} onChange={(e) => setRegisterForm((p) => ({ ...p, password: e.target.value }))} /></Field>
              <Field label={t.department}><Input value={registerForm.department} onChange={(e) => setRegisterForm((p) => ({ ...p, department: e.target.value }))} /></Field>
              <Field label={t.managerDepartment}><Input value={registerForm.managerDepartment} onChange={(e) => setRegisterForm((p) => ({ ...p, managerDepartment: e.target.value }))} /></Field>
              <Field label={t.location}><Input value={registerForm.location} onChange={(e) => setRegisterForm((p) => ({ ...p, location: e.target.value }))} /></Field>
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
        <Card style={{ ...ui.authCard, maxWidth: 560 }}>
          <div style={ui.phoneWrap}><Phone size={28} /></div>

          <div style={ui.authHead}>
            <h1 style={ui.bigTitle}>{t.loginTitle}</h1>
            <p style={ui.subtitle}>{t.loginSubtitle}</p>
          </div>

          <div>
            <Input placeholder={t.phone} value={loginData.phone} onChange={(e) => setLoginData((p) => ({ ...p, phone: e.target.value }))} />
            <Input type="password" placeholder={t.password} value={loginData.password} onChange={(e) => setLoginData((p) => ({ ...p, password: e.target.value }))} />
            {loginError ? <p style={ui.errorText}>{loginError}</p> : null}
            <Button onClick={handleLogin} width="100%">{t.login}</Button>
            <Button variant="outline" onClick={() => setShowRegister(true)} width="100%" style={{ marginTop: 10 }}>
              <UserPlus size={16} /> {t.createAccount}
            </Button>
          </div>

          <div style={ui.demoBox}>
            <p style={ui.demoTitle}>{t.sampleLogin}</p>
            <p>المالك: 0912026390 / 12345678</p>
            <p>HR: 0910000000 / 999999</p>
            <p>مدير فرع: 0941111111 / 444444</p>
            <p>مدير إدارة: 0942222222 / 555555</p>
            <p>موظف: 0912345678 / 111111</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ ...ui.appShell, ...(isMobileView ? ui.appShellMobile : {}) }}>
      <Card style={{ ...ui.heroCard, ...(isMobileView ? ui.heroCardMobile : {}) }}>
        <div style={{ ...ui.heroRow, ...(isMobileView ? ui.heroRowMobile : {}) }}>
          <div style={{ flex: 1, minWidth: isMobileView ? 0 : 300 }}>
            <div style={ui.heroBadge}><Sparkles size={14} /> {t.heroBadge}</div>
            <h1 style={{ ...ui.heroTitle, ...(isMobileView ? ui.heroTitleMobile : {}) }}>{t.appTitle}</h1>
            <p style={{ ...ui.heroDesc, ...(isMobileView ? ui.heroDescMobile : {}) }}>
              {canManageAll
                ? t.ownerDesc
                : canManageBranch
                ? `${authUser?.name || ""}، ${t.branchDesc}`
                : canManageDepartment
                ? `${authUser?.name || ""}، ${t.deptDesc}`
                : `${authUser?.name || ""}، ${t.empDesc}`}
            </p>
          </div>

          <div style={{ ...ui.heroActions, ...(isMobileView ? ui.heroActionsMobile : {}) }}>
            <div style={ui.cloudStatusBadge}>{getCloudStatusLabel()}</div>
            {isAuthenticated && (
              <div style={{ ...ui.searchBox, ...(isMobileView ? ui.searchBoxMobile : {}) }}>
                <Search size={16} />
                <input
                  style={ui.searchInput}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t.search}
                  disabled={!canSearch}
                />
              </div>
            )}
            {isAuthenticated && canAddEmployees && (
              <Button onClick={() => setAddDialogOpen(true)}><Plus size={16} /> {t.addEmployee}</Button>
            )}
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
            <Button variant="outline" onClick={() => setSettingsOpen(true)} style={{ width: 44, padding: 0 }}>
              <Settings size={16} />
            </Button>
            <Button variant="outline" onClick={handleLogout} style={isMobileView ? ui.mobileLogoutButton : undefined}><LogOut size={16} /> {isMobileView ? (language === "ar" ? "خروج" : "Logout") : t.logout}</Button>
          </div>
        </div>
      </Card>


      {sidebarOpen && (
        <div style={ui.sidebarOverlay} onClick={() => setSidebarOpen(false)}>
          <aside style={ui.sidebarPanel} onClick={(e) => e.stopPropagation()}><div style={ui.sidebarGlowTop} /><div style={ui.sidebarGlowBottom} />
            <div style={ui.sidebarTop}>
              <div>
                <div style={ui.sidebarBrand}>{language === "ar" ? "لوحة التحكم" : "Control Panel"}</div>
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
            <SummaryCard title={t.employeeCount} value={totals.employeeCount} icon={Users} subtitle={language === "ar" ? "إجمالي السجلات الظاهرة حسب الصلاحية" : "Visible records based on permissions"} isMobile={isMobileView} />
            <SummaryCard title={t.branchCount} value={totals.branchCount} icon={MapPin} subtitle={language === "ar" ? "إجمالي الفروع الظاهرة" : "Visible branches total"} isMobile={isMobileView} />
          </>
        )}
        <SummaryCard title={t.payrollTotal} value={currency(totals.totalPayroll)} icon={Wallet} subtitle={language === "ar" ? "مجموع الرواتب الظاهرة" : "Visible payroll total"} isMobile={isMobileView} />
        <SummaryCard title={t.leaveTotal} value={totals.totalLeaveBalance} icon={CalendarDays} subtitle={language === "ar" ? "إجمالي الرصيد المتاح" : "Available leave balance"} isMobile={isMobileView} />
        <SummaryCard title={t.advancesTotal} value={currency(totals.totalAdvances)} icon={BadgeInfo} subtitle={language === "ar" ? "مجموع السلف المصروفة" : "Total advances"} isMobile={isMobileView} />
      </div>

      

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
                      <td style={ui.td}>{item.createdAt}</td>
                    </tr>
                  )) : (
                    <tr><td style={ui.emptyCell} colSpan={6}>{language === "ar" ? "لا توجد شكاوي أو طلبات حالياً." : "No complaints or requests yet."}</td></tr>
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
                  <Button onClick={() => setGroupDialogOpen(true)} style={{ ...ui.chatCreateGroupBtn, ...(isMobileView ? ui.chatCreateGroupBtnMobile : {}) }}><UsersRound size={16} /> {t.chatCreateGroup}</Button>
                </div>

                <div style={ui.chatFilterBar}>
                  <button type="button" onClick={() => setChatFilter("all")} style={{ ...ui.chatFilterChip, ...(chatFilter === "all" ? ui.chatFilterChipActive : {}) }}>{t.chatAll}</button>
                  <button type="button" onClick={() => setChatFilter("groups")} style={{ ...ui.chatFilterChip, ...(chatFilter === "groups" ? ui.chatFilterChipActive : {}) }}>{t.chatGroups}</button>
                  <button type="button" onClick={() => setChatFilter("direct")} style={{ ...ui.chatFilterChip, ...(chatFilter === "direct" ? ui.chatFilterChipActive : {}) }}>{t.chatDirect}</button>
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
                          <span style={ui.chatTimeMuted}>{formatChatTime(contact.lastMessage?.sentAt)}</span>
                        </div>
                        <div style={ui.chatMetaLine}>{contact.roleLabel} • {contact.department}</div>
                        <div style={ui.chatSnippet}>{formatChatSnippet(contact.lastMessage)}</div>
                      </div>
                      <div style={ui.chatSideBadges}>
                        {(contact.pinnedBy || []).includes(authUser?.phone) && <span style={ui.chatTinyBadge}>{t.chatPinned}</span>}
                        {(contact.mutedBy || []).includes(authUser?.phone) && <span style={ui.chatTinyBadgeMuted}>{t.chatMuted}</span>}
                        {!!contact.unreadCount && <span style={ui.chatUnreadBubble}>{contact.unreadCount}</span>}
                      </div>
                    </button>

                    {isMobileView && (
                      <button
                        type="button"
                        style={ui.chatContactMenuButton}
                        onClick={() => setContactListMenuChatId((prev) => prev === contact.id ? "" : contact.id)}
                        title={chatLabels.more}
                      >
                        <MoreHorizontal size={18} />
                      </button>
                    )}

                    {isMobileView && contactListMenuChatId === contact.id && (
                      <div style={ui.chatContactMenuPopup}>
                        <button type="button" style={ui.chatContactMenuItem} onClick={() => { toggleChatFlagById(contact.id, "pinnedBy"); setContactListMenuChatId(""); }}>
                          <Pin size={16} /> <span>{t.chatPinned}</span>
                        </button>
                        <button type="button" style={ui.chatContactMenuItem} onClick={() => { toggleChatFlagById(contact.id, "mutedBy"); setContactListMenuChatId(""); }}>
                          <BellOff size={16} /> <span>{t.chatMuted}</span>
                        </button>
                        <button type="button" style={ui.chatContactMenuItem} onClick={() => { setActiveChatId(contact.id); setMobileChatView("conversation"); setChatMoreOpen(true); setContactListMenuChatId(""); }}>
                          <MoreHorizontal size={16} /> <span>{chatLabels.more}</span>
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
                  <div style={{ ...ui.chatHeaderBar, ...(isMobileView ? ui.chatHeaderBarMobile : {}) }}>
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
                      <button type="button" style={ui.chatHeaderIconButton} onClick={() => startChatCall("voice")} title={t.chatStartCall}><PhoneCall size={18} /></button>
                      <button type="button" style={ui.chatHeaderIconButton} onClick={() => startChatCall("video")} title={t.chatStartVideo}><Video size={18} /></button>
                      {!isMobileView && <button type="button" style={ui.chatHeaderIconButton} onClick={toggleActiveChatPin} title={t.chatPinned}><Pin size={18} /></button>}
                      {!isMobileView && <button type="button" style={ui.chatHeaderIconButton} onClick={toggleActiveChatMute} title={t.chatMuted}><BellOff size={18} /></button>}
                      {!isMobileView && <button type="button" style={ui.chatHeaderIconButton} onClick={() => setChatMoreOpen(true)} title={chatLabels.more}><MoreHorizontal size={18} /></button>}
                      {!isMobileView && <Badge>{activeConversation.branch}</Badge>}
                    </div>
                  </div>

                  {ongoingCall && ongoingCall.chatId === activeConversation.id && (
                    <div style={ui.chatCallBanner}>
                      <div>
                        <strong>{ongoingCall.mode === "video" ? t.chatStartVideo : t.chatStartCall}</strong>
                        <div style={ui.chatCallBannerSub}>{t.chatCallActive} • {formatChatTime(ongoingCall.startedAt)}</div>
                      </div>
                      <Button variant="danger" onClick={endChatCall} style={ui.smallBtn}>{t.chatEndCall}</Button>
                    </div>
                  )}

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

                  <div style={ui.chatQuickActions}>
                    <button type="button" style={ui.chatAttachButton} title={chatLabels.archive} onClick={toggleActiveChatArchive}><Archive size={18} /></button>
                    <button type="button" style={ui.chatAttachButton} title={chatLabels.markUnread} onClick={toggleActiveChatUnread}><MessageCircle size={18} /></button>
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
                    <button type="button" style={ui.chatComposerEdgeButton} onClick={() => setAttachSheetOpen(true)} title={t.chatAttach}>
                      <Plus size={24} />
                    </button>
                    <input
                      style={ui.chatComposerInput}
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
                    <button type="button" style={ui.chatComposerEdgeButton} onClick={openChatCamera} title={t.chatPhoto}>
                      <Camera size={22} />
                    </button>
                    <button type="button" style={ui.chatComposerEdgeButton} onClick={startVoiceRecording} title={t.chatVoiceNote}>
                      <Mic size={22} />
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
                  <tr><td style={ui.emptyCell} colSpan={6}>{t.noPending}</td></tr>
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
                    <MobileFieldRow label={t.amount} value={currency(req.amount)} />
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
                        <td style={ui.td}>{currency(req.amount)}</td>
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
        authUser?.role === "employee" ? (
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
              description={language === "ar" ? "عرض الاسم، الفرع، رقم الهاتف، والإدارة فقط. اضغط على الصف لعرض نافذة التفاصيل." : "Show only name, branch, phone, and department. Click the row to open a details modal."}
            />

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
            <SectionHeader icon={Briefcase} title={t.salaryData} description={t.salaryDataDesc} isMobile={isMobileView} />
            {isMobileView ? (
              <div style={ui.mobileCardsStack}>
                {filteredEmployees.map((emp) => {
                  const net = Number(emp.salary || 0) - Number(emp.advance || 0);
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
                      const net = Number(emp.salary || 0) - Number(emp.advance || 0);
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
          <Field label={t.department}><Input value={form.department} onChange={(e) => setForm((p) => ({ ...p, department: e.target.value }))} /></Field>
          <Field label={t.managerDepartment}><Input value={form.managerDepartment} onChange={(e) => setForm((p) => ({ ...p, managerDepartment: e.target.value }))} /></Field>
          <Field label={t.password}><Input type="password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} /></Field>
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
            </Select>
          </Field>
          <Field label={t.fromHour}><Input type="time" value={form.fromHour} onChange={(e) => setForm((p) => ({ ...p, fromHour: e.target.value }))} /></Field>
          <Field label={t.toHour}><Input type="time" value={form.toHour} onChange={(e) => setForm((p) => ({ ...p, toHour: e.target.value }))} /></Field>
          <Field label={t.employeeDescription} full><Textarea value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} /></Field>
        </div>
        <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}><Button onClick={addEmployee}>{t.saveEmployee}</Button></div>
      </Modal>

      <Modal open={editDialogOpen} title={t.editEmployee} onClose={() => setEditDialogOpen(false)} maxWidth={1000}>
        <div style={{ ...ui.grid2, ...(isMobileView ? ui.grid2Mobile : {}) }}>
          <Field label={t.name}><Input value={editForm.name} onChange={(e) => setEditForm((p) => ({ ...p, name: e.target.value }))} /></Field>
          <Field label={t.department}><Input value={editForm.department} onChange={(e) => setEditForm((p) => ({ ...p, department: e.target.value }))} /></Field>
          <Field label={t.managerDepartment}><Input value={editForm.managerDepartment} onChange={(e) => setEditForm((p) => ({ ...p, managerDepartment: e.target.value }))} /></Field>
          <Field label={t.password}><Input type="password" value={editForm.password} onChange={(e) => setEditForm((p) => ({ ...p, password: e.target.value }))} /></Field>
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
            </Select>
          </Field>
          <Field label={t.fromHour}><Input type="time" value={editForm.fromHour} onChange={(e) => setEditForm((p) => ({ ...p, fromHour: e.target.value }))} /></Field>
          <Field label={t.toHour}><Input type="time" value={editForm.toHour} onChange={(e) => setEditForm((p) => ({ ...p, toHour: e.target.value }))} /></Field>
          <Field label={t.employeeDescription} full><Textarea value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} /></Field>
        </div>
        <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}><Button onClick={saveEmployeeEdit}>{t.saveEdit}</Button></div>
      </Modal>

      <Modal open={completeDialogOpen} title={t.completeEmployee} onClose={() => setCompleteDialogOpen(false)} maxWidth={1000}>
        <div style={{ ...ui.grid2, ...(isMobileView ? ui.grid2Mobile : {}) }}>
          <Field label={t.name}><Input value={completeForm.name} onChange={(e) => setCompleteForm((p) => ({ ...p, name: e.target.value }))} /></Field>
          <Field label={t.department}><Input value={completeForm.department} onChange={(e) => setCompleteForm((p) => ({ ...p, department: e.target.value }))} /></Field>
          <Field label={t.managerDepartment}><Input value={completeForm.managerDepartment} onChange={(e) => setCompleteForm((p) => ({ ...p, managerDepartment: e.target.value }))} /></Field>
          <Field label={t.password}><Input type="password" value={completeForm.password} onChange={(e) => setCompleteForm((p) => ({ ...p, password: e.target.value }))} /></Field>
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
              <div style={{ width: isMobileView ? "100%" : "auto", display: "flex", justifyContent: isMobileView ? "flex-start" : "flex-end" }}>
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
                  <Button variant="outline" onClick={() => setSalaryDepositDialogOpen(true)}>{t.salaryDeposit}</Button>
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
                <div style={ui.summaryTitle}>{t.currentAdvanceBalance}</div>
                <div style={ui.statementValue}>{currency(statementData.currentAdvanceBalance)}</div>
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
                        action={<Button variant="outline" style={ui.smallBtn} onClick={() => openNotificationDialog(req)}>{t.notification}</Button>}
                      >
                        <MobileFieldRow label={t.amount} value={currency(req.amount)} />
                        <MobileFieldRow label={t.status} value={req.status || "-"} />
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
                            <td style={ui.td}>{currency(req.amount)}</td>
                            <td style={ui.td}>{req.status}</td>
                            <td style={ui.td}>{req.decidedBy || "-"}</td>
                            <td style={ui.td}>{req.createdAt ? new Date(req.createdAt).toLocaleDateString(language === "ar" ? "ar-EG" : "en-US") : "سجل سابق"}</td>
                            <td style={ui.td}>
                              <Button variant="outline" style={ui.smallBtn} onClick={() => openNotificationDialog(req)}>
                                {t.notification}
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr><td style={ui.emptyCell} colSpan={6}>{t.noTransactions}</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </Card>
          </div>
        ) : null}
      </Modal>

      <Modal open={notificationDialogOpen} title={t.notificationDetails} onClose={() => { setNotificationDialogOpen(false); setSelectedNotification(null); }} maxWidth={520}>
        {selectedNotification ? (
          <div style={{ display: "grid", gap: 14 }}>
            <div>
              <div style={ui.label}>{t.statementType}</div>
              <div style={ui.noticeText}>{selectedNotification.type}</div>
            </div>
            <div>
              <div style={ui.label}>{t.notification}</div>
              <div style={ui.noticeText}>{getNotificationContent(selectedNotification)}</div>
            </div>
          </div>
        ) : null}
        <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}>
          <Button variant="outline" onClick={() => { setNotificationDialogOpen(false); setSelectedNotification(null); }}>{t.close}</Button>
        </div>
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
                    <td style={ui.emptyCell} colSpan={6}>
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
          <Field label={t.chatMembers} full>
            <div style={ui.groupMemberGrid}>
              {availableGroupMembers.map((member) => {
                const checked = groupForm.members.includes(member.participants[1]);
                return (
                  <label key={member.id} style={{ ...ui.groupMemberChip, ...(checked ? ui.groupMemberChipActive : {}) }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const value = member.participants[1];
                        setGroupForm((prev) => ({
                          ...prev,
                          members: e.target.checked ? [...prev.members, value] : prev.members.filter((item) => item !== value),
                        }));
                      }}
                    />
                    <span>{member.name}</span>
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

      <Modal open={attachSheetOpen} title={t.chatAttach} onClose={() => setAttachSheetOpen(false)} maxWidth={760}>
        <div style={ui.attachGrid}>
          {[
            { icon: <UserPlus size={28} />, label: chatLabels.contact, onClick: () => setAttachSheetOpen(false) },
            { icon: <MapPin size={28} />, label: chatLabels.location, onClick: () => setAttachSheetOpen(false) },
            { icon: <Camera size={28} />, label: chatLabels.camera, onClick: () => { openChatCamera(); } },
            { icon: <Image size={28} />, label: chatLabels.photos, onClick: () => { sendQuickAttachment("image"); setAttachSheetOpen(false); } },
            { icon: <Sparkles size={28} />, label: chatLabels.aiImages, onClick: () => setAttachSheetOpen(false) },
            { icon: <CalendarDays size={28} />, label: chatLabels.event, onClick: () => setAttachSheetOpen(false) },
            { icon: <BadgeInfo size={28} />, label: chatLabels.poll, onClick: () => setAttachSheetOpen(false) },
            { icon: <FileText size={28} />, label: chatLabels.document, onClick: () => { sendQuickAttachment("file"); setAttachSheetOpen(false); } },
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
          <button type="button" style={ui.actionMenuItem} onClick={() => { toggleActiveChatArchive(); setChatMoreOpen(false); }}><Archive size={18} /> <span>{(activeConversation?.archivedBy || []).includes(authUser?.phone) ? chatLabels.unarchive : chatLabels.archive}</span></button>
          <button type="button" style={ui.actionMenuItem} onClick={() => { toggleActiveChatUnread(); setChatMoreOpen(false); }}><MessageCircle size={18} /> <span>{chatLabels.markUnread}</span></button>
          <button type="button" style={ui.actionMenuItem} onClick={clearActiveChatMessages}><Trash2 size={18} /> <span>{chatLabels.clearChat}</span></button>
          {activeConversation?.type === "group" && <button type="button" style={{ ...ui.actionMenuItem, ...ui.actionMenuDanger }} onClick={leaveCurrentGroup}><LogOut size={18} /> <span>{chatLabels.leaveGroup}</span></button>}
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
        </div>
      </Modal>

      <Modal open={passwordDialogOpen} title={t.changePassword} onClose={() => setPasswordDialogOpen(false)} maxWidth={520}>
        {!authUser?.mustChangePassword && (
          <Field label={t.currentPassword}>
            <Input type="password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, currentPassword: e.target.value }))} />
          </Field>
        )}
        <Field label={t.newPassword}>
          <Input type="password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, newPassword: e.target.value }))} />
        </Field>
        <Field label={t.confirmPassword}>
          <Input type="password" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm((p) => ({ ...p, confirmPassword: e.target.value }))} />
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

      <Modal open={salaryDepositDialogOpen} title={t.salaryDeposit} onClose={() => setSalaryDepositDialogOpen(false)} maxWidth={560}>
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
        <Field label={t.deductionAmount}><Input type="number" value={salaryDepositForm.deductionAmount} onChange={(e) => setSalaryDepositForm((p) => ({ ...p, deductionAmount: e.target.value }))} /></Field>
        <Field label={t.deductionReason}><Textarea value={salaryDepositForm.deductionReason} onChange={(e) => setSalaryDepositForm((p) => ({ ...p, deductionReason: e.target.value }))} /></Field>
        <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}><Button onClick={submitSalaryDeposit}>{t.salaryDeposit}</Button></div>
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
        <Field label={t.amount}><Input type="number" value={rewardRequestForm.amount} onChange={(e) => setRewardRequestForm((p) => ({ ...p, amount: e.target.value }))} /></Field>
        <Field label={t.reason}><Textarea value={rewardRequestForm.reason} onChange={(e) => setRewardRequestForm((p) => ({ ...p, reason: e.target.value }))} /></Field>
        <div style={{ ...ui.modalActions, ...(isMobileView ? ui.modalActionsMobile : {}) }}><Button onClick={submitRewardRequest}>{canManageAll ? t.rewardOrDeduction : t.requestReward}</Button></div>
      </Modal>
    </div>
  );
}

const ui = {
  appShell: {
    minHeight: "100vh",
    padding: 20,
    background: "var(--bg)",
    display: "grid",
    gap: 18,
    boxSizing: "border-box",
    width: "100%",
    maxWidth: 1280,
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
    borderRadius: 20,
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
    borderRadius: 20,
  },
  summaryValueMobile: {
    fontSize: 18,
  },
  cardMobile: {
    padding: 14,
    borderRadius: 22,
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
    borderRadius: 24,
    padding: 20,
    boxShadow: "var(--shadow)",
    overflow: "hidden",
    maxWidth: "100%",
  },
  innerCard: {
    padding: 18,
    borderRadius: 16,
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
  phoneWrap: {
    width: 56,
    height: 56,
    margin: "0 auto 12px",
    borderRadius: 16,
    background: "var(--primary)",
    color: "var(--primary-contrast)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  authActions: {
    display: "grid",
    gap: 10,
    marginTop: 16,
  },
  demoBox: {
    marginTop: 20,
    padding: 16,
    borderRadius: 18,
    background: "var(--surface-muted)",
    border: "1px solid var(--border)",
    lineHeight: 1.9,
  },
  demoTitle: {
    margin: "0 0 12px",
    fontWeight: 800,
  },
  heroCard: {
    padding: 28,
  },
  heroRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    flexWrap: "wrap",
    alignItems: "flex-start",
  },
  heroActions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
  },
  cloudStatusBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 42,
    padding: "0 14px",
    borderRadius: 999,
    border: "1px solid var(--border)",
    background: "var(--surface-soft)",
    color: "var(--text-soft)",
    fontSize: 13,
    fontWeight: 700,
  },
  heroBadge: {
    display: "inline-flex",
    gap: 8,
    alignItems: "center",
    border: "1px solid var(--border)",
    background: "var(--surface-soft)",
    borderRadius: 999,
    padding: "10px 14px",
    marginBottom: 16,
    fontSize: 14,
    fontWeight: 700,
  },
  heroTitle: {
    margin: 0,
    fontSize: "clamp(32px, 5vw, 64px)",
    lineHeight: 1.1,
    color: "var(--text)",
  },
  heroDesc: {
    margin: "16px 0 0",
    color: "var(--text-soft)",
    fontSize: 16,
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
    borderRadius: 16,
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
    gap: 14,
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
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
    marginTop: 8,
    fontSize: 26,
    fontWeight: 900,
    color: "var(--text)",
  },
  summarySubtitle: {
    marginTop: 8,
    color: "var(--text-muted)",
    fontSize: 14,
    lineHeight: 1.7,
  },
  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
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
    borderRadius: 18,
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
    borderRadius: 16,
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
    borderRadius: 18,
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
    borderRadius: 12,
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
    borderRadius: 12,
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
  textarea: {
    width: "100%",
    minHeight: 120,
    borderRadius: 12,
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
    borderRadius: 12,
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
    borderColor: "#cbd5e1",
  },
  buttonDanger: {
    background: "#dc2626",
    color: "var(--primary-contrast)",
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
    zIndex: 999,
  },
  modalBox: {
    width: "100%",
    maxHeight: "92vh",
    overflow: "auto",
    background: "var(--surface-soft)",
    borderRadius: 24,
    border: "1px solid var(--border)",
    boxShadow: "0 30px 80px rgba(0,0,0,0.22)",
  },
  modalHeader: {
    padding: 18,
    borderBottom: "1px solid var(--border)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(255,255,255,0.02)",
  },
  modalBody: {
    padding: 20,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
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
    borderRadius: 18,
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
    borderRadius: 14,
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
    background: "linear-gradient(180deg, rgba(255,247,237,0.72) 0%, rgba(255,237,213,0.68) 55%, rgba(255,248,240,0.76) 100%)",
    backdropFilter: "blur(22px)",
    color: "#7c2d12",
    borderLeft: "1px solid rgba(251,146,60,0.24)",
    boxShadow: "-24px 0 60px rgba(251,146,60,0.14)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },
  sidebarTop: {
    padding: "18px 18px 16px",
    borderBottom: "1px solid rgba(251,146,60,0.18)",
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
    color: "#9a3412",
    marginBottom: 6,
  },
  sidebarSubbrand: {
    fontSize: 24,
    fontWeight: 900,
    color: "#7c2d12",
    lineHeight: 1.2,
  },
  sidebarCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    border: "1px solid rgba(251,146,60,0.25)",
    background: "rgba(255,255,255,0.42)",
    color: "#7c2d12",
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
    color: "#9a3412",
    letterSpacing: "0.02em",
    textTransform: "uppercase",
    paddingInline: 6,
  },
  sidebarItem: {
    width: "100%",
    minHeight: 52,
    padding: "0 14px",
    borderRadius: 16,
    border: "1px solid transparent",
    background: "transparent",
    color: "#7c2d12",
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
    background: "rgba(251, 146, 60, 0.18)",
    borderColor: "rgba(251, 146, 60, 0.35)",
    color: "#c2410c",
  },

  chatLayoutMobile: {
    gridTemplateColumns: "minmax(0, 1fr)",
    gap: 12,
  },
  chatSidebarMobile: {
    minHeight: "auto",
    maxHeight: "none",
    borderRadius: 22,
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
    borderRadius: 22,
  },
  chatHeaderBarMobile: {
    padding: "14px 12px",
    flexDirection: "column",
    alignItems: "stretch",
    gap: 12,
  },
  chatHeaderToolsMobile: {
    gap: 8,
    justifyContent: "flex-start",
    flexWrap: "nowrap",
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
    borderRadius: 12,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--text-soft)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  chatContactMenuPopup: {
    position: "absolute",
    left: 10,
    top: 52,
    width: 150,
    borderRadius: 16,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    boxShadow: "var(--shadow)",
    padding: 8,
    display: "grid",
    gap: 6,
    zIndex: 5,
  },
  chatContactMenuItem: {
    border: "none",
    background: "transparent",
    borderRadius: 12,
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
  },
  mobileDataCard: {
    padding: 16,
    borderRadius: 22,
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
    padding: 10,
  },
  chatHeaderBackButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
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
    borderRadius: 26,
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
    borderRadius: 16,
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
    background: "linear-gradient(135deg, rgba(37,211,102,0.16), rgba(0,136,204,0.16))",
    color: "var(--text)",
    borderColor: "rgba(37,211,102,0.35)",
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
    borderRadius: 20,
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
    background: "linear-gradient(135deg, #25d366, #0088cc)",
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
    borderRadius: 28,
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
    background: "linear-gradient(135deg, rgba(37,211,102,0.10), rgba(0,136,204,0.12))",
  },
  chatHeaderIdentity: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  chatHeaderIdentityMobile: {
    display: "grid",
    gridTemplateColumns: "40px 56px minmax(0,1fr)",
    alignItems: "center",
    gap: 10,
    width: "100%",
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
    borderRadius: 14,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    color: "var(--text-soft)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },
  chatCallBanner: {
    margin: "14px 16px 0",
    padding: "14px 16px",
    borderRadius: 18,
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
    borderRadius: 22,
    padding: "12px 14px",
    boxShadow: "var(--shadow)",
    border: "1px solid var(--border)",
  },
  chatBubbleMine: {
    background: "linear-gradient(135deg, rgba(37,211,102,0.18), rgba(0,136,204,0.18))",
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
    borderRadius: 18,
    display: "block",
    border: "1px solid rgba(15,23,42,0.08)",
  },
  chatVoicePlayer: {
    marginTop: 8,
    padding: 10,
    borderRadius: 18,
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
    background: "linear-gradient(135deg, #25d366, #128c7e)",
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
    borderRadius: 16,
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
    borderRadius: 18,
    border: "1px solid var(--border)",
    background: "var(--surface-soft)",
    color: "var(--text)",
    padding: "0 16px",
    fontSize: 15,
    outline: "none",
  },
  chatSendButton: {
    width: 56,
    height: 56,
    minWidth: 56,
    borderRadius: 18,
    border: "none",
    background: "linear-gradient(135deg, #25d366, #0088cc)",
    color: "#fff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 16px 32px rgba(0, 136, 204, 0.24)",
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
    borderRadius: 14,
    background: "rgba(239,68,68,0.1)",
    border: "1px solid rgba(239,68,68,0.2)",
    color: "#b91c1c",
    lineHeight: 1.8,
  },
  cameraPreviewBox: {
    width: "100%",
    minHeight: 320,
    borderRadius: 20,
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
    borderRadius: 18,
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
    borderRadius: 16,
    border: "1px solid var(--border)",
    background: "var(--surface-soft)",
    cursor: "pointer",
  },
  groupMemberChipActive: {
    borderColor: "rgba(37,211,102,0.35)",
    background: "rgba(37,211,102,0.12)",
  },
  sidebarItemIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
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
    borderRadius: 18,
    border: "none",
    background: "transparent",
    color: "var(--text)",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
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
    borderRadius: 18,
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
  contactActionBox: { display: "grid", gap: 8, justifyItems: "center", padding: "18px 12px", borderRadius: 22, border: "1px solid var(--border)", background: "var(--surface-soft)", color: "#22c55e", cursor: "pointer" },
  infoList: { display: "grid", gap: 10 },
  infoRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 18px", borderRadius: 18, background: "var(--surface-soft)", border: "1px solid var(--border)" },
  lockRow: { display: "flex", gap: 12, alignItems: "center", padding: "18px", borderRadius: 18, background: "var(--surface-soft)", border: "1px solid var(--border)" },
  lockSwitch: { minWidth: 56 },
  attachGrid: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 },
  attachOption: { display: "grid", justifyItems: "center", gap: 12, border: "none", background: "transparent", color: "var(--text)", cursor: "pointer", fontSize: 18 },
  attachOptionIcon: { width: 88, height: 88, borderRadius: 999, background: "rgba(15,23,42,0.08)", display: "inline-flex", alignItems: "center", justifyContent: "center" },

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
    border: "1px solid #dbe4f0",
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
    border: "1px solid #dbe4f0",
    borderRadius: 22,
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
    border: "1px solid #dbe4f0",
    background: "#ffffff",
    borderRadius: 18,
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
    background: "#fffaf5",
    border: "1px solid #f5d7b4",
    color: "#0f172a",
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
    borderRadius: 20,
  },
  employeeCvMain: {
    display: "grid",
    gap: 18,
    alignContent: "start",
    color: "#0f172a",
  },
  employeeCvName: {
    fontSize: 42,
    fontWeight: 900,
    color: "#1d4f7a",
    lineHeight: 1.15,
  },
  employeeCvSubtitle: {
    color: "#475569",
    fontSize: 22,
    fontWeight: 700,
    marginTop: -2,
  },
  employeeCvLine: {
    width: "100%",
    height: 4,
    borderRadius: 999,
    background: "linear-gradient(90deg, #1d4f7a 0%, #8aa2bd 100%)",
  },
  employeeCvSection: {
    display: "grid",
    gap: 8,
  },
  employeeCvSectionTitle: {
    color: "#1d4f7a",
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
    borderBottom: "1px solid #e8d6c3",
  },
  employeeCvKey: {
    color: "#ea580c",
    fontSize: 17,
    fontWeight: 800,
  },
  employeeCvVal: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: 700,
    lineHeight: 1.9,
  },
  employeeCvDescription: {
    border: "1px solid #ecd8c2",
    borderRadius: 20,
    background: "#ffffff",
    padding: 22,
    minHeight: 150,
    boxSizing: "border-box",
    color: "#0f172a",
    fontSize: 18,
    lineHeight: 2,
  },
  employeeCvSide: {
    background: "linear-gradient(180deg, #fff7ed 0%, #fff1df 100%)",
    borderRadius: 28,
    padding: 22,
    display: "grid",
    gap: 22,
    alignContent: "start",
    border: "1px solid #fed7aa",
    minHeight: 100,
    color: "#0f172a",
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
    color: "#1d4f7a",
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
    color: "#0f172a",
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