"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { BrainCircuit, CheckCircle2, XCircle, RotateCcw, Building2, HelpCircle, Loader2 } from "lucide-react"
import { savePracticeSession } from "@/actions/mock-interviews"

// For simplicity, we fetch the questions in a useEffect or we can pass them in from a server component wrapper.
// Since we want this to be client side, let's just make the page a wrapper and pass questions.

export function PracticeFlashcards({ questions, companyName }: { questions: any[], companyName: string }) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const currentQuestion = questions[currentIndex]

  const handleNext = (correct: boolean) => {
    if (correct) setScore(s => s + 1)
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1)
      setShowAnswer(false)
    } else {
      setCompleted(true)
    }
  }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFinish = async () => {
    setIsSubmitting(true)
    try {
      const companyId = questions.length > 0 ? questions[0].companyId : undefined
      await savePracticeSession({ companyId, score: questions.length })
      router.push(`/dashboard/mock-interviews/${encodeURIComponent(companyName)}`)
    } catch (error) {
      console.error("Failed to record practice session", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (questions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <HelpCircle className="size-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Questions Found</h2>
        <p className="text-muted-foreground mb-6">There are no mock questions available for this filter combination.</p>
        <button onClick={() => router.back()} className="px-6 py-2 bg-primary text-primary-foreground rounded-lg">Go Back</button>
      </div>
    )
  }

  if (completed) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto p-8 rounded-3xl bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 shadow-clay-md text-center"
      >
        <div className="size-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="size-10" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Session Complete!</h2>
        <p className="text-xl text-muted-foreground mb-8">
          You scored <span className="text-primary font-bold">{score}</span> out of {questions.length}.
        </p>
        <div className="flex justify-center gap-4">
          <button 
            onClick={() => {
              setCurrentIndex(0)
              setScore(0)
              setShowAnswer(false)
              setCompleted(false)
            }}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors font-medium border border-white/10"
          >
            <RotateCcw className="size-4" /> Restart
          </button>
          <button 
            onClick={handleFinish}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-colors font-medium shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Loader2 className="size-5 animate-spin" /> : null}
            Finish & Save
          </button>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <BrainCircuit className="size-6 text-primary" />
          <h2 className="text-xl font-bold">Practice Mode</h2>
        </div>
        <div className="text-sm font-semibold text-muted-foreground bg-white/10 px-3 py-1 rounded-full border border-white/10">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white/10 dark:bg-black/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-clay-md p-8 min-h-[400px] flex flex-col"
        >
          <div className="flex items-center gap-2 mb-6">
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold uppercase tracking-wider">
              {currentQuestion.category}
            </span>
            <span className="px-3 py-1 bg-white/10 text-muted-foreground rounded-lg text-xs font-bold uppercase tracking-wider border border-white/10">
              Difficulty: {currentQuestion.difficulty}/5
            </span>
          </div>

          <h3 className="text-2xl font-bold mb-8 flex-1">
            {currentQuestion.question}
          </h3>

          {!showAnswer ? (
            <div className="mt-auto flex justify-center">
              <button 
                onClick={() => setShowAnswer(true)}
                className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                Reveal Answer
              </button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 pt-8 border-t border-white/10"
            >
              <h4 className="text-sm font-bold text-emerald-500 uppercase tracking-wider mb-4">Community Answer</h4>
              <p className="text-lg text-muted-foreground mb-12 whitespace-pre-wrap">
                {currentQuestion.answer}
              </p>

              <div className="flex flex-col items-center gap-4">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">How did you do?</p>
                <div className="flex gap-4 w-full">
                  <button 
                    onClick={() => handleNext(false)}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-xl font-bold transition-all"
                  >
                    <XCircle className="size-5" /> Need Practice
                  </button>
                  <button 
                    onClick={() => handleNext(true)}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/20 rounded-xl font-bold transition-all"
                  >
                    <CheckCircle2 className="size-5" /> Got It Right
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
