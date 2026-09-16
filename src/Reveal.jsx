import { useEffect, useRef, useState } from 'react';

// Adds an `in-view` class (and reports inView via render-prop) the first time
// the element crosses into the viewport. CSS in index.css decides how each
// section actually animates — this just flips one boolean.
export default function Reveal({ children, className = '', as: Tag = 'div', ...rest }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`${className} reveal${inView ? ' in-view' : ''}`.trim()} {...rest}>
      {typeof children === 'function' ? children(inView) : children}
    </Tag>
  );
}
