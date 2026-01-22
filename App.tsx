import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Search,
  Map as MapIcon,
  Calendar,
  Clock,
  User,
  Users,
  LayoutGrid,
  Bell,
  Filter,
  Settings,
  QrCode,
  Sparkles,
  MapPin,
  Navigation,
  Trash2,
  X,
  MessageSquare,
  ShieldAlert,
  ChevronRight,
  Moon,
  Sun,
  Phone,
  Mail,
  Globe,
  BellRing,
  BellOff,
  LogOut,
  Plus,
  Send,
  AlertTriangle,
  CheckCircle2,
  Info,
  Camera,
  Edit3,
  Check,
  Save,
  ShieldCheck,
  MailQuestion,
  Lock,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Activity,
  Eye,
  EyeOff,
  UserPlus,
  LogIn,
  ChevronLeft,
  Award,
  Zap,
  Heart,
  Star,
  BarChart3,
  History,
  Timer,
  Trophy,
  Shield,
} from "lucide-react";
import StadiumCard from "./components/StadiumCard";
import BookingModal from "./components/BookingModal";
import AIAssistant from "./components/AIAssistant";
import { STADIUMS } from "./data/mockStadiums";
import { Stadium, Booking, UserRole } from "./types";
import { LOGO, COLORS } from "./constants";

interface AdminRequest {
  id: string;
  userName: string;
  userAvatar: string;
  stadiumName: string;
  timestamp: string;
  status: "pending" | "accepted" | "rejected";
  amount: number;
}

const App: React.FC = () => {
  // Auth State
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSplashing, setIsSplashing] = useState(false);
  const [authStep, setAuthStep] = useState<
    "choice" | "player_choice" | "email" | "code" | "password" | "admin_login"
  >("choice");
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [adminKey, setAdminKey] = useState("");

  // Admin State
  const [adminTab, setAdminTab] = useState<
    "requests" | "analytics" | "history" | "profile"
  >("requests");
  const [adminRequests, setAdminRequests] = useState<AdminRequest[]>([
    {
      id: "R1",
      userName: "Тимур Алиев",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tim",
      stadiumName: "Bunyodkor Field",
      timestamp: "14:20",
      status: "pending",
      amount: 250000,
    },
    {
      id: "R2",
      userName: "Максим Ким",
      userAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
      stadiumName: "Sport Hub",
      timestamp: "14:35",
      status: "pending",
      amount: 350000,
    },
  ]);
  const [analyticsPeriod, setAnalyticsPeriod] = useState<
    "week" | "month" | "year"
  >("month");

  // Simulated System Notification for OTP
  const [emailNotification, setEmailNotification] = useState<{
    from: string;
    subject: string;
    body: string;
  } | null>(null);

  // Simulated User DB
  const [existingUsers, setExistingUsers] = useState<string[]>([
    "demo@fieldmate.e",
    "admin@fieldmate.e",
    "test@mail.ru",
  ]);
  const isExistingUser = useMemo(
    () => existingUsers.includes(email.toLowerCase()),
    [email, existingUsers],
  );

  // App State
  const [activeTab, setActiveTab] = useState("home");
  const [selectedStadium, setSelectedStadium] = useState<Stadium | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilter, setCurrentFilter] = useState("Все");
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [allTransactions, setAllTransactions] = useState<Booking[]>([
    {
      id: "101",
      stadiumName: "Bunyodkor Training Field",
      stadiumImageUrl: "",
      date: "10.05.2025",
      startTime: "18:00",
      duration: 2,
      players: 12,
      totalPrice: 500000,
      status: "completed",
      paymentDetails: { method: "card" },
      userName: "Сардор Алимов",
      commission: 29750,
    },
    {
      id: "102",
      stadiumName: "Pakhtakor Arena Mini",
      stadiumImageUrl: "",
      date: "11.05.2025",
      startTime: "20:00",
      duration: 1,
      players: 10,
      totalPrice: 300000,
      status: "completed",
      paymentDetails: { method: "cash" },
      userName: "Азиз Ибрагимов",
      commission: 17850,
    },
    {
      id: "103",
      stadiumName: "Sport Hub Tashkent",
      stadiumImageUrl: "",
      date: "12.05.2025",
      startTime: "19:00",
      duration: 2,
      players: 14,
      totalPrice: 700000,
      status: "completed",
      paymentDetails: { method: "hybrid" },
      userName: "Тимур Рахимов",
      commission: 41650,
    },
  ]);
  const [showScanner, setShowScanner] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Profile State
  const [userName, setUserName] = useState("Сардор Алимов");
  const [userImage, setUserImage] = useState(
    "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  );
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [tempName, setTempName] = useState(userName);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Settings
  const [language, setLanguage] = useState<"RU" | "EN">("RU");
  const [profileSection, setProfileSection] = useState<
    "main" | "team" | "support" | "settings"
  >("main");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Flows
  const [isConfirmedId, setIsConfirmedId] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const COMMISSION_RATE = 0.0595;

  const t = {
    RU: {
      welcome: "Добро пожаловать в Fieldmat.e",
      roleChoice: "Кто ты сегодня на поле?",
      playerChoice: "Войти или создать аккаунт?",
      player: "Я ИГРОК",
      admin: "Я АДМИН",
      login: "ВХОД В АККАУНТ",
      register: "РЕГИСТРАЦИЯ",
      enterEmail: "Введи свой Email",
      enterCode: "Введи код из письма",
      enterPass: "Придумай пароль (8-12 символов)",
      enterPassLogin: "Введи пароль для входа",
      adminPass: "Секретный код",
      loginBtn: "ПОДТВЕРДИТЬ И ВОЙТИ",
      regBtn: "ЗАВЕРШИТЬ РЕГИСТРАЦИЮ",
      confirmCodeBtn: "ПОДТВЕРДИТЬ КОД",
      sendCodeBtn: "ПРОДОЛЖИТЬ",
      homeTitle: "Твое поле ждет тебя сегодня!",
      searchPlaceholder: "Район, название, метро...",
      filters: ["Все", "Открытые", "Закрытые", "Рядом", "Топ рейтинга"],
      popular: "Популярные площадки",
      offers: "ПРЕДЛОЖЕНИЙ",
      mapTitle: "Карта площадок",
      mapStatus: "Интерактивный поиск в разработке...",
      matches: "Мои матчи",
      emptyHistory: "История пуста",
      profile: "Мой Профиль",
      level: "Уровень: ПРО",
      games: "Игры",
      myTeam: "Моя команда",
      support: "Поддержка",
      settings: "Настройки",
      invite: "ПРИГЛАСИТЬ",
      members: "Участники",
      supportText:
        "Возникли проблемы? Наши операторы помогут в течение 2 минут.",
      callSupport: "ПОЗВОНИТЬ НАМ",
      telegramChat: "TELEGRAM ЧАТ",
      darkMode: "Темный режим",
      languageLabel: "Язык",
      notifications: "Уведомления",
      logout: "ВЫЙТИ ИЗ АККАУНТА",
      gotIt: "ПОНЯТНО",
      scanTitle: "Сканируй QR",
      scanSub: "на ресепшене стадиона",
      reminderTitle: "Напоминание о матче",
      reminderDesc: "Игра через 1.5 часа! Вы подтверждаете участие?",
      confirmBtn: "Подтверждаю участие",
      cancelBtn: "Отменить бронь",
      confirmedStatus: "Участие подтверждено",
      cancelSuccess: "Бронирование отменено",
      confirmSuccess: "Увидимся на поле!",
      saveProfile: "Сохранить",
      reasons: [
        "Травма игрока",
        "Не собрали команду",
        "Личные обстоятельства",
        "Погода",
        "Другое",
      ],
      adminDash: "Панель Управления",
      totalRevenue: "Общая выручка",
      totalCommission: "Комиссия (5.95%)",
      activeGames: "Активные игры",
      transactions: "Журнал транзакций",
      confirmGame: "Подтвердить игру",
      playerCol: "Игрок",
      fieldCol: "Стадион",
      sumCol: "Сумма",
      commCol: "Комиссия",
      noAuth: "Неверный Email или пароль",
      codeSent: "Код подтверждения отправлен на почту!",
      invalidCode: "Неверный 6-значный код",
      regSuccess: "Вы успешно зарегистрированы!",
      loginSuccess: "С возвращением в игру!",
      passError: "Пароль должен быть от 8 до 12 символов",
      passPlaceholder: "От 8 до 12 знаков",
      sentTo: "Код отправлен на адрес:",
      checkEmail: "Введите код безопасности ниже",
      codeHint: "Ваш код: ",
      notRegistered: "Этот email не найден. Сначала зарегистрируйтесь.",
      alreadyRegistered: "Этот email уже зарегистрирован. Пожалуйста, войдите.",
      simEmailFrom: "Безопасность Fieldmat.e",
      simEmailSubject: "Код подтверждения регистрации",
      goBack: "Назад",
      adminHint: "Код: fieldmate",
      editProfile: "Редактировать",
      cancelEdit: "Отмена",
      teamCap: "Капитан",
      teamAttack: "Нападающий",
      teamDef: "Защита",
      teamGoal: "Вратарь",
      on: "ВКЛ",
      off: "ВЫКЛ",
    },
    EN: {
      welcome: "Welcome to Fieldmat.e",
      roleChoice: "Who are you on the field today?",
      playerChoice: "Log In or Create an Account?",
      player: "I AM A PLAYER",
      admin: "I AM ADMIN",
      login: "LOGIN",
      register: "REGISTRATION",
      enterEmail: "Enter your Email",
      enterCode: "Enter code from email",
      enterPass: "Create password (8-12 characters)",
      enterPassLogin: "Enter your password to login",
      adminPass: "Secret Code",
      loginBtn: "CONFIRM AND LOGIN",
      regBtn: "COMPLETE REGISTRATION",
      confirmCodeBtn: "CONFIRM CODE",
      sendCodeBtn: "CONTINUE",
      homeTitle: "Your field is waiting today!",
      searchPlaceholder: "District, name, metro...",
      filters: ["All", "Outdoor", "Indoor", "Nearby", "Top Rated"],
      popular: "Popular Venues",
      offers: "OFFERS",
      mapTitle: "Venue Map",
      mapStatus: "Interactive search in development...",
      matches: "My Matches",
      emptyHistory: "No history yet",
      profile: "My Profile",
      level: "Level: PRO",
      games: "Games",
      myTeam: "My Team",
      support: "Support",
      settings: "Settings",
      invite: "INVITE",
      members: "Members",
      supportText:
        "Having issues? Our team is here to help you within 2 minutes.",
      callSupport: "CALL SUPPORT",
      telegramChat: "TELEGRAM CHAT",
      darkMode: "Dark Mode",
      languageLabel: "Language",
      notifications: "Notifications",
      logout: "LOG OUT ACCOUNT",
      gotIt: "GOT IT",
      scanTitle: "Scan QR",
      scanSub: "at stadium reception",
      reminderTitle: "Match Reminder",
      reminderDesc: "Game in 1.5 hours! Do you confirm attendance?",
      confirmBtn: "Confirm Attendance",
      cancelBtn: "Cancel Booking",
      confirmedStatus: "Attendance Confirmed",
      cancelSuccess: "Booking cancelled",
      confirmSuccess: "See you on the pitch!",
      saveProfile: "Save",
      reasons: [
        "Player Injury",
        "Couldn't gather team",
        "Personal reasons",
        "Weather",
        "Other",
      ],
      adminDash: "Admin Dashboard",
      totalRevenue: "Total Revenue",
      totalCommission: "Commission (5.95%)",
      activeGames: "Active Games",
      transactions: "Transactions Log",
      confirmGame: "Confirm Game",
      playerCol: "Player",
      fieldCol: "Stadium",
      sumCol: "Amount",
      commCol: "Fee",
      noAuth: "Invalid Email or password",
      codeSent: "Confirmation code sent to your email!",
      invalidCode: "Invalid 6-digit code",
      regSuccess: "Successfully registered!",
      loginSuccess: "Welcome back to the pitch!",
      passError: "Password must be 8-12 characters",
      passPlaceholder: "8 to 12 characters",
      sentTo: "Code sent to:",
      checkEmail: "Enter security code below",
      codeHint: "Your code: ",
      notRegistered: "Email not found. Please register first.",
      alreadyRegistered: "Email already exists. Please log in.",
      simEmailFrom: "Fieldmat.e Security",
      simEmailSubject: "Registration confirmation code",
      goBack: "Go Back",
      adminHint: "Code: fieldmate",
      editProfile: "Edit Profile",
      cancelEdit: "Cancel",
      teamCap: "Captain",
      teamAttack: "Forward",
      teamDef: "Defender",
      teamGoal: "Goalkeeper",
      on: "ON",
      off: "OFF",
    },
  }[language];

  // Auth Logic
  const handleAuthStep = () => {
    if (authStep === "email") {
      if (email.includes("@")) {
        if (!isRegistering && !isExistingUser) {
          showToast(t.notRegistered, "error");
          return;
        }
        if (isRegistering && isExistingUser) {
          showToast(t.alreadyRegistered, "error");
          return;
        }
        if (isRegistering) {
          const newCode = Math.floor(
            100000 + Math.random() * 900000,
          ).toString();
          setGeneratedCode(newCode);
          setTimeout(() => {
            setEmailNotification({
              from: t.simEmailFrom,
              subject: t.simEmailSubject,
              body: `${t.codeHint} ${newCode}`,
            });
            setTimeout(() => setEmailNotification(null), 12000);
          }, 800);
          showToast(t.codeSent, "info");
          setAuthStep("code");
        } else {
          setAuthStep("password");
        }
      } else {
        showToast(t.noAuth, "error");
      }
    } else if (authStep === "code") {
      if (code === generatedCode) {
        setAuthStep("password");
      } else {
        showToast(t.invalidCode, "error");
      }
    } else if (authStep === "password") {
      if (password.length >= 8 && password.length <= 12) {
        if (isRegistering) {
          setExistingUsers((prev) => [...prev, email.toLowerCase()]);
          showToast(t.regSuccess, "success");
        } else {
          showToast(t.loginSuccess, "success");
        }
        setIsSplashing(true);
        setIsAuthenticated(true);
        setUserRole("player");
        setEmailNotification(null);
        setTimeout(() => setIsSplashing(false), 2200);
      } else {
        showToast(t.passError, "error");
      }
    } else if (authStep === "admin_login") {
      if (adminKey === "fieldmate") {
        setIsSplashing(true);
        setIsAuthenticated(true);
        setUserRole("admin");
        showToast(t.loginSuccess, "success");
        setTimeout(() => setIsSplashing(false), 2200);
      } else {
        showToast(t.noAuth, "error");
      }
    }
  };

  const handleBookingConfirm = (bookingData: any) => {
    const commission = bookingData.totalPrice * COMMISSION_RATE;
    const newBooking: Booking = {
      id: Math.random().toString(36).substr(2, 9),
      ...bookingData,
      userName: userName,
      date: new Date().toLocaleDateString(
        language === "RU" ? "ru-RU" : "en-US",
      ),
      status: "pending_confirmation",
      commission,
    };
    setMyBookings((prev) => [newBooking, ...prev]);
    setAllTransactions((prev) => [newBooking, ...prev]);
    setSelectedStadium(null);
    setActiveTab("bookings");
  };

  const handleQRScan = () => {
    const newRequest: AdminRequest = {
      id: Math.random().toString(36).substr(2, 6).toUpperCase(),
      userName: userName,
      userAvatar: userImage,
      stadiumName: "Bunyodkor Field",
      timestamp: new Date().toLocaleTimeString().slice(0, 5),
      status: "pending",
      amount: 250000,
    };
    setAdminRequests((prev) => [newRequest, ...prev]);
    setShowScanner(false);
    showToast(
      language === "RU" ? "Запрос отправлен админу" : "Request sent to admin",
      "success",
    );
  };

  const acceptAdminRequest = (id: string) => {
    setAdminRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "accepted" } : r)),
    );
    showToast(
      language === "RU"
        ? "Мяч в игре! Заезд подтвержден."
        : "Ball in play! Check-in confirmed.",
      "success",
    );
  };

  const confirmGameByAdmin = (id: string) => {
    setAllTransactions((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "completed" } : b)),
    );
    setMyBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: "completed" } : b)),
    );
    showToast(
      language === "RU"
        ? "Игра успешно завершена"
        : "Game successfully finished",
      "success",
    );
  };

  const showToast = (message: string, type: "success" | "error" | "info") => {
    setShowNotification({ message, type });
    setTimeout(() => setShowNotification(null), 5000);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setAuthStep("choice");
    setEmail("");
    setCode("");
    setGeneratedCode("");
    setPassword("");
    setAdminKey("");
    setShowPassword(false);
    setIsRegistering(false);
    setEmailNotification(null);
    setProfileSection("main");
  };

  const filteredStadiums = useMemo(() => {
    return STADIUMS.filter((stadium) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        stadium.name.toLowerCase().includes(searchLower) ||
        stadium.address.toLowerCase().includes(searchLower);

      if (currentFilter === "Все" || currentFilter === "All")
        return matchesSearch;
      if (currentFilter === "Открытые" || currentFilter === "Outdoor")
        return matchesSearch && stadium.type === "outdoor";
      if (currentFilter === "Закрытые" || currentFilter === "Indoor")
        return matchesSearch && stadium.type === "indoor";
      if (currentFilter === "Топ рейтинга" || currentFilter === "Top Rated")
        return matchesSearch && stadium.rating >= 4.7;

      return matchesSearch;
    });
  }, [searchQuery, currentFilter]);

  // Admin View
  if (userRole === "admin") {
    const totalRev = allTransactions.reduce((acc, b) => acc + b.totalPrice, 0);
    const totalComm = allTransactions.reduce(
      (acc, b) => acc + (b.commission || 0),
      0,
    );

    return (
      <div
        className={`min-h-screen max-w-lg mx-auto bg-merino pb-24 relative overflow-x-hidden`}
      >
        <header className="p-8 flex justify-between items-center bg-lunar-green text-white rounded-b-[45px] shadow-2xl border-b-8 border-pale-olive">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-pale-olive rounded-2xl flex items-center justify-center shadow-lg">
              {adminTab === "requests" ? (
                <Timer className="w-7 h-7 text-lunar-green" />
              ) : adminTab === "analytics" ? (
                <BarChart3 className="w-7 h-7 text-lunar-green" />
              ) : adminTab === "history" ? (
                <History className="w-7 h-7 text-lunar-green" />
              ) : (
                <User className="w-7 h-7 text-lunar-green" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-black italic uppercase tracking-tighter">
                {adminTab === "requests"
                  ? "Запросы"
                  : adminTab === "analytics"
                    ? "Аналитика"
                    : adminTab === "history"
                      ? "История"
                      : "Профиль"}
              </h1>
              <p className="text-[8px] font-black uppercase tracking-widest opacity-60">
                Control Panel • Tashkent
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </header>

        <main className="p-6 space-y-6">
          {adminTab === "requests" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-lunar-green border-b-2 border-pale-olive inline-block pb-1">
                  Живая очередь (QR)
                </h3>
                <span className="bg-lunar-green text-pale-olive px-3 py-1 rounded-full text-[10px] font-black animate-pulse">
                  LIVE
                </span>
              </div>

              <div className="space-y-4">
                {adminRequests.filter((r) => r.status === "pending").length ===
                0 ? (
                  <div className="py-20 text-center space-y-4">
                    <div className="w-24 h-24 bg-white border-2 border-dashed border-pale-olive rounded-full flex items-center justify-center mx-auto opacity-30">
                      <QrCode className="w-12 h-12 text-lunar-green" />
                    </div>
                    <p className="font-black uppercase text-[10px] tracking-widest text-lunar-green/30 italic">
                      Ожидайте новых сканирований
                    </p>
                  </div>
                ) : (
                  adminRequests
                    .filter((r) => r.status === "pending")
                    .map((request) => (
                      <div
                        key={request.id}
                        className="bg-white p-6 rounded-[40px] border-4 border-lunar-green shadow-xl flex flex-col gap-4 animate-in slide-in-from-right-10 duration-500"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-4">
                            <img
                              src={request.userAvatar}
                              className="w-14 h-14 rounded-2xl border-2 border-pale-olive shadow-md"
                            />
                            <div>
                              <h4 className="font-black uppercase text-sm text-lunar-green">
                                {request.userName}
                              </h4>
                              <p className="text-[9px] font-black uppercase text-lunar-green/40">
                                {request.timestamp} • {request.stadiumName}
                              </p>
                            </div>
                          </div>
                          <div className="bg-pale-olive/20 px-3 py-1 rounded-xl text-[9px] font-black text-lunar-green uppercase tracking-widest">
                            {request.amount.toLocaleString()} сум
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => acceptAdminRequest(request.id)}
                            className="flex-[2] bg-lunar-green text-white py-5 rounded-2xl font-black text-[11px] uppercase shadow-lg active:scale-95 flex items-center justify-center gap-2"
                          >
                            <Trophy className="w-4 h-4 text-pale-olive" />{" "}
                            ПРИНЯТЬ МЯЧ
                          </button>
                          <button
                            onClick={() =>
                              setAdminRequests((prev) =>
                                prev.filter((r) => r.id !== request.id),
                              )
                            }
                            className="flex-1 bg-white border-2 border-red-500/20 text-red-500 py-5 rounded-2xl font-black text-[11px] uppercase active:scale-95 flex items-center justify-center gap-2"
                          >
                            <X className="w-4 h-4" /> ОТКАЗАТЬ
                          </button>
                        </div>
                      </div>
                    ))
                )}
              </div>

              {adminRequests.filter((r) => r.status === "accepted").length >
                0 && (
                <div className="space-y-4 pt-6">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-lunar-green/40 px-2">
                    Сегодня на поле
                  </h3>
                  {adminRequests
                    .filter((r) => r.status === "accepted")
                    .map((request) => (
                      <div
                        key={request.id}
                        className="bg-pale-olive/10 p-5 rounded-[30px] border-2 border-pale-olive/30 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <CheckCircle2 className="w-6 h-6 text-lunar-green" />
                          <div>
                            <p className="text-xs font-black uppercase text-lunar-green">
                              {request.userName}
                            </p>
                            <p className="text-[8px] font-black uppercase opacity-40">
                              Начало в {request.timestamp}
                            </p>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-white rounded-xl transition-all">
                          <MessageSquare className="w-5 h-5 text-lunar-green" />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {adminTab === "analytics" && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex bg-white rounded-[30px] p-2 border-4 border-pale-olive/20 shadow-md">
                {(["week", "month", "year"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setAnalyticsPeriod(p)}
                    className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${analyticsPeriod === p ? "bg-lunar-green text-white shadow-xl" : "text-lunar-green/40"}`}
                  >
                    {p === "week" ? "Неделя" : p === "month" ? "Месяц" : "Год"}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div className="bg-lunar-green p-8 rounded-[40px] border-4 border-pale-olive shadow-2xl relative overflow-hidden group">
                  <DollarSign className="w-10 h-10 text-pale-olive mb-4" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50">
                    {analyticsPeriod === "year"
                      ? "Годовой доход"
                      : "Доход за период"}
                  </p>
                  <p className="text-4xl font-black italic text-white mt-1">
                    {(analyticsPeriod === "year"
                      ? totalRev * 12.4
                      : analyticsPeriod === "week"
                        ? totalRev * 0.25
                        : totalRev
                    ).toLocaleString()}{" "}
                    <span className="text-xs not-italic opacity-40">сум</span>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-[35px] border-4 border-pale-olive shadow-xl">
                    <Activity className="w-6 h-6 text-lunar-green mb-2" />
                    <p className="text-[8px] font-black uppercase text-lunar-green/40">
                      Эффективность
                    </p>
                    <p className="text-2xl font-black italic text-lunar-green">
                      94%
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-[35px] border-4 border-pale-olive shadow-xl">
                    <Users className="w-6 h-6 text-lunar-green mb-2" />
                    <p className="text-[8px] font-black uppercase text-lunar-green/40">
                      Новые игроки
                    </p>
                    <p className="text-2xl font-black italic text-lunar-green">
                      +24
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[40px] border-2 border-pale-olive/20 shadow-lg">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-lunar-green mb-6 border-b-2 border-merino pb-2">
                  Активность площадок
                </h4>
                <div className="flex items-end gap-3 h-32">
                  {[40, 60, 95, 80, 50, 70, 30].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-pale-olive/20 rounded-t-xl relative"
                    >
                      <div
                        className="absolute bottom-0 left-0 right-0 bg-lunar-green rounded-t-xl"
                        style={{ height: `${h}%` }}
                      />
                      <span className="absolute -bottom-6 left-0 right-0 text-[7px] font-black text-center text-lunar-green/40">
                        ПН-ВС
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {adminTab === "history" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-5">
              <div className="flex justify-between items-end px-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-lunar-green border-b-2 border-pale-olive inline-block pb-1">
                  Таблица всех матчей
                </h3>
                <span className="text-[10px] font-black uppercase text-lunar-green/40">
                  ВСЕГО: {allTransactions.length}
                </span>
              </div>

              <div className="bg-white rounded-[35px] shadow-xl border-2 border-pale-olive/20 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-merino border-b-2 border-pale-olive/10">
                        <th className="px-5 py-4 text-[9px] font-black uppercase text-lunar-green/40">
                          Игрок
                        </th>
                        <th className="px-5 py-4 text-[9px] font-black uppercase text-lunar-green/40">
                          Сумма
                        </th>
                        <th className="px-5 py-4 text-[9px] font-black uppercase text-lunar-green/40">
                          Дата
                        </th>
                        <th className="px-5 py-4 text-[9px] font-black uppercase text-lunar-green/40">
                          Статус
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-merino">
                      {allTransactions.map((transaction) => (
                        <tr
                          key={transaction.id}
                          className="hover:bg-merino/50 transition-all cursor-pointer"
                        >
                          <td className="px-5 py-4">
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-lunar-green uppercase truncate max-w-[80px]">
                                {transaction.userName}
                              </span>
                              <span className="text-[8px] opacity-40 uppercase truncate max-w-[80px]">
                                {transaction.stadiumName}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-xs font-black text-lunar-green">
                              {transaction.totalPrice.toLocaleString()}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-[10px] font-black text-lunar-green/60 uppercase">
                              {transaction.date}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div
                              className={`w-2 h-2 rounded-full ${transaction.status === "completed" ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-yellow-500 animate-pulse"}`}
                            ></div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {adminTab === "profile" && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <div
                className={`p-10 rounded-[50px] relative overflow-hidden shadow-2xl border-4 bg-white border-pale-olive`}
              >
                <div className="flex flex-col items-center gap-6 relative z-10 text-center">
                  <div className="w-32 h-32 rounded-[40px] p-1 shadow-2xl border-4 border-pale-olive bg-merino overflow-hidden">
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
                      className="w-full h-full rounded-[34px] object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-3xl font-black italic tracking-tighter uppercase text-lunar-green">
                      ADMIN PANEL
                    </h3>
                    <div className="inline-block bg-lunar-green text-pale-olive px-6 py-2 rounded-2xl text-[10px] font-black uppercase shadow-md">
                      MASTER ACCESS
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-7 rounded-[35px] border-2 bg-white border-pale-olive/20 shadow-md transition-all active:scale-[0.98]">
                  <div className="flex items-center gap-5">
                    <Shield className="w-7 h-7 text-lunar-green" />
                    <span className="font-black text-sm uppercase tracking-wider text-lunar-green">
                      Настройки доступа
                    </span>
                  </div>
                  <ChevronRight className="w-6 h-6 text-lunar-green/20" />
                </button>
                <button className="w-full flex items-center justify-between p-7 rounded-[35px] border-2 bg-white border-pale-olive/20 shadow-md transition-all active:scale-[0.98]">
                  <div className="flex items-center gap-5">
                    <Settings className="w-7 h-7 text-lunar-green" />
                    <span className="font-black text-sm uppercase tracking-wider text-lunar-green">
                      Параметры комиссий
                    </span>
                  </div>
                  <ChevronRight className="w-6 h-6 text-lunar-green/20" />
                </button>
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-3 p-7 rounded-[35px] border-4 border-red-500/20 text-red-500 font-black text-sm uppercase transition-all active:scale-[0.98] hover:bg-red-500/5"
                >
                  <LogOut className="w-6 h-6" /> ВЫЙТИ ИЗ ПАНЕЛИ
                </button>
              </div>

              <div className="p-8 rounded-[40px] border-4 border-dashed border-pale-olive/40 bg-merino text-center">
                <p className="text-[10px] font-black uppercase text-lunar-green/30 italic">
                  FIELDMAT.E ADMIN v2.5.0-PRO
                  <br />
                  Уровень защиты: ВЫСОКИЙ
                </p>
              </div>
            </div>
          )}
        </main>

        <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white border-t-4 border-pale-olive p-4 flex justify-around items-center z-50 rounded-t-[45px] shadow-[0_-20px_60px_rgba(0,0,0,0.1)]">
          <button
            onClick={() => setAdminTab("requests")}
            className={`flex flex-col items-center gap-1 transition-all ${adminTab === "requests" ? "text-lunar-green scale-110" : "text-lunar-green/30"}`}
          >
            <Timer className="w-6 h-6 stroke-[3.5px]" />
            <span className="text-[7px] font-black uppercase">Очередь</span>
          </button>
          <button
            onClick={() => setAdminTab("analytics")}
            className={`flex flex-col items-center gap-1 transition-all ${adminTab === "analytics" ? "text-lunar-green scale-110" : "text-lunar-green/30"}`}
          >
            <BarChart3 className="w-6 h-6 stroke-[3.5px]" />
            <span className="text-[7px] font-black uppercase">Отчеты</span>
          </button>
          <button
            onClick={() => setAdminTab("history")}
            className={`flex flex-col items-center gap-1 transition-all ${adminTab === "history" ? "text-lunar-green scale-110" : "text-lunar-green/30"}`}
          >
            <History className="w-6 h-6 stroke-[3.5px]" />
            <span className="text-[7px] font-black uppercase">История</span>
          </button>
          <button
            onClick={() => setAdminTab("profile")}
            className={`flex flex-col items-center gap-1 transition-all ${adminTab === "profile" ? "text-lunar-green scale-110" : "text-lunar-green/30"}`}
          >
            <User className="w-6 h-6 stroke-[3.5px]" />
            <span className="text-[7px] font-black uppercase">Профиль</span>
          </button>
        </nav>
      </div>
    );
  }

  const goBack = () => {
    switch (authStep) {
      case "player_choice":
        setAuthStep("choice");
        break;
      case "email":
        setAuthStep("player_choice");
        break;
      case "code":
        setAuthStep("email");
        setEmailNotification(null);
        break;
      case "password":
        if (isRegistering) setAuthStep("code");
        else setAuthStep("email");
        break;
      case "admin_login":
        setAuthStep("choice");
        break;
      default:
        setAuthStep("choice");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setUserImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    setUserName(tempName);
    setIsEditingProfile(false);
    showToast(
      language === "RU" ? "Профиль сохранен" : "Profile saved",
      "success",
    );
  };

  const confirmAttendance = (id: string) => {
    setIsConfirmedId(id);
    setMyBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: "completed" as const } : b,
      ),
    );
    showToast(t.confirmSuccess, "success");
  };

  // Splash Screen Overlay
  if (isSplashing) {
    return (
      <div className="fixed inset-0 z-[200] bg-lunar-green flex flex-col items-center justify-center animate-out fade-out duration-1000 delay-1000">
        <div className="animate-logo-bounce mb-8">
          {LOGO(
            "w-40 h-40 shadow-[0_0_60px_rgba(162,197,121,0.4)] rounded-[40px]",
          )}
        </div>
        <div className="text-center animate-in slide-in-from-bottom-10 duration-1000 delay-300">
          <h1 className="text-5xl font-black italic tracking-tighter text-pale-olive uppercase mb-2">
            FIELDMAT.E
          </h1>
          <div className="w-16 h-1.5 bg-pale-olive mx-auto rounded-full"></div>
        </div>
      </div>
    );
  }

  // Auth Layout
  if (!isAuthenticated) {
    return (
      <div
        className={`min-h-screen max-w-lg mx-auto p-8 flex flex-col justify-center animate-in fade-in duration-700 bg-merino relative overflow-hidden`}
      >
        {emailNotification && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[110] w-[90%] max-w-sm bg-white border-l-8 border-lunar-green rounded-2xl shadow-2xl p-5 ios-notification-slide">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <div className="bg-lunar-green p-2 rounded-xl">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-[11px] font-black uppercase text-lunar-green">
                    {emailNotification?.from}
                  </h4>
                  <p className="text-[10px] text-lunar-green/40">
                    {emailNotification?.subject}
                  </p>
                </div>
              </div>
              <button onClick={() => setEmailNotification(null)}>
                <X className="w-4 h-4 text-lunar-green/20" />
              </button>
            </div>
            <p className="text-xl font-black italic tracking-widest text-lunar-green ml-12">
              {emailNotification?.body.split(": ")[1]}
            </p>
          </div>
        )}

        <div className="flex flex-col items-center gap-6 mb-12">
          {LOGO("w-20 h-20 shadow-2xl rounded-[30px]")}
          <div className="text-center">
            <h1 className="text-3xl font-black italic tracking-tighter text-lunar-green uppercase">
              {t.welcome}
            </h1>
            <p className="text-[14px] font-black uppercase tracking-[0.25em] text-lunar-green mt-3">
              {authStep === "choice"
                ? t.roleChoice
                : authStep === "player_choice"
                  ? t.playerChoice
                  : isRegistering
                    ? t.register
                    : t.login}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {authStep === "choice" && (
            <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-bottom-5">
              <button
                onClick={() => {
                  setUserRole("player");
                  setAuthStep("player_choice");
                }}
                className="w-full bg-lunar-green text-white py-8 rounded-[35px] font-black text-xl uppercase shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 border-b-8 border-black/30"
              >
                <User className="w-8 h-8 text-pale-olive" /> {t.player}
              </button>
              <button
                onClick={() => {
                  setUserRole("admin");
                  setAuthStep("admin_login");
                }}
                className="w-full bg-pale-olive text-lunar-green py-8 rounded-[35px] font-black text-xl uppercase shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 border-b-8 border-drab-green/30"
              >
                <ShieldCheck className="w-8 h-8" /> {t.admin}
              </button>
            </div>
          )}

          {authStep === "player_choice" && (
            <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-right-5">
              <button
                onClick={() => {
                  setIsRegistering(false);
                  setAuthStep("email");
                }}
                className="w-full bg-lunar-green text-white py-7 rounded-[30px] font-black text-lg uppercase shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4 border-b-4 border-black/30"
              >
                <LogIn className="w-6 h-6 text-pale-olive" /> {t.login}
              </button>
              <button
                onClick={() => {
                  setIsRegistering(true);
                  setAuthStep("email");
                }}
                className="w-full bg-white text-lunar-green py-7 rounded-[30px] font-black text-lg uppercase shadow-xl active:scale-95 transition-all flex items-center justify-center gap-4 border-4 border-lunar-green/10"
              >
                <UserPlus className="w-6 h-6 text-pale-olive" /> {t.register}
              </button>
            </div>
          )}

          {authStep === "email" && (
            <div className="space-y-6 animate-in slide-in-from-right-5 duration-500">
              <div className="space-y-2">
                <label className="text-[12px] font-black uppercase tracking-widest text-lunar-green ml-4">
                  {t.enterEmail}
                </label>
                <div className="bg-white border-4 border-lunar-green/20 rounded-[30px] p-6 flex items-center gap-4 focus-within:border-lunar-green transition-all shadow-inner">
                  <Mail className="w-6 h-6 text-lunar-green" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@mail.com"
                    className="flex-1 bg-transparent font-black text-lg outline-none placeholder:opacity-20 text-lunar-green"
                    autoFocus
                  />
                </div>
              </div>
              <button
                onClick={handleAuthStep}
                className="w-full bg-lunar-green text-white py-7 rounded-[30px] font-black uppercase shadow-xl active:scale-95 transition-all border-b-4 border-black/30"
              >
                {t.sendCodeBtn}
              </button>
            </div>
          )}

          {authStep === "code" && (
            <div className="space-y-6 animate-in slide-in-from-right-5 duration-500 text-center">
              <div className="space-y-2">
                <label className="text-[12px] font-black uppercase tracking-widest text-lunar-green ml-4">
                  {t.enterCode}
                </label>
                <div className="px-5 py-3 bg-lunar-green/5 rounded-[25px] mb-4 border-2 border-dashed border-lunar-green/10">
                  <p className="text-[10px] font-black text-lunar-green uppercase tracking-widest opacity-60">
                    {t.sentTo}
                  </p>
                  <p className="text-[12px] font-black text-lunar-green italic mt-1">
                    {email}
                  </p>
                </div>
                <div className="bg-white border-4 border-lunar-green/20 rounded-[30px] p-6 flex items-center gap-4 focus-within:border-lunar-green transition-all shadow-inner">
                  <Lock className="w-6 h-6 text-lunar-green" />
                  <input
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="••••••"
                    className="flex-1 w-full bg-transparent font-black text-4xl tracking-[0.4em] text-center outline-none text-lunar-green"
                    autoFocus
                  />
                </div>
              </div>
              <button
                onClick={handleAuthStep}
                className="w-full bg-lunar-green text-white py-7 rounded-[30px] font-black uppercase shadow-xl active:scale-95 transition-all border-b-4 border-black/30"
              >
                {t.confirmCodeBtn}
              </button>
            </div>
          )}

          {authStep === "password" && (
            <div className="space-y-6 animate-in slide-in-from-right-5 duration-500">
              <div className="space-y-2">
                <label className="text-[13px] font-black uppercase tracking-widest text-lunar-green ml-4">
                  {isRegistering ? t.enterPass : t.enterPassLogin}
                </label>
                <div className="bg-white border-4 border-lunar-green/20 rounded-[30px] p-6 flex items-center gap-4 focus-within:border-lunar-green transition-all shadow-inner group relative">
                  <Lock className="w-6 h-6 text-lunar-green" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    maxLength={12}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.passPlaceholder}
                    className="flex-1 bg-transparent font-black text-lg outline-none text-lunar-green"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-3 hover:bg-merino rounded-full transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-6 h-6 text-lunar-green" />
                    ) : (
                      <Eye className="w-6 h-6 text-lunar-green" />
                    )}
                  </button>
                </div>
              </div>
              <button
                onClick={handleAuthStep}
                className="w-full bg-lunar-green text-white py-7 rounded-[30px] font-black uppercase shadow-xl active:scale-95 transition-all border-b-4 border-black/30"
              >
                {isRegistering ? t.regBtn : t.loginBtn}
              </button>
            </div>
          )}

          {authStep === "admin_login" && (
            <div className="space-y-6 animate-in slide-in-from-right-5 duration-500">
              <div className="space-y-4">
                <div>
                  <label className="text-[12px] font-black uppercase tracking-widest text-lunar-green ml-4">
                    Admin Email
                  </label>
                  <div className="bg-white border-4 border-lunar-green/20 rounded-[30px] p-6 flex items-center gap-4 focus-within:border-lunar-green transition-all shadow-inner mt-2">
                    <Mail className="w-6 h-6 text-lunar-green" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@fieldmate.e"
                      className="flex-1 bg-transparent font-black text-lg outline-none text-lunar-green"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[12px] font-black uppercase tracking-widest text-lunar-green ml-4">
                    {t.adminPass}
                  </label>
                  <div className="bg-white border-4 border-lunar-green/20 rounded-[30px] p-6 flex items-center gap-4 focus-within:border-lunar-green transition-all shadow-inner mt-2">
                    <ShieldAlert className="w-6 h-6 text-red-500" />
                    <input
                      type="password"
                      value={adminKey}
                      onChange={(e) => setAdminKey(e.target.value)}
                      placeholder="••••••••"
                      className="flex-1 bg-transparent font-black text-lg outline-none text-lunar-green"
                    />
                  </div>
                </div>
                <p className="text-[9px] font-bold text-lunar-green/30 uppercase tracking-[0.1em] px-5">
                  {t.adminHint}
                </p>
              </div>
              <button
                onClick={handleAuthStep}
                className="w-full bg-pale-olive text-lunar-green py-7 rounded-[30px] font-black uppercase shadow-xl active:scale-95 transition-all border-b-4 border-drab-green/30"
              >
                {t.loginBtn}
              </button>
            </div>
          )}

          {authStep !== "choice" && (
            <button
              onClick={goBack}
              className="w-full flex items-center justify-center gap-2 py-4 text-[13px] font-black uppercase tracking-widest text-lunar-green mt-8 group transition-all"
            >
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="underline underline-offset-4">{t.goBack}</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  // Player Main App
  return (
    <div
      className={`min-h-screen max-w-lg mx-auto pb-28 relative overflow-x-hidden transition-colors duration-500 animate-in fade-in zoom-in-95 duration-1000 ${isDarkMode ? "bg-black" : "bg-merino"}`}
    >
      {showNotification && (
        <div
          className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-top-10 duration-500 border-4 ${showNotification.type === "success" ? "bg-pale-olive border-lunar-green text-lunar-green" : showNotification.type === "info" ? "bg-lunar-green border-pale-olive text-white" : "bg-red-500 border-white text-white"}`}
        >
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            {showNotification.type === "success" ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : showNotification.type === "info" ? (
              <Mail className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
          </div>
          <span className="font-black uppercase text-[10px] tracking-widest text-center">
            {showNotification.message}
          </span>
        </div>
      )}

      {activeTab !== "ai" && (
        <header
          className={`p-4 flex justify-between items-center sticky top-0 z-30 border-b-2 shadow-sm ${isDarkMode ? "bg-lunar-green border-pale-olive/20" : "bg-white border-pale-olive"}`}
        >
          <div className="flex items-center gap-3">
            {LOGO("w-12 h-12")}
            <span
              className={`text-2xl font-black tracking-tighter italic uppercase ${isDarkMode ? "text-pale-olive" : "text-lunar-green"}`}
            >
              FIELDMAT.E
            </span>
          </div>
          <button
            onClick={() => setActiveTab("bookings")}
            className={`relative p-3 rounded-2xl border-2 ${isDarkMode ? "bg-black/40 text-pale-olive border-pale-olive/10" : "bg-merino text-lunar-green border-pale-olive/20"}`}
          >
            <Bell className="w-5 h-5" />
            {myBookings.length > 0 && !isConfirmedId && (
              <span className="absolute top-2.5 right-2.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-bounce"></span>
            )}
          </button>
        </header>
      )}

      <main className="min-h-[calc(100vh-160px)]">
        {activeTab === "home" && (
          <div className="p-4 space-y-6 animate-in fade-in duration-300">
            <section className="space-y-4 pt-4">
              <h1
                className={`text-2xl font-black leading-tight ${isDarkMode ? "text-pale-olive" : "text-lunar-green"}`}
              >
                {t.homeTitle}
              </h1>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <Search
                    className={`h-5 w-5 ${isDarkMode ? "text-pale-olive" : "text-lunar-green"}`}
                  />
                </div>
                <input
                  type="text"
                  className={`block w-full pl-11 pr-12 py-4 border-2 rounded-2xl shadow-sm outline-none transition-all text-sm font-black placeholder-opacity-50 ${isDarkMode ? "bg-lunar-green border-pale-olive/20 text-white placeholder-white/40" : "bg-white border-pale-olive/30 text-lunar-green placeholder-lunar-green/40"}`}
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="absolute inset-y-3 right-3 px-2 bg-pale-olive rounded-xl flex items-center hover:bg-drab-green transition-colors shadow-sm">
                  <Filter className="w-4 h-4 text-white" />
                </button>
              </div>
            </section>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {t.filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setCurrentFilter(filter)}
                  className={`whitespace-nowrap px-6 py-3 rounded-2xl text-xs font-black transition-all border-2 shadow-sm uppercase tracking-wider ${currentFilter === filter ? "bg-lunar-green text-white border-lunar-green" : isDarkMode ? "bg-lunar-green/50 text-pale-olive border-pale-olive/20" : "bg-white text-lunar-green border-pale-olive/30 hover:border-pale-olive"}`}
                >
                  {filter}
                </button>
              ))}
            </div>
            <section>
              <div className="flex justify-between items-end mb-4">
                <h2
                  className={`text-lg font-black uppercase tracking-tighter ${isDarkMode ? "text-white" : "text-lunar-green"}`}
                >
                  {["Все", "All"].includes(currentFilter)
                    ? t.popular
                    : `Раздел: ${currentFilter}`}
                </h2>
                <span
                  className={`text-[10px] font-black bg-pale-olive/30 px-3 py-1.5 rounded-xl uppercase tracking-widest ${isDarkMode ? "text-pale-olive" : "text-lunar-green"}`}
                >
                  {filteredStadiums.length} {t.offers}
                </span>
              </div>
              <div className="space-y-4">
                {filteredStadiums.map((stadium) => (
                  <StadiumCard
                    key={stadium.id}
                    stadium={stadium}
                    onClick={setSelectedStadium}
                    isDarkMode={isDarkMode}
                  />
                ))}
              </div>
            </section>
          </div>
        )}
        {activeTab === "map" && (
          <div className="p-4 space-y-6 animate-in fade-in duration-300">
            <h2
              className={`text-2xl font-black uppercase tracking-tighter italic pt-4 ${isDarkMode ? "text-white" : "text-lunar-green"}`}
            >
              {t.mapTitle}
            </h2>
            <div
              className={`min-h-[calc(100vh-300px)] aspect-[4/5] w-full rounded-[40px] border-4 border-pale-olive/20 relative overflow-hidden flex items-center justify-center ${isDarkMode ? "bg-lunar-green/30" : "bg-merino"}`}
            >
              <div
                style={{
                  position: "relative",
                  overflow: "hidden",
                  height: "100%",
                  width: "100%",
                }}
              >
                <a
                  href="https://yandex.uz/maps/10335/tashkent/search/Stadion/?utm_medium=mapframe&utm_source=maps"
                  style={{
                    color: "#eee",
                    fontSize: 12,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 2,
                    textDecoration: "none",
                  }}
                  target="_blank"
                  rel="noreferrer"
                >
                  Stadion в Ташкенте
                </a>

                {/* <a
                  href="https://yandex.uz/maps/10335/tashkent/?utm_medium=mapframe&utm_source=maps"
                  style={{
                    color: "#eee",
                    fontSize: 12,
                    position: "absolute",
                    top: 14,
                    left: 0,
                    zIndex: 2,
                    textDecoration: "none",
                  }}
                  target="_blank"
                  rel="noreferrer"
                >
                  Ташкент
                </a> */}

                <iframe
                  src="https://yandex.ru/map-widget/v1/?um=constructor%3Aea8f8d5fbe2e8f363a770ed6733cf7ef37f93bbdeda7cc057971095c2b53d40f&amp;source=constructor"
                  width="100%"
                  height="100%"
                  frameborder="0"
                ></iframe>
              </div>
            </div>
          </div>
        )}
        {activeTab === "bookings" && (
          <div className="p-4 space-y-6 animate-in fade-in duration-300">
            <h2
              className={`text-2xl font-black pt-4 uppercase tracking-tighter italic ${isDarkMode ? "text-white" : "text-lunar-green"}`}
            >
              {t.matches}
            </h2>
            {myBookings.length === 0 ? (
              <div className="py-24 text-center space-y-4">
                <div
                  className={`w-28 h-28 rounded-[40px] flex items-center justify-center mx-auto border-4 shadow-inner ${isDarkMode ? "bg-lunar-green border-pale-olive/20" : "bg-white border-pale-olive"}`}
                >
                  <Calendar
                    className={`w-14 h-14 ${isDarkMode ? "text-pale-olive" : "text-lunar-green"}`}
                  />
                </div>
                <p
                  className={`font-black uppercase text-xs tracking-[0.3em] ${isDarkMode ? "text-white/30" : "text-lunar-green/40"}`}
                >
                  {t.emptyHistory}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {myBookings.map((booking, idx) => {
                  const isMostRecent =
                    idx === 0 && booking.status === "pending_confirmation";
                  const isConfirmed =
                    isConfirmedId === booking.id ||
                    booking.status === "completed";
                  return (
                    <div key={booking.id} className="space-y-3">
                      {isMostRecent && !isConfirmed && (
                        <div className="bg-pale-olive p-6 rounded-[35px] shadow-xl border-4 border-lunar-green flex flex-col gap-5 animate-in slide-in-from-top-4 duration-500 group relative">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-lunar-green rounded-2xl flex items-center justify-center shadow-lg">
                              <AlertTriangle className="w-7 h-7 text-pale-olive" />
                            </div>
                            <div>
                              <h4 className="font-black uppercase text-xs tracking-widest text-lunar-green">
                                {t.reminderTitle}
                              </h4>
                              <p className="text-[10px] font-black uppercase opacity-60 text-lunar-green">
                                System Notification
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-bold text-lunar-green leading-relaxed">
                            {t.reminderDesc}
                          </p>
                          <div className="flex gap-3">
                            <button
                              onClick={() => confirmAttendance(booking.id)}
                              className="flex-[2] bg-lunar-green text-white py-5 rounded-2xl font-black text-[11px] uppercase shadow-xl flex items-center justify-center gap-2"
                            >
                              <CheckCircle2 className="w-4 h-4" />{" "}
                              {t.confirmBtn}
                            </button>
                            <button
                              onClick={() =>
                                setMyBookings((prev) =>
                                  prev.filter((b) => b.id !== booking.id),
                                )
                              }
                              className="flex-1 bg-white/50 text-red-600 py-5 rounded-2xl font-black text-[11px] uppercase shadow-md flex items-center justify-center gap-2"
                            >
                              <X className="w-4 h-4" /> {t.cancelBtn}
                            </button>
                          </div>
                        </div>
                      )}
                      <div
                        className={`p-6 rounded-[40px] border-4 shadow-xl flex flex-col gap-5 relative overflow-hidden transform active:scale-[0.99] ${isConfirmed ? "bg-pale-olive/5 border-pale-olive" : isDarkMode ? "bg-lunar-green border-pale-olive/20" : "bg-white border-pale-olive"}`}
                      >
                        {isConfirmed && (
                          <div className="absolute top-0 right-0 bg-pale-olive text-lunar-green px-5 py-2.5 rounded-bl-[25px] flex items-center gap-2 shadow-lg">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              {t.confirmedStatus}
                            </span>
                          </div>
                        )}
                        <div className="flex gap-6 items-center">
                          <img
                            src={booking.stadiumImageUrl}
                            className="w-24 h-24 object-cover rounded-[30px] shadow-xl border-2 border-pale-olive"
                          />
                          <div className="flex-1">
                            <h3
                              className={`font-black text-lg uppercase tracking-tighter leading-tight ${isDarkMode ? "text-white" : "text-lunar-green"}`}
                            >
                              {booking.stadiumName}
                            </h3>
                            <div className="flex flex-col gap-1 mt-2">
                              <div
                                className={`flex items-center gap-2 text-[10px] font-black uppercase ${isDarkMode ? "text-pale-olive" : "text-lunar-green"}`}
                              >
                                <Calendar className="w-4 h-4 text-pale-olive" />{" "}
                                <span>{booking.date}</span>
                              </div>
                              <div
                                className={`flex items-center gap-2 text-[10px] font-black uppercase ${isDarkMode ? "text-pale-olive" : "text-lunar-green"}`}
                              >
                                <Clock className="w-4 h-4 text-pale-olive" />{" "}
                                <span>{booking.startTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        {activeTab === "profile" && (
          <div className="p-4 space-y-8 animate-in fade-in duration-300 pb-12">
            {profileSection !== "main" && (
              <button
                onClick={() => setProfileSection("main")}
                className={`flex items-center gap-2 p-4 rounded-2xl font-black uppercase text-[10px] tracking-widest ${isDarkMode ? "text-pale-olive" : "text-lunar-green"}`}
              >
                <ChevronLeft className="w-5 h-5" /> {t.goBack}
              </button>
            )}
            {profileSection === "main" && (
              <>
                <div className="flex justify-between items-center pt-4">
                  <h2
                    className={`text-2xl font-black uppercase tracking-tighter italic ${isDarkMode ? "text-white" : "text-lunar-green"}`}
                  >
                    {t.profile}
                  </h2>
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all active:scale-95 ${isDarkMode ? "bg-lunar-green border-pale-olive/20 text-pale-olive" : "bg-white border-pale-olive/30 text-lunar-green"}`}
                    >
                      <Edit3 className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {t.editProfile}
                      </span>
                    </button>
                  )}
                </div>
                <div
                  className={`p-10 rounded-[50px] relative overflow-hidden shadow-2xl border-4 transition-all ${isDarkMode ? "bg-lunar-green border-pale-olive/20" : "bg-white border-pale-olive"}`}
                >
                  <div className="flex flex-col items-center gap-6 relative z-10 text-center">
                    <div className="relative group">
                      <div
                        className={`w-32 h-32 rounded-[40px] p-1 shadow-2xl border-4 overflow-hidden ${isDarkMode ? "bg-black border-pale-olive/30" : "bg-merino border-pale-olive"}`}
                      >
                        <img
                          src={userImage}
                          className="w-full h-full rounded-[34px] object-cover"
                        />
                      </div>
                      {isEditingProfile && (
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-black/60 rounded-[40px] flex flex-col items-center justify-center text-white animate-in fade-in duration-300"
                        >
                          <Camera className="w-8 h-8 mb-1" />
                          <span className="text-[8px] font-black uppercase">
                            Изменить
                          </span>
                          <input
                            ref={fileInputRef}
                            type="file"
                            hidden
                            accept="image/*"
                            onChange={handleImageChange}
                          />
                        </button>
                      )}
                    </div>
                    <div className="space-y-2 w-full max-w-xs mx-auto">
                      {isEditingProfile ? (
                        <div className="space-y-1">
                          <label
                            className={`text-[8px] font-black uppercase tracking-widest block text-left ml-2 ${isDarkMode ? "text-pale-olive/60" : "text-lunar-green/60"}`}
                          >
                            Ваше имя
                          </label>
                          <input
                            type="text"
                            value={tempName}
                            onChange={(e) => setTempName(e.target.value)}
                            className={`w-full text-center text-2xl font-black italic tracking-tighter uppercase py-2 bg-white/10 border-b-4 outline-none transition-all ${isDarkMode ? "text-white border-pale-olive" : "text-lunar-green border-pale-olive"}`}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <h3
                          className={`text-3xl font-black italic tracking-tighter uppercase ${isDarkMode ? "text-white" : "text-lunar-green"}`}
                        >
                          {userName}
                        </h3>
                      )}
                      <div className="inline-block bg-pale-olive text-lunar-green px-6 py-2 rounded-2xl text-[10px] font-black uppercase shadow-md">
                        {t.level}
                      </div>
                    </div>
                    {isEditingProfile && (
                      <div className="grid grid-cols-2 gap-3 w-full mt-4">
                        <button
                          onClick={saveProfile}
                          className="bg-lunar-green text-white py-5 rounded-[24px] font-black text-[10px] uppercase flex items-center justify-center gap-2 shadow-xl active:scale-95 transition-all"
                        >
                          <Save className="w-4 h-4" /> {t.saveProfile}
                        </button>
                        <button
                          onClick={() => {
                            setTempName(userName);
                            setIsEditingProfile(false);
                          }}
                          className={`py-5 rounded-[24px] font-black text-[10px] uppercase flex items-center justify-center gap-2 border-2 active:scale-95 transition-all ${isDarkMode ? "bg-black border-pale-olive/30 text-pale-olive" : "bg-white border-pale-olive/20 text-lunar-green"}`}
                        >
                          <X className="w-4 h-4" /> {t.cancelEdit}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div
                    className={`p-8 rounded-[40px] border-4 border-pale-olive text-center shadow-lg ${isDarkMode ? "bg-lunar-green" : "bg-white"}`}
                  >
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isDarkMode ? "text-pale-olive" : "text-lunar-green"}`}
                    >
                      {t.games}
                    </p>
                    <p
                      className={`text-5xl font-black italic tracking-tighter ${isDarkMode ? "text-white" : "text-lunar-green"}`}
                    >
                      42
                    </p>
                  </div>
                </div>
                <div className="space-y-4 pb-12">
                  {[
                    { icon: Users, label: t.myTeam, id: "team" },
                    { icon: MessageSquare, label: t.support, id: "support" },
                    { icon: Settings, label: t.settings, id: "settings" },
                  ].map((item, i) => (
                    <button
                      key={i}
                      onClick={() => setProfileSection(item.id as any)}
                      className={`w-full flex items-center justify-between p-7 rounded-[35px] border-2 group transition-all active:scale-[0.98] ${isDarkMode ? "bg-lunar-green border-pale-olive/10 hover:border-pale-olive" : "bg-white border-pale-olive/20 hover:border-pale-olive shadow-md"}`}
                    >
                      <div className="flex items-center gap-5">
                        <item.icon
                          className={`w-7 h-7 ${isDarkMode ? "text-pale-olive" : "text-lunar-green"}`}
                        />
                        <span
                          className={`font-black text-sm uppercase tracking-wider ${isDarkMode ? "text-white" : "text-lunar-green"}`}
                        >
                          {item.label}
                        </span>
                      </div>
                      <ChevronRight
                        className={`w-6 h-6 transition-transform group-hover:translate-x-1 ${isDarkMode ? "text-pale-olive/30" : "text-lunar-green/30"}`}
                      />
                    </button>
                  ))}
                  <button
                    onClick={logout}
                    className="w-full flex items-center justify-center gap-3 p-7 rounded-[35px] border-4 border-red-500/20 text-red-500 font-black text-sm uppercase transition-all active:scale-[0.98] hover:bg-red-500/5"
                  >
                    <LogOut className="w-6 h-6" />
                    {t.logout}
                  </button>
                </div>
              </>
            )}
            {profileSection === "team" && (
              <div className="space-y-6 animate-in slide-in-from-right-10 duration-500 pb-12">
                <div className="flex justify-between items-center px-2">
                  <h3
                    className={`text-2xl font-black uppercase italic ${isDarkMode ? "text-white" : "text-lunar-green"}`}
                  >
                    {t.myTeam}
                  </h3>
                  <button className="bg-pale-olive text-white p-4 rounded-2xl shadow-lg active:scale-95 animate-pulse">
                    <Plus className="w-6 h-6" />
                  </button>
                </div>
                <div
                  className={`p-8 rounded-[40px] border-4 border-pale-olive flex justify-around text-center shadow-xl ${isDarkMode ? "bg-lunar-green" : "bg-white"}`}
                >
                  <div>
                    <Award className="w-8 h-8 text-yellow-500 mx-auto mb-1" />
                    <p className="text-[10px] font-black uppercase text-lunar-green/40">
                      Победы
                    </p>
                    <p className="text-2xl font-black italic text-lunar-green">
                      12
                    </p>
                  </div>
                  <div className="w-px h-12 bg-pale-olive/20" />
                  <div>
                    <Zap className="w-8 h-8 text-pale-olive mx-auto mb-1" />
                    <p className="text-[10px] font-black uppercase text-lunar-green/40">
                      Сыгранность
                    </p>
                    <p className="text-2xl font-black italic text-lunar-green">
                      89%
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    {
                      name: userName,
                      role: t.teamCap,
                      score: 4.9,
                      img: userImage,
                    },
                    {
                      name: "Азиз Ибрагимов",
                      role: t.teamAttack,
                      score: 4.7,
                      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aziz",
                    },
                    {
                      name: "Максим Кузнецов",
                      role: t.teamDef,
                      score: 4.5,
                      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
                    },
                    {
                      name: "Тимур Рахимов",
                      role: t.teamGoal,
                      score: 4.8,
                      img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Timur",
                    },
                  ].map((player, idx) => (
                    <div
                      key={idx}
                      className={`p-6 rounded-[35px] border-2 flex items-center justify-between shadow-md transition-all hover:scale-[1.02] ${isDarkMode ? "bg-lunar-green border-pale-olive/20" : "bg-white border-pale-olive/10"}`}
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={player.img}
                          className="w-12 h-12 rounded-xl border-2 border-pale-olive shadow-md"
                        />
                        <div>
                          <p
                            className={`font-black uppercase text-xs ${isDarkMode ? "text-white" : "text-lunar-green"}`}
                          >
                            {player.name}
                          </p>
                          <p className="text-[8px] font-black uppercase text-pale-olive/80">
                            {player.role}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 bg-pale-olive/10 px-3 py-1.5 rounded-xl border border-pale-olive/20">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] font-black text-lunar-green">
                          {player.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full bg-lunar-green text-white py-6 rounded-[30px] font-black uppercase text-xs tracking-[0.2em] shadow-xl active:scale-95 border-b-4 border-black/30">
                  {t.invite} {t.members.toUpperCase()}
                </button>
              </div>
            )}
            {profileSection === "support" && (
              <div className="space-y-8 animate-in slide-in-from-right-10 duration-500">
                <div className="text-center space-y-4 py-6">
                  <div
                    className={`w-24 h-24 rounded-[35px] bg-pale-olive flex items-center justify-center mx-auto shadow-2xl border-4 border-white`}
                  >
                    <MessageSquare className="w-12 h-12 text-lunar-green" />
                  </div>
                  <h3
                    className={`text-2xl font-black uppercase italic ${isDarkMode ? "text-white" : "text-lunar-green"}`}
                  >
                    {t.support}
                  </h3>
                  <p
                    className={`text-sm font-bold opacity-60 px-8 ${isDarkMode ? "text-white" : "text-lunar-green"}`}
                  >
                    {t.supportText}
                  </p>
                </div>
                <div className="space-y-4">
                  <button className="w-full bg-[#0088cc] text-white py-8 rounded-[35px] font-black text-lg flex items-center justify-center gap-4 shadow-xl active:scale-95 border-b-8 border-black/20">
                    <Send className="w-8 h-8" /> {t.telegramChat}
                  </button>
                  <button className="w-full bg-lunar-green text-white py-8 rounded-[35px] font-black text-lg flex items-center justify-center gap-4 shadow-xl active:scale-95 border-b-8 border-black/20">
                    <Phone className="w-8 h-8" /> {t.callSupport}
                  </button>
                </div>
                <div
                  className={`p-8 rounded-[40px] border-4 border-dashed border-pale-olive text-center ${isDarkMode ? "bg-lunar-green/30" : "bg-merino"}`}
                >
                  <Activity className="w-8 h-8 text-pale-olive mx-auto mb-2" />
                  <p
                    className={`text-[10px] font-black uppercase tracking-widest ${isDarkMode ? "text-pale-olive" : "text-lunar-green"}`}
                  >
                    Время ожидания ответа:
                  </p>
                  <p
                    className={`text-2xl font-black italic ${isDarkMode ? "text-white" : "text-lunar-green"}`}
                  >
                    ~1.5 минуты
                  </p>
                </div>
              </div>
            )}
            {profileSection === "settings" && (
              <div className="space-y-6 animate-in slide-in-from-right-10 duration-500 pb-12">
                <h3
                  className={`text-2xl font-black uppercase italic px-2 ${isDarkMode ? "text-white" : "text-lunar-green"}`}
                >
                  {t.settings}
                </h3>
                <div
                  className={`p-7 rounded-[40px] border-2 flex items-center justify-between shadow-md ${isDarkMode ? "bg-lunar-green border-pale-olive/20" : "bg-white border-pale-olive/10"}`}
                >
                  <div className="flex items-center gap-4">
                    <Globe
                      className={`w-7 h-7 ${isDarkMode ? "text-pale-olive" : "text-lunar-green"}`}
                    />
                    <span
                      className={`font-black text-sm uppercase ${isDarkMode ? "text-white" : "text-lunar-green"}`}
                    >
                      {t.languageLabel}
                    </span>
                  </div>
                  <div className="flex bg-merino rounded-2xl p-1 border-2 border-pale-olive/20 shadow-inner">
                    {["RU", "EN"].map((l) => (
                      <button
                        key={l}
                        onClick={() => setLanguage(l as any)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${language === l ? "bg-lunar-green text-white shadow-md" : "text-lunar-green/40"}`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
                <div
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-7 rounded-[40px] border-2 flex items-center justify-between shadow-md cursor-pointer transition-all active:scale-[0.98] ${isDarkMode ? "bg-lunar-green border-pale-olive/40" : "bg-white border-pale-olive/10"}`}
                >
                  <div className="flex items-center gap-4">
                    {isDarkMode ? (
                      <Moon className="w-7 h-7 text-pale-olive" />
                    ) : (
                      <Sun className="w-7 h-7 text-yellow-500" />
                    )}
                    <span
                      className={`font-black text-sm uppercase ${isDarkMode ? "text-white" : "text-lunar-green"}`}
                    >
                      {t.darkMode}
                    </span>
                  </div>
                  <div
                    className={`w-14 h-8 rounded-full p-1 transition-all ${isDarkMode ? "bg-pale-olive" : "bg-merino border-2 border-pale-olive/20"}`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full shadow-md transition-transform ${isDarkMode ? "translate-x-6 bg-lunar-green" : "bg-lunar-green/20"}`}
                    />
                  </div>
                </div>
                <div
                  onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                  className={`p-7 rounded-[40px] border-2 flex items-center justify-between shadow-md cursor-pointer transition-all active:scale-[0.98] ${isDarkMode ? "bg-lunar-green border-pale-olive/20" : "bg-white border-pale-olive/10"}`}
                >
                  <div className="flex items-center gap-4">
                    {notificationsEnabled ? (
                      <BellRing className="w-7 h-7 text-pale-olive" />
                    ) : (
                      <BellOff className="w-7 h-7 text-red-500" />
                    )}
                    <span
                      className={`font-black text-sm uppercase ${isDarkMode ? "text-white" : "text-lunar-green"}`}
                    >
                      {t.notifications}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase ${notificationsEnabled ? "text-pale-olive" : "text-red-500"}`}
                  >
                    {notificationsEnabled ? t.on : t.off}
                  </span>
                </div>
                <div
                  className={`p-8 rounded-[40px] border-4 border-pale-olive/20 text-center ${isDarkMode ? "bg-lunar-green/20" : "bg-merino"}`}
                >
                  <ShieldCheck className="w-8 h-8 text-pale-olive mx-auto mb-2" />
                  <p className="text-[9px] font-black uppercase text-lunar-green/40 leading-relaxed italic">
                    Версия приложения: 2.5.0-PRO
                    <br />
                    Безопасность данных подтверждена
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
        <AIAssistant
          active={activeTab === "ai"}
          onScanClick={() => setShowScanner(true)}
          isDarkMode={isDarkMode}
        />
      </main>

      <nav
        className={`fixed bottom-0 left-0 right-0 max-w-lg mx-auto border-t-4 flex justify-around items-center p-4 z-40 rounded-t-[45px] shadow-2xl transition-all duration-500 ${isDarkMode ? "bg-lunar-green border-pale-olive/30" : "bg-white border-pale-olive"}`}
      >
        <button
          onClick={() => {
            setActiveTab("home");
            setProfileSection("main");
          }}
          className={`w-14 h-14 rounded-2xl transition-all flex items-center justify-center ${activeTab === "home" ? "bg-lunar-green text-pale-olive shadow-lg" : isDarkMode ? "text-pale-olive" : "text-lunar-green"}`}
        >
          <LayoutGrid className="w-7 h-7 stroke-[3px]" />
        </button>
        <button
          onClick={() => {
            setActiveTab("map");
            setProfileSection("main");
          }}
          className={`w-14 h-14 rounded-2xl transition-all flex items-center justify-center ${activeTab === "map" ? "bg-lunar-green text-pale-olive shadow-lg" : isDarkMode ? "text-pale-olive" : "text-lunar-green"}`}
        >
          <MapIcon className="w-7 h-7 stroke-[3px]" />
        </button>
        <button
          onClick={() => {
            setActiveTab("ai");
            setProfileSection("main");
          }}
          className={`-translate-y-12 w-24 h-24 rounded-[35px] flex items-center justify-center shadow-2xl border-[8px] ${isDarkMode ? "border-black" : "border-merino"} ${activeTab === "ai" ? "bg-pale-olive scale-110" : "bg-lunar-green"}`}
        >
          {activeTab === "ai" ? (
            <Sparkles className="w-10 h-10 text-white" />
          ) : (
            LOGO("w-14 h-14")
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab("bookings");
            setProfileSection("main");
          }}
          className={`w-14 h-14 rounded-2xl transition-all flex items-center justify-center ${activeTab === "bookings" ? "bg-lunar-green text-pale-olive shadow-lg" : isDarkMode ? "text-pale-olive" : "text-lunar-green"}`}
        >
          <Calendar className="w-7 h-7 stroke-[3px]" />
        </button>
        <button
          onClick={() => {
            setActiveTab("profile");
            setProfileSection("main");
          }}
          className={`w-14 h-14 rounded-2xl transition-all flex items-center justify-center ${activeTab === "profile" ? "bg-lunar-green text-pale-olive shadow-lg" : isDarkMode ? "text-pale-olive" : "text-lunar-green"}`}
        >
          <User className="w-7 h-7 stroke-[3px]" />
        </button>
      </nav>

      {showScanner && (
        <div
          className={`fixed inset-0 z-[60] flex flex-col items-center justify-center p-14 text-center animate-in fade-in duration-500 ${isDarkMode ? "bg-black" : "bg-white"}`}
        >
          <div
            className={`w-80 h-80 border-8 border-pale-olive rounded-[60px] relative overflow-hidden flex items-center justify-center mb-16 shadow-2xl ${isDarkMode ? "bg-lunar-green/40" : "bg-merino"}`}
          >
            <QrCode
              className={`w-36 h-36 opacity-90 animate-pulse ${isDarkMode ? "text-pale-olive" : "text-lunar-green"}`}
            />
            <div
              className={`absolute top-0 left-0 w-full h-2 shadow-[0_0_40px_#2D4636] animate-[scan_3s_infinite] ${isDarkMode ? "bg-pale-olive" : "bg-lunar-green"}`}
            />
          </div>
          <h2
            className={`font-black text-4xl italic uppercase tracking-tighter mb-4 leading-tight ${isDarkMode ? "text-white" : "text-lunar-green"}`}
          >
            {t.scanTitle}
          </h2>
          <button
            onClick={handleQRScan}
            className={`w-full max-w-xs py-6 rounded-[30px] font-black uppercase text-xs shadow-2xl ${isDarkMode ? "bg-pale-olive text-white" : "bg-lunar-green text-white"}`}
          >
            {t.gotIt}
          </button>
          <style>{`@keyframes scan { 0% {top:0%;} 50% {top:100%;} 100% {top:0%;} }`}</style>
        </div>
      )}
      {selectedStadium && (
        <BookingModal
          stadium={selectedStadium}
          onClose={() => setSelectedStadium(null)}
          onConfirm={handleBookingConfirm}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default App;
