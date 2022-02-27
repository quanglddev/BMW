import { useEffect } from "react";
/**
 * useKeyPress
 * @param {string} key - the name of the key to respond to, compared against event.key
 * @param {function} action - the action to perform on key press
 */
export default function useKeypress(action: (e: KeyboardEvent) => void) {
  useEffect(() => {
    function onKeyup(e: KeyboardEvent) {
      action(e);
    }
    window.addEventListener("keyup", onKeyup);
    return () => window.removeEventListener("keyup", onKeyup);
  }, [action]);
}
