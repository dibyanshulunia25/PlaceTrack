"use client"

import { useEffect, useState } from "react"
import { getUsers, toggleUserBan } from "@/actions/admin"
import { motion } from "framer-motion"
import { Search, ShieldAlert, ShieldCheck } from "lucide-react"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchUsers = async (q = "") => {
    setLoading(true)
    try {
      const data = await getUsers(q)
      setUsers(data)
    } catch (error) {
      console.error(error)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers(query)
  }, [query])

  const handleToggleBan = async (userId: string, currentStatus: boolean) => {
    await toggleUserBan(userId, !currentStatus)
    // Optimistic update
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, banned: !currentStatus } : u))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">User Management</h1>
        <p className="text-slate-500">Search and moderate user accounts.</p>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-2xl shadow-sm overflow-hidden">
        {loading && users.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Loading users...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Name</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Email</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Role</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Status</th>
                  <th className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <motion.tr 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={user.id} 
                    className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium">{user.name || "Unknown"}</td>
                    <td className="px-6 py-4 text-slate-500">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-md text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {user.banned ? (
                        <span className="flex items-center gap-1 text-rose-500 text-sm font-medium">
                          <ShieldAlert className="h-4 w-4" /> Banned
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-emerald-500 text-sm font-medium">
                          <ShieldCheck className="h-4 w-4" /> Active
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {user.role !== "ADMIN" && (
                        <button
                          onClick={() => handleToggleBan(user.id, user.banned)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            user.banned 
                              ? "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700" 
                              : "bg-rose-100 text-rose-700 hover:bg-rose-200 dark:bg-rose-900/50 dark:text-rose-300 dark:hover:bg-rose-900"
                          }`}
                        >
                          {user.banned ? "Reactivate" : "Ban User"}
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
                {users.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
