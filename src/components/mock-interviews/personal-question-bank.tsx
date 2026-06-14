"use client"

import { useState } from "react"
import { Bookmark, Settings2, Trash2, Edit, Save, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function PersonalQuestionBank({ personalQuestions, bookmarkedQuestions }: { personalQuestions: any[], bookmarkedQuestions: any[] }) {
  const [activeView, setActiveView] = useState<'personal' | 'bookmarked'>('personal')
  const [search, setSearch] = useState("")

  const filteredPersonal = personalQuestions.filter(q => q.question.toLowerCase().includes(search.toLowerCase()) || q.category.toLowerCase().includes(search.toLowerCase()))
  const filteredBookmarked = bookmarkedQuestions.filter(b => b.mockQuestion.question.toLowerCase().includes(search.toLowerCase()) || b.mockQuestion.category.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex bg-white/10 p-1 rounded-xl border border-white/10 shadow-inner">
          <button 
            onClick={() => setActiveView('personal')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeView === 'personal' ? 'bg-orange-500 text-white shadow' : 'text-muted-foreground hover:text-foreground'}`}
          >
            My Questions
          </button>
          <button 
            onClick={() => setActiveView('bookmarked')}
            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-colors ${activeView === 'bookmarked' ? 'bg-orange-500 text-white shadow' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Bookmarks
          </button>
        </div>
        <div className="relative w-full sm:w-64">
          <Input 
            placeholder="Search questions..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl border-white/20 bg-white/5"
          />
          <Settings2 className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        </div>
      </div>

      <div className="grid gap-4">
        {activeView === 'personal' && (
          filteredPersonal.length > 0 ? filteredPersonal.map(q => (
            <div key={q.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                  <span className="text-xs font-bold text-orange-500 mb-1 block">{q.company.name} • {q.category}</span>
                  <h3 className="font-semibold text-lg">{q.question}</h3>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="icon" className="size-8 rounded-lg"><Edit className="size-4" /></Button>
                  <Button variant="outline" size="icon" className="size-8 rounded-lg text-red-500 hover:text-red-600"><Trash2 className="size-4" /></Button>
                </div>
              </div>
              <div className="p-4 bg-black/20 rounded-xl mt-4">
                <span className="text-xs text-muted-foreground font-semibold mb-2 block">Answer / Notes</span>
                <p className="text-sm">{q.answer}</p>
                {q.notes && <p className="text-sm mt-4 text-emerald-400">Private Notes: {q.notes}</p>}
              </div>
            </div>
          )) : (
            <div className="text-center py-12 text-muted-foreground bg-white/5 rounded-2xl border border-white/10 border-dashed">
              You haven't added any personal questions yet.
            </div>
          )
        )}

        {activeView === 'bookmarked' && (
          filteredBookmarked.length > 0 ? filteredBookmarked.map(b => (
            <div key={b.id} className="p-6 bg-white/5 border border-white/10 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div>
                  <span className="text-xs font-bold text-blue-500 mb-1 block">{b.mockQuestion.company.name} • {b.mockQuestion.category}</span>
                  <h3 className="font-semibold text-lg">{b.mockQuestion.question}</h3>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="icon" className="size-8 rounded-lg text-orange-500"><Bookmark className="size-4 fill-current" /></Button>
                </div>
              </div>
              <div className="p-4 bg-black/20 rounded-xl mt-4">
                <span className="text-xs text-muted-foreground font-semibold mb-2 block">Expected Answer</span>
                <p className="text-sm">{b.mockQuestion.answer}</p>
              </div>
              <div className="mt-4 p-4 border border-orange-500/30 bg-orange-500/5 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-orange-500">My Private Notes</span>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Edit Note</Button>
                </div>
                <p className="text-sm">{b.notes || <span className="text-muted-foreground italic">No notes added. Click edit to add your thoughts.</span>}</p>
              </div>
            </div>
          )) : (
            <div className="text-center py-12 text-muted-foreground bg-white/5 rounded-2xl border border-white/10 border-dashed">
              You haven't bookmarked any questions from the community yet.
            </div>
          )
        )}
      </div>
    </div>
  )
}
