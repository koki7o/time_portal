"use client";

import {
  Share2,
  ExternalLink,
  Play,
  Book,
  Music,
  Code,
  Globe,
  Image,
  Tv,
  Mic,
} from "lucide-react";

export default function ArtifactCard({ item }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: item.title,
          text: item.description,
          url: `https://archive.org/details/${item.identifier}`,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    }
  };

  const getTypeIcon = () => {
    switch (item.mediatype) {
      case "movies":
        return <Play className="h-6 w-6" />;
      case "texts":
        return <Book className="h-6 w-6" />;
      case "audio":
        return <Music className="h-6 w-6" />;
      case "etree":
        return <Mic className="h-6 w-6" />;
      case "software":
        return <Code className="h-6 w-6" />;
      case "tv":
        return <Tv className="h-6 w-6" />;
      case "image":
        return <Image className="h-6 w-6" />;
      default:
        return null;
    }
  };

  const getTypeName = () => {
    switch (item.mediatype) {
      case "movies":
        return "Video";
      case "texts":
        return "Book";
      case "audio":
        return "Audio";
      case "etree":
        return "Concert";
      case "software":
        return "Software";
      case "tv":
        return "TV";
      case "image":
        return "Image";
      default:
        return item.mediatype;
    }
  };

  const imageUrl = item.thumbs?.[0];

  return (
    <div className="relative h-full w-full group">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-black"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-8 text-white">
        <div className="space-y-6">
          {/* Title and Description */}
          <div>
            <h1 className="text-3xl font-bold mb-2 leading-tight">
              {item.title.slice(0, 200)  || "Untitled"}
            </h1>
            {item.description && (
              <p className="text-base opacity-90 max-w-2xl">
                {item.description.slice(0, 200)}
                {item.description.length > 200 ? "..." : ""}
              </p>
            )}
          </div>

          {/* Bottom Row */}
          <div className="flex justify-between items-center">
            {/* Actions */}
            <div className="flex gap-4">
              <a
                href={`https://archive.org/details/${item.identifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full hover:bg-gray-100 transition-colors"
              >
                <ExternalLink className="h-5 w-5" />
                View in Archive
              </a>
              <button
                onClick={handleShare}
                className="p-3 rounded-full hover:bg-white/10 transition-colors"
              >
                <Share2 className="h-5 w-5" />
              </button>
            </div>

            {/* Type and Year */}
            <div className="flex items-center gap-3 bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
              {getTypeIcon()}
              <span className="text-sm font-medium">
                {getTypeName()} • {item.year}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
