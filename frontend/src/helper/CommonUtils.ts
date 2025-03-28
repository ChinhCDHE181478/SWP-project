export function normalizeName(name: string) {
  return name
    .trim() 
    .replace(/\s+/g, " ") 
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}


