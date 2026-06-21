// Mock data for Softlynest prototype
export type Post = {
  id: string;
  user: string;
  avatar: string;
  time: string;
  text: string;
  image?: string;
  anonymous?: boolean;
};

export type Message = {
  id: string;
  user: string;
  avatar: string;
  time: string;
  preview: string;
  unread?: boolean;
};

export type Notification = {
  id: string;
  user: string;
  action: "liked your post." | "commented:";
  detail?: string;
  time: string;
  unread?: boolean;
};

export type Comment = {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
  likes: number;
};

export type UserProfile = {
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  posts: number;
  friends: number;
};

const av = (seed: string) =>
  `https://api.dicebear.com/9.x/thumbs/svg?seed=${seed}&backgroundColor=ffd5dc,c0aede,b6e3f4,d1d4f9,ffdfbf`;

export const USER_PROFILES: UserProfile[] = [
  { username: "user25", displayName: "User25", avatar: av("user25"), bio: "Taking it one step at a time 🌿", posts: 24, friends: 312 },
  { username: "sleepy_fern", displayName: "sleepy_fern", avatar: av("sleepyfern"), bio: "Soft mornings, slow living ☕", posts: 57, friends: 890 },
  { username: "matchalovr5_", displayName: "matchalovr5_", avatar: av("matcha"), bio: "Matcha and mindfulness 🍵", posts: 33, friends: 461 },
  { username: "azzahra_faiza06", displayName: "azzahra_faiza06", avatar: av("azzahra"), bio: "Here to listen and be heard 💗", posts: 18, friends: 204 },
  { username: "montea_", displayName: "montea_", avatar: av("montea"), bio: "Honestly just vibing 🌊", posts: 9, friends: 135 },
  { username: "its.luna", displayName: "its.luna", avatar: av("luna"), bio: "Night owl, gentle soul 🌙", posts: 41, friends: 560 },
  { username: "thenameless", displayName: "thenameless", avatar: av("nameless"), bio: "Curious about everything 👀", posts: 12, friends: 78 },
];

export function getUserProfile(username: string): UserProfile | undefined {
  return USER_PROFILES.find((u) => u.username === username);
}

export const POSTS: Post[] = [
  {
    id: "p1",
    user: "user25",
    avatar: av("user25"),
    time: "8h ago",
    text: "I managed to go outside today 🥹\nAfter weeks of staying indoors because of anxiety, I finally took a short walk around my neighborhood!! 💗",
  },
  {
    id: "p2",
    user: "Anonymous",
    avatar: av("anon1"),
    time: "3h ago",
    text: "Showing off my fidget boards here! Feel free to ask anything! :D",
    image:
      "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&q=70&auto=format&fit=crop",
    anonymous: true,
  },
  {
    id: "p3",
    user: "sleepy_fern",
    avatar: av("sleepyfern"),
    time: "12h ago",
    text: "Tiny reminder: drinking water and stepping into sunlight counts as self-care today. 🌿",
  },
  {
    id: "p4",
    user: "matchalovr5_",
    avatar: av("matcha"),
    time: "1d ago",
    text: "Made matcha for the first time this morning. It tastes like patience. 🍵",
    image:
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&q=70&auto=format&fit=crop",
  },
];

export const MESSAGES: Message[] = [
  { id: "m1", user: "azzahra_faiza06", avatar: av("azzahra"), time: "3h ago", preview: "How are you feeling today?", unread: true },
  { id: "m2", user: "montea_", avatar: av("montea"), time: "2h ago", preview: "I feel a little overwhelmed, honestly :(", unread: true },
  { id: "m3", user: "gantlew4v3", avatar: av("gant"), time: "6h ago", preview: "Just take your time!!", unread: true },
  { id: "m4", user: "its.luna", avatar: av("luna"), time: "6h ago", preview: "Kalau misal semakin gelisah, mungki…" },
  { id: "m5", user: "sleepy_fern", avatar: av("sleepyfern"), time: "8h ago", preview: "I will try to help as much as i can" },
  { id: "m6", user: "matchalovr5_", avatar: av("matcha"), time: "10h ago", preview: "I feel a lot better today! Thanks!" },
  { id: "m7", user: "maddie234", avatar: av("maddie"), time: "12h ago", preview: "I've been looking for an advice to ever…" },
];

export const NOTIFICATIONS: Notification[] = [
  { id: "n1", user: "azzahra_faiza06", action: "liked your post.", time: "2m ago", unread: true },
  { id: "n2", user: "montea_", action: "liked your post.", time: "2h ago", unread: true },
  { id: "n3", user: "sleepy_fern", action: "liked your post.", time: "3h ago", unread: true },
  { id: "n4", user: "itsluna_", action: "commented:", detail: "Same ☹", time: "5h ago" },
  { id: "n5", user: "its.luna", action: "liked your post.", time: "5h ago" },
  { id: "n6", user: "thenameless", action: "commented:", detail: "Where did you get that??", time: "5h ago" },
  { id: "n7", user: "azzahra_faiza06", action: "liked your post.", time: "6h ago" },
];

export const COMMENTS: Record<string, Comment[]> = {
  p1: [
    { id: "c1", user: "sleepy_fern", avatar: av("sleepyfern"), text: "So proud of you 🥺 every small step counts.", time: "6h", likes: 4 },
    { id: "c2", user: "itsluna_", avatar: av("luna"), text: "Same ☹ getting outside is so hard some days.", time: "5h", likes: 2 },
    { id: "c3", user: "montea_", avatar: av("montea"), text: "This made me smile. Keep going 💗", time: "2h", likes: 7 },
  ],
  p2: [
    { id: "c4", user: "thenameless", avatar: av("nameless"), text: "Where did you get that??", time: "1h", likes: 3 },
  ],
};

export type ChatMessage = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
};

export const CHAT_THREADS: Record<string, ChatMessage[]> = {
  m1: [
    { id: "c1", from: "them", text: "How are you feeling today?", time: "3h ago" },
    { id: "c2", from: "me", text: "A little tired but okay overall 🌿", time: "3h ago" },
    { id: "c3", from: "them", text: "That's okay! Rest is important 💗", time: "2h ago" },
    { id: "c4", from: "me", text: "Thank you, really needed to hear that", time: "2h ago" },
    { id: "c5", from: "them", text: "Always here if you need to talk 🌸", time: "1h ago" },
  ],
  m2: [
    { id: "c1", from: "them", text: "I feel a little overwhelmed, honestly :(", time: "2h ago" },
    { id: "c2", from: "me", text: "Oh no, want to talk about it?", time: "2h ago" },
    { id: "c3", from: "them", text: "There's just so much going on at once", time: "2h ago" },
    { id: "c4", from: "me", text: "Take it one breath at a time 🌬️", time: "1h ago" },
  ],
  m3: [
    { id: "c1", from: "me", text: "Hey! How are you?", time: "6h ago" },
    { id: "c2", from: "them", text: "Just take your time!!", time: "6h ago" },
    { id: "c3", from: "me", text: "Thanks for checking in 😊", time: "5h ago" },
  ],
  m4: [
    { id: "c1", from: "them", text: "Kalau misal semakin gelisah, mungkin boleh coba tarik nafas dulu", time: "6h ago" },
    { id: "c2", from: "me", text: "Iya kak, makasih sarannya 🙏", time: "5h ago" },
  ],
  m5: [
    { id: "c1", from: "me", text: "Hope you're doing well today!", time: "8h ago" },
    { id: "c2", from: "them", text: "I will try to help as much as i can", time: "8h ago" },
  ],
  m6: [
    { id: "c1", from: "them", text: "I feel a lot better today! Thanks!", time: "10h ago" },
    { id: "c2", from: "me", text: "So glad to hear that 🥰", time: "10h ago" },
  ],
  m7: [
    { id: "c1", from: "them", text: "I've been looking for an advice to ever since...", time: "12h ago" },
    { id: "c2", from: "me", text: "I'm listening, take your time 💙", time: "11h ago" },
  ],
};

export const SEARCH_TAGS = ["anxiety", "self-care", "sleep", "journaling", "calm", "tiny wins", "breathing", "gratitude"];

export const SEARCH_GRID = [
  "https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=400&q=60",
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&q=60",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=60",
  "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=400&q=60",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=60",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=400&q=60",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=60",
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&q=60",
  "https://images.unsplash.com/photo-1545158535-c3f7168c28b6?w=400&q=60",
];
