export function studentEmail() {
  const suffix = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return `qa.student.${suffix}@example.com`;
}
