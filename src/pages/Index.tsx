
"use client";

import React from 'react';
import TextRewriter from '@/components/text-rewriter/TextRewriter';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">AI Text Rewriter</h1>
        <TextRewriter />
      </div>
    </div>
  );
};

export default Index;
