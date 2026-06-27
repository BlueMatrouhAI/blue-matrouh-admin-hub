/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  Ad,
  Area,
  Category,
  NotificationItem,
  Offer,
  Service,
  UserRef,
} from "@/types";

// ---------- seed data ----------
const areas: Area[] = [
  { _id: "a1", name: "Downtown" },
  { _id: "a2", name: "Harbor District" },
  { _id: "a3", name: "Old Town" },
  { _id: "a4", name: "Westside" },
];

const categories: Category[] = [
  {
    _id: "c1",
    title: "Boat Rentals",
    imageUrl: "https://images.unsplash.com/photo-1502209524164-acea936639a2?w=200",
    order: 1,
    priceRequired: true,
    featureCategories: [
      { _id: "fc1", title: "Yacht" },
      { _id: "fc2", title: "Speedboat" },
      { _id: "fc3", title: "Sailboat" },
    ],
  },
  {
    _id: "c2",
    title: "Fishing Trips",
    imageUrl: "https://images.unsplash.com/photo-1545566239-0710c1f1cb7d?w=200",
    order: 2,
    priceRequired: true,
    featureCategories: [
      { _id: "fc4", title: "Deep Sea" },
      { _id: "fc5", title: "Coastal" },
    ],
  },
  {
    _id: "c3",
    title: "Diving",
    imageUrl: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=200",
    order: 3,
    priceRequired: false,
    featureCategories: [
      { _id: "fc6", title: "Scuba" },
      { _id: "fc7", title: "Snorkeling" },
    ],
  },
  {
    _id: "c4",
    title: "Water Sports",
    imageUrl: "https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=200",
    order: 4,
    priceRequired: true,
    featureCategories: [
      { _id: "fc8", title: "Jet Ski" },
      { _id: "fc9", title: "Parasailing" },
    ],
  },
];

const users: UserRef[] = [
  { _id: "u1", username: "ahmed_seller", email: "ahmed@example.com", phoneNumber: "+201001112222", role: "seller", status: "active", isSeller: true, imageUrl: "https://i.pravatar.cc/80?img=12" },
  { _id: "u2", username: "sara_marine", email: "sara@example.com", phoneNumber: "+201005556666", role: "seller", status: "pending", isSeller: true, imageUrl: "https://i.pravatar.cc/80?img=47" },
  { _id: "u3", username: "omar_dive", email: "omar@example.com", phoneNumber: "+201007778888", role: "seller", status: "active", isSeller: true, imageUrl: "https://i.pravatar.cc/80?img=33" },
  { _id: "u4", username: "layla", email: "layla@example.com", phoneNumber: "+201009990000", role: "user", status: "active", isSeller: false, imageUrl: "https://i.pravatar.cc/80?img=5" },
  { _id: "u5", username: "youssef", email: "youssef@example.com", role: "user", status: "active", isSeller: false },
  { _id: "u6", username: "mariam", email: "mariam@example.com", role: "user", status: "active", isSeller: false, imageUrl: "https://i.pravatar.cc/80?img=20" },
  { _id: "u7", username: "khaled_boats", email: "khaled@example.com", role: "seller", status: "pending", isSeller: true, imageUrl: "https://i.pravatar.cc/80?img=15" },
  { _id: "u8", username: "noor", email: "noor@example.com", role: "user", status: "active", isSeller: false, imageUrl: "https://i.pravatar.cc/80?img=25" },
  { _id: "u9", username: "hassan", email: "hassan@example.com", role: "user", status: "suspended", isSeller: false },
  { _id: "u10", username: "fatma_tours", email: "fatma@example.com", role: "seller", status: "active", isSeller: true, imageUrl: "https://i.pravatar.cc/80?img=49" },
  { _id: "u11", username: "ali", email: "ali@example.com", role: "user", status: "active", isSeller: false },
  { _id: "u12", username: "rana", email: "rana@example.com", role: "user", status: "active", isSeller: false, imageUrl: "https://i.pravatar.cc/80?img=44" },
];

// Deterministic 30-day signup trend
const signupTrend: { date: string; users: number; sellers: number }[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date(Date.now() - (29 - i) * 86400000);
  const seed = (i * 9301 + 49297) % 233280;
  const rand = seed / 233280;
  return {
    date: d.toISOString().slice(5, 10),
    users: 2 + Math.floor(rand * 8) + (i % 7 === 0 ? 4 : 0),
    sellers: Math.floor(rand * 3) + (i % 5 === 0 ? 1 : 0),
  };
});

const now = Date.now();
const days = (n: number) => new Date(now + n * 86400000).toISOString();

const services: Service[] = [
  {
    _id: "s1",
    title: "Luxury Yacht Sunset Cruise",
    description: "A 3-hour sunset cruise aboard a 60ft luxury yacht.",
    serviceCatId: categories[0],
    userId: users[0],
    area: areas[0],
    price: 450,
    features: ["Captain included", "Snacks", "Wi-Fi"],
    imageUrls: ["https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=600"],
    status: "pending",
    createdAt: days(-1),
    rating: { avg: 4.6, count: 23 },
  },
  {
    _id: "s2",
    title: "Deep Sea Fishing Adventure",
    description: "Full-day fishing trip with experienced crew.",
    serviceCatId: categories[1],
    userId: users[1],
    area: areas[1],
    price: 280,
    features: ["Equipment provided", "Lunch"],
    imageUrls: ["https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=600"],
    status: "pending",
    createdAt: days(-2),
    rating: { avg: 4.2, count: 11 },
  },
  {
    _id: "s3",
    title: "Beginner Scuba Diving Lesson",
    description: "Certified instructors, all gear included.",
    serviceCatId: categories[2],
    userId: users[2],
    area: areas[2],
    price: 120,
    features: ["Gear", "PADI instructor"],
    imageUrls: ["https://images.unsplash.com/photo-1551244072-5d12893278ab?w=600"],
    status: "approved",
    createdAt: days(-5),
    rating: { avg: 4.9, count: 64 },
  },
  {
    _id: "s4",
    title: "Jet Ski Rental — 1 Hour",
    description: "Brand new Yamaha jet skis.",
    serviceCatId: categories[3],
    userId: users[0],
    area: areas[3],
    price: 90,
    features: ["Life jacket", "Brief intro"],
    imageUrls: ["https://images.unsplash.com/photo-1530541930197-ff16ac917b0e?w=600"],
    status: "approved",
    createdAt: days(-10),
    rating: { avg: 4.4, count: 38 },
  },
  {
    _id: "s5",
    title: "Coastal Family Fishing",
    description: "Kid-friendly half-day trip near the coast.",
    serviceCatId: categories[1],
    userId: users[1],
    area: areas[0],
    price: 150,
    features: ["Family friendly", "Snacks"],
    imageUrls: ["https://images.unsplash.com/photo-1502635994848-1a26eb4ce819?w=600"],
    status: "rejected",
    rejectReason: "Photos do not match service description.",
    createdAt: days(-7),
    rating: { avg: 3.8, count: 4 },
  },
  {
    _id: "s6",
    title: "Sailing Lessons for Two",
    description: "Learn to sail in a relaxed environment.",
    serviceCatId: categories[0],
    userId: users[2],
    area: areas[2],
    price: 220,
    features: ["2 people", "2 hours"],
    imageUrls: ["https://images.unsplash.com/photo-1500627964684-141351970a7f?w=600"],
    status: "pending",
    createdAt: days(0),
    rating: { avg: 0, count: 0 },
  },
];

const offers: Offer[] = [
  {
    _id: "o1",
    serviceId: services[2],
    offerDescription: "Summer special — 20% off all dive lessons",
    discountPercentage: 20,
    promoCode: "DIVE20",
    startTime: days(-3),
    endTime: days(20),
    status: "approved",
  },
  {
    _id: "o2",
    serviceId: services[3],
    offerDescription: "Weekend jet ski deal",
    discountPercentage: 15,
    promoCode: "JET15",
    startTime: days(-1),
    endTime: days(10),
    status: "approved",
  },
  {
    _id: "o3",
    serviceId: services[0],
    offerDescription: "Launch promo on luxury cruise",
    discountPercentage: 10,
    promoCode: "CRUISE10",
    startTime: days(2),
    endTime: days(30),
    status: "pending",
  },
];

const ads: Ad[] = [
  { _id: "ad1", serviceId: services[2], startTime: days(-2), endTime: days(12) },
  { _id: "ad2", serviceId: services[3], startTime: days(-5), endTime: days(2) },
];

const notifications: NotificationItem[] = [
  {
    _id: "n1",
    title: "New service awaiting review",
    subtitle: "Luxury Yacht Sunset Cruise",
    description: "A new service has been submitted by ahmed_seller.",
    isViewed: false,
    createdAt: days(-1),
  },
  {
    _id: "n2",
    title: "Offer requires approval",
    subtitle: "Launch promo on luxury cruise",
    description: "Promo CRUISE10 needs admin approval.",
    isViewed: false,
    createdAt: days(0),
  },
  {
    _id: "n3",
    title: "Ad campaign started",
    subtitle: "Beginner Scuba Diving Lesson",
    description: "Featured ad is now active.",
    isViewed: true,
    createdAt: days(-2),
  },
];

// ---------- router ----------
function matchId(path: string, prefix: string) {
  if (!path.startsWith(prefix)) return null;
  const rest = path.slice(prefix.length).replace(/^\/+|\/+$/g, "");
  return rest || null;
}

export function mockHandle(rawPath: string, method: string, body?: unknown): unknown {
  const path = rawPath.split("?")[0].replace(/\/+$/, "") || "/";

  // ----- stats -----
  if (path === "/stats" || path === "/admin/stats") {
    const totalUsers = users.length;
    const sellers = users.filter((u) => u.isSeller).length;
    const buyers = totalUsers - sellers;
    const pendingSellers = users.filter((u) => u.isSeller && u.status === "pending").length;
    const suspended = users.filter((u) => u.status === "suspended").length;
    return {
      users: {
        total: totalUsers,
        buyers,
        sellers,
        pendingSellers,
        suspended,
        active: users.filter((u) => u.status === "active").length,
        newThisWeek: 7,
        newThisMonth: 19,
      },
      services: {
        total: services.length,
        pending: services.filter((s) => s.status === "pending").length,
        approved: services.filter((s) => s.status === "approved").length,
        rejected: services.filter((s) => s.status === "rejected").length,
      },
      offers: {
        total: offers.length,
        pending: offers.filter((o) => o.status === "pending").length,
        approved: offers.filter((o) => o.status === "approved").length,
      },
      ads: { active: ads.length },
      notifications: {
        total: notifications.length,
        unread: notifications.filter((n) => !n.isViewed).length,
      },
      categories: categories.length,
      areas: areas.length,
    };
  }
  if (path === "/users/trend") return signupTrend;

  if (path === "/services/pending") return services.filter((s) => s.status === "pending");
  if (path === "/services") return services;
  {
    const id = matchId(path, "/services/approve/");
    if (id && method === "POST") {
      const s = services.find((x) => x._id === id);
      if (s) s.status = "approved";
      return { ok: true };
    }
  }
  {
    const id = matchId(path, "/services/reject/");
    if (id && method === "POST") {
      const s = services.find((x) => x._id === id);
      if (s) {
        s.status = "rejected";
        s.rejectReason = (body as any)?.rejectReason || "Rejected";
      }
      return { ok: true };
    }
  }
  {
    const id = matchId(path, "/services/");
    if (id) return services.find((x) => x._id === id);
  }

  // ----- offers -----
  if (path === "/offers") return offers.filter((o) => o.status === "approved");
  if (path === "/offers/pending") return offers.filter((o) => o.status === "pending");
  {
    const id = matchId(path, "/offers/approve/");
    if (id && method === "POST") {
      const o = offers.find((x) => x._id === id);
      if (o) o.status = "approved";
      return { ok: true };
    }
  }
  {
    const id = matchId(path, "/offers/reject/");
    if (id && method === "POST") {
      const o = offers.find((x) => x._id === id);
      if (o) o.status = "rejected";
      return { ok: true };
    }
  }
  {
    const id = matchId(path, "/offers/");
    if (id && method === "DELETE") {
      const i = offers.findIndex((x) => x._id === id);
      if (i >= 0) offers.splice(i, 1);
      return { ok: true };
    }
  }

  // ----- ads -----
  if (path === "/adds") {
    if (method === "POST") {
      const b = (body || {}) as any;
      const svc = services.find((s) => s._id === b.serviceId);
      const ad: Ad = {
        _id: `ad${ads.length + 1}`,
        serviceId: svc || b.serviceId,
        startTime: b.startTime,
        endTime: b.endTime,
      };
      ads.push(ad);
      return ad;
    }
    return ads;
  }

  // ----- notifications -----
  if (path === "/notifications") {
    if (method === "POST") {
      const b = (body || {}) as any;
      const n: NotificationItem = {
        _id: `n${notifications.length + 1}`,
        title: b.title || "Untitled",
        subtitle: b.subtitle,
        description: b.description,
        isViewed: false,
        createdAt: new Date().toISOString(),
      };
      notifications.unshift(n);
      return n;
    }
    return notifications;
  }
  if (path === "/notifications/view-all" && method === "PATCH") {
    notifications.forEach((n) => (n.isViewed = true));
    return { ok: true };
  }
  {
    const m = path.match(/^\/notifications\/([^/]+)\/view$/);
    if (m && method === "PATCH") {
      const n = notifications.find((x) => x._id === m[1]);
      if (n) n.isViewed = true;
      return { ok: true };
    }
  }

  // ----- categories / areas -----
  if (path === "/categories") return categories;
  if (path === "/areas") return areas;

  // ----- users -----
  if (path === "/users") return users;

  // Default: empty array (safe for list views)
  return [];
}
