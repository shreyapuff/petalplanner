// /types/types.ts

import { Timestamp } from "firebase/firestore";

export interface Task {
  id?: string;
  text: string;
  completed: boolean;
  mood: string;
  createdAt: Timestamp;
}
