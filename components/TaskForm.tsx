// components/TaskForm.tsx

'use client'
import { useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

export default function TaskForm() {
  const [task, setTask] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!task.trim()) return

    try {
      await addDoc(collection(db, 'tasks'), {
        text: task,
        createdAt: new Date()
      })
      setTask('')
    } catch (error) {
      console.error('Error adding task:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4">
      <input
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="What's your task?"
        className="rounded-xl p-2 w-full border"
      />
      <button
        type="submit"
        className="bg-pink-300 hover:bg-pink-400 text-white font-bold rounded-xl px-4"
      >
        Bloom 🌸
      </button>
    </form>
  )
}
