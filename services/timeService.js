export function isWithinRewardHours(startTime, endTime) {
    const estOffset = -5 * 60; // EST is UTC -5 hours
    const start = new Date(startTime);
    const end = new Date(endTime);

    const startHour = start.getUTCHours() + estOffset / 60;
    const endHour = end.getUTCHours() + estOffset / 60;

    return startHour >= 11 && endHour <= 15; // 11 AM - 3 PM EST
}
