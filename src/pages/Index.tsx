
import React from 'react';
import TextRewriter from '@/components/TextRewriter';

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">AI Text Rewriter</h1>
        <TextRewriter />
        
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Powered by OpenAI API • Your API key is stored locally in your browser</p>
          <p className="mt-1">
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              Get an API key from OpenAI
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
