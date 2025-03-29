
import React from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import JournalEditor from '@/components/Journal/JournalEditor';

const NewEntryPage = () => {
  return (
    <MainLayout>
      <div className="mb-6">
        <h1 className="font-heading text-3xl font-bold">New Journal Entry</h1>
        <p className="text-reflect-muted">
          Capture your thoughts, feelings, and experiences
        </p>
      </div>
      
      <JournalEditor />
    </MainLayout>
  );
};

export default NewEntryPage;
