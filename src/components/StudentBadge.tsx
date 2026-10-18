'use client';

import React from 'react';
import { UserCheck, Sparkles } from 'lucide-react';

interface StudentBadgeProps {
  studentName?: string;
  role?: string;
  sectionName?: string;
  className?: string;
}

export const StudentBadge: React.FC<StudentBadgeProps> = ({
  studentName = 'Student Contributor',
  role = 'Spanish Assignment Project',
  sectionName,
  className = '',
}) => {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#F7EBE6] border border-[#C85A32]/25 text-[#A2411E] shadow-xs select-none ${className}`}
      title={`Section contribution: ${studentName} (${role})`}
    >
      <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#C85A32] text-white text-[10px]">
        <UserCheck className="w-2.5 h-2.5" />
      </span>
      <span className="font-semibold tracking-tight">Built by {studentName}</span>
      {role && (
        <span className="hidden sm:inline-block text-[#8B1E1E]/70 font-normal">
          · {role}
        </span>
      )}
      <Sparkles className="w-3 h-3 text-[#D4A017] ml-0.5" />
    </div>
  );
};
