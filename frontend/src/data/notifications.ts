// data/notifications.tsx
export interface Notification {
    id: number;
    title: string;
    content: string;
}

export const notifications: Notification[] = [
    { id: 1, title: "New Message", content: "You have a new message from John." },
    { id: 2, title: "Reminder", content: "Don't forget your meeting at 3 PM." },
];