
import React from 'react';
import TextRewriter from '@/components/TextRewriter';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">AI Text Rewriter</h1>
        <TextRewriter />
      </div>
    </div>
  );
};

export default Index;
