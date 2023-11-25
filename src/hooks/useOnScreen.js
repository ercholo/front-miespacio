import React from 'react';

export default function useOnScreen(ref) {

    const [isIntersecting, setIntersecting] = React.useState(false)
  
    React.useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => setIntersecting(entry.isIntersecting)
      )
      observer.observe(ref.current)
      // Remove the observer as soon as the component is unmounted
      return () => { observer.disconnect() }
    }, [setIntersecting, ref])
  
    return isIntersecting
  }