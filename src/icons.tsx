// Material Symbols outlined paths, viewBox 0 0 24 24.
const PATHS: Record<string, string> = {
  visibility:
    "M12 9a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m0-4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M3.18 12C4.83 8.36 8.24 6 12 6s7.17 2.36 8.82 6c-1.65 3.64-5.06 6-8.82 6s-7.17-2.36-8.82-6Z",
  smartphone:
    "M17 1.01 7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z",
  account_tree:
    "M22 11V3h-7v3H9V3H2v8h7V8h2v10h4v3h7v-8h-7v3h-2V8h2v3h7zM7 9H4V5h3v4zm10 6h3v4h-3v-4zm0-10h3v4h-3V5z",
  format_list_bulleted:
    "M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zM4 4.5C3.17 4.5 2.5 5.17 2.5 6S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12.04c-.81 0-1.46.67-1.46 1.46s.67 1.46 1.46 1.46 1.46-.67 1.46-1.46-.65-1.46-1.46-1.46zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z",
  // strategy: a flag-on-a-mast icon. Material's "outlined_flag".
  strategy:
    "M14 6l-1-2H5v17h2v-7h5l1 2h7V6h-6zm4 8h-4l-1-2H7V6h5l1 2h5v6z",
  account_box:
    "M3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z",
  map:
    "M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM10 5.47l4 1.4v11.66l-4-1.4V5.47zm-5 .99l3-1.01v11.7l-3 1.16V6.46zm14 11.08l-3 1.01V6.86l3-1.16v11.84z",
  // image
  image:
    "M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5zM19 19H5V5h14v14z",
  // photo_frame: use frame outline + corner mark
  photo_frame:
    "M3 3v18h18V3H3zm16 16H5V5h14v14zM7 7h10v2H7zm0 4h6v2H7zm0 4h10v2H7z",
  // labs (science): test tube
  labs:
    "M7 2v2h1v15c0 1.66 1.34 3 3 3h2c1.66 0 3-1.34 3-3V4h1V2H7zm6 17h-2c-.55 0-1-.45-1-1v-3h4v3c0 .55-.45 1-1 1zm1-6h-4V4h4v9z",
  analytics:
    "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z",
};

export function Icon({ name }: { name: string }) {
  const d = PATHS[name];
  if (!d) return null;
  return (
    <svg viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
      <path d={d} fill="currentColor" />
    </svg>
  );
}
