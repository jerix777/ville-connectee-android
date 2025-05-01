
import React from "react";

interface PropertyDescriptionProps {
  description: string;
}

export function PropertyDescription({ description }: PropertyDescriptionProps) {
  return (
    <p className="text-sm text-gray-700 line-clamp-3 mb-2">{description}</p>
  );
}
