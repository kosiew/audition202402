// hooks/useRequireAuth.tsx

import { useState } from 'react';

export const useTriggerUpdate = () => {
  const [trigger, setTrigger] = useState(0);
  const triggerUpdate = () => setTrigger((trigger) => trigger + 1);

  return { trigger, triggerUpdate };
};
