'use client';

import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { motion } from "framer-motion";
import Link from "next/link";
import { db } from "../lib/firebase";
import { Task } from "../types/types";

export default function Garden() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data: Task[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Task));
      setTasks(data);
    });
    return () => unsub();
  }, []);

  const moodToFlower = (mood: string, completed: boolean) => {
    if (!completed) return "🥀"; // wilted
    switch (mood) {
      case "😴": return "🌙";
      case "😐": return "🌾";
      case "😊": return "🌼";
      case "🥰": return "🌸";
      case "✨": return "🌟";
      default: return "🌱";
    }
  };

  const completedTasks = tasks.filter(task => task.completed);

  return (
    <main className="min-h-screen bg-green-50 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-green-700 mb-2">
        🌼 Your Magical Garden
      </h1>
      <p className="text-green-600 mb-4">Each flower represents a completed task, blooming with your mood! 🌷</p>

      <Link href="/">
        <button className="mb-6 px-4 py-2 bg-pink-200 text-pink-800 rounded-full hover:bg-pink-300 transition">
          ← Back to Planner
        </button>
      </Link>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-4xl">
        {completedTasks.length === 0 && (
          <p className="col-span-full text-gray-500">No flowers yet. Complete some tasks to grow your garden! 🌱</p>
        )}
        {completedTasks.map((task, index) => (
          <motion.div
            key={task.id || index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="flex flex-col items-center justify-center bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition transform hover:scale-105"
          >
            <div className="text-4xl">{moodToFlower(task.mood, task.completed)}</div>
            <p className="text-sm mt-2 text-center text-gray-600">{task.text}</p>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
