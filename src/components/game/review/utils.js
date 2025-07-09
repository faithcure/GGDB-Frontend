// src/components/game/review/utils.js
const pastel = [
  "#9CA3AF", "#A7F3D0", "#FECACA", "#C7D2FE", "#FDE68A",
  "#FCA5A5", "#FDBA74", "#FCD34D", "#6EE7B7", "#A5B4FC"
];

export function avatarBg(str = "") {
  return pastel[str.charCodeAt(0) % pastel.length];
}

export function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "2-digit",
  });
}
