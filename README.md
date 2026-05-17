# 3D-UX — "What UX Design Actually Is"

A React + Vite implementation of the layered "Release" canvas from the
[Figma design](https://www.figma.com/design/OeuLnM0RZ1L2ngUv7KMKIh/Alice-Lo?node-id=2035-616).

## Interactivity

1. **Card hover**: hovering any card scales it to 200% in place (centered
   transform, smooth easing) and returns to default on mouse leave.
2. **Leaf through versions**: clicking the visible label/strip of any
   background release (`MVP`, `Version 1`, `Version 2`, `… Version N`)
   brings that release to the front; the other releases preserve their
   relative stacking order behind it.

## Run

```
npm install
npm run dev      # http://localhost:5173
npm run build
```
