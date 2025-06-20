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

  useEffect(() => {
    const savedMood = localStorage.getItem("petalplanner-mood");
    if (savedMood) setMood(savedMood);
  }, []);

  useEffect(() => {
    const q = query(collection(db, "tasks"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const data: Task[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Task, "id">),
      }));
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
      case "😴":
        return "🌙";
      case "😐":
        return "🌾";
      case "😊":
        return "🌼";
      case "🥰":
        return "🌸";
      case "✨":
        return "🌟";
      default:
        return "🌱";
    }
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-pink-50 p-4 overflow-hidden">
      {/* ✨ Animated Cloud Background */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full z-0 overflow-hidden"
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      >
        <div className="absolute w-40 h-20 bg-white opacity-30 rounded-full top-10 left-10 blur-2xl" />
        <div className="absolute w-60 h-24 bg-white opacity-20 rounded-full top-40 right-10 blur-2xl" />
        <div className="absolute w-52 h-20 bg-white opacity-25 rounded-full bottom-10 left-20 blur-2xl" />
        <div className="absolute w-36 h-18 bg-white opacity-20 rounded-full bottom-20 right-14 blur-2xl" />
      </motion.div>

      {/* 🌸 Main Content */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center">
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
          <p className="text-sm text-pink-600">Today&apos;s Mood:</p>
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
          <div className="mt-4 flex gap-2 w-full">
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Type your task..."
              className="px-4 py-2 rounded-full border border-pink-300 focus:outline-none flex-1"
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
        <ul className="mt-6 space-y-2 w-full">
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
                {task.completed ? `${moodToFlower(task.mood || "😊")} ` : "🌱 "}
                {task.text}
              </span>
              {task.completed && (
                <span className="text-2xl animate-ping text-yellow-400">✨</span>
              )}
            </motion.li>
          ))}
        </ul>
      </div>
    </main>
  );
}
