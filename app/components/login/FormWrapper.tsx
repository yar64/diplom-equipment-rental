// app/components/auth/FormWrapper.tsx
'use client';

import { ReactNode } from 'react';

interface FormWrapperProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function FormWrapper({ 
  children, 
  title, 
  subtitle 
}: FormWrapperProps) {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-1">{title}</h2>
        <p className="text-gray-600 text-sm">{subtitle}</p>
      </div>
      
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}