export const getPoint = (center: number, radius: number, angle: number, value: number) => {
    const x = center + (radius * value) * Math.cos(angle * Math.PI / 180);
    const y = center + (radius * value) * Math.sin(angle * Math.PI / 180);
    return `${x},${y}`;
};
