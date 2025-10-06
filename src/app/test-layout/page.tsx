import type { ReactElement } from 'react';
import { Layout } from '@/components/composite/Layout';

export default function TestLayoutPage(): ReactElement {
  return (
    <div>
      <Layout theme="dark">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Dark Theme (Tutors)</h1>
          <p className="text-lg">
            This is the dark theme with Primary Dark background (#191723) and Primary Green text (#269A9B).
          </p>
          <p className="text-base">
            Testing text readability and contrast ratio for WCAG 2.1 Level AA compliance.
          </p>
        </div>
      </Layout>

      <Layout theme="green">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">Green Theme (Vets)</h1>
          <p className="text-lg">
            This is the green theme with Primary Green background (#269A9B) and Primary Dark text (#191723).
          </p>
          <p className="text-base">
            Testing text readability and contrast ratio for WCAG 2.1 Level AA compliance.
          </p>
        </div>
      </Layout>
    </div>
  );
}
