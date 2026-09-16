import { useEffect, useState } from 'react';
import { Statistic } from 'antd';

// Counts up to `target` once `active` turns true. Used for stat numbers
// revealed on scroll.
export default function Counter({ target, active, decimals = 0, ...rest }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let raf;
    const start = performance.now();
    const duration = 900;

    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setValue(target);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target]);

  return <Statistic value={decimals ? value.toFixed(decimals) : Math.round(value)} {...rest} />;
}
