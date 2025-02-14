//news/page.tsx
"use client";

import NotificationHeader from "@/components/longnt/news/NotificationHeader";
import NewsHeader from "@/components/longnt/news/NewsHeader";
import SuggestionNews from "@/components/longnt/news/SuggestionNews";
import NewsPageContent from "@/components/longnt/news/NewsPageContent";

export default function NotificationPage() {

  return (
    <div className="flex flex-col">
      <NewsHeader />
      <NotificationHeader />
      <div className="container mx-auto p-4 flex-grow">
        <NewsPageContent />
      </div>
      <SuggestionNews />
    </div>
  );
}