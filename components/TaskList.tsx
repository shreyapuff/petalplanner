// components/TaskList.tsx

'use client'
import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'

export default function TaskList() {
  const [tasks, setTasks] = useState<any[]>([])

  useEffect(() => {
    const q = query(collection(db, 'tasks'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="p-4 space-y-2">
      {tasks.map(task => (
        <div key={task.id} className="bg-white rounded-xl p-3 shadow-sm border">
          {task.text}
        </div>
      ))}
    </div>
  )
}
