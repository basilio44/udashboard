import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend, AreaChart, Area } from "recharts";
import { Shield, Plane, TrendingUp, Home, Globe, Swords, Users, AlertTriangle, ChevronDown, ChevronUp, ExternalLink, Clock, MapPin, Filter, BarChart3, Newspaper, Info, Search } from "lucide-react";

const COLORS = {
  primary: "#1e40af",
  danger: "#dc2626",
  warning: "#f59e0b",
  success: "#16a34a",
  info: "#0891b2",
  purple: "#7c3aed",
  rose: "#e11d48",
  slate: "#475569",
  chart: ["#3b82f6", "#ef4444", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"],
};

const CATEGORIES = [
  { id: "all", label: "Все", icon: Globe, color: COLORS.primary },
  { id: "military", label: "Военная ситуация", icon: Swords, color: COLORS.danger },
  { id: "negotiations", label: "Переговоры", icon: Users, color: COLORS.purple },
  { id: "economy", label: "Экономика", icon: TrendingUp, color: COLORS.success },
  { id: "realestate", label: "Недвижимость", icon: Home, color: COLORS.warning },
  { id: "security", label: "Безопасность", icon: Shield, color: COLORS.rose },
  { id: "tourism", label: "Туризм", icon: MapPin, color: COLORS.info },
  { id: "aviation", label: "Авиасообщение", icon: Plane, color: COLORS.slate },
];

const SOURCES = [
  { id: "ua", label: "Украина", flag: "\ud83c\uddfa\ud83c\udde6", color: "#005bbb" },
  { id: "ru", label: "Россия", flag: "\ud83c\uddf7\ud83c\uddfa", color: "#d52b1e" },
  { id: "eu", label: "Европа", flag: "\ud83c\uddea\ud83c\uddfa", color: "#003399" },
  { id: "us", label: "США", flag: "\ud83c\uddfa\ud83c\uddf8", color: "#3c3b6e" },
];

const newsData = [
  {
    id: 1, category: "military", source: "us",
    title: "Россия запустила 948 дронов за 24 часа — начало весеннего наступления",
    summary: "Россия провела одну из крупнейших воздушных атак с начала войны, запустив 948 дронов за сутки при переброске войск и техники на передовую. Дневные атаки поразили города Ивано-Франковск и Винница.",
    date: "24 марта 2026", sourceLabel: "Al Jazeera",
    url: "https://www.aljazeera.com/news/2026/3/24/russia-hits-ukraine-with-deadly-daytime-barrage-as-spring-offensive-starts",
    impact: "high"
  },
  {
    id: 2, category: "military", source: "ua",
    title: "Украина впервые запускает столько же дальнобойных дронов, сколько Россия",
    summary: "В марте 2026 года число дальнобойных дронов, запущенных Украиной по целям в РФ, впервые сравнялось с числом российских дронов. С января по 18 марта ВСУ провели минимум 110 серий ударных пакетов дронов.",
    date: "18 марта 2026", sourceLabel: "Kyiv Post",
    url: "https://www.kyivpost.com/analysis/72254",
    impact: "high"
  },
  {
    id: 3, category: "military", source: "us",
    title: "Украина вернула 285,6 км² в Александрийском направлении",
    summary: "Февраль 2026 стал первым месяцем с 2024 года, когда Украина отвоевала больше территории, чем потеряла. ВСУ практически полностью освободили Днепропетровскую область.",
    date: "11 марта 2026", sourceLabel: "Russia Matters (Harvard)",
    url: "https://www.russiamatters.org/news/russia-ukraine-war-report-card/russia-ukraine-war-report-card-march-11-2026",
    impact: "medium"
  },
  {
    id: 4, category: "negotiations", source: "us",
    title: "Трамп «взбешён» Путиным, угрожает тарифами на нефть",
    summary: "30 марта Трамп заявил NBC News, что может ввести дополнительные тарифы на российскую нефть, если Путин не пойдёт на сотрудничество в переговорах по прекращению войны в Украине.",
    date: "30 марта 2026", sourceLabel: "NBC News / Al Jazeera",
    url: "https://www.aljazeera.com/news/2026/1/6/ukraine-talks-in-paris-yield-significant-progress-on-security-pledges",
    impact: "high"
  },
  {
    id: 5, category: "negotiations", source: "eu",
    title: "Великобритания и Франция готовы разместить военные базы в Украине",
    summary: "В рамках мирного плана Великобритания и Франция готовы создать «военные хабы» на территории Украины как часть гарантий безопасности. США поддерживают гарантии безопасности для Украины.",
    date: "6 января 2026", sourceLabel: "NPR / Al Jazeera",
    url: "https://www.npr.org/2026/01/06/g-s1-104730/progress-ukraine-talks-paris-uncertain",
    impact: "high"
  },
  {
    id: 6, category: "negotiations", source: "ru",
    title: "Переговоры в Стамбуле: территориальные вопросы — главный камень преткновения",
    summary: "Переговоры на уровне делегаций стартовали 29 марта в Стамбуле. Территориальные споры и статус ЗАЭС являются главными «красными линиями» для обеих сторон. По проекту США, Украина уступает ~2500 кв. миль Донецкой обл.",
    date: "29 марта 2026", sourceLabel: "РБК / Октагон",
    url: "https://www.rbc.ru/politics/31/01/2026/697cc53a9a7947999c7e386e",
    impact: "high"
  },
  {
    id: 7, category: "negotiations", source: "eu",
    title: "Энергетическое перемирие: Россия прекратила удары по энергетике на месяц",
    summary: "После телефонного разговора Трампа и Путина Россия согласилась приостановить удары по энергетической инфраструктуре Украины на один месяц. Обе стороны обвиняют друг друга в нарушениях.",
    date: "18 марта 2026", sourceLabel: "CSIS / New Eastern Europe",
    url: "https://neweasterneurope.eu/2026/03/09/the-us-russia-ukraine-negotiations-architecture-of-tactical-theatre-and-strategic-deception/",
    impact: "medium"
  },
  {
    id: 8, category: "economy", source: "eu",
    title: "ЕБРР: Украина сохраняет макроэкономическую стабильность несмотря на войну",
    summary: "Реальный ВВП Украины прогнозируется на уровне роста 2,5% в 2026 году с увеличением до 4% в 2027. Инфляция ускорилась до 7,6% в феврале 2026. НБУ сохранил ключевую ставку на уровне 15%.",
    date: "29 марта 2026", sourceLabel: "EBRD",
    url: "https://www.ebrd.com/home/news-and-events/news/2026/ukraine-maintains-macroeconomic-stability-despite-war---ebrd-rep.html",
    impact: "medium"
  },
  {
    id: 9, category: "economy", source: "ua",
    title: "Украине нужно $50 млрд внешнего финансирования в 2026 году",
    summary: "Потребность Украины во внешнем финансировании в 2026 году составляет около $50 млрд. Поддержка приходит из международных источников, включая ЕС, МВФ и Всемирный банк.",
    date: "Март 2026", sourceLabel: "Centre for Economic Strategy",
    url: "https://ces.org.ua/en/tracker-economy-during-the-war/",
    impact: "medium"
  },
  {
    id: 10, category: "economy", source: "ua",
    title: "Восстановлено 3,5 ГВт энергетических мощностей из 9 ГВт повреждённых",
    summary: "Украина восстановила 3,5 ГВт генерирующих мощностей ТЭС, ТЭЦ и ГЭС из более чем 9 ГВт, повреждённых российскими ударами. Более двух третей энергетических мощностей были уничтожены или повреждены с осени 2024.",
    date: "Середина марта 2026", sourceLabel: "Укринформ",
    url: "https://www.ukrinform.net/block-lastnews",
    impact: "medium"
  },
  {
    id: 11, category: "realestate", source: "ua",
    title: "Цены на первичном рынке жилья Киева выросли на 3,3% — $2,011/м²",
    summary: "Средняя цена на первичном рынке Киева достигла $2,011/м² (+3,3% за год). Аналитики прогнозируют, что в 2026 году цены не снизятся из-за ограниченного числа новых проектов и роста стоимости стройматериалов.",
    date: "Начало 2026", sourceLabel: "Интерфакс-Украина",
    url: "https://en.interfax.com.ua/news/economic/1131347.html",
    impact: "low"
  },
  {
    id: 12, category: "realestate", source: "ua",
    title: "Рынок недвижимости в фазе адаптации — уже не шок, но до восстановления далеко",
    summary: "Украинский рынок недвижимости в 2026 году находится в состоянии адаптации. Дефицит качественного предложения сохраняется. Рынок уже не в шоке, как в начале войны, но говорить о полном восстановлении рано.",
    date: "Март 2026", sourceLabel: "UA.News / AgroReview",
    url: "https://ua.news/en/ukraine/nerukhomist-v-ukrayini-v-2026-rotsi-kupuvati-chi-chekati",
    impact: "low"
  },
  {
    id: 13, category: "security", source: "us",
    title: "РФ запускает 5200 ракет и дронов в месяц — рост с 3900 в феврале 2025",
    summary: "Российская военная активность выросла: с сентября по декабрь 2025 запускалось ~5200 ракет и дронов в месяц (против 3900 в феврале 2025). За неделю конца марта 2026 — более 3000 дронов, 1450 КАБов и 40 ракет.",
    date: "Март 2026", sourceLabel: "CSIS / Visit Ukraine",
    url: "https://www.csis.org/programs/futures-lab/projects/russian-firepower-strike-tracker-analyzing-missile-attacks-ukraine",
    impact: "high"
  },
  {
    id: 14, category: "security", source: "ua",
    title: "Зеленский предупреждает о дефиците ПВО из-за войны США-Израиль с Ираном",
    summary: "Президент Зеленский предупредил, что Украина, зависящая от систем ПВО США для защиты от баллистических ракет, столкнётся с дефицитом ракет-перехватчиков, пока Вашингтон сосредоточен на ирано-израильском конфликте.",
    date: "Март 2026", sourceLabel: "President.gov.ua",
    url: "https://www.president.gov.ua/en/news/all",
    impact: "high"
  },
  {
    id: 15, category: "security", source: "eu",
    title: "Рекордные 67% россиян поддерживают мирные переговоры",
    summary: "В России рекордные 67% поддерживают мирные переговоры. На Украине только 25% верят, что текущие переговоры приведут к прочному миру. Общественное мнение обеих стран расходится.",
    date: "Март 2026", sourceLabel: "ReliefWeb / Исследования",
    url: "https://reliefweb.int/report/ukraine/ukraine-war-situation-update-28-february-6-march-2026",
    impact: "medium"
  },
  {
    id: 16, category: "tourism", source: "ua",
    title: "Безопасные регионы для туристов: обновлённый рейтинг 2026",
    summary: "Относительно безопасными для туризма в 2026 году являются Закарпатская, Львовская, Ивано-Франковская и Черновицкая области. Работают отели, рестораны, музеи и культурные учреждения.",
    date: "Март 2026", sourceLabel: "Visit Ukraine",
    url: "https://visitukraine.today/blog/8073/safe-regions-of-ukraine-updated-rating-for-tourists-in-2026",
    impact: "low"
  },
  {
    id: 17, category: "tourism", source: "us",
    title: "США, Великобритания, Канада: рекомендация «не ездить» в Украину сохраняется",
    summary: "Несмотря на внутренний туризм, США, Великобритания, Канада и Австралия по-прежнему не рекомендуют поездки в Украину. Военное положение продолжает действовать. Комендантский час — с 00:00 до 05:00.",
    date: "Март 2026", sourceLabel: "U.S. State Department / GOV.UK",
    url: "https://travel.state.gov/content/travel/en/traveladvisories/traveladvisories/ukraine-travel-advisory.html",
    impact: "medium"
  },
  {
    id: 18, category: "tourism", source: "ua",
    title: "Карпаты и Закарпатье — безопасные направления весны-лета 2026",
    summary: "Портал Visit Ukraine рекомендует малоизвестные места в Карпатах и Закарпатье для путешествий без массового туризма. Въезд для граждан ЕС, США, Канады, Японии, Австралии — без визы до 90 дней.",
    date: "Март 2026", sourceLabel: "Visit Ukraine",
    url: "https://visitukraine.today/blog/8117/safe-travel-in-ukraine-in-springsummer-2026-places-in-the-carpathians-and-transcarpathia-without-crowds-of-tourists",
    impact: "low"
  },
  {
    id: 19, category: "aviation", source: "ua",
    title: "Украина готовится открыть воздушное пространство — создана спецкомиссия",
    summary: "18 марта правительство перешло от планирования к практической подготовке: создана экспертная группа для открытия аэропортов Борисполь, Львов и Жуляны. Львов — первый кандидат на открытие.",
    date: "18 марта 2026", sourceLabel: "Visit Ukraine / Airline Ratings",
    url: "https://visitukraine.today/blog/8075/ukraine-is-preparing-to-reopen-its-airports-a-special-commission-has-been-set-up",
    impact: "high"
  },
  {
    id: 20, category: "aviation", source: "eu",
    title: "Для перезапуска рейсов из Львова/Борисполя нужно 45-50 дней",
    summary: "По словам министра развития Алексея Кулебы, для перезапуска рейсов из Львова или Борисполя потребуется 45-50 дней. Интеграция военной защиты в гражданское УВД может позволить первый рейс до летнего солнцестояния 2026.",
    date: "Март 2026", sourceLabel: "The Traveler / PYOK",
    url: "https://www.thetraveler.org/kyiv-flights-resume-budget-airlines-plans/",
    impact: "medium"
  },
  {
    id: 21, category: "aviation", source: "eu",
    title: "Ryanair готов добавить 5 млн мест и инвестировать $3 млн в Украину",
    summary: "Ryanair заявил о готовности «вернуться» в Украину при первой возможности, добавив до 5 миллионов пассажирских мест в первый год после открытия воздушного пространства и инвестировав $3 млн.",
    date: "Март 2026", sourceLabel: "AeroXplorer / Airlineratings",
    url: "https://aeroxplorer.com/articles/ukraine-clears-the-skies-for-passenger-jets-after-four-years.php",
    impact: "medium"
  },
];

// Chart data
const gdpData = [
  { year: "2021", value: 3.4 }, { year: "2022", value: -29.1 },
  { year: "2023", value: 5.3 }, { year: "2024", value: 4.1 },
  { year: "2025", value: 3.0 }, { year: "2026*", value: 2.5 },
];
const inflationData = [
  { month: "Сен 25", value: 8.6 }, { month: "Окт 25", value: 8.2 },
  { month: "Ноя 25", value: 7.9 }, { month: "Дек 25", value: 7.7 },
  { month: "Янв 26", value: 7.4 }, { month: "Фев 26", value: 7.6 },
];
const droneData = [
  { month: "Фев 25", ru: 3900, ua: 1800 }, { month: "Июн 25", ru: 4200, ua: 2500 },
  { month: "Сен 25", ru: 5200, ua: 3400 }, { month: "Дек 25", ru: 5200, ua: 4100 },
  { month: "Мар 26", ru: 5500, ua: 5300 },
];
const realEstateData = [
  { city: "Киев", price: 2011 }, { city: "Львов", price: 1450 },
  { city: "Одесса", price: 1200 }, { city: "Харьков", price: 750 },
  { city: "Днепр", price: 850 },
];
const energyData = [
  { name: "Уничтожено", value: 5.5, color: "#ef4444" },
  { name: "Восстановлено", value: 3.5, color: "#22c55e" },
];
const publicOpinionData = [
  { name: "За переговоры (РФ)", value: 67, color: "#d52b1e" },
  { name: "Верят в мир (УА)", value: 25, color: "#005bbb" },
];
const territoryData = [
  { period: "27 янв — 24 фев", ru_gain: 50, ua_gain: 0 },
  { period: "24 фев — 24 мар", ru_gain: 0, ua_gain: 4 },
];

const ImpactBadge = ({ level }) => {
  const styles = {
    high: "bg-red-100 text-red-700 border-red-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    low: "bg-green-100 text-green-700 border-green-200",
  };
  const labels = { high: "Высокое", medium: "Среднее", low: "Низкое" };
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${styles[level]}`}>
      {labels[level]} влияние
    </span>
  );
};

const NewsCard = ({ item, expanded, onToggle }) => {
  const cat = CATEGORIES.find((c) => c.id === item.category);
  const src = SOURCES.find((s) => s.id === item.source);
  const Icon = cat?.icon || Globe;
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-4 cursor-pointer" onClick={onToggle}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cat?.color + "15" }}>
              <Icon size={18} style={{ color: cat?.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-sm leading-snug">{item.title}</h3>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={11} /> {item.date}
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded-md font-medium" style={{ backgroundColor: src?.color + "15", color: src?.color }}>
                  {src?.flag} {item.sourceLabel}
                </span>
                <ImpactBadge level={item.impact} />
              </div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-gray-600 mt-1 flex-shrink-0">
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          <p className="text-sm text-gray-600 leading-relaxed">{item.summary}</p>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-2 font-medium"
          >
            Источник <ExternalLink size={11} />
          </a>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, subtext, color }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "15" }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <p className="text-lg font-bold text-gray-900">{value}</p>
        {subtext && <p className="text-xs text-gray-400">{subtext}</p>}
      </div>
    </div>
  </div>
);

const ChartCard = ({ title, children, className = "" }) => (
  <div className={`bg-white rounded-xl border border-gray-200 p-4 shadow-sm ${className}`}>
    <h3 className="text-sm font-semibold text-gray-700 mb-3">{title}</h3>
    {children}
  </div>
);

export default function UkraineDashboard() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSource, setActiveSource] = useState("all");
  const [expandedNews, setExpandedNews] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("news");

  const filteredNews = useMemo(() => {
    return newsData.filter((item) => {
      const catMatch = activeCategory === "all" || item.category === activeCategory;
      const srcMatch = activeSource === "all" || item.source === activeSource;
      const searchMatch = !searchQuery || item.title.toLowerCase().includes(searchQuery.toLowerCase()) || item.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return catMatch && srcMatch && searchMatch;
    });
  }, [activeCategory, activeSource, searchQuery]);

  const toggleExpand = (id) => {
    setExpandedNews((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    if (expandedNews.size === filteredNews.length) {
      setExpandedNews(new Set());
    } else {
      setExpandedNews(new Set(filteredNews.map((n) => n.id)));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-yellow-400 rounded-xl flex items-center justify-center">
                <Globe size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Украина: Обзорный дашборд</h1>
                <p className="text-xs text-gray-500">Данные на 30 марта 2026 · Мультиисточниковый анализ</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {["news", "charts"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                    activeTab === tab ? "bg-blue-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {tab === "news" ? <><Newspaper size={13} /> Новости</> : <><BarChart3 size={13} /> Аналитика</>}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <StatCard icon={TrendingUp} label="Рост ВВП (прогноз 2026)" value="+2,5%" subtext="ЕБРР" color={COLORS.success} />
          <StatCard icon={Swords} label="Дронов РФ за неделю" value="3 000+" subtext="+ 1 450 КАБов, 40 ракет" color={COLORS.danger} />
          <StatCard icon={Plane} label="До перезапуска рейсов" value="45-50 дн." subtext="Львов первый" color={COLORS.info} />
          <StatCard icon={Home} label="Цена м² Киев (первичка)" value="$2 011" subtext="+3,3% за год" color={COLORS.warning} />
        </div>

        {activeTab === "charts" ? (
          /* Charts Tab */
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ChartCard title="Динамика ВВП Украины (%, г/г)">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={gdpData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="year" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="value" name="ВВП %">
                      {gdpData.map((entry, i) => (
                        <Cell key={i} fill={entry.value >= 0 ? "#22c55e" : "#ef4444"} radius={[4, 4, 0, 0]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Инфляция (%, м/м)">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={inflationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis domain={[6, 10]} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: "#f59e0b" }} name="Инфляция %" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Дроны: Россия vs Украина (в месяц)">
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={droneData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Area type="monotone" dataKey="ru" name="Россия" fill="#ef444420" stroke="#ef4444" strokeWidth={2} />
                    <Area type="monotone" dataKey="ua" name="Украина" fill="#3b82f620" stroke="#3b82f6" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Цены на недвижимость ($/м², первичка)">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={realEstateData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="city" type="category" tick={{ fontSize: 11 }} width={60} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Bar dataKey="price" name="$/м²" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Энергетика: урон и восстановление (ГВт)">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={energyData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value} ГВт`}>
                      {energyData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Общественное мнение о переговорах (%)">
                <div className="flex items-center justify-center h-48 gap-8">
                  {publicOpinionData.map((item) => (
                    <div key={item.name} className="text-center">
                      <div className="relative w-24 h-24 mx-auto mb-2">
                        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                          <path d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                          <path
                            d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={item.color}
                            strokeWidth="3"
                            strokeDasharray={`${item.value}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold" style={{ color: item.color }}>{item.value}%</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 font-medium max-w-24">{item.name}</p>
                    </div>
                  ))}
                </div>
              </ChartCard>
            </div>

            {/* Key Insights */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-4">
              <div className="flex items-start gap-3">
                <Info size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">Ключевые тенденции (март 2026)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-800">
                    <div className="flex items-start gap-1.5">
                      <span className="text-blue-500 mt-0.5">&#9679;</span>
                      <span>Украина впервые достигла паритета с Россией по дальнобойным дронам</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-blue-500 mt-0.5">&#9679;</span>
                      <span>Переговоры в Стамбуле: территории — главный камень преткновения</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-blue-500 mt-0.5">&#9679;</span>
                      <span>Подготовка к открытию воздушного пространства активно ведётся</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-blue-500 mt-0.5">&#9679;</span>
                      <span>Рынок недвижимости стабилизируется, цены медленно растут</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-blue-500 mt-0.5">&#9679;</span>
                      <span>ВВП +2,5% прогноз — экономика устойчива, но нужно $50 млрд внешней помощи</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-blue-500 mt-0.5">&#9679;</span>
                      <span>Западная Украина развивает туризм, но международные рекомендации — «не ездить»</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* News Tab */
          <>
            {/* Filters */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1 max-w-sm">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Поиск по новостям..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button onClick={expandAll} className="px-3 py-2 text-xs font-medium bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors flex-shrink-0">
                  {expandedNews.size === filteredNews.length ? "Свернуть все" : "Развернуть все"}
                </button>
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                <Filter size={14} className="text-gray-400 flex-shrink-0" />
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                        activeCategory === cat.id
                          ? "text-white shadow-sm"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                      style={activeCategory === cat.id ? { backgroundColor: cat.color } : {}}
                    >
                      <Icon size={13} /> {cat.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Источник:</span>
                <button
                  onClick={() => setActiveSource("all")}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                    activeSource === "all" ? "bg-gray-800 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  Все
                </button>
                {SOURCES.map((src) => (
                  <button
                    key={src.id}
                    onClick={() => setActiveSource(src.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      activeSource === src.id ? "text-white shadow-sm" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                    style={activeSource === src.id ? { backgroundColor: src.color } : {}}
                  >
                    {src.flag} {src.label}
                  </button>
                ))}
              </div>
            </div>

            {/* News Count */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-gray-500">
                Показано <span className="font-semibold text-gray-700">{filteredNews.length}</span> из {newsData.length} новостей
              </p>
            </div>

            {/* News List */}
            <div className="space-y-2">
              {filteredNews.length > 0 ? (
                filteredNews.map((item) => (
                  <NewsCard key={item.id} item={item} expanded={expandedNews.has(item.id)} onToggle={() => toggleExpand(item.id)} />
                ))
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <AlertTriangle size={32} className="mx-auto mb-3" />
                  <p className="text-sm font-medium">Нет новостей по выбранным фильтрам</p>
                  <p className="text-xs mt-1">Попробуйте изменить категорию или источник</p>
                </div>
              )}
            </div>
          </>
        )}

        {/* Footer */}
        <div className="mt-6 mb-4 text-center">
          <p className="text-xs text-gray-400">
            Данные собраны из украинских, российских, европейских и американских источников для обеспечения непредвзятости.
            Обновление: 30 марта 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
