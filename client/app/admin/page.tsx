"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Users, FileText, Briefcase, Activity, LogOut, Loader2, Search, MessageSquare, Star, DollarSign, TrendingUp, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from 'recharts';

const SUBSCRIPTION_PRICE = 7; // Assumption for the cost per subscription

interface AdminUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    isSubscribed: boolean;
    createdAt: string;
    resumesCount: number;
    resumes: Array<{ _id: string, title: string }>;
    jobsCount: number;
    activity: number;
}

interface AdminFeedback {
    _id: string;
    comment: string;
    rating: number;
    createdAt: string;
    user?: {
        _id: string;
        name: string;
        email: string;
    };
}

interface AdminData {
    users: AdminUser[];
    totalResumes: number;
    totalJobs: number;
    totalUsers: number;
    feedbacks: AdminFeedback[];
    totalFeedback: number;
    dailyRevenue: Record<string, number>;
    monthlyRevenue: Record<string, number>;
    totalSubscribed: number;
}

export default function AdminPage() {
    const router = useRouter();
    const [adminData, setAdminData] = useState<AdminData | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"users" | "feedback" | "revenue">("users");
    const [feedbackFilter, setFeedbackFilter] = useState("all");
    const [chartView, setChartView] = useState<"daily" | "monthly">("daily");
  // ✅ NEW: delete modal state
    const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (!userStr) {
            router.push("/login");
            return;
        }

        const user = JSON.parse(userStr);
        if (user.role !== "admin") {
            toast.error("Unauthorized access");
            router.push("/dashboard");
            return;
        }

        fetchAdminData();
    }, [router]);

    const fetchAdminData = async () => {
        try {
            const response = await api.get("/admin/data");
            setAdminData(response.data);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
            toast.error("Failed to fetch admin data");
        } finally {
            setLoading(false);
        }
    };

 const handleDeleteUser = async () => {
        if (!deleteUserId) return;

        try {
            await api.delete(`/admin/user/${deleteUserId}`);
            toast.success("User deleted successfully");
            fetchAdminData();
        } catch (err) {
            toast.error("Failed to delete user");
        } finally {
            setDeleteUserId(null);
        }
    };


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged out successfully");
        router.push("/login");
    };


    const filteredUsers = adminData?.users.filter(u =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const filteredFeedback = adminData?.feedbacks.filter(f => {
        if (feedbackFilter !== "all" && f.rating !== parseInt(feedbackFilter)) return false;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            const commentMatch = f.comment?.toLowerCase().includes(query);
            const nameMatch = f.user?.name?.toLowerCase().includes(query);
            const emailMatch = f.user?.email?.toLowerCase().includes(query);
            return commentMatch || nameMatch || emailMatch;
        }

        return true; // ✅ VERY IMPORTANT
    }) || [];

    const dailyChartData = useMemo(() => {
        if (!adminData?.dailyRevenue) return [];
        return Object.entries(adminData.dailyRevenue)
            .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
            .map(([date, count]) => ({
                date,
                subscriptions: count,
                revenue: count * SUBSCRIPTION_PRICE
            }));
    }, [adminData?.dailyRevenue]);

    const monthlyChartData = useMemo(() => {
        if (!adminData?.monthlyRevenue) return [];
        return Object.entries(adminData.monthlyRevenue)
            .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
            .map(([month, count]) => ({
                name: month,
                subscriptions: count,
                revenue: count * SUBSCRIPTION_PRICE
            }));
    }, [adminData?.monthlyRevenue]);


    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-background text-foreground">
                <Loader2 className="animate-spin h-8 w-8 text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
            {/* Header */}
            <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur-md">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg shadow-primary/20">
                                A
                            </div>
                            Admin Dashboard
                        </h1>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <ThemeToggle />
                    <Button onClick={handleLogout} variant="destructive" className="rounded-xl font-bold h-10 px-6 gap-2 border-border border shadow-lg">
                        <LogOut size={16} /> Logout
                    </Button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl relative z-10 px-8 py-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-8 rounded-[2rem] border border-border bg-card shadow-xl flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Users size={28} className="text-primary" />
                        </div>
                        <div>
                            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">Total Users</p>
                            <p className="text-4xl font-black text-foreground">{adminData?.totalUsers}</p>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-8 rounded-[2rem] border border-border bg-card shadow-xl flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-blue-500/10 flex items-center justify-center shrink-0">
                            <FileText size={28} className="text-blue-500" />
                        </div>
                        <div>
                            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">Total Resumes</p>
                            <p className="text-4xl font-black text-foreground">{adminData?.totalResumes}</p>
                        </div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-8 rounded-[2rem] border border-border bg-card shadow-xl flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-purple-500/10 flex items-center justify-center shrink-0">
                            <MessageSquare size={28} className="text-purple-500" />
                        </div>
                        <div>
                            <p className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">Total Feedback</p>
                            <p className="text-4xl font-black text-foreground">{adminData?.totalFeedback}</p>
                        </div>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 pb-4 border-b border-border overflow-x-auto custom-scrollbar">
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === "users" ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}
                    >
                        <Users size={18} /> Users
                    </button>
                    <button
                        onClick={() => setActiveTab("feedback")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === "feedback" ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}
                    >
                        <MessageSquare size={18} /> User Feedback
                    </button>
                    <button
                        onClick={() => setActiveTab("revenue")}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === "revenue" ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-card border border-border text-muted-foreground hover:bg-muted"}`}
                    >
                        <TrendingUp size={18} /> Revenue
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
                        <h2 className="text-2xl font-bold tracking-tight">
                            {activeTab === "users" ? "Registered Users" : activeTab === "feedback" ? "User Feedback" : "Revenue Analytics"}
                        </h2>
                        {activeTab !== "revenue" && (
                            <div className="flex flex-col md:flex-row gap-4">
                                {activeTab === "feedback" && (
                                    <select
                                        value={feedbackFilter}
                                        onChange={(e) => setFeedbackFilter(e.target.value)}
                                        className="h-12 bg-input border border-border rounded-xl px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                    >
                                        <option value="all">All Ratings</option>
                                        <option value="5">5 Stars</option>
                                        <option value="4">4 Stars</option>
                                        <option value="3">3 Stars</option>
                                        <option value="2">2 Stars</option>
                                        <option value="1">1 Star</option>
                                    </select>
                                )}
                                <div className="relative w-full md:w-96">
                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        type="text"
                                        placeholder={activeTab === "users" ? "Search users..." : "Search feedback..."}
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full h-12 bg-input border border-border rounded-xl pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {activeTab === "users" ? (
                        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-2xl">
                            <div className="overflow-x-auto custom-scrollbar">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/50 text-muted-foreground">
                                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">User</th>
                                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">Resumes</th>
                                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">Status</th>
                                            <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">Joined Date</th>
                                        <th className="px-8 py-5 text-xs font-black uppercase tracking-widest">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <AnimatePresence>
                                            {filteredUsers.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="px-8 py-16 text-center text-muted-foreground font-medium">
                                                        No users found matching your search.
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredUsers.map((user, index) => (
                                                    <motion.tr
                                                        key={user._id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                                                    >
                                                        <td className="px-8 py-5">
                                                            <div className="flex items-center gap-4">
                                                                <div className="h-10 w-10 min-w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                                    {user.name.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div>
                                                                    <p className="font-bold text-foreground truncate max-w-[200px]">{user.name}</p>
                                                                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{user.email}</p>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-5">
                                                            <div className="flex flex-col gap-2">
                                                                <div className="flex items-center gap-2">
                                                                    <FileText size={16} className="text-muted-foreground" />
                                                                    <span className="font-bold text-lg">{user.resumesCount}</span>
                                                                </div>
                                                                {user.resumes && user.resumes.length > 0 && (
                                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                                        {user.resumes.map(r => (
                                                                            <Link key={r._id} href={`/editor/${r._id}`} className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded-md hover:bg-primary/20 transition-colors">
                                                                                {r.title || 'Untitled'}
                                                                            </Link>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                      
                                                        <td className="px-8 py-5">
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${user.role === 'admin' ? 'bg-primary/10 text-primary border border-primary/20' : user.isSubscribed ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-secondary text-muted-foreground border border-border'}`}>
                                                                {user.role === 'admin' ? 'Admin' : user.isSubscribed ? 'Pro' : 'Free'}
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-5 text-sm font-medium text-muted-foreground">
                                                            {new Date(user.createdAt).toLocaleDateString(undefined, {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric'
                                                            })}
                                                        </td>
                                                        {/* ✅ NEW COLUMN */}
<td className="px-8 py-5">
    <Button
        variant="destructive"
        size="sm"
        onClick={() => setDeleteUserId(user._id)}
    >
        Delete
    </Button>
</td>
                                                    </motion.tr>
                                                ))
                                            )}
                                        </AnimatePresence>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : activeTab === "feedback" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {filteredFeedback.length === 0 ? (
                                    <div className="col-span-full py-16 text-center text-muted-foreground font-medium border border-border rounded-3xl bg-card">
                                        <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
                                        No feedback found matching your criteria.
                                    </div>
                                ) : (
                                    filteredFeedback.map((feedback, index) => (
                                        <motion.div
                                            key={feedback._id}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="p-6 rounded-[2rem] border border-border bg-card shadow-lg hover:shadow-xl transition-all"
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                        {feedback.user?.name ? feedback.user.name.charAt(0).toUpperCase() : 'A'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-foreground text-sm">{feedback.user?.name || 'Anonymous'}</p>
                                                        <p className="text-xs text-muted-foreground">{feedback.user?.email || 'N/A'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <Star
                                                            key={star}
                                                            size={14}
                                                            className={star <= (feedback.rating || 5) ? "fill-yellow-500 text-yellow-500" : "text-muted"}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-secondary-foreground text-sm leading-relaxed mb-4 min-h-[60px]">
                                                "{feedback.comment}"
                                            </p>
                                            <p className="text-xs text-muted-foreground font-medium pt-4 border-t border-border">
                                                {new Date(feedback.createdAt).toLocaleDateString(undefined, {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-8 rounded-[2rem] border border-border bg-card shadow-xl flex items-center gap-6">
                                    <div className="h-16 w-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <TrendingUp size={28} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">Total Subscriptions</p>
                                        <p className="text-4xl font-black text-foreground">{adminData?.totalSubscribed}</p>
                                    </div>
                                </motion.div>
                            </div>

                            {/* Revenue Graph Toggle Container */}
                            <div className="p-8 rounded-[2rem] border border-border bg-card shadow-xl flex flex-col min-h-[500px]">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                            {chartView === 'daily' ? <DollarSign size={24} className="text-primary" /> : <TrendingUp size={24} className="text-primary" />}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">{chartView === 'daily' ? 'Daily Revenue' : 'Monthly Revenue'}</h3>
                                            <p className="text-sm text-muted-foreground">Calculated at ${SUBSCRIPTION_PRICE}/sub</p>
                                        </div>
                                    </div>
                                    <div className="flex p-1 bg-muted/50 rounded-xl border border-border/50">
                                        <button 
                                            onClick={() => setChartView('daily')}
                                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${chartView === 'daily' ? 'bg-background shadow-md text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            Day wise
                                        </button>
                                        <button 
                                            onClick={() => setChartView('monthly')}
                                            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${chartView === 'monthly' ? 'bg-background shadow-md text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                        >
                                            Month wise
                                        </button>
                                    </div>
                                </div>
                                <div className="w-full pt-4" style={{ minHeight: '400px', height: '400px' }}>
                                    {chartView === 'daily' ? (
                                        dailyChartData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={400}>
                                                <BarChart data={dailyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                                                    <XAxis dataKey="date" tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }} axisLine={false} tickLine={false} />
                                                    <YAxis tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                                                    <Tooltip
                                     formatter={((value: unknown) => {
    const num = Number(value ?? 0);
    return [`$${num.toLocaleString()}`, "Revenue"];
}) as any}
                                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '12px', border: 'none', color: '#fff' }}
                                                        itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                                                        cursor={{ fill: 'currentColor', opacity: 0.05 }}
                                                    />
                                                    <Bar dataKey="revenue" name="Revenue" fill="#10b981" radius={[8, 8, 0, 0]} maxBarSize={60} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/20 rounded-2xl border border-border/50">No daily revenue data yet.</div>
                                        )
                                    ) : (
                                        monthlyChartData.length > 0 ? (
                                            <ResponsiveContainer width="100%" height={400}>
                                                <BarChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
                                                    <XAxis dataKey="name" tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }} axisLine={false} tickLine={false} />
                                                    <YAxis tick={{ fill: 'currentColor', opacity: 0.5, fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                                                    <Tooltip
                                                formatter={((value: unknown) => {
    const num = Number(value ?? 0);
    return [`$${num.toLocaleString()}`, "Revenue"];
}) as any}
                                                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '12px', border: 'none', color: '#fff' }}
                                                        itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                                                        cursor={{ fill: 'currentColor', opacity: 0.05 }}
                                                    />
                                                    <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" radius={[8, 8, 0, 0]} maxBarSize={60} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/20 rounded-2xl border border-border/50">No monthly revenue data yet.</div>
                                        )
                                    )}
                                    
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            {deleteUserId && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background text-foreground border border-border p-6 rounded-xl shadow-xl w-[400px]">
            <h2 className="text-lg font-bold mb-4">Confirm Delete</h2>

            <p className="mb-6 text-sm text-muted-foreground">
                Are you sure you want to delete this user?
            </p>

            <div className="flex justify-end gap-4">
                <Button
                    variant="outline"
                    onClick={() => setDeleteUserId(null)}
                >
                    Cancel
                </Button>

                <Button
                    variant="destructive"
                    onClick={handleDeleteUser}
                >
                    Delete
                </Button>
            </div>
        </div>
    </div>
)}
        </div>
    );
}
