/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  DocumentData,
} from 'firebase/firestore'

interface Task {
  id: string
  text: string
  createdAt: Timestamp
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData: Task[] = snapshot.docs.map((doc: DocumentData) => ({
        id: doc.id,
        ...(doc.data() as Omit<Task, 'id'>),
      }))

      setTasks(tasksData)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="p-4 space-y-2">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white rounded-xl p-3 shadow-sm border">
          {task.text}
        </div>
      ))}
    </div>
  )
}
/* eslint-enable @typescript-eslint/no-explicit-any */
