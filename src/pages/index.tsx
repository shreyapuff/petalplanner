'use client';

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  updateDoc,
  doc,
  orderBy,
  query,
  Timestamp,
} from "firebase/firestore";
import { Task } from "../types/types";

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [mood, setMood] = useState("😊");

  // Load mood from localStorage
  useEffect(() => {
    const savedMood = localStorage.getItem("petalplanner-mood");
    if (savedMood) setMood(savedMood);
  }, []);

  // Real-time listener for tasks
  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data: Task[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Task));
      setTasks(data);
      localStorage.setItem("petalplanner-tasks", JSON.stringify(data));
    });
    return () => unsub();
  }, []);

  const handleAddTask = async () => {
    const trimmed = newTask.trim();
    const isDuplicate = tasks.some(
      (task) => task.text.toLowerCase() === trimmed.toLowerCase()
    );
    if (!trimmed || isDuplicate) return;

    await addDoc(collection(db, "tasks"), {
      text: trimmed,
      mood,
      completed: false,
      createdAt: Timestamp.now(),
    });
    setNewTask("");
  };

  const toggleTask = async (task: Task) => {
    if (!task.id) return;
    const docRef = doc(db, "tasks", task.id);
    await updateDoc(docRef, {
      completed: !task.completed,
    });

    if (!task.completed) {
      const audio = new Audio("/Bling.mp3");
      audio.play().catch(() => {});
    }
  };

  const handleMoodChange = (emoji: string) => {
    setMood(emoji);
    localStorage.setItem("petalplanner-mood", emoji);
  };

  const moodToFlower = (mood: string) => {
    switch (mood) {
      case "😴": return "🌙";
      case "😐": return "🌾";
      case "😊": return "🌼";
      case "🥰": return "🌸";
      case "✨": return "🌟";
      default: return "🌱";
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-pink-50 p-4">
      <h1 className="text-4xl md:text-6xl font-bold text-pink-700 mb-4 animate-bounce">
        🌸 PetalPlanner
      </h1>

      <Link href="/garden">
        <button className="mb-4 px-4 py-2 bg-green-200 text-green-800 rounded-full hover:bg-green-300 transition">
          🌼 View Your Garden
        </button>
      </Link>

      {/* Mood Picker */}
      <div className="mt-2 mb-4 flex flex-col items-center">
        <p className="text-sm text-pink-600">Today's Mood:</p>
        <div className="flex gap-2 mt-1">
          {["😴", "😐", "😊", "🥰", "✨"].map((emoji) => (
            <button
              key={emoji}
              onClick={() => handleMoodChange(emoji)}
              className={`text-2xl transition-transform ${
                mood === emoji ? "scale-125" : "opacity-70"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <p className="text-lg text-pink-600 text-center max-w-xl">
        Grow a magical garden with every task you complete. 🌷
      </p>

      {/* Add Task */}
      <button
        onClick={() => setShowInput(!showInput)}
        className="mt-6 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white text-lg rounded-full shadow-md transition"
      >
        + Add a Task
      </button>

      {showInput && (
        <div className="mt-4 flex gap-2">
          <input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Type your task..."
            className="px-4 py-2 rounded-full border border-pink-300 focus:outline-none"
          />
          <button
            onClick={handleAddTask}
            className="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-full"
          >
            Add
          </button>
        </div>
      )}

      {/* Task List */}
      <ul className="mt-6 space-y-2 w-full max-w-sm">
        {tasks.map((task) => (
          <motion.li
            key={task.id}
            onClick={() => toggleTask(task)}
            initial={task.completed ? { scale: 0 } : false}
            animate={task.completed ? { scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            className={`cursor-pointer px-4 py-2 rounded-lg border-l-4 flex items-center justify-between transition-all duration-300 ${
              task.completed
                ? "bg-green-100 border-green-400 text-green-700 line-through scale-95"
                : "bg-white border-pink-300 text-gray-800 hover:bg-pink-100"
            }`}
          >
            <span>
              {task.completed ? `${moodToFlower(task.mood)} ` : "🌱 "}
              {task.text}
            </span>
            {task.completed && (
              <span className="text-2xl animate-ping text-yellow-400">✨</span>
            )}
          </motion.li>
        ))}
      </ul>
    </main>
  );
}
