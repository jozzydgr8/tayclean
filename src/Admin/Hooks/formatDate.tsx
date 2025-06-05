export const formatDate = (isoDateStr: string) => {
  const [year, month, day] = isoDateStr.split("-");
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);
  const weekday = date.toLocaleDateString("en-GB", { weekday: "short" });
  return `${day}, ${weekday}, ${month}, ${year}`;
};