"use client";

export function DevReset() {
  if (process.env.NODE_ENV === "production") return null;

  function resetVision() {
    for (let index = localStorage.length - 1; index >= 0; index -= 1) {
      const key = localStorage.key(index);
      if (key?.startsWith("rooted-essence-vision-")) localStorage.removeItem(key);
    }
    window.location.assign("/");
  }

  return <button className="dev-reset" type="button" onClick={resetVision} aria-label="Clear saved vision and restart">Reset vision</button>;
}
