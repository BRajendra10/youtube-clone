export function formatDuration(seconds) {
    if (!seconds) return "00:00";

    const total = Math.floor(seconds);
    const mins = Math.floor(total / 60);
    const secs = (total % 60).toString().padStart(2, "0");

    return `${mins}:${secs}`;
}

export function formatDate(dateString) {
    if (!dateString) return "";

    const date = new Date(dateString);

    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}
