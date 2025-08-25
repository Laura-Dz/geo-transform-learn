import React from 'react';
import ConceptLibrary from '@/components/concept/ConceptLibrary';

const ConceptsPage = () => {
  return (
    <div className="space-y-6">
      <ConceptLibrary 
        onConceptSelect={(concept) => {
          console.log('Concept selected:', concept);
        }}
      />
    </div>
  );
};

export default ConceptsPage;
