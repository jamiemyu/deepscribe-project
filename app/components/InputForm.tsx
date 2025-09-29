// components/InputForm.tsx
import React, { useState } from 'react';

interface InputFormProps {
  onPromptChange: React.FormEventHandler;
  onFormSubmit: React.FormEventHandler;
  prompt: string;
  loading: boolean;
}

const InputForm: React.FC<InputFormProps> = (
  { onPromptChange, onFormSubmit, loading, prompt }) => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <form onSubmit={onFormSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => onPromptChange(e)}
          placeholder="Enter your prompt"
          disabled={loading}
        />
        <button className="p-4" type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Ask Claude'}
        </button>
      </form>
    </div>
  );
};

export default InputForm;