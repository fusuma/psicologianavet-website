'use client';

import { type ReactElement } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestComponentsPage(): ReactElement {
  const [inputValue, setInputValue] = useState<string>('');
  const [clickCount, setClickCount] = useState<number>(0);

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-foreground">
          Shadcn/UI Component Test Page
        </h1>

        {/* Button Tests */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <Button
              variant="default"
              onClick={() => setClickCount(clickCount + 1)}
            >
              Default Button
            </Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
          </div>
          <p className="text-muted-foreground">
            Default button clicked: {clickCount} times
          </p>
        </section>

        {/* Button Sizes */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Button Sizes
          </h2>
          <div className="flex items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">🎨</Button>
          </div>
        </section>

        {/* Input and Label Tests */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Input & Label
          </h2>
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Current value: {inputValue || '(empty)'}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="Enter password" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="disabled">Disabled Input</Label>
            <Input id="disabled" disabled placeholder="This is disabled" />
          </div>
        </section>

        {/* Theme Test */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            CSS Variables Test
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-primary text-primary-foreground rounded-md">
              Primary
            </div>
            <div className="p-4 bg-secondary text-secondary-foreground rounded-md">
              Secondary
            </div>
            <div className="p-4 bg-muted text-muted-foreground rounded-md">
              Muted
            </div>
            <div className="p-4 bg-accent text-accent-foreground rounded-md">
              Accent
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
