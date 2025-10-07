import { useState, useEffect } from 'react';

export function useDeviceOrientation() {
  const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');

  const requestPermission = async () => {
    if (
      typeof DeviceOrientationEvent !== 'undefined' &&
      typeof (DeviceOrientationEvent as any).requestPermission === 'function'
    ) {
      try {
        const permissionState = await (DeviceOrientationEvent as any).requestPermission();
        setPermission(permissionState);
        return permissionState === 'granted';
      } catch (error) {
        console.error('Error requesting device orientation permission:', error);
        setPermission('denied');
        return false;
      }
    }
    // Non-iOS devices don't require permission
    setPermission('granted');
    return true;
  };

  return { permission, requestPermission };
}
